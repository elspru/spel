#include <stdint.h>
#include <assert.h>
#include <string.h>
#include "../seed/seed.h"
#include "programmer.h"
#include "prng.h"
/*
  algorithm:
  
  load the program elements list, 
  generate the DNA of the initial population by using various elements,
  
  load the check list and check the population for fitness
*/ 





void create_plan(const uint8_t activity_elements_length, const v16us* restrict
                 activity_elements, const uint16_t plan_length,
                 uint64_t* random_seed, v16us* restrict plan) {
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
                        ((uint8_t)(activity_elements_length - 1))) ;
  *plan = activity_elements[nomination];
  
}

void check_plan(const uint16_t check_sentence_length,
                   const v16us* restrict check_sentence_list,
                   const uint16_t plan_length,
                   const v16us* restrict plan,
                   uint16_t* plan_worth) {
  /* algorithm:
    for each check sentence feed the plan inputs, 
      and if the output is correct then add one to the plan_worth.
  */
  assert(check_sentence_length > 0);
  assert(check_sentence_list != NULL);
  assert(plan_length > 0);
  assert(plan != NULL);
  assert(plan_worth != NULL);
}
