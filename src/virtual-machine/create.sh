#!/bin/bash
BINARY="vm"
FLAGS="-Wall -Wextra -Wpedantic"
CFLAGS="-std=c11"
CXXFLAGS="-std=c++11"
CFILES="source/vm.c source/seed/seed.c"
FILES="source/vm source/seed/seed"
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
rm source/*.su
rm create/*.map
rm source/*.cpp
rm create/vm*html
rm create/vm*js

for FILE in $FILES
do
    echo "C++ file generating"
    echo 'extern "C" {' | cat > $FILE.cpp
    sed 's/restrict/__restrict__/g' $FILE.c >> $FILE.cpp
    echo '}' | cat >> $FILE.cpp
done

# checks
    
    # soure code checks
    splint  source/vm.c -exportlocal && \
            echo "vm splint" &
    #splint  source/seed/seed.c -exportlocal && \
    #        echo "seed split " &
    cppcheck source/vm.c vmlib && echo "vmlib cppcheck" &
    #scan-create $FILE
    
# compilation
clang -Wglobal-constructors $CFLAGS $FLAGS source/vmlib.c -c \
         -o create/vmlib.o && echo "vmlib clang" &
gcc $GCCDEBUGFLAGS $CFLAGS $FLAGS source/vmlib.c -c -o create/vmlib.o && \
        echo "vmlib gcc" &

clang -Wglobal-constructors $CFLAGS $FLAGS source/seed/seed.c -c \
         -o create/seed.o && echo "seed clang" &
gcc $GCCDEBUGFLAGS $CFLAGS $FLAGS $GPUFLAGS source/seed/seed.c -c \
        -o create/seed.o && \
        echo "seed gcc" &

clang -S -emit-llvm -Wglobal-constructors -o create/$BINARY.ll \
        $FLAGS $CXXFLAGS source/vm.cpp  && echo "clang vm"&
gcc  $GXXDEBUGFLAGS $FLAGS source/vm.cpp create/seed.o -o create/vm \
       $CXXFLAGS && echo "vm gcc" &

# echo "module.exports = Module; Module.inspect = function() {\
#return '[Module]'; }; " | cat >> vm.js 
emcc  source/vm.cpp source/seed/seed.c -o create/$BINARY.html  $FLAGS -s \
        EXPORTED_FUNCTIONS="['_run']" && echo "emcc HTML" &
#emcc  source/vm.cpp lank-worker.cpp vmlib.c \
#        -o $BINARY-worker.js $FLAGS  -s \
#        EXPORTED_FUNCTIONS="['_work']" && echo "emcc worker" &
#emcc  lank-prez.cpp -o $BINARY-prez.html   $FLAGS -s \
#        EXPORTED_FUNCTIONS="['_main']" && echo "emcc prez" &
wait 
echo "all done"
