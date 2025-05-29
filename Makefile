w:
	wat2wasm test.wat
	http-server

all:
	mkdir -p bin
	cc -o bin/zeasm zeasm.c
	cat sample.zea | ./bin/zeasm > t.c
	gcc -g -Wall -ansi t.c

fmt:
	clang-format --style="{BasedOnStyle: llvm,UseTab: Always,IndentWidth: 8,TabWidth: 8}" -i *.h *.c

	
