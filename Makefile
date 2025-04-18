
all:
	mkdir -p bin
	cc -o bin/zeasm zeasm.c
	./bin/zeasm -c sample.zea

