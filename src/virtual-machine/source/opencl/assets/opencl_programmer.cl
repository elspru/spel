/*
 * This confidential and proprietary software may be used only as
 * authorised by a licensing agreement from ARM Limited
 *    (C) COPYRIGHT 2013 ARM Limited
 *        ALL RIGHTS RESERVED
 * The entire notice above must be reproduced on all authorised
 * copies and copies may only be made to the extent permitted
 * by a licensing agreement from ARM Limited.
 */

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;
typedef unsigned int uint32_t;
typedef unsigned long uint64_t;
typedef ushort16 v16us;

/**
 * \brief Hello World kernel function.
 * \param[in] inputA First input array.
 * \param[in] inputB Second input array.
 * \param[out] produce Output array.
 */
/* [OpenCL Implementation] */

uint64_t splitMix64(__local uint64_t *seed) {
  uint64_t z = (*seed += 0x9E3779B97F4A7C15);
  z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9;
  z = (z ^ (z >> 27)) * 0x94D049BB133111EB;
  return z ^ (z >> 31);
}
void composition_program(const uint8_t activity_atom_size,
                         __constant const v16us *restrict activity_atom,
                         const uint16_t program_size,
                         __local uint64_t *random_seed,
                         __global v16us *restrict program) {
  /*algorithm:
      select a random element,
      add it to the program.*/
  uint8_t nomination;
  // assert(activity_atom_size > 0);
  // assert(activity_atom != NULL);
  // assert(program_size > 0);
  // assert(program != NULL);
  // assert(random_seed != 0);
  nomination =
      (uint8_t)(splitMix64(random_seed) % ((uint8_t)(activity_atom_size - 1)));
  *program = activity_atom[nomination];
}

__kernel void composition_population(const uint8_t activity_atom_size,
                                     __constant const v16us *restrict
                                         activity_atom,
                                     const uint16_t program_size,
                                     // const uint8_t population_size,
                                     __local uint64_t *random_seed,
                                     __global v16us *restrict population) {
  uint8_t program_spot = get_global_id(0);
  // for (; program_spot < population_size; ++program_spot) {
  composition_program(activity_atom_size, activity_atom, program_size,
                      random_seed, &population[program_spot]);
  //}
}

__kernel void hello_world_opencl(__global const int *restrict inputA,
                                 __global const int *restrict inputB,
                                 __global int *restrict produce) {
  /*
   * Set i to be the ID of the kernel instance.
   * If the global work size (set by clEnqueueNDRangeKernel) is n,
   * then n kernels will be run and i will be in the range [0, n - 1].
   */
  int i = get_global_id(0);

  /* Use i as an index into the three arrays. */
  produce[i] = inputA[i] + inputB[i];
}
/* [OpenCL Implementation] */
