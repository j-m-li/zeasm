#include <stdio.h>
#include <string.h>

/*
 * Basic ASCII to Unicode Braille converter for C90.
 * Outputs UTF-8 encoded Braille patterns for a limited set of ASCII characters.
 * Unknown characters are mapped to the blank Braille pattern (U+2800).
 */

const char *ascii_to_braille(char ch) {
	switch (ch) {
	case 'a':
	case 'A':
		return "\xE2\xA0\x81"; // ⠁
	case 'b':
	case 'B':
		return "\xE2\xA0\x83";
	case 'c':
	case 'C':
		return "\xE2\xA0\x89";
	case 'd':
	case 'D':
		return "\xE2\xA0\x99";
	case 'e':
	case 'E':
		return "\xE2\xA0\x91";
	case 'f':
	case 'F':
		return "\xE2\xA0\x8B";
	case 'g':
	case 'G':
		return "\xE2\xA0\x9B";
	case 'h':
	case 'H':
		return "\xE2\xA0\x93";
	case 'i':
	case 'I':
		return "\xE2\xA0\x8A";
	case 'j':
	case 'J':
		return "\xE2\xA0\x9A";
	case 'k':
	case 'K':
		return "\xE2\xA0\x85";
	case 'l':
	case 'L':
		return "\xE2\xA0\x87";
	case 'm':
	case 'M':
		return "\xE2\xA0\x8D";
	case 'n':
	case 'N':
		return "\xE2\xA0\x9D";
	case 'o':
	case 'O':
		return "\xE2\xA0\x95";
	case 'p':
	case 'P':
		return "\xE2\xA0\x8F";
	case 'q':
	case 'Q':
		return "\xE2\xA0\x9F";
	case 'r':
	case 'R':
		return "\xE2\xA0\x97";
	case 's':
	case 'S':
		return "\xE2\xA0\x8E";
	case 't':
	case 'T':
		return "\xE2\xA0\x9E";
	case 'u':
	case 'U':
		return "\xE2\xA0\xA5";
	case 'v':
	case 'V':
		return "\xE2\xA0\xA7";
	case 'w':
	case 'W':
		return "\xE2\xA0\xBA";
	case 'x':
	case 'X':
		return "\xE2\xA0\xAD";
	case 'y':
	case 'Y':
		return "\xE2\xA0\xBD";
	case 'z':
	case 'Z':
		return "\xE2\xA0\xB5";
	case '0':
		return "\xE2\xA0\x9A";
	case '1':
		return "\xE2\xA0\x81";
	case '2':
		return "\xE2\xA0\x83";
	case '3':
		return "\xE2\xA0\x89";
	case '4':
		return "\xE2\xA0\x99";
	case '5':
		return "\xE2\xA0\x91";
	case '6':
		return "\xE2\xA0\x8B";
	case '7':
		return "\xE2\xA0\x9B";
	case '8':
		return "\xE2\xA0\x93";
	case '9':
		return "\xE2\xA0\x8A";
	case ' ':
		return "\xE2\xA0\x80";
	case '.':
		return "\xE2\xA0\xB2";
	case ',':
		return "\xE2\xA0\x82";
	case '?':
		return "\xE2\xA0\xA6";
	case '!':
		return "\xE2\xA0\x96";
	case '-':
		return "\xE2\xA0\xA4";
	case '\'':
		return "\xE2\xA0\x84";
	case '"':
		return "\xE2\xA0\x94";
	default:
		return "\xE2\xA0\x80"; // blank
	}
}

int main(int argc, char *argv[]) {
	char line[1024];
	unsigned int i;
	if (argc > 1) {
		/* Print all arguments as a single line */
		for (i = 1; i < (unsigned int)argc; ++i) {
			char *p = argv[i];
			while (*p) {
				printf("%s", ascii_to_braille(*p));
				++p;
			}
			if (i < (unsigned int)argc - 1) {
				printf("%s", ascii_to_braille(' '));
			}
		}
		printf("\n");
	} else {
		/* Read from stdin */
		while (fgets(line, sizeof(line), stdin)) {
			for (i = 0; i < strlen(line); ++i) {
				if (line[i] == '\n' || line[i] == '\r')
					continue;
				printf("%s", ascii_to_braille(line[i]));
			}
			printf("\n");
		}
	}
	return 0;
}
