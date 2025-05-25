//
// This software is dedicated to the public domain.
//

class lexer {
	file;
	input;
	in_len;
	position;
	read_position;
	ch;
	tk;
	line;
};

function lexer__new(file)
{
	var self;
	struct(self, lexer);

	self = new lexer();
	self.file = file;
	self.in_len = file_size(file);
	self.input = file_load(file, self.in_len);
	self.position = 0;
	self.line = 1;
	self.read_position = 0;
	self.ch = __(" ");
	self.tk = token__new();
	lexer__read_char(self);
	return self;
}

function lexer__dispose(self)
{
	struct(self, lexer);
	token__dispose(self.tk);
	free(self.input);
	free(self);
}

function lexer__read_char(self)
{
	struct(self, lexer);
	switch (self.read_position >= self.in_len) {
	case true:
		self.ch = 0;
		return 0;
	}
	self.ch = peek(self.input, self.read_position);
	self.position = self.read_position;
	switch (self.ch != 0) {
	case true:
		self.read_position = self.read_position + 1;
	}
	return self.ch;
}

function lexer__peek_char(self)
{
	struct(self, lexer);
	switch (self.read_position >= self.in_len) {
	case true:
		return 0;
	}
	return peek(self.input, self.read_position);
}

function lexer__error(self,txt, tk)
{
	struct(self, lexer);
	struct(tk, token);
	var tk2;
	struct(tk2, token);

	tk2 = token__copy(tk);

	print(_("#error :"));
	print(self.file);
	print(_(":"));
	print10(self.line);
	print(_(": "));
	print(txt);
	print(_(" '"));
	print(tk2.buf);
	print(_("'\n"));
	token__dispose(tk2);
	exit(-1);
}

function lexer__next(self)
{
	struct(self, lexer);
	var tk;
	struct(tk, token);

	lexer__skip_whitespace(self);
	
	tk = self.tk;
	tk.buf = self.input;
	tk.start = self.read_position - 1;
	tk.end = self.read_position;
	tk.type = TK_NONE;

	switch (self.ch) {
	case __("="):
		switch (lexer__peek_char(self) == __("=")) {
		case true:
			lexer__read_char(self);
			switch (lexer__peek_char(self) == __("=")) {
			case true:
				lexer__read_char(self);
				tk.type = TK_STRICT_EQUALITY;
				break;
			default:
				tk.type = TK_EQUALITY;
			}
			break;
		default:
			tk.type = TK_ASSIGNMENT;
		}
		break;
	case __(">"):
		switch (lexer__peek_char(self) == __("=")) {
		case true:
			lexer__read_char(self);
			tk.type = TK_GREATER_THAN_OR_EQUAL;
			break;
		default:
			tk.type = TK_GREATER_THAN;
		}
		break;
	case __("<"):
		switch (lexer__peek_char(self) == __("=")) {
		case true:
			lexer__read_char(self);
			tk.type = TK_LESS_THAN_OR_EQUAL;
			break;
		default:
			tk.type = TK_LESS_THAN;
		}
		break;
	case __("!"):
		switch (lexer__peek_char(self) == __("=")) {
		case true:
			lexer__read_char(self);
			switch (lexer__peek_char(self) == __("=")) {
			case true:
				lexer__read_char(self);
				tk.type = TK_STRICT_INEQUALITY;
				break;
			default:
				tk.type = TK_INEQUALITY;
			}
			break;
		default:
			tk.type = TK_LOGICAL_NOT; 
		}
		break;
	case __("&"):
		switch (lexer__peek_char(self) == __("&")) {
		case true:
			lexer__read_char(self);
			tk.type = TK_LOGICAL_AND;
			break;
		default:
			tk.type = TK_BITWISE_AND;
		}
		break;
	case __("|"):
		switch (lexer__peek_char(self) == __("|")) {
		case true:
			lexer__read_char(self);
			tk.type = TK_LOGICAL_OR;
			break;
		default:
			tk.type = TK_BITWISE_OR;
		}
		break;
	case __("+"):
		tk.type = TK_UNARY_PLUS;
		break;
	case __("-"):
		tk.type = TK_UNARY_NEGATION;
		break;
	case __(","):
		tk.type = TK_COMMA;
		break;
	case __(";"):
		tk.type = TK_SEMICOLON;
		break;
	case __(":"):
		tk.type = TK_COLON;
		break;
	case __("."):
		tk.type = TK_DOT;
		break;
	case __("\""):
	case __("'"):
		return lexer__read_string(self);
	case __("{"):
		tk.type = TK_LEFT_BRACE;
		break;
	case __("}"):
		tk.type = TK_RIGHT_BRACE;
		break;
	case __("["):
		tk.type = TK_LEFT_BRACKET;
		break;
	case __("]"):
		tk.type = TK_RIGHT_BRACKET;
		break;
	case __("("):
		tk.type = TK_LEFT_PARENTHESIS;
		break;
	case __(")"):
		tk.type = TK_RIGHT_PARENTHESIS;
		break;
	case 0:
		return null;
	default:
		switch (lexer__is_id(self.ch)) {
		case true:
			return lexer__read_id(self);
		default:
			switch (lexer__is_digit(self.ch)) {
			case true:
				return lexer__read_num(self);
			default:
				tk.end = self.read_position - 1;
				lexer__error(self, 
					_("Unexpected character"), tk);
				return null;
			}
		}
		break;
	}
	tk.end = self.read_position;
	lexer__read_char(self);
	return tk;
}

function lexer__is_digit(ch)
{
	switch (ch >= __("0") && ch <= __("9")) {
	case true:
		return true;
	}
}

