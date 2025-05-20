if (typeof require !== 'undefined') {importScripts = require;} 
importScripts("../lib/std.js");
class main { main(argc, argv)
{
    print(_("Hello world!\n"));
}}; 
run(main);
