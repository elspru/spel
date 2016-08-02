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
extern void composition_program(const uint8_t activity_atom_size,
                        const v16us* restrict activity_atom, 
                        const uint16_t program_size,
                        uint64_t* random_seed,
                        v16us* restrict program);
extern void quiz_program(const uint16_t quiz_sentence_size,
                       const v16us* restrict quiz_sentence_list,
                       const uint16_t program_size,
                       const v16us* restrict program,
                       uint16_t* program_worth);
extern void composition_population(const uint8_t activity_atom_size,
                         const v16us* restrict activity_atom,
                         const uint16_t program_size,
                         const uint8_t population_size,
                         uint64_t* random_seed,
                         v16us* restrict population);
extern void quiz_population(const uint16_t quiz_sentence_size,
                        const v16us* restrict quiz_sentence_list,
                        const uint16_t program_size,
                        const uint8_t population_size,
                        const v16us* restrict population,
                        uint8_t* champion,
                        uint16_t* champion_worth);
#endif
