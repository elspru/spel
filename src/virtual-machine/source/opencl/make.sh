#!/bin/bash
#g++ template.cpp -o template -lOpenCL -L./lib -lCommon  -L./common 
#g++ mandelbrot.cpp -o mandelbrot -lOpenCL -L./lib -lCommon  -L./common 
g++ opencl_programmer.cpp -o programmer -lOpenCL -L./lib -lCommon  -L./common 
