/*SPEL virtual machine
Copyright (C) 2016  Logan Streondj

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

contact: streondj at gmail dot com
*/
#include "common.h"
#include "image.h"
#include "programmer.h"
#include "seed.h"
#include <stdio.h>

#include <CL/cl.h>
#include <assert.h>
#include <iostream>
#include <string.h>

#define NEWSPAPER_LONG 0x10
uint8_t newspaper_indexFinger = 0;
const uint16_t newspaper_byte_size = NEWSPAPER_LONG * TABLET_BYTE_LONG;
// v16us newspaper[NEWSPAPER_LONG] = {0};

using namespace std;
// using namespace seed;

/**
 * \brief Basic integer array addition implemented in OpenCL.
 * \details A sample which shows how to add two integer arrays and store the
 * result in a third array.
 *          The main calculation code is in an OpenCL kernel which is executed
 * on a GPU device.
 * \return The exit code of the application, non-zero if a problem occurred.
 */

void getInfo() {
  /* get info */
  cl_uint numEntries = 5;
  cl_platform_id platforms[5];
  cl_uint num_platforms;
  // cl_int result;
  clGetPlatformIDs(numEntries, platforms, &num_platforms);
  printf("num_platforms %d\n", num_platforms);

  char platformInfo[256];
  size_t realSize = 0;
  clGetPlatformInfo(platforms[0], CL_PLATFORM_NAME, 256, &platformInfo,
                    &realSize);
  printf("name %s \n", platformInfo);

  cl_device_id deviceID[4];
  cl_uint num_devices;
  clGetDeviceIDs(platforms[0], CL_DEVICE_TYPE_ALL, 8, deviceID, &num_devices);
  printf("# of devices %d\n", num_devices);

  // cl_ulong deviceType[2];
  cl_ulong globalCacheSize = 0;
  cl_ulong globalMemSize = 0;
  cl_ulong localMemSize = 0;
  cl_ulong constantBufferSize = 0;
  cl_ulong memAllocSize = 0;
  // size_t maxParameterSize = 0;
  size_t workGroupSize = 0;
  cl_uint workItemDimensions = 0;
  cl_uint maxComputeUnits = 0;
  cl_uint clockFreq = 0;
  size_t workItemSizes[6];
  char deviceName[256];
  int i = 0;
  for (i = 0; i < 2; i++) {
    clGetDeviceInfo(deviceID[i], CL_DEVICE_NAME, 256, deviceName, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_COMPUTE_UNITS, 8,
                    &maxComputeUnits, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_CLOCK_FREQUENCY, 8, &clockFreq,
                    &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_LOCAL_MEM_SIZE, 16, &localMemSize,
                    &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE, 8,
                    &constantBufferSize, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_GLOBAL_MEM_CACHE_SIZE, 8,
                    &globalCacheSize, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_GLOBAL_MEM_SIZE, 8, &globalMemSize,
                    &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_MEM_ALLOC_SIZE, 8, &memAllocSize,
                    &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_WORK_GROUP_SIZE, 8,
                    &workGroupSize, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS, 8,
                    &workItemDimensions, &realSize);
    clGetDeviceInfo(deviceID[i], CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS, 25,
                    workItemSizes, &realSize);
    printf("\n DEVICE %d\n", i);
    printf("name %s \n", deviceName);
    printf("compute units \t%u \n", (unsigned int)maxComputeUnits);
    printf("clockFreq \t%u \n", (unsigned int)clockFreq);
    printf("localMemSize \t%lu \n", (unsigned long)localMemSize);
    printf("constant buffer size \t%lu \n", (unsigned long)constantBufferSize);
    printf("globalCacheSize %lu \n", (unsigned long)globalCacheSize);
    printf("globalMemSize \t%lu \n", (unsigned long)globalMemSize);
    printf("memory allocation size \t %ld \n", (unsigned long)memAllocSize);
    printf("max work group size %d \n", (unsigned int)workGroupSize);
    printf("max work item dimensions %d \n", (unsigned int)workItemDimensions);
    printf("max work item sizes 0 %lu \n", (unsigned long)workItemSizes[0]);
    printf("max work item sizes 1 %lu \n", (unsigned long)workItemSizes[1]);
    printf("max work item sizes 2 %lu \n", (unsigned long)workItemSizes[2]);
    printf("max work item sizes 3 %lu \n", (unsigned long)workItemSizes[3]);
  }
}

