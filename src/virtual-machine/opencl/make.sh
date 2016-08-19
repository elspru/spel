#!/bin/bash


FILES="assets/opencl_programmer.cl dictionary.cxx seed.cxx \
      opencl_programmer.cxx seed.h dictionary.h "
  
for i in $FILES
do
  clang-format $i > tmp;
  mv tmp $i;
done
#g++ template.cpp -o template -lOpenCL -L./lib -lCommon  -L./common 
#g++ mandelbrot.cpp -o mandelbrot -lOpenCL -L./lib -lCommon  -L./common 
#g++ -c dictionary.cxx -o dictionary.o
#g++ -c -o seed.o -ldictionary.o seed.cxx
#g++   -c \
#-o programmer.o opencl_programmer.cxx -lseed -lOpenCL -L./lib -lCommon  -L./common 
#g++ programmer.o seed.o -lOpenCL ./lib -lCommon  -L./common -lseed -o programmer
rm program2
g++ dictionary.cxx seed.cxx opencl_programmer.cxx -lOpenCL  \
    -lCommon -L./common -o program2
#    g++ opencl_programmer.cpp -o programmer -lOpenCL -L./lib -lCommon  -L./common 
