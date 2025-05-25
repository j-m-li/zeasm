//
// This software is dedicated to the public domain.
//
// This file is in plain JavaScript.


if (typeof process !== 'undefined') {
	globalThis['fs'] = require('fs');
	globalThis['onmessage'] = 0;
}

function _(txt)
{
	return (new TextEncoder()).encode(txt);
}

function __(txt)
{
	return txt.codePointAt(0);
}


function define(n,v)
{
	Object.defineProperty(globalThis, n,
		{value:v,enumerable:true, writable:false});
}

define('RIKIKI', _("JavaScript Version 1.0"));

class RIKIKI_CLASS {
	hello;	
}

function exporting(m)
{
	for (var f in m) {
		if (typeof globalThis[m[f].name] === "undefined") {
			globalThis[m[f].name] = m[f];
			//console.log("#OK : " + m[f].name + "");
		} else {
			console.log("#error : " + m[f].name + " already exists");
		}
	}
}


function _class(v,cls)
{
}

function array(n)
{
	return new Array(n);
}

function bytes(n)
{
	return new Uint8Array(n);
}

function free(v)
{
	v = null;
}


function poke(b,i,v)
{
	var n = v;
	if (typeof v === "string") {
		n = v.charCodeAt(0);
	}
	b[i] = n;
}

function peek(b,i)
{
	if (i >= b.length) {
		return 0;
	}
	return b[i];
}

function print(v)
{
	while (v.length > 0 && v[v.length-1] == 0) {
		v = v.slice(0, v.length - 1);
	}
	var s = (new TextDecoder()).decode(v);
	if (typeof process !== 'undefined') {
		process.stdout.write(s);
	} else {
		postMessage(s);
	}
}

function draw(dt)
{		
	if (dt - globalThis['time'] < 50.0) {
		//globalThis['handle'] = self.requestAnimationFrame(draw);
		return;
	}
	const ctx = globalThis['ctx'];
	const img = globalThis['img'];
	const fb = img.data;
	const w = img.width;
	const h = img.height;
	let i;
	i = ((w - 1) * 4);
	fb[i+0] = 0x00;
	fb[i+1] = 0xE0;
	fb[i+2] = 0x00;
	fb[i+3] = 0xFF;
	fb[3] = 0xFF; // alpha
	fb[0] = 0xFF;
	ctx.putImageData(img, 0,0);
	globalThis['time'] = dt;
	globalThis['handle'] = self.requestAnimationFrame(draw);
}

onmessage = function(event) {
	switch (event.data.type) {
	case 'canvas':
		globalThis['canvas'] = event.data.canvas;
		globalThis['time'] = 0;
		globalThis['ctx'] = globalThis['canvas'].getContext('2d');
		globalThis['handle'] = self.requestAnimationFrame(draw);
		globalThis['img'] = globalThis['ctx'].createImageData(
			globalThis['canvas'].width,
			globalThis['canvas'].height);
		break;
	}
}

function print10(v)
{
	if (typeof process !== 'undefined') {
		process.stdout.write(parseInt(v).toString());
	} else {
		postMessage(parseInt(v));
	}
}

function file_size(f)
{
	if (typeof process !== 'undefined') {
		var s = (new TextDecoder()).decode(f);
		const st = globalThis['fs'].statSync(s);
		return st.size;
	}
}

function file_load(f,s)
{
	if (typeof process !== 'undefined') {
		var s = (new TextDecoder()).decode(f);
		return globalThis['fs'].readFileSync(s, null);
	}
}

function file_save(f,s,b)
{
	if (typeof process !== 'undefined') {
		var s = (new TextDecoder()).decode(f);
		return globaThis['fs'].writeFileSync(s, b.subarray(0,s));
	}
}

function exit(n)
{
	if (typeof process !== 'undefined') {
		process.exit(n);
	}
}

// FIXME
function run(main) {
	let r;
	const ma = new main;
	switch (typeof process !== 'undefined') {
	case true:
		const a = process.argv.slice(1);
		let ar = [];
		a.forEach(function (v,i,a) {ar.push(_(v));});
		r = ma.main(ar.length,ar);break;
	default:
		r = ma.main(2,[_("theApp"), _("Yes"), 0]);break;
	}
	exit(r);
}

function mul2(a, b) 
{
	return ((a|0) * (b|0)) | 0;
}

function div2(a, b) 
{
	return ((a|0) / (b|0)) | 0; // signed 32 bit
}

function mod2(a, b) 
{
	return ((a|0) % (b|0)) | 0;
}

function and2(a, b) 
{
	return a & b;
}

function or2(a, b) 
{
	return a | b;
}

function xor2(a, b) 
{
	return a ^ b;
}

function inv2(a) 
{
	return ~a;
}

function strcmp(a,b)
{
	var i;
	i = 0;
	while ((a[i] == b[i]) && a[i]) {
		i++;
	}
	return a[i] - b[i];
}

exporting([_, __,
	define,
	exporting,
	_class,
	array,
	bytes,
	poke,
	peek,
	print,
	print10,
	free,
	file_size,
	file_load,
	file_save,
	exit,
	mul2,
	div2,
	mod2,
	and2,
	or2,
	xor2,
	inv2,
	strcmp,
	RIKIKI_CLASS,
	run]);