int main(void) {
  cl_context context = 0;
  cl_command_queue commandQueue = 0;
  cl_program program = 0;
  cl_device_id device = 0;
  cl_kernel kernel = 0;
  int numberOfMemoryObjects = 3;
  cl_mem memoryObjects[3] = {0, 0, 0};
  cl_int errorNumber;

  getInfo();

  if (!createContext(&context)) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to create an OpenCL context. " << __FILE__ << ":"
         << __LINE__ << endl;
    return 1;
  }

  if (!createCommandQueue(context, &commandQueue, &device)) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to create the OpenCL command queue. " << __FILE__ << ":"
         << __LINE__ << endl;
    return 1;
  }

  if (!createProgram(context, device, "assets/opencl_programmer.cl",
                     &program)) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to create OpenCL program." << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }

  kernel = clCreateKernel(program, "composition_population", &errorNumber);
  if (!checkSuccess(errorNumber)) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to create OpenCL kernel. " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }

  /* [Setup memory] */
  /* Number of elements in the arrays of input and output data. */

  /* The buffers are the size of the arrays. */
  uint16_t activity_atom_size = MAX_INDEPENDENTCLAUSE_TABLET * 1;
  uint8_t program_size = 1;
  uint8_t population_size = 4;
  size_t activity_atom_byte_size = activity_atom_size * sizeof(v16us);
  size_t population_byte_size = program_size * population_size * sizeof(v16us);

  /*
   * Ask the OpenCL implementation to allocate buffers for the data.
   * We ask the OpenCL implemenation to allocate memory rather than allocating
   * it on the CPU to avoid having to copy the data later.
   * The read/write flags relate to accesses to the memory from within the
   * kernel.
   */
  bool createMemoryObjectsSuccess = true;

  memoryObjects[0] =
      clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     activity_atom_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= checkSuccess(errorNumber);

  memoryObjects[1] =
      clCreateBuffer(context, CL_MEM_WRITE_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     population_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= checkSuccess(errorNumber);

  memoryObjects[2] =
      clCreateBuffer(context, CL_MEM_WRITE_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     newspaper_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= checkSuccess(errorNumber);

  if (!createMemoryObjectsSuccess) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to create OpenCL buffer. " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }
  /* [Setup memory] */

  /* [Map the buffers to pointers] */
  /* Map the memory buffers created by the OpenCL implementation to pointers so
   * we can access them on the CPU. */
  bool mapMemoryObjectsSuccess = true;

  v16us *activity_atom = (v16us *)clEnqueueMapBuffer(
      commandQueue, memoryObjects[0], CL_TRUE, CL_MAP_WRITE, 0,
      activity_atom_byte_size, 0, NULL, NULL, &errorNumber);
  mapMemoryObjectsSuccess &= checkSuccess(errorNumber);

  // cl_int *inputB = (cl_int *)clEnqueueMapBuffer(
  //    commandQueue, memoryObjects[1], CL_TRUE, CL_MAP_WRITE, 0, bufferSize, 0,
  //    NULL, NULL, &errorNumber);
  // mapMemoryObjectsSuccess &= checkSuccess(errorNumber);

  if (!mapMemoryObjectsSuccess) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to map buffer. " << __FILE__ << ":" << __LINE__ << endl;
    return 1;
  }
  /* [Map the buffers to pointers] */

  /* [Initialize the input data] */

  const char *activity_atom_text = "nyistu htoftu hnattu hnamtu";
  const uint16_t activity_atom_text_size =
      (uint16_t)(strlen(activity_atom_text));
  const char *quiz_independentClause_list_text =
      "zrundoka hwindocayu hwindokali"
      "hwindoka tyutdocayu tyindokali"
      "tyutdoka tyutdocayu hfutdokali"
      "tyindoka fwandocayu nyatdokali";
  //"bu.hnac.2.hnac.buka bu.hnac.2.hnac.buca yu "
  //"bu.hnac.4.hnac.bukali";
  const uint16_t quiz_independentClause_list_text_size =
      (uint16_t)strlen(quiz_independentClause_list_text);
  uint16_t quiz_independentClause_list_size = 4;
  v16us quiz_independentClause_list[8];
  uint16_t text_remainder = 0;
  uint16_t program_worth = 0;
  uint64_t random_seed = 0x0123456789ABCDEF;
  uint16_t tablet_indexFinger = 0;
  uint8_t champion = 0;
  uint16_t champion_worth = 0;
  v16us program_;
  v16us population[4];
  memset(quiz_independentClause_list, 0,
         (size_t)(quiz_independentClause_list_size * TABLET_LONG * WORD_THICK));
  text_code(activity_atom_text_size, activity_atom_text, &activity_atom_size,
            activity_atom, &text_remainder);
  assert(text_remainder == 0);
  text_code(quiz_independentClause_list_text_size,
            quiz_independentClause_list_text, &quiz_independentClause_list_size,
            quiz_independentClause_list, &text_remainder);
  /* [Initialize the input data] */

  /* [Un-map the buffers] */
  /*
   * Unmap the memory objects as we have finished using them from the CPU side.
   * We unmap the memory because otherwise:
   * - reads and writes to that memory from inside a kernel on the OpenCL side
   * are undefined.
   * - the OpenCL implementation cannot free the memory when it is finished.
   */
  if (!checkSuccess(clEnqueueUnmapMemObject(commandQueue, memoryObjects[0],
                                            activity_atom, 0, NULL, NULL))) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Unmapping memory objects failed " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }

  // if (!checkSuccess(clEnqueueUnmapMemObject(commandQueue, memoryObjects[1],
  //                                          inputB, 0, NULL, NULL))) {
  //  cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
  //                numberOfMemoryObjects);
  //  cerr << "Unmapping memory objects failed " << __FILE__ << ":" << __LINE__
  //       << endl;
  //  return 1;
  //}
  /* [Un-map the buffers] */

  /* [Set the kernel arguments] */
  bool setKernelArgumentsSuccess = true;
  printf("arg0\n");
  setKernelArgumentsSuccess &= checkSuccess(clSetKernelArg(
      kernel, 0, sizeof(uint8_t), (uint8_t *)&activity_atom_size));
  printf("arg1\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 1, sizeof(cl_mem), &memoryObjects[0]));
  printf("arg2\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 2, sizeof(uint16_t), (uint16_t *)&program_size));
  printf("arg3\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 3, sizeof(uint8_t), (uint8_t *)&population_size));
  printf("arg4\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 4, sizeof(uint64_t), (uint64_t *)&random_seed));
  printf("arg5\n");
  setKernelArgumentsSuccess &=
      checkSuccess(clSetKernelArg(kernel, 5, sizeof(uint64_t *), NULL));
  printf("arg6\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 6, sizeof(cl_mem), &memoryObjects[1]));
  printf("arg7\n");
  setKernelArgumentsSuccess &=
      checkSuccess(clSetKernelArg(kernel, 7, sizeof(uint8_t *), NULL));
  printf("arg8\n");
  setKernelArgumentsSuccess &= checkSuccess(
      clSetKernelArg(kernel, 8, sizeof(cl_mem), &memoryObjects[2]));

  if (!setKernelArgumentsSuccess) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed setting OpenCL kernel arguments. " << __FILE__ << ":"
         << __LINE__ << endl;
    return 1;
  }
  /* [Set the kernel arguments] */

  /* An event to associate with the Kernel. Allows us to retrieve profiling
   * information later. */
  cl_event event = 0;

  /* [Global work size] */
  /*
   * Each instance of our OpenCL kernel operates on a single element of each
   * array so the number of
   * instances needed is the number of elements in the array.
   */
  size_t globalWorksize[1] = {population_size};
  size_t localWorksize[1] = {2};
  /* Enqueue the kernel */
  if (!checkSuccess(clEnqueueNDRangeKernel(commandQueue, kernel, 1, NULL,
                                           globalWorksize, localWorksize, 0,
                                           NULL, &event))) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed enqueuing the kernel. " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }
  /* [Global work size] */

  /* Wait for kernel execution completion. */
  if (!checkSuccess(clFinish(commandQueue))) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed waiting for kernel execution to finish. " << __FILE__ << ":"
         << __LINE__ << endl;
    return 1;
  }

  /* Print the profiling information for the event. */
  printProfilingInfo(event);
  /* Release the event object. */
  if (!checkSuccess(clReleaseEvent(event))) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed releasing the event object. " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }

  /* Get a pointer to the output data. */
  printf("clOut\n");
  v16us *output = (v16us *)clEnqueueMapBuffer(
      commandQueue, memoryObjects[1], CL_TRUE, CL_MAP_READ, 0,
      population_byte_size, 0, NULL, NULL, &errorNumber);
  v16us *newspaper = (v16us *)clEnqueueMapBuffer(
      commandQueue, memoryObjects[2], CL_TRUE, CL_MAP_READ, 0,
      newspaper_byte_size, 0, NULL, NULL, &errorNumber);
  if (!checkSuccess(errorNumber)) {
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Failed to map buffer. " << __FILE__ << ":" << __LINE__ << endl;
    return 1;
  }

  /* [Output the results] */
  /* Uncomment the following block to print results. */
  for (tablet_indexFinger = 0;
       tablet_indexFinger < (population_size * TABLET_LONG);
       ++tablet_indexFinger) {
    if (tablet_indexFinger % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)((uint16_t *)output)[tablet_indexFinger]);
  }
  printf("\n");
  printf("program %04X \n", (uint)output[1].s1);

  printf("newspaper \n");
  for (tablet_indexFinger = 0;
       tablet_indexFinger < (NEWSPAPER_LONG * TABLET_LONG);
       ++tablet_indexFinger) {
    if (tablet_indexFinger % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)((uint16_t *)newspaper)[tablet_indexFinger]);
  }
  printf("\n");
  /* [Output the results] */

  /* Unmap the memory object as we are finished using them from the CPU side. */
  if (!checkSuccess(clEnqueueUnmapMemObject(commandQueue, memoryObjects[1],
                                            output, 0, NULL, NULL))) {
    printf("unmapping\n");
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Unmapping memory objects failed " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }
  if (!checkSuccess(clEnqueueUnmapMemObject(commandQueue, memoryObjects[2],
                                            newspaper, 0, NULL, NULL))) {
    printf("unmapping\n");
    cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                  numberOfMemoryObjects);
    cerr << "Unmapping memory objects failed " << __FILE__ << ":" << __LINE__
         << endl;
    return 1;
  }

  printf("releasing\n");
  /* Release OpenCL objects. */
  cleanUpOpenCL(context, commandQueue, program, kernel, memoryObjects,
                numberOfMemoryObjects);
}
