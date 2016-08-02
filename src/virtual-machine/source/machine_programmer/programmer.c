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
#include <stdint.h>
#include <assert.h>
#include <string.h>
#include <stdio.h>
#include "../seed/seed.h"
#include "programmer.h"
#include "prng.h"
/*
  algorithm:

  load the program atom list,
  generate the DNA of the initial population by using various atom,

  load the quiz list and quiz the population for fitness
*/

void composition_program(const uint8_t activity_atom_size,
                         const v16us *restrict activity_atom,
                         const uint16_t program_size, uint64_t *random_seed,
                         v16us *restrict program) {
  /*algorithm:
      select a random element,
      add it to the program.*/
  uint8_t nomination;
  assert(activity_atom_size > 0);
  assert(activity_atom != NULL);
  assert(program_size > 0);
  assert(program != NULL);
  assert(random_seed != 0);
  nomination =
      (uint8_t)(splitMix64(random_seed) % ((uint8_t)(activity_atom_size - 1)));
  *program = activity_atom[nomination];
}

static void obtain_first_sentence(const uint16_t quiz_sentence_list_size,
                                  const v16us *restrict quiz_sentence_list,
                                  uint8_t *sentence_size) {
  assert(quiz_sentence_list_size != 0);
  assert(quiz_sentence_list != NULL);
  assert(sentence_size != NULL);
  *sentence_size = 1;
  assert(*sentence_size < MAX_SENTENCE_BRICK);
}

