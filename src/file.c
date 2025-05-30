
#include "file.h"
#include "folder.h"

#include "folder.c"

var file__delete() /*(var path)*/
{
	var self = pop();
	var path = pop();
#ifdef _WIN32
	var r = DeleteFileA((char *)path) == 0;
#else
	var r = unlink((char *)path);
#endif
	push(r);
	(void)self;
	return r;
}

var file__rename() /*(var src, var dest)*/
{
	var self = pop();
	var src = pop();
	var dest = pop();
#ifdef _WIN32
	var r = MoveFileA((char *)src, (char *)dest) == 0;
#else
	var r = rename((char *)src, (char *)dest);
#endif
	push(r);
	(void)self;
	return r;
}

var file__size() /*(var path)*/
{
	var self = pop();
	var path = pop();
	FILE *fp;
	var si;
	(void)self;
	fp = fopen((char *)path, "rb");
	if (!fp) {
		push(0);
		return 0;
	}
	fseek(fp, 0, SEEK_END);
	si = ftell(fp);
	fclose(fp);
	push(si);
	return si;
}

var file__load() /*(var path, var offset, var size)*/
{
	var self = pop();
	var path = pop();
	var offset = pop();
	var size = pop();
	char *buf;
	FILE *fp;
	var ret;
	(void)self;
	fp = fopen((char *)path, "rb");
	if (!fp) {
		push(0);
		return 0;
	}
	buf = malloc(size + 1);
	if (!buf) {
		push(0);
		return 0;
	}
	fseek(fp, offset, SEEK_SET);
	ret = fread(buf, 1, size, fp);
	if (ret != size) {
		free(buf);
		buf = 0;
		push(0);
		return 0;
	}
	buf[size] = '\0';
	fclose(fp);
	push((var)buf);
	return (var)buf;
}

var file__save() /*(var path, var offset, var buf, var size)*/
{
	var self = pop();
	var path = pop();
	var offset = pop();
	var buf = pop();
	var size = pop();
	FILE *fp;
	var ret;
	char *mode1 = "rb+";
	char *mode2 = "wb+";
	(void)self;
	if (offset < 0) {
		mode1 = "wb";
	}
	fp = fopen((char *)path, mode1);
	if (!fp) {
		fp = fopen((char *)path, mode2);
		if (!fp) {
			push(-1);
			return -1;
		}
	}
	if (offset > 0) {
		if (fseek(fp, offset, SEEK_SET)) {
			fseek(fp, 0, SEEK_SET);
		}
	}
	ret = fwrite((void *)buf, 1, size, fp);
	fclose(fp);
	push(ret);
	return ret;
}

var folder__create() /*(var path)*/
{
	var self = pop();
	var r = mkfldr((char *)pop());
	(void)self;
	push(r);
	return 0;
}

var folder__delete() /*(var path)*/
{
	var self = pop();
	var r = rmfldr((char *)pop());
	(void)self;
	push(r);
	return 0;
}

var folder__list() /*(var path)*/
{
	var self = pop();
	var path = pop();
	FOLDER *f;
	char *entry;
	var buf[3];
	(void)self;
	buf[0] = 0;
	f = openfldr((char *)path);
	if (!f) {
		push(0);
		return 0;
	}
	entry = readfldr(f);
	if (entry) {
		buffer__append((var)buf, (var)entry, strlen(entry));
	}
	while (entry) {
		entry = readfldr(f);
		if (!entry) {
			break;
		}
		buffer__append((var)buf, (var) "\n", 1);
		buffer__append((var)buf, (var)entry, strlen(entry));
	}
	closefldr(f);
	if (buf[0]) {
		((char *)buf[0])[buf[1]] = '\0';
	} else {
		char *n = malloc(1);
		n[0] = 0;
		push((var)n);
		return (var)n;
	}
	push(buf[0]);
	(void)self;
	return buf[0];
}

var file__get_home() {
	var self = pop();
	char *p = getenv("HOME");
	if (p) {
		push((var)p);
		return (var)p;
	}
	push((var) "");
	(void)self;
	return (var) "";
}
