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
#include "programmer.h"
#include "../seed/seed.h"
#include "prng.h"
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
/*
  algorithm:

  load the program atom list,
  generate the DNA of the initial population by using various atom,

  load the quiz list and quiz the population for fitness
*/

void composition_program(const uint8_t activity_atom_size,
                         const v16us *activity_atom,
                         const uint16_t program_size, uint64_t *random_seed,
                         v16us *program) {
  /*algorithm:
      select a random element,
      add it to the program.*/
  uint8_t nomination = 0;
  assert(activity_atom_size > 0);
  assert(activity_atom != NULL);
  assert(program_size > 0);
  assert(program != NULL);
  assert(random_seed != NULL);
  assert(*random_seed != 0);
  // printf("composition1 \n");
  *random_seed = splitMix64(random_seed);
  // printf("composition2 \n");
  nomination = (uint8_t)(activity_atom_size - 1);
  // printf("composition3 %X\n", nomination);
  // printf("composition4 \n");
  nomination = (uint8_t)((uint8_t)*random_seed % (uint8_t)nomination);
  // printf("composition5 %X\n", nomination);
  *program = activity_atom[nomination];
}

static void
obtain_first_independentClause(const uint16_t quiz_independentClause_list_size,
                               const v16us *quiz_independentClause_list,
                               uint8_t *independentClause_size) {
  assert(quiz_independentClause_list_size != 0);
  assert(quiz_independentClause_list != NULL);
  assert(independentClause_size != NULL);
  *independentClause_size = 1;
  assert(*independentClause_size < MAX_INDEPENDENTCLAUSE_TABLET);
}

