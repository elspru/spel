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
#define NEWSPAPER_LONG 0x10

#define REALIS_MOOD 0x017E                     // li
#define DEONTIC_MOOD 0x095E                    // tu
#define CONDITIONAL_MOOD 0x9BE                 // cu
#define COUNTERFACTUAL_CONDITIONAL_MOOD 0x159E // f6
#define ACCUSATIVE_CASE 0x45E                  // ka
#define DATIVE_CASE 0x007E                     // yi
#define INSTRUMENTAL_CASE 0x087E               // yu

#define TRUTH_WORD 0x6109 // syan
#define LIE_WORD 0x600D   // cyin
#define ERROR_WORD 0xE4CD // croc

#define QUOTED_REFERENTIAL 0x1D
#define CONSONANT_ONE_MASK 0x1F
#define CONSONANT_ONE_THICK 5 // bits
#define UNSIGNED_CHAR_QUOTED 0x009D
#define SIGNED_CHAR_QUOTED 0x029D
#define SHORT_NUMBER_QUOTED 0x143D
#define QUOTED_LITERAL_INDEXFINGER 8

#define HOOK_LIST_LONG 3
#define VERB_INDEXFINGER 3
#define ACCUSATIVE_INDEXFINGER 2
#define INSTRUMENTAL_INDEXFINGER 1
#define DATIVE_INDEXFINGER 0

#define ERROR_BINARY 0
#define TABLET_LONG 0x10
#define WORD_THICK 2
#define V8US_LONG 16
#define TRUE 1
#define FALSE 0

typedef unsigned char uint8_t;
typedef unsigned short uint16_t;
typedef unsigned int uint32_t;
typedef unsigned long uint64_t;
typedef ushort4 v4us;
typedef ushort8 v8us;
typedef ushort16 v16us;

int comparison_randomAccessMemory(const void *s1, const void *s2, size_t n) {
  const unsigned char *p1 = s1, *p2 = s2;
  while (n--)
    if (*p1 != *p2)
      return *p1 - *p2;
    else
      p1++, p2++;
  return 0;
}

void *copy_randomAccessMemory(void *dest, const void *src, size_t n) {
  char *dp = dest;
  const char *sp = src;
  while (n--)
    *dp++ = *sp++;
  return dest;
}

void agree(const int c, const v16us error_news,
           local uint8_t *newspaper_indexFinger, global v16us *newspaper) {
  uint8_t program_indexFinger = get_global_id(0);
  if (*newspaper_indexFinger < NEWSPAPER_LONG) {
    if (!c) {
      if (program_indexFinger < NEWSPAPER_LONG) {
        newspaper[program_indexFinger] = error_news;
      } else {
        newspaper[*newspaper_indexFinger] = error_news;
      }
      *newspaper_indexFinger += 1;
    }
  }
}

uint64_t splitMix64(local uint64_t *seed) {
  uint64_t z = (*seed += 0x9E3779B97F4A7C15);
  z = (z ^ (z >> 30)) * 0xBF58476D1CE4E5B9;
  z = (z ^ (z >> 27)) * 0x94D049BB133111EB;
  return z ^ (z >> 31);
}

