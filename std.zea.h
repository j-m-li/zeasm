
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define var long
#define byte unsigned char

#define MAX_STACK 1000

#define push(v) if (sp < MAX_STACK) {var d = (var)(v);stack[sp] = d; sp++;} 
#define pop_() stack[--sp]

extern var stack[MAX_STACK + 1];
extern var sp;

static var pop()
{
	var v = pop_();
/*	printf("pop %lx %ld\n", v, sp);
*/
	return v;
}

