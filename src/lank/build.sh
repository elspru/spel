#!/bin/bash
BINARY="lank"
CFLAGS="-Wall -Wextra -Wpedantic -ansi"
CFILES="lank-vm.c"
FILES="lank-vm.cpp"
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



echo "C++ file generating"
echo 'extern "C" {' | cat > lank-vm.cpp
cat lank-vm.c >> lank-vm.cpp
echo '}' | cat >> lank-vm.cpp

# soure code checks
echo "cpp check"
cppcheck $FILES
echo "splint"
splint  $CFILES
#scan-build $FILES

# compilation
echo "clang"
clang -S -emit-llvm -Wglobal-constructors $CFLAGS $FILES -o $BINARY.ll
echo "gcc"
gcc  $GXXDEBUGFLAGS $CFLAGS $FILES -o $BINARY
echo "emcc JS"
emcc  $FILES -o $BINARY.js   -s EXPORTED_FUNCTIONS="['_main']"
echo "module.exports = Module; Module.inspect = function() {\
return '[Module]'; }; " | cat >> lank.js

echo "emcc HTML"
emcc  lank-vm.cpp -o $BINARY.html   -s EXPORTED_FUNCTIONS="['_main']"
