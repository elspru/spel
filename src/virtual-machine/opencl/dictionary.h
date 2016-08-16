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
#ifndef DICTIONARY_H
#define DICTIONARY_H
#include "seed.h"
void x6048009D00000000(unsigned char *text); /*say*/
void x6048029D00000000(signed char *text);   /*say*/
void x4124000000000000(v8us *hook_list);     /*equal*/
void x8006000000000000(v8us *hook_list);     /*increase*/
                                             /*not (CCNOT)*/
void xA130143D143D0000(uint16_t *accusative, uint16_t *instrumental);
void xC450143D143D0000(uint16_t *accusative, uint16_t *instrumental);
void x8006143D143D0000(uint16_t *accusative, uint16_t *instrumental);
#endif
