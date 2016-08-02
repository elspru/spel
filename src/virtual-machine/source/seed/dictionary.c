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
#include <stdint.h> // opencl compatible
#include <stdio.h>  // NOT opencl compatible
#include <assert.h>
#include <string.h> // NOT opencl compatible// uses memset and memcmp
#include "seed.h"
#include "dictionary.h"

inline void x6048009D00000000(unsigned char *text) {
  assert(text != NULL);
  printf("ini %02X\n", (uint)text[0]);
  printf("%s", text);
}
inline void x6048029D00000000(signed char *text) {
  assert(text != NULL);
  printf("%s", text);
}
inline void x4124000000000000(v8us *hook_list) {
  if (memcmp((char *)&hook_list[ACCUSATIVE_SPOT],
             (char *)&hook_list[INSTRUMENTAL_SPOT], 16) == 0) {
    hook_list[DATIVE_SPOT][0] = FACT_WORD;
  } else {
    hook_list[DATIVE_SPOT][0] = WRONG_WORD;
  }
}
inline void x8006000000000000(v8us *hook_list) {
  if (memcmp((char *)&hook_list[ACCUSATIVE_SPOT],
             (char *)&hook_list[INSTRUMENTAL_SPOT], 16) != 0) {
    hook_list[DATIVE_SPOT][0] = FACT_WORD;
  } else {
    hook_list[DATIVE_SPOT][0] = WRONG_WORD;
  }
}

inline void xA130143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  if (*instrumental) {
     *accusative = (uint16_t)~(*accusative);
  }
}
inline void xC450143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  *accusative = (uint16_t)(*accusative - *instrumental);
}
inline void x8006143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  *accusative = (uint16_t)(*accusative + *instrumental);
}
