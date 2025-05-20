w:
	wat2wasm test.wat
	http-server

all:
	mkdir -p bin
	cc -o bin/zeasm zeasm.c
	cat sample.zea | ./bin/zeasm 
