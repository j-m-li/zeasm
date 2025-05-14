/*
                 ZeASM programing language


          MMXXV April 19 PUBLIC DOMAIN by JML

     The authors and contributors disclaim copyright, patents
           and all related rights to this software.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a
 compiled binary, for any purpose, commercial or non-commercial,
 and by any means.

 The authors waive all rights to patents, both currently owned
 by the authors or acquired in the future, that are necessarily
 infringed by this software, relating to make, have made, repair,
 use, sell, import, transfer, distribute or configure hardware
 or software in finished or intermediate form, whether by run,
 manufacture, assembly, testing, compiling, processing, loading
 or applying this software or otherwise.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT OF ANY PATENT, COPYRIGHT, TRADE SECRET OR OTHER
 PROPRIETARY RIGHT.  IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR
 ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
/*
 Must run on a CH32x035G8R6 $0.40
 (32bit RISC-V, 62kB Flash, 20kB SRAM, USB host/device, 48MHz) 

 id = ((class & 0xFF) << 24) | \
 	((size & 0xFF) << 16) | \
 	(label & 0xFFFF);
*/

#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#define byte unsigned char
#define var long

#define MAX_ID_LEN 70
#define MAX_CLASS 255
#define MAX_SIZE 255
#define MAX_LABEL 65535
byte buf[512];
byte input[512];
var ahead = 0;
byte tmp[MAX_ID_LEN + 1];
var classes[MAX_CLASS + 1];
var labels[MAX_LABEL + 1];
var line;

var comment(var c);

var next()
{
	var t = ahead;
	ahead = getchar();
	return t;
}

var error(byte *str)
{
	printf("#error at line %d (%c)  %s\n", line, ahead,  str);
	fflush(stdout);
	exit(-1);
}

var identifier()
{
	var i = 0;
	while (i < sizeof(buf) - 1 && ahead != EOF) {
		if ((ahead >= 'a' && ahead <= 'z') || 
				(ahead >= '0' && ahead <= '9')) 
		{
			buf[i] = ahead;
			i++;
		} else {
			break;
		}
		next();
	}
	if (i < 1) {
		error("identifier");
	}
	buf[i] = 0;
	return (var)buf;
}


var kcmp(byte *key, byte *tmp)
{
	var c;
	var i = 0;
	while (tmp[i]) {
		if (tmp[i] != key[i]) {
			return tmp[i] - key[i];
		}
		i++;
	}
	if (!key[i]) {
		return 0;
	}
	while (key[i] && ahead != EOF && i < MAX_ID_LEN) {
		if (ahead >= 'a' && ahead <= 'z') {
		        if (ahead == key[i]) {	
				tmp[i] = next();
				i++;
			} else {
				break;
			}
		} else {
			break;
		}
	}
	tmp[i] = 0;
	if (!key[i]) {
		return 0;
	}	
	return -1;
}

var spaces()
{
	var c;
	while (ahead != EOF) {
		switch (ahead) {
		case ' ':
		case '\t':
		case '\r':
		case '\n':
			break;
		case '?':
			break;
		case '!':
			comment(next());
			break;
		default:
			return 0;
		}
		c = next();
		if (c == '\n') {
			line++;
		}
	}
	return 0;
}


var byte_string()
{
	var i;
	var c;
	var n = 0;
	if (ahead != '\'') {
		error("bytes");
		return 0;
	}
	next();
	i = 0;
	while (i < 0x10000 && (c = next()) != EOF) {
		if (c == '\'') {
			return i;
		}
		if (c == '-') {
			n = 0;
		} else if (c >= 'a' && c <= 'o') {
			n = c - 'a' + 1;
		} else {
			error("syntax");
		}
		n <<= 4;
		c = next();
		if (c == '-') {
		} else if (c >= 'a' && c <= 'o') {
			n += c - 'a' + 1;
		} else {
			error("syntax");
		}
		if (ahead != '\'') {
			printf("0x%x, ", n);
		} else {
			printf("0x%x", n);
		}
		i++;
	}
	error("bytes no end");
	return 0;
}


var string()
{
	var i;
	var c;
	if (ahead != '"') {
		error("string");
		return 0;
	}
	next();
	i = 0;
	while (i < sizeof(buf) - 1 && (c = next()) != EOF) {
		if (c == '"') {
			buf[i] = 0;
			return (var)buf;
		}
		buf[i] = c;
		i++;
	}
	error("string no end");
	return 0;
}

