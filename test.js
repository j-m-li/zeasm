const fs = require('node:fs');
const tm = require('node:timers/promises');
var wasm;
var term;

function mem2string(ptr) {
  let len = 0;
  let hl = 0;
  const head = new Uint8Array(wasm.exports.memory.buffer, ptr, 4);
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
  const bytes = new Uint8Array(wasm.exports.memory.buffer, ptr + hl, len);
  return new TextDecoder('utf-8').decode(bytes);
}

function print(ptr) {
  process.stdout.write(mem2string(ptr));
}

function keyboard(data) {
  let seq = data.toString();
  if (seq == "\r") {
    seq = "\r\n";
  }
  if (seq == "\x1B") {
    process.exit(0);
  }
  let u = new TextEncoder('utf-8').encode(seq);
  let s = u.length;
  let a = new Uint32Array(wasm.exports.memory.buffer, term, 6);
  let si = new Uint8Array(wasm.exports.memory.buffer, term + 4 * 6, 1);
  let d = new Uint8Array(wasm.exports.memory.buffer, term + 4 * 6 + 1, 127);
  if (s > 127) {
    s = 127;
  }
  si[0] = s;
  for (i = 0; i < s; i++) {
    d[i] = u[i]
  }
  a[3] = 1; /* event type */
  a[4] = s; /* event data length */
  a[5] = term + 4 * 6; /* event data pointer */
  wasm.exports.event(term);
}

function timeout() {
  tm.setTimeout(1000).then(timeout);
  let d = new Uint8Array(wasm.exports.memory.buffer, term + 4 * 6, 1);
  d[0] = 0;
  wasm.exports.event(term);
}

function fd_write()
{
	console.log("FFF");
}

const imp = {
  std: {
    print: print,
  },
  wasi_snapshot_preview1: {
	  fd_write: fd_write,
	  fd_read: fd_write,
	  proc_exit: fd_write,
  },
};
const wasmBuffer = fs.readFileSync('test.cmd');
WebAssembly.instantiate(wasmBuffer.slice(128), imp).then(wasmModule => {
  wasm = wasmModule.instance;
  process.stdin.setRawMode(true);
  term = wasm.exports.init();
  tm.setTimeout(100).then(timeout);
  process.stdin.on('data', keyboard);
  const {
    add,
    _start
  } = wasmModule.instance.exports;
  const sum = add(40, 10);
  console.log("40 + 10 = " + sum); // Outputs: 11
	_start();
});
