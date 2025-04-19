
all:
	mkdir -p bin
	cc -o bin/zeasm zeasm.c
	./bin/zeasm sample.zea

