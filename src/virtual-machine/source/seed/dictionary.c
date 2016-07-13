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
inline void x60AA000000000000(v8us *hook_list) {
  if (memcmp((char *)&hook_list[ACCUSATIVE_SPOT],
             (char *)&hook_list[INSTRUMENTAL_SPOT], 16) != 0) {
    hook_list[DATIVE_SPOT][0] = FACT_WORD;
  } else {
    hook_list[DATIVE_SPOT][0] = WRONG_WORD;
  }
}