static void obtain_import(const uint8_t sentence_size,
                          const v16us *restrict quiz_sentence_list,
                          uint8_t *brick_spot, v4us *coded_name,
                          v8us *hook_list) {
  // uint16_t grammar_indicator = quiz_sentence_list[0][0];
  // uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  // uint8_t quiz_spot = 0;
  // uint8_t import_size = 0;
  assert(sentence_size > 0);
  assert(quiz_sentence_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(sentence_size, quiz_sentence_list, brick_spot, coded_name,
                   hook_list);
  // printf("OI hook_list: ");
  // for (quiz_spot = 0; quiz_spot < HOOK_LIST_SIZE; ++quiz_spot) {
  //  printf("%04X ", (uint)hook_list[quiz_spot][0]);
  //}
  // printf("\n");
  // for (brick_spot = 0; brick_spot < sentence_size * BRICK_SIZE;
  //     ++brick_spot) {
  //  if (((grammar_indicator & (1 << brick_spot)) >> brick_spot) == indicator
  //  &&
  //      quiz_sentence_list[0][brick_spot] == CONDITIONAL_MOOD) {
  //    // import_size = (uint8_t)(brick_spot + 1);
  //    break;
  //  }
  //}
}
static void obtain_export(const uint8_t sentence_size,
                          const v16us *restrict quiz_sentence_list,
                          uint8_t *brick_spot, v4us *coded_name,
                          v8us *hook_list) {
  //  uint8_t brick_spot = 0;
  //  uint16_t grammar_indicator = quiz_sentence_list[0][0];
  //  uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  //  assert(sentence_size > 0);
  //  assert(quiz_sentence_list != NULL);
  //  assert(export_size != NULL);
  assert(sentence_size > 0);
  assert(quiz_sentence_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(sentence_size, quiz_sentence_list, brick_spot, coded_name,
                   hook_list);
  //  for (brick_spot = import_size; brick_spot < sentence_size *
  //  BRICK_SIZE;
  //       ++brick_spot) {
  //    if (((grammar_indicator & (1 << brick_spot)) >> brick_spot) == indicator
  //    &&
  //        quiz_sentence_list[0][brick_spot] == REALIS_MOOD) {
  //      *export_size = (uint8_t)(brick_spot + 1);
  //      break;
  //    }
  //  }
}

void quiz_program(const uint16_t quiz_sentence_list_size,
                  const v16us *restrict quiz_sentence_list,
                  const uint16_t program_size, const v16us *restrict program,
                  uint16_t *program_worth) {
  /* algorithm:
    for each quiz sentence feed the program inputs,
      and if the output is correct then add one to the program_worth.
  */
  uint16_t worth = 0;
  uint16_t quiz_sentence_spot;
  uint8_t sentence_size = 0;
  v4us coded_name = {0, 0, 0, 0};
  // uint8_t import_size = 0;
  // uint8_t export_size = 0;
  // uint8_t quiz_spot = 0;
  uint8_t brick_spot = 1;
  v8us hook_list[HOOK_LIST_SIZE];
  v8us export_hook_list[HOOK_LIST_SIZE];
  memset(hook_list, 0, HOOK_LIST_SIZE * HOOK_LIST_WIDTH * WORD_WIDTH);
  memset(export_hook_list, 0, HOOK_LIST_SIZE * HOOK_LIST_WIDTH * WORD_WIDTH);
  assert(quiz_sentence_list_size > 0);
  assert(quiz_sentence_list != NULL);
  assert(program_size > 0);
  assert(program != NULL);
  assert(program_worth != NULL);
  for (quiz_sentence_spot = 0; quiz_sentence_spot < quiz_sentence_list_size;
       ++quiz_sentence_spot) {
    brick_spot = 1;
    // obtain_first_sentence(); // for multi brick sentences
    // printf("ITERATION %X\n", quiz_sentence_spot);
    // memset((char *)&coded_name, 0, 8);
    memset(hook_list, 0, V8US_SIZE * HOOK_LIST_SIZE);
    memset(export_hook_list, 0, V8US_SIZE * HOOK_LIST_SIZE);
    obtain_first_sentence(
        (uint16_t)(quiz_sentence_list_size - quiz_sentence_spot),
        quiz_sentence_list + quiz_sentence_spot, &sentence_size);
    // obtain_import
    obtain_import(sentence_size, quiz_sentence_list + quiz_sentence_spot,
                  &brick_spot, &coded_name, hook_list);
    // printf("hook_list: ");
    // for (quiz_spot = 0; quiz_spot < HOOK_LIST_SIZE; ++quiz_spot) {
    //  printf("%04X ", (uint)hook_list[quiz_spot][0]);
    //}
    // printf("\n");
    memcpy((char *)&export_hook_list, (char *)&hook_list,
           V8US_SIZE * HOOK_LIST_SIZE);
    // obtain_export
    // printf("pre export hook_list: ");
    // for (quiz_spot = 0; quiz_spot < HOOK_LIST_SIZE; ++quiz_spot) {
    //  printf("%04X ", (uint)export_hook_list[quiz_spot][0]);
    //}
    // printf("\n");
    ++brick_spot;
    // printf("brick_spot %X\n", (uint)brick_spot);
    obtain_export(sentence_size, quiz_sentence_list + quiz_sentence_spot,
                  &brick_spot, &coded_name, export_hook_list);
    // printf("export hook_list: ");
    // for (quiz_spot = 0; quiz_spot < HOOK_LIST_SIZE; ++quiz_spot) {
    //  printf("%04X ", (uint)export_hook_list[quiz_spot][0]);
    //}
    // printf("\n");
    // printf("coded_name burden3 %04X%04X%04X%04X\n",
    // (uint)(coded_name)[3],
    //        (uint)(coded_name)[2], (uint)(coded_name)[1],
    //        (uint)(coded_name)[0]);
    // play_program
    play_text(program_size, program, &coded_name, hook_list);
    // printf("hook_list-after: ");
    // for (quiz_spot = 0; quiz_spot < HOOK_LIST_SIZE; ++quiz_spot) {
    //  printf("%04X ", (uint)hook_list[quiz_spot][0]);
    //}
    // printf("\n");
    if (memcmp((char *)&export_hook_list, (char *)&hook_list,
               V8US_SIZE * HOOK_LIST_SIZE) == 0) {
      ++worth;
    }
    // compare program_export to quiz_export
  }
  printf("worth: %X\n", (uint)worth);
  *program_worth = worth;
}
void composition_population(const uint8_t activity_atom_size,
                            const v16us *restrict activity_atom,
                            const uint16_t program_size,
                            const uint8_t population_size,
                            uint64_t *random_seed, v16us *restrict population) {
  uint8_t program_spot = 0;
  assert(activity_atom_size > 0);
  assert(activity_atom != NULL);
  assert(program_size > 0);
  assert(population_size > 0);
  assert(random_seed != NULL);
  assert(population != NULL);
  for (; program_spot < population_size; ++program_spot) {
    composition_program(activity_atom_size, activity_atom, program_size,
                        random_seed, &population[program_spot]);
  }
}
extern void quiz_population(const uint16_t quiz_sentence_list_size,
                            const v16us *restrict quiz_sentence_list,
                            const uint16_t program_size,
                            const uint8_t population_size,
                            const v16us *restrict population, uint8_t *champion,
                            uint16_t *champion_worth) {
  uint16_t program_worth = 0;
  uint8_t program_number = 0;
  assert(quiz_sentence_list_size > 0);
  assert(quiz_sentence_list != NULL);
  assert(program_size > 0);
  assert(population_size > 0);
  assert(population != NULL);
  assert(champion != NULL);
  assert(champion_worth != NULL);
  for (; program_number < population_size; ++program_number) {
    program_worth = 0;
    quiz_program(quiz_sentence_list_size, quiz_sentence_list, program_size,
                 &population[program_number], &program_worth);
    if (program_worth > *champion_worth) {
      *champion = program_number;
      *champion_worth = program_worth;
    }
  }
}
