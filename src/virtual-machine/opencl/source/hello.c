#include <stdio.h>
#include <stdlib.h>

#include "generic.h"
 

#ifdef __APPLE__
#include <OpenCL/opencl.h>
#else
#include <CL/cl.h>
#endif


#define MEM_SIZE (128)
#define MAX_SOURCE_SIZE (0x100000)
 
int main()
{
cl_device_id device_id = NULL;
cl_context context = NULL;
cl_command_queue command_waiting_line = NULL;
cl_mem memobj = NULL;
cl_program program = NULL;
cl_kernel kernel = NULL;
cl_platform_id platform_id = NULL;
cl_uint ret_num_devices;
cl_uint ret_num_platforms;
cl_int ret;
 
char string[MEM_SIZE];
 
FILE *fp;
char fileName[] ="./hello.cl";
char *source_str;
size_t source_size;
 
/* Load the source code containing the kernel*/
fp = fopen(fileName, "r");
if (!fp) {
fprintf(stderr, "Failed to load kernel.\n");
exit(1);
}
source_str = (char*)malloc(MAX_SOURCE_SIZE);
source_size = fread(source_str, 1, MAX_SOURCE_SIZE, fp);
fclose(fp);

//getInfo();
 
/* Get Platform and Device Info */
ret = clGetPlatformIDs(1, &platform_id, &ret_num_platforms);
ret = clGetDeviceIDs(platform_id, CL_DEVICE_TYPE_DEFAULT, 1, &device_id, &ret_num_devices);
 
/* Create OpenCL context */
context = clCreateContext(NULL, 1, &device_id, NULL, NULL, &ret);
 
/* Create Command Queue */
#ifdef CL_VERSION_2_0
  command_waiting_line =
      clCreateCommandQueueWithProperties(context, device_id, 0, &ret);
#else
  command_waiting_line = clCreateCommandQueue(context, device_id, 0, &ret);
#endif
 
/* Create Memory Buffer */
memobj = clCreateBuffer(context, CL_MEM_READ_WRITE,MEM_SIZE * sizeof(char), NULL, &ret);
 
/* Create Kernel Program from the source */
program = clCreateProgramWithSource(context, 1, (const char **)&source_str,
(const size_t *)&source_size, &ret);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel, memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create OpenCL program. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }
 
/* Build Kernel Program */
ret = clBuildProgram(program, 1, &device_id, NULL, NULL, NULL);
 
/* Create OpenCL Kernel */
kernel = clCreateKernel(program, "hello", &ret);
 
/* Set OpenCL Kernel Parameters */
ret = clSetKernelArg(kernel, 0, sizeof(cl_mem), (void *)&memobj);
 
/* Execute OpenCL Kernel */
size_t globalWorksize[1] ={1};
size_t localWorksize[1] = {1};
cl_event event;
ret = clEnqueueNDRangeKernel(
          command_waiting_line, kernel, 1, NULL, globalWorksize, localWorksize,
          0, NULL, &event);
 
/* Copy results from the memory buffer */
ret = clEnqueueReadBuffer(command_waiting_line, memobj, CL_TRUE, 0,
MEM_SIZE * sizeof(char),string, 0, NULL, NULL);
 
/* Display Result */
puts(string);
 
/* Finalization */
ret = clFlush(command_waiting_line);
ret = clFinish(command_waiting_line);
ret = clReleaseKernel(kernel);
ret = clReleaseProgram(program);
ret = clReleaseMemObject(memobj);
ret = clReleaseCommandQueue(command_waiting_line);
ret = clReleaseContext(context);
 
free(source_str);
 
return 0;
}
