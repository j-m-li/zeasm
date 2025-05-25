if (typeof require !== 'undefined') {importScripts = require;} 
importScripts("../lib/std.js");
importScripts("./stack.js");
importScripts("./token.js");
importScripts("./lexer.js");
importScripts("./parser.js");

class main { main(argc, argv)
{
	var lex,par;
	_class(lex, lexer);
	_class(par, parser);

	print10(argc);
	if (argc < 4 || strcmp(_("-o"), argv[1])) {
		this.usage();
	}
	lex = new lexer;
	lex.init(argv[3]);

	par = new parser;
	par.init(lex);

	print(argv[2]);
	par.process();

	par.dispose();
	lex.dispose();
	return 0;
}
usage()
{
	print(_("js2c -o out.c [in.js]...\n"));
	exit(0);
}
}; // class main

run(main);
