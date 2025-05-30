// Assume add.wasm file exists that contains a single function adding 2 provided arguments
const fs = require('node:fs');

// Use the readFileSync function to read the contents of the "add.wasm" file
const wasmBuffer = fs.readFileSync('test.cmd');

// Use the WebAssembly.instantiate method to instantiate the WebAssembly module

var wasmInstance;

function log(ptr)
{
     let len = 0;
     let hl = 0;
     const head = new Uint8Array(wasmInstance.exports.memory.buffer, ptr, 4);
     if (head[0] < 0xC0) {
	len = head[0];
	hl = 1;
     } else if (head[0] < 0xE0) {
	len = head[0] & 0x1F;
	len <<= 6;
	len += head[1] & 0x3F;
	hl = 2;
     } else if (head[0] < 0xF0) {
	len = head[0] & 0x0F;
	len <<= 6;
	len += head[1] & 0x3F;
	len <<= 6;
	len += head[2] & 0x3F;
	hl = 3;
     } else {
	len = head[0] & 0x07;
	len <<= 6;
	len += head[1] & 0x3F;
	len <<= 6;
	len += head[2] & 0x3F;
	len <<= 6;
	len += head[3] & 0x3F;
	hl = 4;
     }

     const bytes = new Uint8Array(wasmInstance.exports.memory.buffer, ptr + hl, len);
      const text = new TextDecoder('utf-8').decode(bytes);
      console.log(text);
}

const imp = {
	console: {
		log: log,
	},
};

WebAssembly.instantiate(wasmBuffer.slice(128), imp).then(wasmModule => {
  wasmInstance = wasmModule.instance;
  // Exported function lives under instance.exports object
  const { add } = wasmModule.instance.exports;
  const sum = add(40, 10);
  console.log("40 + 10 = " + sum); // Outputs: 11
});

