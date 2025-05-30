all: bin/zw
	./bin/zw
	wat2wasm test.wat
	zcat src/3o3_exe.cmd.gz > test.cmd
	cat test.wasm >> test.cmd
	node test.js


www: all
	http-server

bin/zw: zw.zea bin/zeasm
	cat zw.zea | ./bin/zeasm > ./bin/zw.c
	gcc -g -Wall -ansi bin/zw.c -o bin/zw

bin/zeasm: src/zeasm.c
	mkdir -p bin
	cc -g -Wall -o bin/zeasm src/zeasm.c
	cat sample.zea | ./bin/zeasm > bin/s.c
	gcc -g -Wall -ansi bin/s.c -o bin/sample

clean:
	rm -f bin/*

fmt:
	clang-format --style="{BasedOnStyle: llvm,UseTab: Always,IndentWidth: 8,TabWidth: 8}" -i *.h *.c

	
