/*
                 ZeASM programing language


          MMXXV April 19 PUBLIC DOMAIN by JML

     The authors and contributors disclaim copyright, patents
           and all related rights to this software.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a
 compiled binary, for any purpose, commercial or non-commercial,
 and by any means.

 The authors waive all rights to patents, both currently owned
 by the authors or acquired in the future, that are necessarily
 infringed by this software, relating to make, have made, repair,
 use, sell, import, transfer, distribute or configure hardware
 or software in finished or intermediate form, whether by run,
 manufacture, assembly, testing, compiling, processing, loading
 or applying this software or otherwise.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT OF ANY PATENT, COPYRIGHT, TRADE SECRET OR OTHER
 PROPRIETARY RIGHT.  IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR
 ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

#include "std.h"

byte buf[512];
byte input[512];

var process(var argc, byte **argv)
{
	var c, l;
	l = 0;
	while ((c = getchar()) != EOF) {
		if (l < 511) {
			input[l] = c & 0xFF;
			l++;
		}
		if (c == '\n') {
			input[l] = '\0';
			printf(">%s", input);
			fflush(stdout);
			l = 0;
		}
	}
	return 0;
}

int main(int argc, char *argv[])
{
	return (int)process(argc, (byte**)argv);
}

