#!/bin/bash
BINARY="lank"
CFLAGS="-Wall -Wextra -Wpedantic -ansi"
CFILES="lank-vm.c"
FILES="lank-vm lank-worker lank-prez"
PURE_FILES="lank-vm"
CACHE_LIMIT=512
GXXDEBUGFLAGS="-Wstrict-null-sentinel -Wno-coverage-mismatch\
 -fstack-usage -Wstack-usage=$CACHE_LIMIT -Wlogical-op\
 -Wno-aggressive-loop-optimizations -Wunsafe-loop-optimizations\
 -Wdouble-promotion -Wmaybe-uninitialized -Wnoexcept\
 -Waggregate-return"
DEBUGFLAGS="-gdwarf-4 -UNDEBUG -Wall -Wpedantic -Werror\
 -Wabi -Wreorder -Woverloaded-virtual\
 -Wsign-promo -Wformat=2 -Winit-self -Wuninitialized\
 -Wmissing-include-dirs -Wparentheses  -Wswitch -Wunused\
 -Wunused-macros  -Wfloat-equal -Wframe-larger-than=$CACHE_LIMIT\
 -Wtype-limits  -Wcast-qual -Wsign-compare\
 -Wmissing-field-initializers -Wpacked -Wredundant-decls\
 -Woverlength-strings  -Wmissing-declarations"


echo "cleaning"
rm *.su
rm *.map
rm *.cpp
rm lank*html
rm lank*-*js

for FILE in $FILES
do
    echo "C++ file generating"
    echo 'extern "C" {' | cat > $FILE.cpp
    cat $FILE.c >> $FILE.cpp
    echo '}' | cat >> $FILE.cpp
done

for FILE in $PURE_FILES
do
    
    # soure code checks
    splint  $FILE.c -exportlocal && echo "splint" &
    cppcheck $FILE.cpp && echo "cppcheck" &
    #scan-build $FILE
    
    # compilation
    clang -S -emit-llvm -Wglobal-constructors $CFLAGS $FILE.cpp \
            -o $BINARY.ll && echo "clang"&
    gcc  $GXXDEBUGFLAGS $CFLAGS $FILE.cpp -o $BINARY && \
           echo "gcc" &
    wait
    echo "done"
done

# echo "module.exports = Module; Module.inspect = function() {\
#return '[Module]'; }; " | cat >> lank.js 
emcc  lank-vm.cpp -o $BINARY.html  $CFLAGS -s \
        EXPORTED_FUNCTIONS="['_run']" && echo "emcc HTML" &
emcc  lank-vm.cpp lank-worker.cpp -o $BINARY-worker.js $CFLAGS  -s \
        EXPORTED_FUNCTIONS="['_work']" && echo "emcc worker" &
emcc  lank-prez.cpp -o $BINARY-prez.html   $CFLAGS -s \
        EXPORTED_FUNCTIONS="['_main']" && echo "emcc prez" &
wait 
echo "all done"
