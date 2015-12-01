extern "C" {
#include <assert.h>
#include <stdio.h>
#include <emscripten/emscripten.h>

void callback_function(char *data, int size, void *yo){
    assert(data != NULL);
    assert(size > 0);
    yo = data;
    printf("callback %s %d %s",data,size,(char *)yo);
}

int main(){
    int worker_handle;
    char data[]="hello";
    void* vague_pointer = NULL;
    int size = 5;
    worker_handle =
        emscripten_create_worker("lank-worker.js");
    emscripten_call_worker(worker_handle, "work", data, size,
        callback_function, vague_pointer);
    assert(vague_pointer != NULL);
    emscripten_destroy_worker(worker_handle);
    return worker_handle;
}
}