var number()
{
	var i;
	var c;
	var s = 1;
	if (ahead == '-') {
		next();
		s = -1;
	}
	if (ahead < '0' || ahead > '9') {
		error("number");
		return 0;
	}
	i = 0;
	c = 0;
	while (i < 20 && (ahead != EOF)) {
		if (ahead < '0' || ahead > '9') {
			if (s < 1) {
				return -c;
			}
			return c;
		}
		c = (c * 10) + (ahead - '0');
		i++;
		next();
	}
	error("num too big");
	return 0;
}


var include()
{
	byte *s;
	spaces();
	s = (byte*)string();
	printf("#include \"%s.h\"\n", s);
	return 0;
}

var func()
{
	byte *s;
	spaces();
	s = (byte*)identifier();
	printf("var %s(", s);
	spaces();
	while (ahead != EOF && ahead != ':' && ahead != ';') {
		s = (byte*)identifier();
		spaces();
		if (ahead == ',') {
			printf("var %s, ", s);
			next();
		} else {
			printf("var %s", s);
			break;
		}
	}
	if (ahead == ':') {
		next();
	} else if (ahead == ';') {
		printf(");\n");
		next();
		return 0;
	} else {
		error("missing ; or :");
	}
	printf(")\n{\n");
	printf("}\n");
	return 0;
}

var bytes()
{
	var size = 0;
	byte *s;
	var v;
	spaces();
	s = (byte*)identifier();
	spaces();
	if (ahead == '"') {
		printf("byte *%s = (byte*)\"", s);
		while (ahead == '"') {
			printf("%s", string());
			spaces();
		}
		if (ahead != ';') {
			error("miss ;");
		}
		next();
		printf("\";\n");
		return 0;
	}
	printf("byte %s[] = {", s);
	while (ahead != EOF && ahead != ';') {
		size += byte_string();
		spaces();
	}
	if (ahead == ';') {
		printf("}; /* size : %d */\n", size);
		next();
		return 0;
	} else {
		error("missing ;");
	}
	return 0;
}


var array()
{
	var size = 0;
	byte *s;
	var v;
	spaces();
	s = (byte*)identifier();
	printf("var %s[] = {", s);
	spaces();
	while (ahead != EOF && ahead != ';') {
		v = number();
		spaces();
		if (ahead == ',') {
			printf("0x%x, ", v);
			size++;
			next();
			spaces();
		} else {
			printf("0x%x", v);
			size++;
			break;
		}
	}
	if (ahead == ';') {
		printf("}; /* size : %d */\n", size);
		next();
		return 0;
	} else {
		error("missing ;");
	}
	return 0;
}



var keyword(var c)
{
	var i;
	tmp[0] = c;
	tmp[1] = 0;
	switch (c) {
	case 'a':
		if (!kcmp("array", tmp)) {
			return array();
		}
		break;
	case 'b':
		if (!kcmp("bytes", tmp)) {
			return bytes();
		}
		break;
	case 'i':
		if (!kcmp("include", tmp)) {
			return include();
		}
		break;	
	case 'f':
		if (!kcmp("func", tmp)) {
			return func();
		}
		break;	
	default:
	}
	i = 0;
	while (tmp[i]) { 
		i++; 
	}
	while (ahead != EOF && i < MAX_ID_LEN) {
		if (ahead >= 'a' && ahead <= 'z') {
			tmp[i] = next();
			i++;
		} else {
			break;
		}
	}
	tmp[i] = 0;
	printf("#error %s\n", tmp);
	error("is a keyword?");
	return -1;
}


var comment(var c)
{
	while ((c = next()) != EOF) {
		switch (c) {
		case '\n':
			line++;
		case '\r':
			return c;
		case '?':
			c = next();
			if (c == '\r') {
				c = next();
			}
			if (c == '\n') {
				line++;
			}
			break;
		}
	}
	return -1;
}

var process(var argc, byte **argv)
{
	var c;
	line = 1;
	next();
	while ((c = next()) != EOF) {
		switch (c) {
		case '!':
			comment(c);
			break;
		case '\n':
			line++;
		case '\r':
		case ' ':
		case '\t':
			break;
		default:
			if (c >= 'a' && c <= 'z') {
				 keyword(c);
			} else {
				error("unexpected");
			}
		}
	}
	return 0;
}

int main(int argc, char *argv[])
{
	return (int)process(argc, (byte**)argv);
}

