
define("PA_LEFT", 1);
define("PA_RIGHT", 2);
define("PA_NONE", 4);

class parser {
	lex;
	tk;
	operators;
	operands;
};


function parser__new(lex)
{
	var self;
	struct(self, parser);
	self = new parser();

	self.operators = stack__new(32);
	self.operands = stack__new(32);
	self.lex = lex;
	self.tk = null;
	return self;
}

function parser__dispose(self)
{
	struct(self, parser);
	stack__dispose(self.operators);
	stack__dispose(self.operands);
	free(self);
}

function parser__process(self)
{
	struct(self, parser);
	var tk;
	self.tk = lexer__next(self.lex);
	parser__parse(self);
}

function parser__parse(self)
{
	struct(self, parser);
	var tk;
	struct(tk, token);
	tk = self.tk;

	while (tk != null) {
		switch (tk.type) {
		case TK_IF:
			parser__if_statement(self);
			break;
		default:
			lexer__error(self.lex, _("unexpected"), self.tk);
		}
		tk = self.tk;
	}
}

function parser__if_statement(self)
{
	parser__eat(self, TK_IF);
	parser__eat(self, TK_LEFT_PARENTHESIS);
	parser__expression(self);
	parser__eat(self, TK_RIGHT_PARENTHESIS);
	parser__eat(self, TK_LEFT_BRACE);
	parser__statements(self);
	parser__eat(self, TK_RIGHT_BRACE);
}

function parser__statements(self)
{
	struct(self, parser);
	var tk,parenthesis,end,brace;
	struct(tk, token);
	tk = self.tk;
	brace = 0;
	end = false;
	while (tk != null && !end) {
		switch (tk.type) {
		case TK_LEFT_BRACE:
			brace = brace + 1;
			parser__eat(self, TK_LEFT_BRACE);
			break;
		case TK_RIGHT_BRACE:
			switch (brace < 1) {
			case true:
				end = true;
				break;
			default:
				brace = brace - 1;
				parser__eat(self, TK_RIGHT_BRACE);
				break;
			}
			break;
		default:
			parser__eat(self, tk.type);
		}
		tk = self.tk;
	}
}

function parser__expression(self)
{
	struct(self, parser);
	var tk,parenthesis, end;
	struct(tk, token);
	tk = self.tk;

	
	parenthesis = 0;
	end = false;

	while (tk != null && !end) {
		switch (tk.type) {
		case TK_STRING_LITERAL:
		case TK_DECIMAL_LITERAL:
			parser__push_operand(self, tk);
			parser__eat(self, tk.type);
			break;
		case TK_LEFT_PARENTHESIS:
			parser__push_operator(self, tk);
			parser__eat(self, tk.type);
			parenthesis = parenthesis + 1;
			break;
		case TK_RIGHT_PARENTHESIS:
			switch (parenthesis < 1) {
			case true:
				end = true;
				break;
			default:
				parenthesis = parenthesis - 1;
				while (!parser__operator_is(self,null) &&
					!parser__operator_is(self,
						TK_LEFT_PARENTHESIS)) 
				{
					parser__process_operator(self);
				}
				parser__free_operator(self);
				parser__eat(self, TK_RIGHT_PARENTHESIS);
			}
			break;
		case TK_IDENTIFIER:
			parser__push_operand(self, tk);
			parser__eat(self, tk.type)
			break;
		case TK_TYPEOF:
		default:
			parser__fill_precedence(self, tk);
			switch (tk.precedence <= 0) {
			case true:
				return;
			}
			parser__process_higher(self, tk);
			parser__push_operator(self, tk);
			parser__eat(self, tk.type);
		}
		tk = self.tk;
	}
	while (!parser__operator_is(self,null)) {
		parser__process_operator(self);
	}
	return stack__pop(self.operands);
}

function parser__process_higher(self, tk)
{
	struct(self, parser);
	struct(tk, token);
	var top;
	struct(top, token);
	top = stack__top(self.operators);
	while (top != null &&
		(top.precedence > tk.precedence ||
			(top.precedence == tk.precedence &&
				tk.associativity == PA_LEFT
			)
		)) 
	{
		parser__process_operator(self);
		top = stack__top(self.operators);
	}
}

function parser__push_operand(self, data)
{
	struct(self, parser);
	stack__push(self.operands, token__copy(data));
}

function parser__push_operator(self, data)
{
	struct(self, parser);
	struct(data, token);
	parser__fill_precedence(self, data);
	stack__push(self.operators, token__copy(data));
}

function parser__free_operator(self)
{
	struct(self, parser);
	var data;
	data = stack__pop(self.operators);
	switch (data != null) {
	case true:
		token__dispose(data);
	}
}

function parser__fill_precedence(self, tk)
{
	struct(tk, token);
	tk.precedence = -1;
	tk.associativity = 0;
	switch (tk.type) {
	case TK_UNARY_PLUS: 
		tk.precedence = 140; tk.associativity = PA_NONE; break;
	case TK_TYPEOF: 
		tk.precedence = 140; tk.associativity = PA_NONE; break;
	case TK_STRICT_INEQUALITY: 
		tk.precedence = 80; tk.associativity = PA_LEFT; break;
	case TK_STRICT_EQUALITY: 
		tk.precedence = 80; tk.associativity = PA_LEFT; break;
	}
}

function parser__operator_is(self, type)
{
	struct(self, parser);
	var top;
	struct(top, token);
	top = stack__top(self.operators);
	switch (type == null) {
	case true:
		return (top == null);
	}
	return (top.type == type);
}

function parser__process_operator(self)
{
	struct(self, parser);
	var op,right,left,result;
	struct(op, token);
	struct(right, token);
	struct(left, token);
	struct(result, token);

	op = stack__pop(self.operators);
	right = stack__pop(self.operands)
	result = null;
	switch (op == null) {
	case true:
		lexer__error(self.lex, _("Operator expected"), self.tk);
		return;
	}

	switch (op.type) {
	case TK_TYPEOF:
		result = 1;
		break;
	case TK_UNARY_PLUS:
		result = 1;
		break;
	default:
		left = stack__pop(self.operands);
		switch (op.type) {
		case TK_STRICT_INEQUALITY:
			break;
		case TK_SUBTRACTION:
		default:
			lexer__error(self.lex, _("syntax error"), op);
		}
	}
		
	stack__push(self.operands, result);
}

function parser__eat(self,type)
{
	struct(self, parser);
	var tk;
	struct(tk, token);

	tk = self.tk;
	switch (tk.type == type) {
	case true:
		self.tk = lexer__next(self.lex);
		break;
	default:
		lexer__error(self.lex, _("unexpected token"), tk);
	}
}

exporting([ 
	parser,
	parser__new,
	parser__dispose,
	parser__process
]);

