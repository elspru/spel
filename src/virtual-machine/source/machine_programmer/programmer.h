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