inline void x6048009D00000000(unsigned char *text) {
  // agree(text != NULL);
  // printf("ini %02X\n", (uint)text[0]);
  // printf("%s", text);
}
inline void x6048029D00000000(signed char *text) {
  // agree(text != NULL);
  // printf("%s", text);
}
inline void x4124000000000000(v8us *hook_list) {
  if (comparison_randomAccessMemory(
          (char *)&hook_list[ACCUSATIVE_INDEXFINGER],
          (char *)&hook_list[INSTRUMENTAL_INDEXFINGER], 16) == 0) {
    ((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] = TRUTH_WORD;
  } else {
    ((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] = LIE_WORD;
  }
}
inline void x8006000000000000(v8us *hook_list) {
  if (comparison_randomAccessMemory(
          (char *)&hook_list[ACCUSATIVE_INDEXFINGER],
          (char *)&hook_list[INSTRUMENTAL_INDEXFINGER], 16) != 0) {
    ((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] = TRUTH_WORD;
  } else {
    ((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] = LIE_WORD;
  }
}

inline void xA130143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  if (*instrumental) {
    *accusative = (uint16_t) ~(*accusative);
  }
}
inline void xC450143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  *accusative = (uint16_t)(*accusative - *instrumental);
}
inline void x8006143D143D0000(uint16_t *accusative, uint16_t *instrumental) {
  *accusative = (uint16_t)(*accusative + *instrumental);
}

void composition_program(const uint8_t activity_atom_size,
                         constant const v16us *restrict activity_atom,
                         const uint16_t program_size,
                         const uint64_t random_seed,
                         local uint64_t *random_workplace,
                         global v16us *restrict program) {
  /*algorithm:
      select a random element,
      add it to the program.*/
  uint8_t nomination;
  // agree(activity_atom_size > 0);
  // agree(activity_atom != NULL);
  // agree(program_size > 0);
  // agree(program != NULL);
  // agree(random_seed != 0);
  *random_workplace = random_seed;
  nomination = (uint8_t)(splitMix64(random_workplace) %
                         ((uint8_t)(activity_atom_size - 1)));
  *program = activity_atom[nomination];
}

uint64_t roll_u64(const uint64_t random_seed, const uint8_t amount) {
  return (uint64_t)((random_seed >> amount) || (random_seed << (64 - amount)));
}

kernel void composition_population(
    const uint8_t activity_atom_size,
    constant const v16us *restrict activity_atom, const uint16_t program_size,
    const uint8_t population_size, const uint64_t random_seed,
    local uint64_t *random_workplace, global v16us *restrict population,
    local uint8_t *newspaper_indexFinger, global v16us *newspaper) {
  uint8_t program_indexFinger = get_global_id(0);
  // v16us news = 1;
  // for (; program_indexFinger < population_size; ++program_indexFinger) {
  if (program_indexFinger < population_size) {
    agree(1 == 0, (v16us){program_indexFinger, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0xA,
                          0xB, 0xC, 0xD, 0xE, 0xF},
          newspaper_indexFinger, newspaper);
    composition_program(activity_atom_size, activity_atom, program_size,
                        roll_u64(random_seed, 8 * program_indexFinger),
                        random_workplace, &population[program_indexFinger]);
  }
  //}
}
//
// void obtain_first_independentClause(
//    const uint16_t quiz_independentClause_list_size,
//    const v16us *restrict quiz_independentClause_list,
//    uint8_t *independentClause_size /*,
//                           uint8_t *newspaper_indexFinger, v16us *newspaper*/)
//                           {
//  //  agree(quiz_independentClause_list_size != 0,
//  //        (v16us){'O', 'F', 'S', ',', 'Q', 'S', 'L', 'S', '!', '=', '0'},
//  //        newspaper_indexFinger, newspaper);
//  //  agree(quiz_independentClause_list != NULL, (v16us) "OFS,WSLS!=N",
//  //        newspaper_indexFinger, newspaper);
//  //  agree(independentClause_size != NULL), (v16us) "OFS,SS!=N",
//  //      newspaper_indexFinger, newspaper;
//  *independentClause_size = 1;
//  //  agree(*independentClause_size < MAX_INDEPENDENTCLAUSE_TABLET, (v16us)
//  //  "OFS,SS<MSB",
//  //        newspaper_indexFinger, newspaper);
//}
// inline void play_quote(const v16us *tablet, const uint8_t tablet_indexFinger,
//                       const uint8_t tablet_size, uint16_t *quote_word,
//                       v8us *quote_fill) {
//  uint16_t word;
//  uint8_t quote_indexFinger = 0;
//  uint8_t quote_size;
//  // agree(tablet != NULL);
//  // agree(tablet_indexFinger < TABLET_LONG);
//  // agree(tablet_size < MAX_INDEPENDENTCLAUSE_TABLET);
//  // agree(quote_word != NULL);
//  // agree(quote_fill != NULL);
//  word = ((uint16_t *)tablet)[tablet_indexFinger];
//  // printf("quote quizing, word %04X\n", (uint)
//  (*tablet)[tablet_indexFinger]);
//  if ((word & CONSONANT_ONE_MASK) == QUOTED_REFERENTIAL) {
//    // then is quote
//    *quote_word = word;
//    // printf("quote detected %04X\n", (uint)word);
//    quote_size = (uint8_t)(
//        1 << (((*quote_word >> CONSONANT_ONE_THICK) & 7 /* 3 bit mask */) -
//        1));
//    // printf("quote_size %X \n", (uint)quote_size);
//    // printf("tablet_indexFinger %X \n", (uint)tablet_indexFinger);
//    // agree(quote_size < tablet_size * TABLET_LONG * WORD_THICK);
//    // printf("quote_fill ");
//    if (quote_size == 0) {
//      ((uint16_t *)quote_fill)[0] =
//          (uint16_t)(word >> QUOTED_LITERAL_INDEXFINGER);
//      // printf("%04X ", (uint)(*quote_fill)[0]);
//    }
//    for (quote_indexFinger = 0; quote_indexFinger < quote_size;
//         ++quote_indexFinger) {
//      ((uint16_t *)quote_fill)[quote_indexFinger] =
//          ((uint16_t *)tablet)[tablet_indexFinger + quote_indexFinger + 1];
//      // printf("%04X ", (uint)(*quote_fill)[quote_indexFinger]);
//    }
//    // printf("\n");
//  }
//}
//
// inline void burden_hook_list(const uint8_t tablet_size, const v16us *tablet,
//                             uint8_t *tablet_indexFinger, v4us *coded_name,
//                             v8us *hook_list) {
//  // agree(tablet_size != 0);
//  // agree(tablet != NULL);
//  // agree(coded_name != NULL);
//  // agree(hook_list != NULL);
//  // agree(tablet_indexFinger != NULL);
//  // agree(*tablet_indexFinger >= 1);
//  uint16_t indicator_list = 0;
//  uint8_t indicator = 0;
//  uint8_t tablet_number = 0;
//  uint8_t exit = FALSE;
//  uint16_t word = 0;
//  uint16_t quote_word = 0;
//  v8us quote_fill = {0, 0, 0, 0, 0, 0, 0, 0};
//  indicator_list = ((uint16_t *)tablet)[0];
//  indicator = (uint8_t)1 & indicator_list;
//  // printf("indicator %X\n", (uint) indicator);
//  // printf("indicator_list %X\n", (uint) indicator_list);
//  for (tablet_number = 0; tablet_number < tablet_size; ++tablet_number) {
//    for (; *tablet_indexFinger < TABLET_LONG; ++*tablet_indexFinger) {
//      // printf("BHL tablet_indexFinger %X\n", (uint)*tablet_indexFinger);
//      // if previous is indicated then quiz if is quote
//      if (((indicator_list & (1 << (*tablet_indexFinger - 1))) >>
//           (*tablet_indexFinger - 1)) == indicator) {
//        // printf("quote's word %X \n", (uint)tablet[0][*tablet_indexFinger]);
//        play_quote(tablet, *tablet_indexFinger, tablet_size, &quote_word,
//                   &quote_fill);
//      }
//      // if current is indicated then quiz if is case or
//      // verb
//      if (((indicator_list & (1 << *tablet_indexFinger)) >>
//           *tablet_indexFinger) == indicator) {
//        word = ((uint16_t **)&tablet)[tablet_number][*tablet_indexFinger];
//        // printf("BHL word %X\n", (uint)word);
//        switch (word) {
//        case ACCUSATIVE_CASE:
//          // printf("detected accusative case\n");
//          if (quote_word != 0) {
//            ((uint16_t *)coded_name)[ACCUSATIVE_INDEXFINGER] = quote_word;
//            // printf("coded_name ACC %04X%04X%04X%04X\n",
//            //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
//            //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
//            hook_list[ACCUSATIVE_INDEXFINGER] = quote_fill;
//            // printf("ACC quote_fill %X\n", (uint)quote_fill[0]);
//            // printf("ACC hook_list %X\n",
//            // (uint)hook_list[ACCUSATIVE_INDEXFINGER][0]);
//            quote_word = 0;
//          }
//          break;
//        case DATIVE_CASE:
//          if (quote_word != 0) {
//            ((uint16_t *)coded_name)[DATIVE_INDEXFINGER] = quote_word;
//            hook_list[DATIVE_INDEXFINGER] = quote_fill;
//            quote_word = 0;
//          }
//          break;
//        case INSTRUMENTAL_CASE:
//          if (quote_word != 0) {
//            ((uint16_t *)coded_name)[INSTRUMENTAL_INDEXFINGER] = quote_word;
//            hook_list[INSTRUMENTAL_INDEXFINGER] = quote_fill;
//            quote_word = 0;
//          }
//          break;
//        default:
//          exit = TRUE;
//          break;
//        }
//      }
//      if (exit == TRUE)
//        break;
//    }
//    if (exit == TRUE)
//      break;
//  }
//}
//
// void obtain_import(const uint8_t independentClause_size,
//                   const v16us *restrict quiz_independentClause_list,
//                   uint8_t *brick_indexFinger, v4us *coded_name,
//                   v8us *hook_list) {
//  // uint16_t grammar_indicator = quiz_independentClause_list[0][0];
//  // uint8_t indicator = (uint8_t)(1 & grammar_indicator);
//  // uint8_t quiz_indexFinger = 0;
//  // uint8_t import_size = 0;
//  // agree(independentClause_size > 0);
//  // agree(quiz_independentClause_list != NULL);
//  // agree(hook_list != NULL);
//  burden_hook_list(independentClause_size, quiz_independentClause_list,
//                   brick_indexFinger, coded_name, hook_list);
//  // printf("OI hook_list: ");
//  // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
//  // ++quiz_indexFinger) {
//  //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
//  //}
//  // printf("\n");
//  // for (brick_indexFinger = 0; brick_indexFinger < independentClause_size *
//  // TABLET_LONG;
//  //     ++brick_indexFinger) {
//  //  if (((grammar_indicator & (1 << brick_indexFinger)) >>
//  brick_indexFinger)
//  //  == indicator
//  //  &&
//  //      quiz_independentClause_list[0][brick_indexFinger] ==
//  CONDITIONAL_MOOD)
//  //      {
//  //    // import_size = (uint8_t)(brick_indexFinger + 1);
//  //    break;
//  //  }
//  //}
//}
//
// void obtain_export(const uint8_t independentClause_size,
//                   const v16us *restrict quiz_independentClause_list,
//                   uint8_t *brick_indexFinger, v4us *coded_name,
//                   v8us *hook_list) {
//  //  uint8_t brick_indexFinger = 0;
//  //  uint16_t grammar_indicator = quiz_independentClause_list[0][0];
//  //  uint8_t indicator = (uint8_t)(1 & grammar_indicator);
//  //  agree(independentClause_size > 0);
//  //  agree(quiz_independentClause_list != NULL);
//  //  agree(export_size != NULL);
//  // agree(independentClause_size > 0);
//  // agree(quiz_independentClause_list != NULL);
//  // agree(hook_list != NULL);
//  burden_hook_list(independentClause_size, quiz_independentClause_list,
//                   brick_indexFinger, coded_name, hook_list);
//  //  for (brick_indexFinger = import_size; brick_indexFinger <
//  //  independentClause_size *
//  //  TABLET_LONG;
//  //       ++brick_indexFinger) {
//  //    if (((grammar_indicator & (1 << brick_indexFinger)) >>
//  //    brick_indexFinger) == indicator
//  //    &&
//  //        quiz_independentClause_list[0][brick_indexFinger] == REALIS_MOOD)
//  {
//  //      *export_size = (uint8_t)(brick_indexFinger + 1);
//  //      break;
//  //    }
//  //  }
//}
//
// inline void play(const v4us coded_name, v8us *hook_list) {
//  void *accusative = NULL;
//  void *instrumental = NULL;
//  // void *dative =  NULL;
//  // agree(((uint16_t *)&coded_name)[VERB_INDEXFINGER] != 0);
//  // agree(hook_list != NULL);
//  // quizing hash key name
//  // printf("coded_name play %04X%04X%04X%04X\n",
//  //       (uint)((uint16_t *)&coded_name)[3], (uint)((uint16_t
//  //       *)&coded_name)[2],
//  //       (uint)((uint16_t *)&coded_name)[1],
//  //       (uint)((uint16_t *)&coded_name)[0]);
//  // switch (coded_name[ACCUSATIVE_INDEXFINGER]) {
//  // case UNSIGNED_CHAR_QUOTED:
//  //  accusative = (unsigned char *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
//  //  break;
//  // case SIGNED_CHAR_QUOTED:
//  //  accusative = (char *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
//  //  break;
//  // case SHORT_NUMBER_QUOTED:
//  //  accusative = (uint16_t *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
//  //  break;
//  // case ERROR_BINARY:
//  //  break;
//  // default:
//  //  printf("unrecognized type %04X",
//  //  (uint)coded_name[ACCUSATIVE_INDEXFINGER]);
//  //  agree(0 != 0);
//  //  break;
//  //}
//  switch (((uint16_t *)&coded_name)[INSTRUMENTAL_INDEXFINGER]) {
//  case UNSIGNED_CHAR_QUOTED:
//    instrumental = (unsigned char *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
//    break;
//  case SIGNED_CHAR_QUOTED:
//    instrumental = (char *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
//    break;
//  case SHORT_NUMBER_QUOTED:
//    instrumental = (uint16_t *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
//    break;
//  case ERROR_BINARY:
//    break;
//  default:
//    // printf("unrecognized type %04X",
//    //       (uint)((uint16_t *)&coded_name)[ACCUSATIVE_INDEXFINGER]);
//    // agree(0 != 0);
//    break;
//  }
//  switch (*((uint64_t *)&coded_name)) {
//  case 0x6048009D00000000: /* say unsigned char* */
//    x6048009D00000000((unsigned char *)accusative);
//    break;
//  case 0x6048029D00000000: /* say signed char* */
//    x6048029D00000000((signed char *)accusative);
//    break;
//  case 0x4124000000000000: /* equal */
//    x4124000000000000((v8us *)hook_list);
//    break;
//  case 0x8006000000000000: /* different */
//    x8006000000000000((v8us *)hook_list);
//    break;
//  case 0xA130143D143D0000: /* not CCNOT */
//    xA130143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
//    break;
//  case 0xC450143D143D0000: /* not CCNOT */
//    xC450143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
//    break;
//  case 0x8006143D143D0000: /* not CCNOT */
//    x8006143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
//    break;
//  default:
//    // printf(
//    //    "unrecognized coded_name %04X%04X%04X%04X\n",
//    //    (uint)((uint16_t *)&coded_name)[3], (uint)((uint16_t
//    //    *)&coded_name)[2],
//    //    (uint)((uint16_t *)&coded_name)[1], (uint)((uint16_t
//    //    *)&coded_name)[0]);
//    // agree(0 != 0);
//    break;
//  }
//}
// inline void play_independentClause(const uint8_t tablet_size,
//                                   const v16us *tablet, v4us *coded_name,
//                                   v8us *hook_list) {
//  /* go through coded independentClause,
//      loading quotes into temporary register,
//      append to case list,
//      when get to case, move to appropriate case register,
//      add to case counter, and append to case list,
//      when get to verb,
//      match to available functions by number of cases,
//      match to available functions by case list,
//      make 64bit hash key, ACC DAT INS verb,
//      with appropriate quotes filling in place of ACC DAT INS
//      or a 0 if there is none.
//      execute proper function.
//  */
//  uint16_t indicator_list = 0;
//  uint8_t indicator = 0;
//  uint8_t tablet_number = 0;
//  uint8_t tablet_indexFinger = 1;
//  uint8_t exit = FALSE;
//  uint16_t word = 0;
//  // agree(tablet_size != 0);
//  // agree(tablet != NULL);
//  // agree(coded_name != NULL);
//  // agree(hook_list != NULL);
//  indicator_list = ((uint16_t *)tablet)[0];
//  indicator = (uint8_t)1 & indicator_list;
//  // printf("indicator %X\n", (uint) indicator);
//  // printf("indicator_list %X\n", (uint) indicator_list);
//  burden_hook_list(tablet_size, tablet, &tablet_indexFinger, coded_name,
//                   hook_list);
//  // printf("coded_name burden %04X%04X%04X%04X\n", (uint)(*coded_name)[3],
//  //       (uint)(*coded_name)[2], (uint)(*coded_name)[1],
//  //       (uint)(*coded_name)[0]);
//  for (tablet_number = 0; tablet_number < tablet_size; ++tablet_number) {
//    for (; tablet_indexFinger < TABLET_LONG; ++tablet_indexFinger) {
//      // if current is indicated then quiz if is case or
//      // verb
//      if (((indicator_list & (1 << tablet_indexFinger)) >>
//           tablet_indexFinger) == indicator) {
//        word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger];
//        // printf("word %X\n", (uint)word);
//        switch (word) {
//        case CONDITIONAL_MOOD:
//          word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger -
//          1];
//          // printf("COND word %04X \n", (uint) word);
//          ((uint16_t *)coded_name)[VERB_INDEXFINGER] = word;
//          // printf("coded_name COND %04X%04X%04X%04X\n",
//          //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
//          //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
//          play(*coded_name, hook_list);
//          // if dative is LIE_WORD then skip to next independentClause
//          if (((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] == LIE_WORD) {
//            exit = TRUE;
//          } else {
//            ++tablet_indexFinger;
//            burden_hook_list(tablet_size, tablet, &tablet_indexFinger,
//                             coded_name, hook_list);
//            // printf("coded_name burden2 %04X%04X%04X%04X\n",
//            //       (uint)((uint16_t *)&coded_name)[3],
//            //       (uint)((uint16_t *)&coded_name)[2],
//            //       (uint)((uint16_t *)&coded_name)[1],
//            //       (uint)((uint16_t *)&coded_name)[0]);
//            // printf("tablet_indexFinger %X\n", (uint)tablet_indexFinger);
//            --tablet_indexFinger;
//          }
//          break;
//        case DEONTIC_MOOD:
//          // quizing verb
//          word = ((uint16_t **)tablet)[tablet_number][tablet_indexFinger - 1];
//          ((uint16_t *)&coded_name)[VERB_INDEXFINGER] = word;
//          // printf("coded_name DEO %04X%04X%04X%04X\n",
//          //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
//          //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
//          // printf("realizing");
//          play((*coded_name), hook_list);
//          exit = TRUE;
//          break;
//        case REALIS_MOOD:
//          // quizing verb
//          word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger -
//          1];
//          ((uint16_t *)coded_name)[VERB_INDEXFINGER] = word;
//          // printf("coded_name REAL %04X%04X%04X%04X\n",
//          //       (uint)((uint16_t *)&coded_name)[3],
//          //       (uint)((uint16_t *)&coded_name)[2],
//          //       (uint)((uint16_t *)&coded_name)[1],
//          //       (uint)((uint16_t *)&coded_name)[0]);
//          // printf("realizing");
//          play((*coded_name), hook_list);
//          exit = TRUE;
//          break;
//        case ERROR_BINARY:
//          // agree(ERROR_BINARY != ERROR_BINARY);
//          break;
//        default:
//          // printf("tablet_indexFinger %X\n", (uint)tablet_indexFinger);
//          // agree(1 == 0); // indicated wrong point
//          break;
//        }
//      }
//      if (exit == TRUE)
//        break;
//    }
//    if (indicator == 1 || exit == TRUE)
//      break;
//  }
//  // agree(indicator == 1); /* must finish properly */
//  // quizing grammtical-case list
//  // printf("\n");
//}
// inline void play_text(const uint16_t max_tablet_size, const v16us *tablet,
//                      v4us *coded_name, v8us *hook_list) {
//  /*
//    identify independentClause tablet,
//    then pass to independentClause_play,
//    and so on until reach end.
//  */
//  uint16_t tablet_indexFinger = 0;
//  // agree(tablet != NULL);
//  // agree(max_tablet_size > 0);
//  // agree(coded_name != NULL);
//  // agree(hook_list != NULL);
//  for (; tablet_indexFinger < max_tablet_size; ++tablet_indexFinger) {
//    play_independentClause((uint8_t)(max_tablet_size - tablet_indexFinger),
//                           &tablet[tablet_indexFinger], coded_name,
//                           hook_list);
//  }
//}
//
// void quiz_program(const uint16_t quiz_independentClause_list_size,
//                  const v16us *restrict quiz_independentClause_list,
//                  const uint16_t program_size, const v16us *restrict program,
//                  uint16_t *program_worth) {
//  /* algorithm:
//    for each quiz independentClause feed the program inputs,
//      and if the output is correct then add one to the program_worth.
//  */
//  uint16_t worth = 0;
//  uint16_t quiz_independentClause_indexFinger;
//  uint8_t independentClause_size = 0;
//  v4us coded_name = {0, 0, 0, 0};
//  // uint8_t import_size = 0;
//  // uint8_t export_size = 0;
//  // uint8_t quiz_indexFinger = 0;
//  uint8_t brick_indexFinger = 1;
//  uint8_t list_indexFinger = 0;
//  v8us hook_list[HOOK_LIST_LONG] = {0};
//  v8us export_hook_list[HOOK_LIST_LONG] = {0};
//  // memset(hook_list, 0, HOOK_LIST_LONG * HOOK_LIST_THICK * WORD_THICK);
//  // memset(export_hook_list, 0, HOOK_LIST_LONG * HOOK_LIST_THICK *
//  WORD_THICK);
//  //  agree(quiz_independentClause_list_size > 0);
//  //  agree(quiz_independentClause_list != NULL);
//  //  agree(program_size > 0);
//  //  agree(program != NULL);
//  //  agree(program_worth != NULL);
//  for (quiz_independentClause_indexFinger = 0;
//       quiz_independentClause_indexFinger < quiz_independentClause_list_size;
//       ++quiz_independentClause_indexFinger) {
//    brick_indexFinger = 1;
//    // obtain_first_independentClause(); // for multi brick independentClauses
//    // printf("ITERATION %X\n", quiz_independentClause_indexFinger);
//    // memset((char *)&coded_name, 0, 8);
//    // memset(hook_list, 0, V8US_LONG * HOOK_LIST_LONG);
//    // memset(export_hook_list, 0, V8US_LONG * HOOK_LIST_LONG);
//    obtain_first_independentClause(
//        (uint16_t)(quiz_independentClause_list_size -
//                   quiz_independentClause_indexFinger),
//        quiz_independentClause_list + quiz_independentClause_indexFinger,
//        &independentClause_size);
//    // obtain_import
//    obtain_import(independentClause_size,
//                  quiz_independentClause_list +
//                      quiz_independentClause_indexFinger,
//                  &brick_indexFinger, &coded_name, hook_list);
//    // printf("hook_list: ");
//    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
//    // ++quiz_indexFinger) {
//    //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
//    //}
//    // printf("\n");
//    for (list_indexFinger = 0; list_indexFinger < HOOK_LIST_LONG;
//         ++list_indexFinger) {
//      export_hook_list[list_indexFinger] = hook_list[list_indexFinger];
//    }
//    // copy_randomAccessMemory((char *)&export_hook_list, (char *)&hook_list,
//    //       V8US_LONG * HOOK_LIST_LONG);
//    // obtain_export
//    // printf("pre export hook_list: ");
//    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
//    // ++quiz_indexFinger) {
//    //  printf("%04X ", (uint)export_hook_list[quiz_indexFinger][0]);
//    //}
//    // printf("\n");
//    ++brick_indexFinger;
//    // printf("brick_indexFinger %X\n", (uint)brick_indexFinger);
//    obtain_export(independentClause_size,
//                  quiz_independentClause_list +
//                      quiz_independentClause_indexFinger,
//                  &brick_indexFinger, &coded_name, export_hook_list);
//    // printf("export hook_list: ");
//    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
//    // ++quiz_indexFinger) {
//    //  printf("%04X ", (uint)export_hook_list[quiz_indexFinger][0]);
//    //}
//    // printf("\n");
//    // printf("coded_name burden3 %04X%04X%04X%04X\n",
//    // (uint)(coded_name)[3],
//    //        (uint)(coded_name)[2], (uint)(coded_name)[1],
//    //        (uint)(coded_name)[0]);
//    // play_program
//    play_text(program_size, program, &coded_name, hook_list);
//    // printf("hook_list-after: ");
//    // for (quiz_indexFinger = 0; quiz_indexFinger < HOOK_LIST_LONG;
//    // ++quiz_indexFinger) {
//    //  printf("%04X ", (uint)hook_list[quiz_indexFinger][0]);
//    //}
//    // printf("\n");
//    if (comparison_randomAccessMemory((char *)&export_hook_list,
//                                      (char *)&hook_list,
//                                      V8US_LONG * HOOK_LIST_LONG) == 0) {
//      ++worth;
//    }
//    // compare program_export to quiz_export
//  }
//  // printf("worth: %X\n", (uint)worth);
//  *program_worth = worth;
//}
//
// void quiz_population(const uint16_t quiz_independentClause_list_size,
//                     const v16us *restrict quiz_independentClause_list,
//                     const uint16_t program_size, const uint8_t
//                     population_size,
//                     const v16us *restrict population, uint8_t *champion,
//                     uint16_t *champion_worth) {
//  uint16_t program_worth = 0;
//  uint8_t program_number = 0;
//  //  agree(quiz_independentClause_list_size > 0);
//  //  agree(quiz_independentClause_list != NULL);
//  //  agree(program_size > 0);
//  // agree(population_size > 0);
//  // agree(population != NULL);
//  // agree(champion != NULL);
//  // agree(champion_worth != NULL);
//  for (; program_number < population_size; ++program_number) {
//    program_worth = 0;
//    quiz_program(quiz_independentClause_list_size,
//    quiz_independentClause_list,
//                 program_size, &population[program_number], &program_worth);
//    if (program_worth > *champion_worth) {
//      *champion = program_number;
//      *champion_worth = program_worth;
//    }
//  }
//}
