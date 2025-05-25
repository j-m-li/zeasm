//
// This software is dedicated to the public domain.
//

// There is no type checking. Every variable is threated equaly as an 
// integer, a reference, a one dimension array of integer/reference, a 
// reference to a byte array or a method reference.

if (typeof require !== 'undefined') {importScripts = require;} // for nodejs !!

importScripts("../lib/std.js"); // include a source file

define('MY_CONST', 47); //define a constant

class myst { // a class with four members
one; 
next;
three;
four;
init()
{
	this.one = 1;
	this.three = 3;
	this.four = 4;
}
set_next(v)
{
	this.next = v;
}
}; // class myst 

class main {
main(argc, argv) 
{       // definition of the entry point function

	var i,a,s,b,end; //declaration of local variables
	var n;
	var f,y;
	_class(s, myst); //class type

	a = array(123);   //allocate an array of 123 intergers
	s = new myst;   //allocate a "myst" class
	b = bytes(3);     //allocate 3 bytes of memory
	
	poke(b,0,__("B"));	  // put a B in the first byte of b memory
	poke(b,1,__("\n"));
	poke(b,2,0);
	print(_("B:"));
	print(b);

	f = this.t2;		 // function pointer
	f(100,2,3,+4,-5); // indirect function call
	f = f();

	n = mul2(1, 20) + mod2(2,3) - div2(2,3) + (17 - 4); //that's all the operators that we have
	print10(n);

	s.init(); 
	s.set_next(_("two")); // string literal (nul terminated as in C)

	i = a[1];	     // array access

	a[0] = _("yo");
	a[122] = _("lAst");

	print(_("héllo world!\n")); // UTF-8
	print10(peek(a[122], 1));  // print the integer value of the second byte
                                  // of the string pointed by the 123 cell of a
	print(_("\n"));
	print(argv[argc-1]);
	print10(argv[argc-1]);

	i = 0;
	y = i;
	while (i == y && i != y && i < y && i <= y && i > y && i >= y) {
	}

	if (argc > 2) {	
		print(_(" MORE THAN TWO ARGS \n"));
		i = 2;
		end = 0;
		while (i < argc && (end == 0 || 3 == 2)) { // only while loop
			print(_("."));
			i = i + 1;
			if (i > 10) {
				end = 1;
			}
		}
	} else {
		print(_(" LESS THAN THREE ARGS \n"));
		print(s.next);
	}
	free(a);
	this.test(); 	// function call
	free(s);
	f = file_size(argv[1]);
	if (f > 0) {
		f = file_load(argv[1], f);
		print(f);
	} else {
	}
	
	f = new RIKIKI_CLASS();
	switch (47) {
	case MY_CONST:
		print(RIKIKI);
		break;
	default:
		print(_("grr"));
	}
	return 0;
}

// definition of methods
test()
{
	print(_("test\n")); //print a string
	print10(MY_CONST); // print a number (print3 is for ternary encoded numbers)
	this.t2(1,2);
}

t2( a , b ) {
	print10(a+b);
	print(_("\n"));
}
}; // class main

run(main);

