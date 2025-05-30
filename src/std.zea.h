
#ifndef STD_ZEA_H_
#define STD_ZEA_H_

#ifdef _WIN32
#include <windows.h>
#else
#define _XOPEN_SOURCE 600
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <sys/ioctl.h>
#include <sys/select.h>
#include <termios.h>
#include <unistd.h>
#undef _XOPEN_SOURCE
#endif
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define var long
#define byte unsigned char

#define MAX_STACK 1000

#include "file.h"
#include "term.h"

#define push(v)                                                                \
	if (sp < MAX_STACK) {                                                  \
		var d = (var)(v);                                              \
		stack[sp] = d;                                                 \
		sp++;                                                          \
	}
#define pop_() stack[--sp]

extern var stack[MAX_STACK + 1];
extern var sp;

static var pop() {
	var v = pop_();
	/*	printf("pop %lx %ld\n", v, sp);
	 */
	return v;
}

#define pow zeasm_pow

var pow() /*var x, var y)*/
{
	var x = pop();
	var y = pop();
	var r = 1;
	if (x == 0) {
		push(0);
		return 0;
	}
	while (y > 0) {
		r = r * x;
		y--;
	}
	while (y < 0) {
		r = r / x;
		y++;
	}
	push(r);
	return r;
}

var flush() {
	fflush(stdout);
	return 0;
}

struct buffer {
	var data;
	var length;
	var alloced;
};

var buffer__append() /*var b, var data, var len)*/
{
	var b = pop();
	var data = pop();
	var len = pop();
	var *buf = (var *)b;
	var end;
	if (buf[0] == 0) {
		buf[0] = (var)malloc(4096);
		buf[1] = 0;
		buf[2] = 4096;
	}
	end = buf[1] + len;
	if ((end + 2) >= buf[2]) {
		buf[2] = end + 4096;
		buf[0] = (var)realloc((void *)buf[0], buf[2]);
	}
	memcpy((char *)(buf[0] + buf[1]), (char *)data, len);
	buf[1] = end;
	((char *)buf[0])[end] = 0;
	push(0);
	return 0;
}

var buffer__appendv() /*(var b, var n) */
{
	var b = pop();
	var n = pop();
	char tmp[64];
	int i = 0;
	int sub = 0;
	var max = 10000;
	var t;

	if (n == 0) {
		tmp[0] = '0';
		push(1);
		push((var)tmp);
		push(b);
		return buffer__append();
	}
	t = max * 10;
	while (t > max) {
		max = t;
		t = t * 10;
	}

	if (n == -n) { /* -32768 or -2147483648 or -9223372036854775808 */
		sub = 1;
		n = n + 1;
		tmp[0] = '-';
		i = 1;
	} else if (n < 0) {
		n = -n;
		tmp[0] = '-';
		i = 1;
	}
	while (max > 1) {
		t = max / 10;
		if (n >= t) {
			break;
		}
		max = t;
	}
	while (max > 1) {
		tmp[i] = '0' + (n / max);
		i++;
		n = (n % max) - sub;
		sub = 0;
		max = max / 10;
	}
	push(i);
	push((var)tmp);
	push(b);
	return buffer__append();
}

var str_cmp() /*(var a, var b)*/
{
	var a = pop();
	var b = pop();
	var r = strcmp((void *)a, (void *)b);
	push(r);
	return r;
}

var str_dup() /*(var a)*/
{
	var a = pop();
	var l = strlen((char *)a);
	var r = (var)malloc(l + 1);
	memcpy((void *)r, (void *)a, l);
	((char *)r)[l] = 0;
	push(r);
	return 0;
}

#ifdef _MSC_VER
var __builtin_trap() {
	__debugbreak();
	return 0;
}
#endif

var run() /*(var a)*/
{
	var a = pop();
	var r = system((char *)a);
	push(r);
	return 0;
}

var quit() /*(void)*/
{
	term__deinit();
	exit(0);
	return -1;
}

#include "file.c"
#include "term.c"

#endif
