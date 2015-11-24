# HSPL Rpoku Sysh makefile
# uses scripts in bin

prefix=/usr/local
exec_prefix=$(prefix)

srcdir=src
bindir=$(exec_prefix)/bin
datadir=$(prefix)/share
infodir=$(datadir)/info
mandir=$(datadir)/man/man1
docdir=$(datadir)/doc/spel
TARGET=bin/spel

NASM=nasm
INSTALL=/usr/bin/install -c -m 755
INSTALLDATA=/usr/bin/install -c -m 644
LD=ld 
CC=clang 
ECXX=em++
GXXDEBUGFLAGS= -Wall -Wextra -Wpedantic -Wstrict-null-sentinel -Wno-coverage-mismatch -fstack-usage -Wstack-usage=1024 -Wuseless-cast -Wlogical-op -Wno-aggressive-loop-optimizations -Wunsafe-loop-optimizations -Wdouble-promotion -Wmaybe-uninitialized -Wnoexcept  # -Waggregate-return
CLANGDEBUGFLAGS= -Wglobal-constructors 
DEBUGFLAGS= -gdwarf-4 -UNDEBUG -Wall -Wpedantic -Werror -Wfatal-errors -Wabi -Wreorder -Woverloaded-virtual -Wsign-promo  -Wformat=2 -Winit-self -Wuninitialized -Wmissing-include-dirs -Wparentheses  -Wswitch -Wunused -Wunused-macros  -Wfloat-equal -Wframe-larger-than=1024 -Wtype-limits  -Wcast-qual -Wsign-compare -Wmissing-field-initializers -Wpacked -Wredundant-decls -Woverlength-strings  -Wmissing-declarations 
CXX=g++  
CXXD=g++   $(GXXDEBUGFLAGS)
#CXXD=clang++  $(CLANGDEBUGFLAGS)
#CXX=clang++  
#CXX=c++ 
CXXFLAGS= -std=c++11 -O3  
 

.PHONY: all
all: $(TARGET)

$(TARGET):
#	$(CXX)  $(CXX_FLAGS) -o $(TARGET)   src/spel.cxx
	$(CXX)  src/spel.cxx -o $(TARGET) $(LLVMFLAGS) $(CXXFLAGS) $(DEBUGFLAGS)
spelt:
	$(CXXD)  src/spelt.cxx -o $(TARGET)t $(CXXFLAGS) $(DEBUGFLAGS) -Wextra -Wctor-dtor-privacy -Weffc++ -Wold-style-cast -Wswitch-default -Wswitch-enum -Wundef -Wshadow -Wconversion -Winline 
	mv spelt.su build
s:
	clang++ src/spelt.cxx -o $(TARGET)t.s $(CXXFLAGS) -c -emit-llvm -S
bc:
	clang++ src/spelt.cxx -o $(TARGET)t.bc $(CXXFLAGS) -O0 -c -emit-llvm 

js:
	$(ECXX) src/spelt.cxx -o $(TARGET)t.js $(CXXFLAGS)

 
#	$(WCXX) -o bin/spel.exe  $(CXX_FLAGS) src/spel.cxx
#
#w64:
#	$(NASM) $(srcdir)/spel.asm -f win64 -g -DWIN32 \
#		-o bin/spel-w64.o -i $(srcdir)/
#	$(W64CC) -c $(srcdir)/system/c/cos.c -o bin/cos-w64.o
#	$(W64CC) bin/cos-w64.o bin/spel-w64.o \
#		-o bin/spel64.exe
#
initial: 

#spel: src/spel.asm bin/spel.o
clean:
	rm $(TARGET)
#	rm bin/spel.o
#	rm bin/cos.o
#	cd info;rm `ls |grep -v texi|grep -v img` 

install:
	$(INSTALL) bin/spel	 	$(bindir)/spel
	$(INSTALLDATA) man/spel.1.gz 	$(mandir)/spel.1.gz
	$(INSTALL) -d	  		$(docdir)
	$(INSTALLDATA) doc/readme.txt	$(docdir)/readme.txt
	$(INSTALLDATA) doc/roadmap.txt  $(docdir)/roadmap.txt

uninstall: 
	rm $(bindir)/spel
	rm $(mandir)/spel.1.gz
	rm -Rf $(docdir)

info: 
	makeinfo --plaintext --ifplaintext info/spel.texi -o info/spel.txt
	makeinfo info/spel.texi -o info/spel.info
	makeinfo info/spel.texi --html --no-headers --no-split -o info/spel.html
	cd info/; makeinfo spel.texi --pdf -o spel.pdf
	cp info/spel.txt doc/readme.txt
	cp info/spel.html doc/www/manual.html


api: api/html/index.html	
	naturaldocs -i src -o html api/html -p api/nd

pack:
	epm -a all spel
	sudo epm -a all -f deb spel
	
