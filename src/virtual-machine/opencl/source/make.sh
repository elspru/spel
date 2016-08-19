#!/bin/bash


FILES="parallel/composition_population.cl dictionary.c seed.c \
      opencl_programmer.c seed.h dictionary.h "
  
for i in $FILES
do
  clang-format $i > tmp;
  mv tmp $i;
done
#g++ template.cpp -o template -lOpenCL -L./lib -lCommon  -L./common 
#g++ mandelbrot.cpp -o mandelbrot -lOpenCL -L./lib -lCommon  -L./common 
#g++ -c dictionary.c -o dictionary.o
#g++ -c -o seed.o -ldictionary.o seed.c
#g++   -c \
#-o programmer.o opencl_programmer.c -lseed -lOpenCL -L./lib -lCommon  -L./common 
#g++ programmer.o seed.o -lOpenCL ./lib -lCommon  -L./common -lseed -o programmer
rm program2
g++ generic.c dictionary.c seed.c opencl_programmer.c -lOpenCL \
    -L../library  -o program2
#    g++ opencl_programmer.cpp -o programmer -lOpenCL -L./lib -lCommon  -L./common 
