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

init(file)
{
	this.file = file;
	this.in_len = file_size(file);
	this.input = file_load(file, this.in_len);
	this.position = 0;
	this.line = 1;
	this.read_position = 0;
	this.ch = __(" ");
	this.tk = new token;
	this.read_char();
	return this;
}

dispose()
{
	this.tk.dispose(this.tk);
	free(this.input);
	free(this);
}

function lexer__read_char(this)
{
	_class(this, lexer);
	switch (this.read_position >= this.in_len) {
	case true:
		this.ch = 0;
		return 0;
	}
	this.ch = peek(this.input, this.read_position);
	this.position = this.read_position;
	switch (this.ch != 0) {
	case true:
		this.read_position = this.read_position + 1;
	}
	return this.ch;
}

function lexer__peek_char(this)
{
	_class(this, lexer);
	switch (this.read_position >= this.in_len) {
	case true:
		return 0;
	}
	return peek(this.input, this.read_position);
}

function lexer__error(this,txt, tk)
{
	_class(this, lexer);
	_class(tk, token);
	var tk2;
	_class(tk2, token);

	tk2 = token__copy(tk);

	print(_("#error :"));
	print(this.file);
	print(_(":"));
	print10(this.line);
	print(_(": "));
	print(txt);
	print(_(" '"));
	print(tk2.buf);
	print(_("'\n"));
	token__dispose(tk2);
	exit(-1);
}

function lexer__next(this)
{
	_class(this, lexer);
	var tk;
	_class(tk, token);

	lexer__skip_whitespace(this);
	
	tk = this.tk;
	tk.buf = this.input;
	tk.start = this.read_position - 1;
	tk.end = this.read_position;
	tk.type = TK_NONE;

	switch (this.ch) {
	case __("="):
		switch (lexer__peek_char(this) == __("=")) {
		case true:
			lexer__read_char(this);
			switch (lexer__peek_char(this) == __("=")) {
			case true:
				lexer__read_char(this);
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
		switch (lexer__peek_char(this) == __("=")) {
		case true:
			lexer__read_char(this);
			tk.type = TK_GREATER_THAN_OR_EQUAL;
			break;
		default:
			tk.type = TK_GREATER_THAN;
		}
		break;
	case __("<"):
		switch (lexer__peek_char(this) == __("=")) {
		case true:
			lexer__read_char(this);
			tk.type = TK_LESS_THAN_OR_EQUAL;
			break;
		default:
			tk.type = TK_LESS_THAN;
		}
		break;
	case __("!"):
		switch (lexer__peek_char(this) == __("=")) {
		case true:
			lexer__read_char(this);
			switch (lexer__peek_char(this) == __("=")) {
			case true:
				lexer__read_char(this);
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
		switch (lexer__peek_char(this) == __("&")) {
		case true:
			lexer__read_char(this);
			tk.type = TK_LOGICAL_AND;
			break;
		default:
			tk.type = TK_BITWISE_AND;
		}
		break;
	case __("|"):
		switch (lexer__peek_char(this) == __("|")) {
		case true:
			lexer__read_char(this);
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
		return lexer__read_string(this);
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
		switch (lexer__is_id(this.ch)) {
		case true:
			return lexer__read_id(this);
		default:
			switch (lexer__is_digit(this.ch)) {
			case true:
				return lexer__read_num(this);
			default:
				tk.end = this.read_position - 1;
				lexer__error(this, 
					_("Unexpected character"), tk);
				return null;
			}
		}
		break;
	}
	tk.end = this.read_position;
	lexer__read_char(this);
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

function lexer__read_id(this)
{
	_class(this, lexer);
	var end, tk;
	_class(tk, token);
	
	tk = this.tk;
	end = false;
	tk.type = TK_IDENTIFIER;
	lexer__read_char(this);
	while (this.ch != 0 && !end) {
		switch (lexer__is_id(this.ch) || lexer__is_digit(this.ch)) {
		case true:
			lexer__read_char(this);
			break;
		default:
			end = true;
		}
	}
	tk.end = this.read_position - 1;
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

function lexer__read_string(this)
{
	_class(this, lexer);
	var c,tk;
	_class(tk, token);

	tk = this.tk;
	c = this.ch;
	tk.type = TK_STRING_LITERAL;
	tk.start = this.read_position;
	lexer__read_char(this);
	while (this.ch != 0 && this.ch != c) {
		switch (this.ch == __("\\")) {
		case true:
			lexer__read_char(this);
		}
		lexer__read_char(this);
	}
	tk.end = this.read_position - 1;
	lexer__read_char(this);
	return tk;
}

function lexer__read_num(this)
{
	_class(this, lexer);
	var pos, end, tk;
	_class(tk, token);

	tk = this.tk;
	end = false;
	pos = this.read_position;
	tk.type = TK_DECIMAL_LITERAL;
	lexer__read_char(this);
	while (this.ch != 0 && !end) {
		switch (lexer__is_digit(this.ch)) {
		case true:
			lexer__read_char(this);
			break;
		default:
			end = true;
		}
	}
	tk.end = this.read_position - 1;
	return tk;
}

function lexer__skip_whitespace(this)
{
	_class(this, lexer);
	while (this.ch != 0) {
		switch (this.ch) {
		case __("\n"):
			this.line = this.line + 1;
		case __(" "):
		case __("\r"):
		case __("\t"):
			break;
		case __("/"):
			switch (lexer__peek_char(this) == __("/")) {
			case true:
				lexer__read_char(this);
				while (this.ch != 0 && this.ch != __("\n")) {
					lexer__read_char(this);
				}
				this.line = this.line + 1;
				break;
			default:
				return;
			}
			break;
		default:
			return;
		}
		lexer__read_char(this);
	}
}
}; // class lexer

exporting([ 
	lexer,
]);

