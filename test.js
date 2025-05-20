// Assume add.wasm file exists that contains a single function adding 2 provided arguments
const fs = require('node:fs');

// Use the readFileSync function to read the contents of the "add.wasm" file
const wasmBuffer = fs.readFileSync('test.wasm');

// Use the WebAssembly.instantiate method to instantiate the WebAssembly module
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // Exported function lives under instance.exports object
  const { add } = wasmModule.instance.exports;
  const sum = add(40, 10);
  console.log("40 + 10 = " + sum); // Outputs: 11
});

