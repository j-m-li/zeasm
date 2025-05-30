// Outputs a WASM file with two entries/example for each section (where
// allowed). Compile with: gcc wasm_both_examples_single_module.c -o makewasm
// Run: ./makewasm both_examples.wasm

#include <stdio.h>
#include <stdlib.h>

unsigned char wasm_both_examples[] = {
    // Magic & version
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,

    // Type Section (2 types)
    0x01, 0x10,				// Section ID, size
    0x02,				// count: 2
    0x60, 0x00, 0x01, 0x7F,		// (func) -> i32
    0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7E, // (func i32, i32) -> i64

    // Import Section (2 imports)
    0x02, 0x18, // Section ID, size
    0x02,	// count: 2
    // import "foo" from "env" as func type 0
    0x03, 0x65, 0x6E, 0x76, // module "env"
    0x03, 0x66, 0x6F, 0x6F, // name "foo"
    0x00, 0x00,		    // kind func, type 0
    // import "mem" from "js" as memory min 1
    0x02, 0x6A, 0x73,	    // module "js"
    0x03, 0x6D, 0x65, 0x6D, // name "mem"
    0x02, 0x00, 0x01,	    // kind memory, min 1

    // Function Section (2 functions)
    0x03, 0x03,
    0x02, // count: 2
    0x00, // type 0
    0x01, // type 1

    // Table Section (2 tables)
    0x04, 0x0A,
    0x02,		    // count: 2
    0x70, 0x00, 0x01,	    // funcref, min 1
    0x70, 0x01, 0x02, 0x04, // funcref, min 2, max 4

    // Memory Section (2 memories)
    0x05, 0x07,
    0x02,	      // count: 2
    0x00, 0x01,	      // min 1
    0x01, 0x01, 0x02, // min 1, max 2

    // Global Section (2 globals)
    0x06, 0x10,
    0x02,			  // count: 2
    0x7F, 0x00, 0x41, 0x2A, 0x0B, // i32, immutable, i32.const 42, end
    0x7D, 0x01, 0x43, 0x00, 0x00, 0x60, 0x40,
    0x0B, // f32, mutable, f32.const 3.5, end

    // Export Section (2 exports)
    0x07, 0x0F,
    0x02,				// count: 2
    0x03, 0x66, 0x6F, 0x6F, 0x00, 0x00, // "foo", kind func, index 0
    0x03, 0x6D, 0x65, 0x6D, 0x02, 0x01, // "mem", kind memory, index 1

    // Start Section (only one allowed, use first example)
    0x08, 0x01,
    0x00, // function index 0

    // Element Section (2 segments)
    0x09, 0x11,
    0x02,				// count: 2
    0x00, 0x41, 0x00, 0x0B, 0x01, 0x00, // table 0, offset 0, 1 func (0)
    0x00, 0x41, 0x01, 0x0B, 0x02, 0x01,
    0x02, // table 0, offset 1, 2 funcs (1,2)

    // Code Section (2 functions)
    0x0A, 0x14,
    0x02,			  // count: 2
    0x04, 0x00, 0x41, 0x2A, 0x0B, // body: i32.const 42, end
    0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6A,
    0x0B, // body: get_local 0, get_local 1, i32.add, end

    // Data Section (2 segments)
    0x0B, 0x13,
    0x02,					   // count: 2
    0x00, 0x41, 0x00, 0x0B, 0x02, 0x68, 0x69,	   // mem 0, offset 0, "hi"
    0x00, 0x41, 0x02, 0x0B, 0x03, 0x4F, 0x4B, 0x21 // mem 0, offset 2, "OK!"
};

int main(int argc, char **argv) {
	FILE *f;
	if (argc < 2) {
		fprintf(stderr, "Usage: %s output.wasm\n", argv[0]);
		return 1;
	}
	f = fopen(argv[1], "wb");
	if (!f) {
		fprintf(stderr, "Failed to open output file\n");
		return 1;
	}
	fwrite(wasm_both_examples, 1, sizeof(wasm_both_examples), f);
	fclose(f);
	printf("Wrote WASM with both examples for each section to %s\n",
	       argv[1]);
	return 0;
}
