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

  load the program elements list,
  generate the DNA of the initial population by using various elements,

  load the check list and check the population for fitness
*/

void create_plan(const uint8_t activity_elements_length,
                 const v16us *restrict activity_elements,
                 const uint16_t plan_length, uint64_t *random_seed,
                 v16us *restrict plan) {
  /*algorithm:
      select a random element,
      add it to the plan.*/
  uint8_t nomination;
  assert(activity_elements_length > 0);
  assert(activity_elements != NULL);
  assert(plan_length > 0);
  assert(plan != NULL);
  assert(random_seed != 0);
  nomination = (uint8_t)(splitMix64(random_seed) %
                         ((uint8_t)(activity_elements_length - 1)));
  *plan = activity_elements[nomination];
}

static void obtain_first_sentence(const uint16_t check_sentence_list_length,
                                  const v16us *restrict check_sentence_list,
                                  uint8_t *sentence_length) {
  assert(check_sentence_list_length != 0);
  assert(check_sentence_list != NULL);
  assert(sentence_length != NULL);
  *sentence_length = 1;
  assert(*sentence_length < MAX_SENTENCE_BRICK);
}

static void obtain_import(const uint8_t sentence_length,
                          const v16us *restrict check_sentence_list,
                          uint8_t *brick_spot, v4us *encoded_name,
                          v8us *hook_list) {
  // uint16_t grammar_indicator = check_sentence_list[0][0];
  // uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  // uint8_t check_spot = 0;
  // uint8_t import_length = 0;
  assert(sentence_length > 0);
  assert(check_sentence_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(sentence_length, check_sentence_list, brick_spot,
                   encoded_name, hook_list);
  // printf("OI hook_list: ");
  // for (check_spot = 0; check_spot < HOOK_LIST_LENGTH; ++check_spot) {
  //  printf("%04X ", (uint)hook_list[check_spot][0]);
  //}
  // printf("\n");
  // for (brick_spot = 0; brick_spot < sentence_length * BRICK_LENGTH;
  //     ++brick_spot) {
  //  if (((grammar_indicator & (1 << brick_spot)) >> brick_spot) == indicator
  //  &&
  //      check_sentence_list[0][brick_spot] == CONDITIONAL_MOOD) {
  //    // import_length = (uint8_t)(brick_spot + 1);
  //    break;
  //  }
  //}
}
static void obtain_export(const uint8_t sentence_length,
                          const v16us *restrict check_sentence_list,
                          uint8_t *brick_spot, v4us *encoded_name,
                          v8us *hook_list) {
  //  uint8_t brick_spot = 0;
  //  uint16_t grammar_indicator = check_sentence_list[0][0];
  //  uint8_t indicator = (uint8_t)(1 & grammar_indicator);
  //  assert(sentence_length > 0);
  //  assert(check_sentence_list != NULL);
  //  assert(export_length != NULL);
  assert(sentence_length > 0);
  assert(check_sentence_list != NULL);
  assert(hook_list != NULL);
  burden_hook_list(sentence_length, check_sentence_list, brick_spot,
                   encoded_name, hook_list);
  //  for (brick_spot = import_length; brick_spot < sentence_length *
  //  BRICK_LENGTH;
  //       ++brick_spot) {
  //    if (((grammar_indicator & (1 << brick_spot)) >> brick_spot) == indicator
  //    &&
  //        check_sentence_list[0][brick_spot] == REALIS_MOOD) {
  //      *export_length = (uint8_t)(brick_spot + 1);
  //      break;
  //    }
  //  }
}

void check_plan(const uint16_t check_sentence_list_length,
                const v16us *restrict check_sentence_list,
                const uint16_t plan_length, const v16us *restrict plan,
                uint16_t *plan_worth) {
  /* algorithm:
    for each check sentence feed the plan inputs,
      and if the output is correct then add one to the plan_worth.
  */
  uint16_t worth = 0;
  uint16_t check_sentence_spot;
  uint8_t sentence_length = 0;
  v4us encoded_name = {0, 0, 0, 0};
  // uint8_t import_length = 0;
  // uint8_t export_length = 0;
  uint8_t check_spot = 0;
  uint8_t brick_spot = 1;
  v8us hook_list[HOOK_LIST_LENGTH];
  v8us export_hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, HOOK_LIST_LENGTH * HOOK_LIST_WIDTH * WORD_WIDTH);
  memset(export_hook_list, 0, HOOK_LIST_LENGTH * HOOK_LIST_WIDTH * WORD_WIDTH);
  assert(check_sentence_list_length > 0);
  assert(check_sentence_list != NULL);
  assert(plan_length > 0);
  assert(plan != NULL);
  assert(plan_worth != NULL);
  for (check_sentence_spot = 0;
       check_sentence_spot < check_sentence_list_length;
       ++check_sentence_spot) {
    brick_spot = 1;
    // obtain_first_sentence(); // for multi brick sentences
    printf("ITERATION %X\n", check_sentence_spot);
    // memset((char *)&encoded_name, 0, 8);
    memset(hook_list, 0, V8US_LENGTH * HOOK_LIST_LENGTH);
    memset(export_hook_list, 0, V8US_LENGTH * HOOK_LIST_LENGTH);
    obtain_first_sentence(
        (uint16_t)(check_sentence_list_length - check_sentence_spot),
        check_sentence_list + check_sentence_spot, &sentence_length);
    // obtain_import
    obtain_import(sentence_length, check_sentence_list + check_sentence_spot,
                  &brick_spot, &encoded_name, hook_list);
    printf("hook_list: ");
    for (check_spot = 0; check_spot < HOOK_LIST_LENGTH; ++check_spot) {
      printf("%04X ", (uint)hook_list[check_spot][0]);
    }
    printf("\n");
    memcpy((char *)&export_hook_list, (char *)&hook_list,
           V8US_LENGTH * HOOK_LIST_LENGTH);
    // obtain_export
    // printf("pre export hook_list: ");
    // for (check_spot = 0; check_spot < HOOK_LIST_LENGTH; ++check_spot) {
    //  printf("%04X ", (uint)export_hook_list[check_spot][0]);
    //}
    // printf("\n");
    ++brick_spot;
    // printf("brick_spot %X\n", (uint)brick_spot);
    obtain_export(sentence_length, check_sentence_list + check_sentence_spot,
                  &brick_spot, &encoded_name, export_hook_list);
    printf("export hook_list: ");
    for (check_spot = 0; check_spot < HOOK_LIST_LENGTH; ++check_spot) {
      printf("%04X ", (uint)export_hook_list[check_spot][0]);
    }
    printf("\n");
    // printf("encoded_name burden3 %04X%04X%04X%04X\n",
    // (uint)(encoded_name)[3],
    //        (uint)(encoded_name)[2], (uint)(encoded_name)[1],
    //        (uint)(encoded_name)[0]);
    // realize_plan
    realize_text(plan_length, plan, &encoded_name, hook_list);
    printf("hook_list-after: ");
    for (check_spot = 0; check_spot < HOOK_LIST_LENGTH; ++check_spot) {
      printf("%04X ", (uint)hook_list[check_spot][0]);
    }
    printf("\n");
    if (memcmp((char *)&export_hook_list, (char *)&hook_list,
               V8US_LENGTH * HOOK_LIST_LENGTH) == 0) {
      ++worth;
    }
    // compare plan_export to check_export
  }
  printf("worth: %X\n", (uint)worth);
  *plan_worth = worth;
}
