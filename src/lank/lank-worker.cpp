extern "C" {
#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <emscripten/emscripten.h>
#include "lank-vm.h"
#define BUILD_AS_WORKER 1
#define INT_BYTES 4
#define MEMORY_SIZE 0x60

unsigned int memory[MEMORY_SIZE];
int memLength;

void init(char *data, int size){
    assert(data != NULL);
    assert(size > 0);
    memset(memory,0,MEMORY_SIZE*INT_BYTES);
    memLength = size;
}

void work(char *data, int size) {
   unsigned int prog[] = { 0x126, 0x9B58C2D6U, 0x3C380064U,
           0x9B58C2D6U, 0x3A3800C8U, 
           0x342CC13AU,
           0x9B58C2D6U, 0x593800B8U, 
           0x342CC854U,
           0x342CA291U
        }; 
    unsigned int progLength = 0xA;
    char hello[] = "hello world";
    assert(data != NULL);
    assert(size > 0);
    run(prog,progLength,memory);
    printf("worker %s %d",data,size);
    emscripten_worker_respond(hello,11); 
}
}
