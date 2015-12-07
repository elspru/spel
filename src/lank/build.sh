#!/bin/bash
BINARY="lank"
FLAGS="-Wall -Wextra -Wpedantic"
CFLAGS="-std=c11 -ansi"
CXXFLAGS="-std=c++11 -ansi"
CFILES="lank-vm.c"
FILES="lank-vm lank-worker lank-prez lanklib"
PURE_FILES="lank-vm lanklib"
CACHE_LIMIT=1024
GCCDEBUGFLAGS="-Wno-coverage-mismatch\
 -fstack-usage -Wstack-usage=$CACHE_LIMIT -Wlogical-op\
 -Wno-aggressive-loop-optimizations -Wunsafe-loop-optimizations\
 -Wdouble-promotion -Wmaybe-uninitialized \
 -Waggregate-return"
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

# checks
    
    # soure code checks
    splint  lank-vm.c lanklib.c -exportlocal && \
            echo "lanklib splint" &
    cppcheck lank-vm.c lanklib.c && echo "lanklib cppcheck" &
    #scan-build $FILE
    
# compilation
clang -Wglobal-constructors $CFLAGS $FLAGS lanklib.c -c \
         -o lanklib.o && echo "lanklib clang" &
gcc $GCCDEBUGFLAGS $CFLAGS $FLAGS lanklib.c -c -o lanklib.o && \
        echo "lanklib gcc" &
clang -S -emit-llvm -Wglobal-constructors -o $BINARY.ll $FLAGS\
        $CXXFLAGS lank-vm.cpp   && echo "clang lank-vm"&
gcc  $GXXDEBUGFLAGS $FLAGS lank-vm.cpp lanklib.o -o lank \
       $CXXFLAGS && echo "lank-vm gcc" &

# echo "module.exports = Module; Module.inspect = function() {\
#return '[Module]'; }; " | cat >> lank.js 
emcc  lank-vm.cpp lanklib.c -o $BINARY.html  $FLAGS -s \
        EXPORTED_FUNCTIONS="['_run']" && echo "emcc HTML" &
emcc  lank-vm.cpp lank-worker.cpp lanklib.c \
        -o $BINARY-worker.js $FLAGS  -s \
        EXPORTED_FUNCTIONS="['_work']" && echo "emcc worker" &
emcc  lank-prez.cpp -o $BINARY-prez.html   $FLAGS -s \
        EXPORTED_FUNCTIONS="['_main']" && echo "emcc prez" &
wait 
echo "all done"
