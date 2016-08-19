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

#include <CL/cl.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "generic.h"
#include "seed.h"

#define NEWSPAPER_LONG 0x10
#define MAX_SOURCE_SIZE (0x100000)
uint8_t newspaper_indexFinger = 0;
const uint16_t newspaper_byte_size = NEWSPAPER_LONG * TABLET_BYTE_LONG;
// v16us newspaper[NEWSPAPER_LONG] = {0};

/**
 * \brief Basic integer array addition implemented in OpenCL.
 * \details A sample which shows how to add two integer arrays and store the
 * result in a third array.
 *          The main calculation code is in an OpenCL kernel which is executed
 * on a GPU device.
 * \return The exit code of the application, non-zero if a problem occurred.
 */

int main(void) {
  cl_context context = 0;
  cl_command_queue command_waiting_line = 0;
  cl_program program = 0;
  cl_device_id device_id = 0;
  cl_kernel kernel = 0;
  // int numberOfMemoryObjects = 3;
  cl_mem memoryObjects[3] = {0, 0, 0};
  cl_platform_id platform_id = NULL;
  cl_uint ret_num_devices;
  cl_int errorNumber;
  cl_int ret;
  /* Load the source code containing the kernel*/
  char fileName[] = "source/parallel/composition_population.cl";
  FILE *fp;
  char *source_str;
  size_t source_size;
  fp = fopen(fileName, "r");
  cl_uint ret_num_platforms;
  if (!fp) {
    fprintf(stderr, "Failed to load kernel %s:%d.\n", __FILE__, __LINE__);
    exit(1);
  }
  source_str = (char *)malloc(MAX_SOURCE_SIZE);
  source_size = fread(source_str, 1, MAX_SOURCE_SIZE, fp);
  fclose(fp);

  // printf("file: %s :file", source_str);

  getInfo();

  ret = clGetPlatformIDs(1, &platform_id, &ret_num_platforms);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to get platform id's. %s:%d\n", __FILE__, __LINE__);
    return 1;
  }
  ret = clGetDeviceIDs(platform_id, CL_DEVICE_TYPE_DEFAULT, 1, &device_id,
                       &ret_num_devices);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to get OpenCL devices. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  context = clCreateContext(NULL, 1, &device_id, NULL, NULL, &ret);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create an OpenCL context. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

#ifdef CL_VERSION_2_0
  command_waiting_line =
      clCreateCommandQueueWithProperties(context, device_id, 0, &ret);
#else
  command_waiting_line = clCreateCommandQueue(context, device_id, 0, &ret);