function lexer__is_id(ch)
{
	switch (ch >= __("a") && ch <= __("z")) {
	case true:
		return true;
	}
	switch (ch >= __("A") && ch <= __("Z")) {
	case true:
		return true;
	}
	switch (ch == __("_")) {
	case true:
		return true;
	}
	return false;
}

function lexer__read_id(self)
{
	struct(self, lexer);
	var end, tk;
	struct(tk, token);
	
	tk = self.tk;
	end = false;
	tk.type = TK_IDENTIFIER;
	lexer__read_char(self);
	while (self.ch != 0 && !end) {
		switch (lexer__is_id(self.ch) || lexer__is_digit(self.ch)) {
		case true:
			lexer__read_char(self);
			break;
		default:
			end = true;
		}
	}
	tk.end = self.read_position - 1;
	switch (tk.end - tk.start) {
	case 2:
		switch (peek(tk.buf, tk.start)) {
		case __("i"):
			switch (token__cmp(tk, _("if"))) {
				case 0: tk.type = TK_IF; return tk;
			}
			break;
		}
		break;
	case 3:
		switch (peek(tk.buf, tk.start)) {
		case __("n"):
			switch (token__cmp(tk, _("new"))) {
				case 0: tk.type = TK_NEW; return tk;
			}
			break;
		case __("v"):
			switch (token__cmp(tk, _("var"))) {
				case 0: tk.type = TK_VAR; return tk;
			}
			break;
	
		}
		break;
	case 4:
		switch (peek(tk.buf, tk.start)) {
		case __("c"):
			switch (token__cmp(tk, _("case"))) {
				case 0: tk.type = TK_CASE; return tk;
			}
			break;
		case __("n"):
			switch (token__cmp(tk, _("null"))) {
				case 0: tk.type = TK_NULL; return tk;
			}
			break;
		case __("t"):
			switch (token__cmp(tk, _("true"))) {
				case 0: tk.type = TK_TRUE; return tk;
			}
			break;
	
		}
		break;
	case 5:
		switch (peek(tk.buf, tk.start)) {
		case __("b"):
			switch (token__cmp(tk, _("break"))) {
				case 0: tk.type = TK_BREAK; return tk;
			}
			break;
		case __("c"):
			switch (token__cmp(tk, _("class"))) {
				case 0: tk.type = TK_CLASS; return tk;
			}
			break;
		case __("f"):
			switch (token__cmp(tk, _("false"))) {
				case 0: tk.type = TK_FALSE; return tk;
			}
			break;
		case __("w"):
			switch (token__cmp(tk, _("while"))) {
				case 0: tk.type = TK_WHILE; return tk;
			}
			break;
	
		}
		break;
	case 6:
		switch (peek(tk.buf, tk.start)) {
		case __("r"):
			switch (token__cmp(tk, _("return"))) {
				case 0: tk.type = TK_RETURN; return tk;
			}
			break;
		case __("s"):
			switch (token__cmp(tk, _("switch"))) {
				case 0: tk.type = TK_SWITCH; return tk;
			}
			break;
		case __("t"):
			switch (token__cmp(tk, _("typeof"))) {
				case 0: tk.type = TK_TYPEOF; return tk;
			}
			break;
	
		}
		break;
	
	case 7:
		switch (peek(tk.buf, tk.start)) {
		case __("d"):
			switch (token__cmp(tk, _("default"))) {
				case 0: tk.type = TK_DEFAULT; return tk;
			}
			break;
		}
		break;
	
	case 8:
		switch (peek(tk.buf, tk.start)) {
		case __("c"):
			switch (token__cmp(tk, _("continue"))) {
				case 0: tk.type = TK_CONTINUE; return tk;
			}
			break;
		case __("f"):
			switch (token__cmp(tk, _("FUNCTION"))) {
				case 0: tk.type = TK_FUNCTION; return tk;
			}
			break;
	
		}
		break;
	
	}
	return tk;
}

function lexer__read_string(self)
{
	struct(self, lexer);
	var c,tk;
	struct(tk, token);

	tk = self.tk;
	c = self.ch;
	tk.type = TK_STRING_LITERAL;
	tk.start = self.read_position;
	lexer__read_char(self);
	while (self.ch != 0 && self.ch != c) {
		switch (self.ch == __("\\")) {
		case true:
			lexer__read_char(self);
		}
		lexer__read_char(self);
	}
	tk.end = self.read_position - 1;
	lexer__read_char(self);
	return tk;
}

function lexer__read_num(self)
{
	struct(self, lexer);
	var pos, end, tk;
	struct(tk, token);

	tk = self.tk;
	end = false;
	pos = self.read_position;
	tk.type = TK_DECIMAL_LITERAL;
	lexer__read_char(self);
	while (self.ch != 0 && !end) {
		switch (lexer__is_digit(self.ch)) {
		case true:
			lexer__read_char(self);
			break;
		default:
			end = true;
		}
	}
	tk.end = self.read_position - 1;
	return tk;
}

function lexer__skip_whitespace(self)
{
	struct(self, lexer);
	while (self.ch != 0) {
		switch (self.ch) {
		case __("\n"):
			self.line = self.line + 1;
		case __(" "):
		case __("\r"):
		case __("\t"):
			break;
		case __("/"):
			switch (lexer__peek_char(self) == __("/")) {
			case true:
				lexer__read_char(self);
				while (self.ch != 0 && self.ch != __("\n")) {
					lexer__read_char(self);
				}
				self.line = self.line + 1;
				break;
			default:
				return;
			}
			break;
		default:
			return;
		}
		lexer__read_char(self);
	}
}

exporting([ 
	lexer,
	lexer__new,
	lexer__dispose,
	lexer__next,
	lexer__error,
]);

