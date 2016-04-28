Lank is the virtual machine language.
A forth like language that is register machine based. 

*************
Algorithm:
*************

Summary:

the type words could convert the preceding literals accordingly.
cases can be commands that load registers and then a
final verb does an action based on their contents.

Lookup:

The lookup can be done via a hash that is made by appending the
types and cases together. cases can be numerically sorted when
appended together, so they match better. 

for-example ksa mak sla munt mak tyi ha say hi ya
would have a hash that is 
tyihhasayhhiya
this could go along a tree, 
first the ya would be taken off for declarative sentences,
making it tyihhasayhhi  then the verb would be taken off for sayh
commands  so the sayh list referenced from the ya list would
match tyihha

matches can be fuzzy if starting from longest match down,
throwing a warning that no precise match was found, 
alternatively can be strict match, 
which may be easier to implement, 
can still sort lists by length and alphabet,
for faster searching.

Memory Organization:

It should have a number of registers, 
Perhaps 16, rather large registers,
such as 256 or 512 bit, so can fit 16 UTF-16 or UTF-32 glyphs.
If working with just C16 suftlank input though, can have 64bit
registers. 

The 0th register would be the working register for incoming
data. Long quotes start with ksa or another identifiable word,
so could have some cache memory allocated for them. 

4KB cache seems like a pretty reasonable standard. 

Basic Commands:
We'll be looking at BrainPlus which successfully was used for
self-programming algorithms. 

>   increment the data pointer (to point to the next cell to the
>   right).
<   decrement the data pointer (to point to the next cell to the
left).
+   increment (increase by one) the byte at the data pointer.
-   decrement (decrease by one) the byte at the data pointer.
.   output the byte at the data pointer.
,   accept one byte of input, storing its value in the byte at
the data pointer.
[   if the byte at the data pointer is zero, then instead of
moving the instruction pointer forward to the next command, jump
it forward to the command after the matching ] command.
]   if the byte at the data pointer is nonzero, then instead of
moving the instruction pointer forward to the next command, jump
it back to the command after the matching [ command.
$     Overwrites the byte in storage with the byte at the
pointer. (Extended Type I)
!     Overwrites the byte at the pointer with the byte in
storage. (Extended Type I)
0-F   Sets the value of the current memory pointer to a multiple
of 16. (Extended Type III)
a-z   Call function a-z, where function is named based upon
location in code. (BrainPlus)
@     Exits the program, or if inside a function, return to the
last position in main program
      and restore state. (Extended Type I, BrainPlus)

C equivalents:

(Program Start)     char array[infinitely large size] = {0};
char *ptr=array;
>   ++ptr;
<   --ptr;
+   ++*ptr;
-   --*ptr;
.   putchar(*ptr);
,   *ptr=getchar();
[   while (*ptr) {
]   }
$   sourceChar=*ptr;
!   *ptr=sourceChar;
0-F *ptr=16*sourceChar
a-z function(a-z)
@   exit();

unlambda is simpler it has
`
s 
k 
d 

*****************************
Development Environment
**************************

Want to have a state-of-the-art environment for javascript
development.  Will be implementing with the restrictions 
of asm.js.   Alternatively will be implementing in C or C++ that
compiles to asm.js. 

Coding Standards:
jslint, jshint and nasa's JPL revised guidelines.
The coding standards are available in JPL-P10.pdf
unit testing with tape.

Build System:
Gulp, browserify 

Hosting continued on sourceforge.

Build Steps:
source-code verification:
JSlint, JShint, JPLint




