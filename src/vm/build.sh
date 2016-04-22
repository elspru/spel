#!/bin/bash
BINARY="vm"
FLAGS="-Wall -Wextra -Wpedantic"
CFLAGS="-std=c11"
CXXFLAGS="-std=c++11"
CFILES="vm.c seed/seed.c"
FILES="vm seed/seed"
GPU_FILES="seed/seed"
PURE_FILES=""
CACHE_LIMIT=1024
GPU_CACHE_LIMIT=256
HEAP_LIMIT=0
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
GPUFLAGS="-Wstack-usage=$GPU_CACHE_LIMIT"
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
rm build/*.map
rm *.cpp
rm build/vm*html
rm build/vm*js

for FILE in $FILES
do
    echo "C++ file generating"
    echo 'extern "C" {' | cat > $FILE.cpp
    sed 's/restrict/__restrict__/g' $FILE.c >> $FILE.cpp
    echo '}' | cat >> $FILE.cpp
done

# checks
    
    # soure code checks
    splint  vm.c -exportlocal && \
            echo "vm splint" &
    #splint  seed/seed.c -exportlocal && \
    #        echo "seed split " &
    cppcheck vm.c vmlib && echo "vmlib cppcheck" &
    #scan-build $FILE
    
# compilation
clang -Wglobal-constructors $CFLAGS $FLAGS vmlib.c -c \
         -o build/vmlib.o && echo "vmlib clang" &
gcc $GCCDEBUGFLAGS $CFLAGS $FLAGS vmlib.c -c -o build/vmlib.o && \
        echo "vmlib gcc" &

clang -Wglobal-constructors $CFLAGS $FLAGS seed/seed.c -c \
         -o build/seed.o && echo "seed clang" &
gcc $GCCDEBUGFLAGS $CFLAGS $FLAGS $GPUFLAGS seed/seed.c -c \
        -o build/seed.o && \
        echo "seed gcc" &

clang -S -emit-llvm -Wglobal-constructors -o build/$BINARY.ll \
        $FLAGS $CXXFLAGS vm.cpp  && echo "clang vm"&
gcc  $GXXDEBUGFLAGS $FLAGS vm.cpp build/seed.o -o build/vm \
       $CXXFLAGS && echo "vm gcc" &

# echo "module.exports = Module; Module.inspect = function() {\
#return '[Module]'; }; " | cat >> vm.js 
emcc  vm.cpp seed/seed.c -o build/$BINARY.html  $FLAGS -s \
        EXPORTED_FUNCTIONS="['_run']" && echo "emcc HTML" &
#emcc  vm.cpp lank-worker.cpp vmlib.c \
#        -o $BINARY-worker.js $FLAGS  -s \
#        EXPORTED_FUNCTIONS="['_work']" && echo "emcc worker" &
#emcc  lank-prez.cpp -o $BINARY-prez.html   $FLAGS -s \
#        EXPORTED_FUNCTIONS="['_main']" && echo "emcc prez" &
wait 
echo "all done"
