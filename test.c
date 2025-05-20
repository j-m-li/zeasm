#include <stdio.h>
#include <string.h>
#include <stdlib.h>

/* Write a minimal wasm file for: (module (func (result i32) i32.const 42) (export "main" (func 0))) */

unsigned char wasm_bytes[] = {
    // WASM binary magic + version
    0x00,0x61,0x73,0x6D,   // \0asm
    0x01,0x00,0x00,0x00,   // version 1

    // Type section
    0x01, // section: Type
    0x07, // section size
    0x01, // 1 type
    0x60, // func
    0x00, // num params
    0x01, // num results
    0x7F, // i32

    // Function section
    0x03, // section: Function
    0x02, // section size
    0x01, // 1 function
    0x00, // type index 0

    // Export section
    0x07, // section: Export
    0x07, // section size
    0x01, // 1 export
    0x04, // string length
    'm','a','i','n',
    0x00, // export kind: func
    0x00, // func index

    // Code section
    0x0A, // section: Code
    0x06, // section size
    0x01, // 1 function body
    0x04, // body size
    0x00, // local decl count
    0x41,0x2A, // i32.const 42
    0x0B  // end
};

int main(int argc, char **argv) {
    FILE *f;
    if(argc < 2) {
        printf("Usage: %s output.wasm\n", argv[0]);
        return 1;
    }
    f = fopen(argv[1], "wb");
    if(!f) {
        printf("Failed to open output file\n");
        return 1;
    }
    fwrite(wasm_bytes, 1, sizeof(wasm_bytes), f);
    fclose(f);
    printf("Wrote minimal WASM to %s\n", argv[1]);
    return 0;
}
