/*
 * This confidential and proprietary software may be used only as
 * authorised by a licensing agreement from ARM Limited
 *    (C) COPYRIGHT 2013 ARM Limited
 *        ALL RIGHTS RESERVED
 * The entire notice above must be reproduced on all authorised
 * copies and copies may only be made to the extent permitted
 * by a licensing agreement from ARM Limited.
 */

#include "common.h"
#include "image.h"

#include <CL/cl.h>
#include <assert.h>
#include <stdio.h>
#include <errno.h>
#include <stdint.h>

using namespace std;


void getInfo() {
/* get info */
    cl_uint numEntries = 5;
    cl_platform_id platforms[5];
    cl_uint num_platforms;
    //cl_int result;
    clGetPlatformIDs(numEntries, platforms, &num_platforms);
    printf("num_platforms %d\n", num_platforms);

    char platformInfo[256];
    size_t realSize = 0;
    clGetPlatformInfo(platforms[0], CL_PLATFORM_NAME, 256, 
        &platformInfo, &realSize);
    printf("name %s \n", platformInfo);

    cl_device_id deviceID[4];
    cl_uint num_devices;
    clGetDeviceIDs(platforms[0], CL_DEVICE_TYPE_ALL, 8, 
        deviceID, &num_devices);
    printf("# of devices %d\n", num_devices);

    //cl_ulong deviceType[2];
    cl_ulong globalCacheSize = 0;
    cl_ulong globalMemSize = 0;
    cl_ulong localMemSize = 0;
    cl_ulong constantBufferSize = 0;
    cl_ulong memAllocSize = 0;
    //size_t maxParameterSize = 0;
    size_t workGroupSize = 0;
    cl_uint workItemDimensions = 0;
    cl_uint maxComputeUnits = 0;
    cl_uint clockFreq = 0;
    size_t workItemSizes[6];
    char deviceName[256];
    int i = 0;
    for (i = 0; i < 2; i++) {
    clGetDeviceInfo(deviceID[i], CL_DEVICE_NAME, 256,
        deviceName, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_COMPUTE_UNITS, 8,
        &maxComputeUnits, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_CLOCK_FREQUENCY, 8,
        &clockFreq, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_LOCAL_MEM_SIZE, 16,
        &localMemSize, &realSize);
    clGetDeviceInfo(deviceID[i], 
        CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE, 8,
        &constantBufferSize, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_GLOBAL_MEM_CACHE_SIZE, 8,
        &globalCacheSize, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_GLOBAL_MEM_SIZE, 8,
        &globalMemSize, &realSize);
    clGetDeviceInfo(deviceID[i], 
        CL_DEVICE_MAX_MEM_ALLOC_SIZE, 8,
        &memAllocSize, &realSize);
    clGetDeviceInfo(deviceID[i], 
        CL_DEVICE_MAX_WORK_GROUP_SIZE, 8,
        &workGroupSize, &realSize);
    clGetDeviceInfo(deviceID[i], 
        CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS, 8,
        &workItemDimensions, &realSize);
    clGetDeviceInfo(deviceID[i], 
        CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS, 25,
        workItemSizes, &realSize);
    printf("\n DEVICE %d\n", i);
    printf("name %s \n", deviceName);
    printf("compute units \t%u \n", (unsigned int) maxComputeUnits);
    printf("clockFreq \t%u \n", (unsigned int) clockFreq);
    printf("localMemSize \t%lu \n", (unsigned long) localMemSize);
    printf("constant buffer size \t%lu \n", 
        (unsigned long) constantBufferSize);
    printf("globalCacheSize %lu \n", 
        (unsigned long) globalCacheSize);
    printf("globalMemSize \t%lu \n", 
        (unsigned long) globalMemSize);
    printf("memory allocation size \t %ld \n", 
        (unsigned long) memAllocSize);
    printf("max work group size %d \n", 
        (unsigned int) workGroupSize);
    printf("max work item dimensions %d \n", 
        (unsigned int) workItemDimensions);
    printf("max work item sizes 0 %lu \n", 
        (unsigned long) workItemSizes[0]);
    printf("max work item sizes 1 %lu \n", 
        (unsigned long) workItemSizes[1]);
    printf("max work item sizes 2 %lu \n", 
        (unsigned long) workItemSizes[2]);
    printf("max work item sizes 3 %lu \n", 
        (unsigned long) workItemSizes[3]);
    }
}