#endif

  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create the OpenCL command queue. %s:%d\n",
            __FILE__, __LINE__);
    return 1;
  }

  /* create program */

  program = clCreateProgramWithSource(context, 1, (const char **)&source_str,
                                      (const size_t *)&source_size, &ret);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create OpenCL program. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }
  /* Build Kernel Program */
  ret = clBuildProgram(program, 1, &device_id, NULL, NULL, NULL);
  if (!success_verification(ret)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to build OpenCL program. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  kernel = clCreateKernel(program, "composition_population", &errorNumber);
  if (!success_verification(errorNumber)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create OpenCL kernel. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  /* [Setup memory] */
  /* Number of elements in the arrays of input and output data. */

  /* The buffers are the size of the arrays. */
  uint16_t activity_atom_size = MAX_INDEPENDENTCLAUSE_TABLET * 1;
  uint8_t program_size = 1;
  uint8_t population_size = 4;
  size_t activity_atom_byte_size = activity_atom_size * sizeof(v16us);
  uint16_t population_byte_size =
      (uint16_t)(program_size * (uint16_t)(population_size * sizeof(v16us)));

  /*
   * Ask the OpenCL implementation to allocate buffers for the data.
   * We ask the OpenCL implemenation to allocate memory rather than allocating
   * it on the CPU to avoid having to copy the data later.
   * The read/write flags relate to accesses to the memory from within the
   * kernel.
   */
  int createMemoryObjectsSuccess = TRUE;

  memoryObjects[0] =
      clCreateBuffer(context, CL_MEM_READ_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     activity_atom_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= success_verification(errorNumber);

  memoryObjects[1] =
      clCreateBuffer(context, CL_MEM_WRITE_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     population_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= success_verification(errorNumber);

  memoryObjects[2] =
      clCreateBuffer(context, CL_MEM_WRITE_ONLY | CL_MEM_ALLOC_HOST_PTR,
                     newspaper_byte_size, NULL, &errorNumber);
  createMemoryObjectsSuccess &= success_verification(errorNumber);

  if (!createMemoryObjectsSuccess) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to create OpenCL buffer. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }
  /* [Setup memory] */

  /* [Map the buffers to pointers] */
  /* Map the memory buffers created by the OpenCL implementation to pointers so
   * we can access them on the CPU. */
  int mapMemoryObjectsSuccess = TRUE;

  v16us *activity_atom = (v16us *)clEnqueueMapBuffer(
      command_waiting_line, memoryObjects[0], CL_TRUE, CL_MAP_WRITE, 0,
      activity_atom_byte_size, 0, NULL, NULL, &errorNumber);
  mapMemoryObjectsSuccess &= success_verification(errorNumber);

  // cl_int *inputB = (cl_int *)clEnqueueMapBuffer(
  //    command_waiting_line, memoryObjects[1], CL_TRUE, CL_MAP_WRITE, 0,
  //    bufferSize, 0,
  //    NULL, NULL, &errorNumber);
  // mapMemoryObjectsSuccess &= success_verification(errorNumber);

  if (!mapMemoryObjectsSuccess) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to map buffer. %s:%d\n", __FILE__, __LINE__);
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
  // uint16_t program_worth = 0;
  uint64_t random_seed = 0x0123456789ABCDEF;
  uint16_t tablet_indexFinger = 0;
  // uint8_t champion = 0;
  // uint16_t champion_worth = 0;
  // v16us program_;
  // v16us population[4];
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
  if (!success_verification(
          clEnqueueUnmapMemObject(command_waiting_line, memoryObjects[0],
                                  activity_atom, 0, NULL, NULL))) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Unmapping memory objects failed %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  // if (!success_verification(clEnqueueUnmapMemObject(command_waiting_line,
  // memoryObjects[1],
  //                                          inputB, 0, NULL, NULL))) {
  //  cleanUpOpenCL(context, command_waiting_line, program, kernel,
  //  memoryObjects,
  //                numberOfMemoryObjects);
  //  cerr << "Unmapping memory objects failed " << __FILE__ << ":" << __LINE__
  //       << endl;
  //  return 1;
  //}
  /* [Un-map the buffers] */

  /* [Set the kernel arguments] */
  int setKernelArgumentsSuccess = TRUE;
  printf("arg0\n");
  setKernelArgumentsSuccess &= success_verification(clSetKernelArg(
      kernel, 0, sizeof(uint8_t), (uint8_t *)&activity_atom_size));
  printf("arg1\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 1, sizeof(cl_mem), &memoryObjects[0]));
  printf("arg2\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 2, sizeof(uint16_t), (uint16_t *)&program_size));
  printf("arg3\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 3, sizeof(uint8_t), (uint8_t *)&population_size));
  printf("arg4\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 4, sizeof(uint64_t), (uint64_t *)&random_seed));
  printf("arg5\n");
  setKernelArgumentsSuccess &=
      success_verification(clSetKernelArg(kernel, 5, sizeof(uint64_t *), NULL));
  printf("arg6\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 6, sizeof(cl_mem), &memoryObjects[1]));
  printf("arg7\n");
  setKernelArgumentsSuccess &=
      success_verification(clSetKernelArg(kernel, 7, sizeof(uint8_t *), NULL));
  printf("arg8\n");
  setKernelArgumentsSuccess &= success_verification(
      clSetKernelArg(kernel, 8, sizeof(cl_mem), &memoryObjects[2]));

  if (!setKernelArgumentsSuccess) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed setting OpenCL kernel arguments. %s:%d\n", __FILE__,
            __LINE__);
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
  if (!success_verification(clEnqueueNDRangeKernel(
          command_waiting_line, kernel, 1, NULL, globalWorksize, localWorksize,
          0, NULL, &event))) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed enqueuing the kernel. %s:%d\n", __FILE__, __LINE__);
    return 1;
  }
  /* [Global work size] */

  /* Wait for kernel execution completion. */
  if (!success_verification(clFinish(command_waiting_line))) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed waiting for kernel execution to finish. %s:%d\n",
            __FILE__, __LINE__);
    return 1;
  }

  /* Print the profiling information for the event. */
  // printProfilingInfo(event);
  /* Release the event object. */
  if (!success_verification(clReleaseEvent(event))) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed releasing the event object. %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  /* Get a pointer to the output data. */
  printf("clOut\n");
  v16us *output = (v16us *)clEnqueueMapBuffer(
      command_waiting_line, memoryObjects[1], CL_TRUE, CL_MAP_READ, 0,
      population_byte_size, 0, NULL, NULL, &errorNumber);
  v16us *newspaper = (v16us *)clEnqueueMapBuffer(
      command_waiting_line, memoryObjects[2], CL_TRUE, CL_MAP_READ, 0,
      newspaper_byte_size, 0, NULL, NULL, &errorNumber);
  if (!success_verification(errorNumber)) {
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Failed to map buffer. %s:%d\n", __FILE__, __LINE__);
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
  // printf("program %04X \n", (uint)*((uint16_t *)&(output[1])));

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
  if (!success_verification(clEnqueueUnmapMemObject(
          command_waiting_line, memoryObjects[1], output, 0, NULL, NULL))) {
    printf("unmapping\n");
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Unmapping memory objects failed %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }
  if (!success_verification(clEnqueueUnmapMemObject(
          command_waiting_line, memoryObjects[2], newspaper, 0, NULL, NULL))) {
    printf("unmapping\n");
    // cleanUpOpenCL(context, command_waiting_line, program, kernel,
    // memoryObjects,
    //              numberOfMemoryObjects);
    fprintf(stderr, "Unmapping memory objects failed %s:%d\n", __FILE__,
            __LINE__);
    return 1;
  }

  printf("releasing\n");
  /* Release OpenCL objects. */
  // cleanUpOpenCL(context, command_waiting_line, program, kernel,
  // memoryObjects,
  //              numberOfMemoryObjects);
}