static void obtain_import(const uint8_t independentClause_size,
                          const v16us *quiz_independentClause_list,
                          uint8_t *brick_indexFinger, v4us *coded_name,
                          v8us *hook_list) {
  // uint16_t grammar_indicator = quiz_independentClause_list[0][0];
  // uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  // uint8_t quiz_indexFinger = 0;
  // uint8_t import_size = 0;
  assert(independentClause_size > 0);
  assert(quiz_independentClause_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(independentClause_size, quiz_independentClause_list,
                   brick_indexFinger, coded_name, hook_list);
  // printf("OI hook_list: ");
  // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
  // ++quiz_indexFinger) {
  //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
  //}
  // printf("\n");
  // for (brick_indexFinger = 0; brick_indexFinger < independentClause_size *
  // TABLET_LONG;
  //     ++brick_indexFinger) {
  //  if (((grammar_indicator & (1 << brick_indexFinger)) >> brick_indexFinger)
  //  == indicator
  //  &&
  //      quiz_independentClause_list[0][brick_indexFinger] == CONDITIONAL_MOOD)
  //      {
  //    // import_size = (uint8_t)(brick_indexFinger + 1);
  //    break;
  //  }
  //}
}
static void obtain_export(const uint8_t independentClause_size,
                          const v16us *quiz_independentClause_list,
                          uint8_t *brick_indexFinger, v4us *coded_name,
                          v8us *hook_list) {
  //  uint8_t brick_indexFinger = 0;
  //  uint16_t grammar_indicator = quiz_independentClause_list[0][0];
  //  uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  //  assert(independentClause_size > 0);
  //  assert(quiz_independentClause_list != NULL);
  //  assert(export_size != NULL);
  assert(independentClause_size > 0);
  assert(quiz_independentClause_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(independentClause_size, quiz_independentClause_list,
                   brick_indexFinger, coded_name, hook_list);
  //  for (brick_indexFinger = import_size; brick_indexFinger <
  //  independentClause_size *
  //  TABLET_LONG;
  //       ++brick_indexFinger) {
  //    if (((grammar_indicator & (1 << brick_indexFinger)) >>
  //    brick_indexFinger) == indicator
  //    &&
  //        quiz_independentClause_list[0][brick_indexFinger] == REALIS_MOOD) {
  //      *export_size = (uint8_t)(brick_indexFinger + 1);
  //      break;
  //    }
  //  }
}

void quiz_program(const uint16_t quiz_independentClause_list_size,
                  const v16us *quiz_independentClause_list,
                  const uint16_t program_size, const v16us *program,
                  uint16_t *program_worth) {
  /* algorithm:
    for each quiz independentClause feed the program inputs,
      and if the output is correct then add one to the program_worth.
  */
  uint16_t worth = 0;
  uint16_t quiz_independentClause_indexFinger;
  uint8_t independentClause_size = 0;
  v4us coded_name = {0, 0, 0, 0};
  // uint8_t import_size = 0;
  // uint8_t export_size = 0;
  // uint8_t quiz_indexFinger = 0;
  uint8_t brick_indexFinger = 1;
  v8us hook_list[HOOK_LIST_LONG];
  v8us export_hook_list[HOOK_LIST_LONG];
  memset(hook_list, 0, HOOK_LIST_LONG * HOOK_LIST_THICK * WORD_THICK);
  memset(export_hook_list, 0, HOOK_LIST_LONG * HOOK_LIST_THICK * WORD_THICK);
  assert(quiz_independentClause_list_size > 0);
  assert(quiz_independentClause_list != NULL);
  assert(program_size > 0);
  assert(program != NULL);
  assert(program_worth != NULL);
  for (quiz_independentClause_indexFinger = 0;
       quiz_independentClause_indexFinger < quiz_independentClause_list_size;
       ++quiz_independentClause_indexFinger) {
    brick_indexFinger = 1;
    // obtain_first_independentClause(); // for multi brick independentClauses
    // printf("ITERATION %X\n", quiz_independentClause_indexFinger);
    // memset((char *)&coded_name, 0, 8);
    memset(hook_list, 0, V8US_LONG * HOOK_LIST_LONG);
    memset(export_hook_list, 0, V8US_LONG * HOOK_LIST_LONG);
    obtain_first_independentClause(
        (uint16_t)(quiz_independentClause_list_size -
                   quiz_independentClause_indexFinger),
        quiz_independentClause_list + quiz_independentClause_indexFinger,
        &independentClause_size);
    // obtain_import
    obtain_import(independentClause_size,
                  quiz_independentClause_list +
                      quiz_independentClause_indexFinger,
                  &brick_indexFinger, &coded_name, hook_list);
    // printf("hook_list: ");
    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
    // ++quiz_indexFinger) {
    //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
    //}
    // printf("\n");
    memcpy((char *)&export_hook_list, (char *)&hook_list,
           V8US_LONG * HOOK_LIST_LONG);
    // obtain_export
    // printf("pre export hook_list: ");
    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
    // ++quiz_indexFinger) {
    //  printf("%04X ", (uint)export_hook_list[quiz_indexFinger][0]);
    //}
    // printf("\n");
    ++brick_indexFinger;
    // printf("brick_indexFinger %X\n", (uint)brick_indexFinger);
    obtain_export(independentClause_size,
                  quiz_independentClause_list +
                      quiz_independentClause_indexFinger,
                  &brick_indexFinger, &coded_name, export_hook_list);
    // printf("export hook_list: ");
    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
    // ++quiz_indexFinger) {
    //  printf("%04X ", (uint)export_hook_list[quiz_indexFinger][0]);
    //}
    // printf("\n");
    // printf("coded_name burden3 %04X%04X%04X%04X\n",
    // (uint)(coded_name)[3],
    //        (uint)(coded_name)[2], (uint)(coded_name)[1],
    //        (uint)(coded_name)[0]);
    // play_program
    play_text(program_size, program, &coded_name, hook_list);
    // printf("hook_list-after: ");
    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
    // ++quiz_indexFinger) {
    //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
    //}
    // printf("\n");
    if (memcmp((char *)&export_hook_list, (char *)&hook_list,
               V8US_LONG * HOOK_LIST_LONG) == 0) {
      ++worth;
    }
    // compare program_export to quiz_export
  }
  printf("worth: %X\n", (uint)worth);
  *program_worth = worth;
}
void composition_population(const uint8_t activity_atom_size,
                            const v16us *activity_atom,
                            const uint16_t program_size,
                            const uint8_t population_size,
                            uint64_t *random_seed, v16us *population) {
  uint8_t program_indexFinger = 0;
  assert(activity_atom_size > 0);
  assert(activity_atom != NULL);
  assert(program_size > 0);
  assert(population_size > 0);
  assert(random_seed != NULL);
  assert(population != NULL);
  for (; program_indexFinger < population_size; ++program_indexFinger) {
    composition_program(activity_atom_size, activity_atom, program_size,
                        random_seed, &population[program_indexFinger]);
  }
}
void quiz_population(const uint16_t quiz_independentClause_list_size,
                     const v16us *quiz_independentClause_list,
                     const uint16_t program_size, const uint8_t population_size,
                     const v16us *population, uint8_t *champion,
                     uint16_t *champion_worth) {
  uint16_t program_worth = 0;
  uint8_t program_number = 0;
  assert(quiz_independentClause_list_size > 0);
  assert(quiz_independentClause_list != NULL);
  assert(program_size > 0);
  assert(population_size > 0);
  assert(population != NULL);
  assert(champion != NULL);
  assert(champion_worth != NULL);
  for (; program_number < population_size; ++program_number) {
    program_worth = 0;
    quiz_program(quiz_independentClause_list_size, quiz_independentClause_list,
                 program_size, &population[program_number], &program_worth);
    if (program_worth > *champion_worth) {
      *champion = program_number;
      *champion_worth = program_worth;
    }
  }
}
