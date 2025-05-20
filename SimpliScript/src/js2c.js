if (typeof require !== 'undefined') {importScripts = require;} 
importScripts("../lib/std.js");
importScripts("./stack.js");
importScripts("./token.js");
importScripts("./lexer.js");
importScripts("./parser.js");

class main { main(argc, argv)
{
	var lex,par;
		
	print10(argc);
	if (argc < 4 || strcmp(_("-o"), argv[1])) {
		usage();
	}
	lex = lexer__new(argv[3]);
	par = parser__new(lex);

	print(argv[2]);
	parser__process(par);

	parser__dispose(par);
	lexer__dispose(lex);
	return 0;
}};

function usage()
{
	print(_("js2c -o out.c [in.js]...\n"));
	exit(0);
}

run(main);
