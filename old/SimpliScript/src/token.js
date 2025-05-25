
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
//
define("TK_NONE", 0);

define("TK_ADDITION", 1);
define("TK_ADDITION_ASSIGNMENT", 2);
define("TK_ASSIGNMENT", 3);
define("TK_ASYNC", 4);
define("TK_AWAIT", 5);
define("TK_BITWISE_AND", 6);
define("TK_BITWISE_AND_ASSIGNMENT", 7);
define("TK_BITWISE_NOT", 8);
define("TK_BITWISE_OR", 9);
define("TK_BITWISE_OR_ASSIGNMENT", 10);
define("TK_BITWISE_XOR", 11);
define("TK_BITWISE_XOR_ASSIGNMENT", 12);
define("TK_CLASS", 13);
define("TK_COMMA", 14);
define("TK_CONDITIONAL", 15);
define("TK_DECREMENT", 16);
define("TK_DELETE", 17);
define("TK_DESTRUCTURING_ASSIGNMENT", 18);
define("TK_DIVISION", 19);
define("TK_DIVISION_ASSIGNMENT", 20);
define("TK_EQUALITY", 21);
define("TK_EXPONENTIATION", 22);
define("TK_EXPONENTIATION_ASSIGNMENT", 23);
define("TK_IDENTIFIER", 24);
define("TK_GREATER_THAN", 25);
define("TK_GREATER_THAN_OR_EQUAL", 26);
define("TK_GROUPING", 27);
define("TK_STRUCT", 28); // SimpliScript specific
define("TK_UNDEFINED", 29);
define("TK_INCREMENT", 30);
define("TK_INEQUALITY", 31);
//define("", 32);
define("TK_LEFT_SHIFT", 33);
define("TK_LEFT_SHIFT_ASSIGNMENT", 34);
define("TK_LESS_THAN", 35);
define("TK_LESS_THAN_OR_EQUAL", 36);
define("TK_LOGICAL_AND", 37);
define("TK_LOGICAL_AND_ASSIGNMENT", 38);
define("TK_LOGICAL_NOT", 39);
define("TK_LOGICAL_OR", 40);
define("TK_LOGICAL_OR_ASSIGNMENT", 41);
define("TK_MULTIPLICATION", 42);
define("TK_MULTIPLICATION_ASSIGNMENT", 43);
//define("", 44);
//define("", 45);
define("TK_NULLISH_COALESCING_ASSIGNMENT", 46);
define("TK_NULLISH_COALESCING_OPERATOR", 47);
define("TK_OPTIONAL_CHAINING", 48);
define("TK_DOT", 49);
define("TK_COLON", 50);
define("TK_SEMICOLON", 51);
define("TK_LEFT_BRACKET", 52);
define("TK_RIGHT_BRACKET", 53);
define("TK_LEFT_PARENTHESIS", 54);
define("TK_RIGHT_PARENTHESIS", 55);
define("TK_LEFT_BRACE", 56);
define("TK_RIGHT_BRACE", 57);
define("TK_REMAINDER", 58);
define("TK_REMAINDER_ASSIGNMENT", 59);
define("TK_RIGHT_SHIFT", 60);
define("TK_RIGHT_SHIFT_ASSIGNMENT", 61);
define("TK_SPREAD", 62);
define("TK_STRICT_EQUALITY", 63);
define("TK_STRICT_INEQUALITY", 64);
define("TK_SUBTRACTION", 65);
define("TK_SUBTRACTION_ASSIGNMENT", 66);
define("TK_SUPER", 67);
define("TK_THIS", 68);
define("TK_TYPEOF", 69);
define("TK_UNARY_NEGATION", 70);
define("TK_UNARY_PLUS", 71);
define("TK_UNSIGNED_RIGHT_SHIFT", 72);
define("TK_UNSIGNED_RIGHT_SHIFT_ASSIGNMENT", 73);
define("TK_VOID_OPERATOR", 74);
define("TK_YIELD", 75);
define("TK_BREAK", 76);
define("TK_CASE", 77);
define("TK_CATCH", 78);
define("TK_CONST", 79);
define("TK_CONTINUE", 80);
define("TK_DEBUGGER", 81);
define("TK_DEFAULT", 82);
define("TK_DO", 83);
define("TK_ELSE", 84);
define("TK_EXPORT", 85);
define("TK_EXTENDS", 86);
define("TK_FALSE", 87);
define("TK_FINALLY", 88);
define("TK_FOR", 89);
define("TK_FUNCTION", 90);
define("TK_IF", 91);
define("TK_IMPORT", 92);
define("TK_IN", 93);
define("TK_INSTANCEOF", 94);
define("TK_NEW", 95);
define("TK_NULL", 96);
define("TK_RETURN", 97);
define("TK_SWITCH", 98);
define("TK_THROW", 99);
define("TK_TRUE", 100);
define("TK_TRY", 101);
define("TK_VAR", 102);
define("TK_VOID", 103);
define("TK_WHILE", 104);
define("TK_WITH", 105);
define("TK_LET", 106);
define("TK_STATIC", 107);
define("TK_ENUM", 108);
define("TK_IMPLEMENTS", 109);
define("TK_INTERFACE", 110);
define("TK_PACKAGE", 111);
define("TK_PRIVATE", 112);
define("TK_PROTECTED", 113);
define("TK_PUBLIC", 114);
define("TK_NULL_LITERAL", 115);
define("TK_BOOLEAN_LITERAL", 116);
define("TK_DECIMAL_LITERAL", 117);
define("TK_EXPONENTIAL_LITERAL", 119);
define("TK_BINARY_LITERAL", 120);
define("TK_OCTAL_LITERAL", 121);
define("TK_HEXADECIMAL_LITERAL", 122);
define("TK_BIGINT_LITERAL", 123);
define("TK_NUMERIC_SEPARATOR", 124);
define("TK_STRING_LITERAL", 125);
define("TK_REGULAR_EXPRESSION_LITERAL", 126);
define("TK_TEMPLATE_LITERAL", 127);