/**
 * \brief Simple template OpenCL sample.
 * \details The basic code to run a kernel with no arguments.
 * \return The exit code of the application, non-zero if a problem occurred.
 */
int main(void)
{
    cl_context context = 0;
    cl_command_queue commandQueue = 0;
    cl_program program = 0;
    cl_device_id device = 0;
    cl_kernel kernel = 0;
    const int numMemoryObjects = 1;
    cl_mem memoryObjects[numMemoryObjects] = {0};
    cl_int errorNumber;


    getInfo();
    /* Set up OpenCL environment: create context, command queue, program and kernel. */

    /* [Create Context] */
    if (!createContext(&context))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, 
            "Failed to create an OpenCL context.  %s:%d\n",
            __FILE__, __LINE__);
        return 1;
    }
    /* [Create Context] */

    /* [Create Command Queue] */
    if (!createCommandQueue(context, &commandQueue, &device))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, 
            "Failed to create the OpenCL command queue.  %s:%d\n",
            __FILE__, __LINE__);
        return 1;
    }
    /* [Create Command Queue] */

    /* [Create Program] */
    if (!createProgram(context, device, "assets/template.cl", 
        &program))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, 
            "Failed to create OpenCL program. %s:%d\n",
            __FILE__, __LINE__);
        return 1;
    }
    /* [Create Program] */

    /* [Create kernel] */
    kernel = clCreateKernel(program, "template", &errorNumber);
    if (!checkSuccess(errorNumber))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, "Failed to create OpenCL kernel. %s:%d\n",
            __FILE__, __LINE__);
        return 1;
    }
    /* [Create kernel] */


    /*
     * Add code here to set up memory/data, for example:
     * - Create memory buffers.
     * - Initialise the input data.
     * - Set up kernel arguments.
     */


    /* Execute the kernel instances. */

    /* [Set the kernel work size] */
    const int workDimensions = 1;
    size_t globalWorkSize[workDimensions] = {1};
    /* [Set the kernel work size] */

    /* [Enqueue the kernel] */
    /* An event to associate with the kernel. Allows us to 
        retrieve profiling information later. */
    cl_event event = 0;

    if (!checkSuccess(clEnqueueNDRangeKernel(commandQueue, 
            kernel, workDimensions, NULL, globalWorkSize, 
            NULL, 0, NULL, &event)))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, "Failed enqueuing the kernel. %s:%d\n",
             __FILE__, __LINE__);
        return 1;
    }
    /* [Enqueue the kernel] */

    /* [Wait for kernel execution completion] */
    if (!checkSuccess(clFinish(commandQueue)))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, 
            "Failed waiting for kernel execution to finish. %s:%d\n",
            __FILE__, __LINE__);
        return 1;
    }
    /* [Wait for kernel execution completion] */


    /* After execution. */

    /* [Print the profiling information for the event] */
    printProfilingInfo(event);
    /* Release the event object. */
    if (!checkSuccess(clReleaseEvent(event)))
    {
        cleanUpOpenCL(context, commandQueue, program, kernel, 
            memoryObjects, numMemoryObjects);
        fprintf(stderr, 
            "Failed releasing the event object. %s:%d\n",
            __FILE__,  __LINE__);
        return 1;
    }
    /* [Print the profiling information for the event] */


    /* Add code here to retrieve results of the kernel execution. */


    /* [Release OpenCL objects] */
    cleanUpOpenCL(context, commandQueue, program, kernel, 
        memoryObjects, numMemoryObjects);
    /* [Release OpenCL objects] */

    return 0;
}
