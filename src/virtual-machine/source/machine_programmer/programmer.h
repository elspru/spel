#ifndef PROGRAMMER_H
#define PROGRAMMER_H
/* requires including seed.h */
extern void create_plan(const uint8_t activity_elements_length,
                        const v16us* restrict activity_elements, 
                        const uint16_t plan_length,
                        uint64_t* random_seed,
                        v16us* restrict plan);
extern void check_plan(const uint16_t check_sentence_length,
                          const v16us* restrict check_sentence_list,
                          const uint16_t plan_length,
                          const v16us* restrict plan,
                          uint16_t* plan_worth);
///*@unused@*/ extern void create_crowd(const uint8_t activity_elements_length,
//                                      const v16us* restrict
//                                      activity_elements,
//                                      const uint8_t plan_length,
//                                      const uint8_t crowd_length,
//                                      v16us** restrict crowd);
///*@unused@*/ extern void check_crowd(const uint16_t check_sentence_length,
//                                       const v16us* restrict
//                                       check_sentence_list,
//                                       const uint8_t crowd_length,
//                                       const v16us** restrict crowd,
//                                       uint16_t plan_worth);
#endif