class token {
	type;
	buf;
	start;
	end;
	precedence;
	associativity;
	is_copy;
};

function token__new()
{
	var self;
	struct(self, token);

	self = new token();
	self.type = 0;
	self.start = 0;
	self.end = 0;
	self.is_copy = false;
	return self;
}

function token__dispose(self)
{
	struct(self, token);
	if (self.is_copy) {
		free(self.buf);
	}
	free(self);
}

function token__copy(self)
{
	struct(self, token);
	var self1, size, i;
	struct(self1, token);

	self1 = new token();
	self1.type = self.type;
	self1.precedence = self.precedence;
	self1.associativity = self.associativity;
	size = self.end - self.start;
	self1.start = 0;
	self1.end = size;
	self1.buf = bytes(size+1);
	i = 0;
	while (i < size) {
		poke(self1.buf, i, peek(self.buf, self.start + i));
		i = i + 1;
	}
	poke(self1.buf, size, 0);
	self1.is_copy = true;
	return self1;
}

function token__cmp(self, b)
{
	struct(self, token);
	var a, i, j;
	i = 0;
	a = self.buf;
	j = self.start;
	while (j < self.end && peek(b, i) != 0 &&
		peek(a,j) == peek(b,i)) 
	{
		j = j + 1;
		i = i + 1;
	}
	switch (j == self.end) {
	case true:
		switch (peek(b,i) == 0) {
		case true:
			return 0;
		default:
			return -1;
		}
		break;
	default:
		switch (peek(b,i) == 0) {
		case true:
			return 1;
		}
		break;
	}
	return peek(a,j) - peek(b,i); 
}


exporting([
	token,
	token__new,
	token__dispose,
	token__copy,
	token__cmp,
]);
