all: bin/zc
	wat2wasm wasi-poll-stdin.wat
	(wasmtime wasi-poll-stdin.wasm ; echo $?)	
	./bin/zc
	wat2wasm test.wat
	zcat src/3o3_exe.cmd.gz > test.cmd
	cat test.wasm >> test.cmd
	node test.js


www: all
	http-server

bin/zc: zc.zea bin/zeasm
	cat zc.zea | ./bin/zeasm > ./bin/zc.c
	gcc -g -Wall -ansi bin/zc.c -o bin/zc

bin/zeasm: src/zeasm.c
	mkdir -p bin
	cc -g -Wall -o bin/zeasm src/zeasm.c
	cat sample.zea | ./bin/zeasm > bin/s.c
	gcc -g -Wall -ansi bin/s.c -o bin/sample

clean:
	rm -f bin/*

fmt:
	tidy -i -w 1024 --preserve-entities yes --show-info no --warn-proprietary-attributes no -m *.html
	js-beautify -n --no-preserve-newlines -w 79 -s 2 *.js
	clang-format --style="{BasedOnStyle: llvm,UseTab: Always,IndentWidth: 8,TabWidth: 8}" -i src/*.h src/*.c

	
