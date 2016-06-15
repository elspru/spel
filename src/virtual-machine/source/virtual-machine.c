/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"

#define MAXIMUM_PAPER_LENGTH 0x1000

static void encode_check() {
  /* testing encode_ACC_word_DAT_number */
  const char *long_root = "tcan";
  const char *short_root = "hlep";
  const char *long_grammar = "br6h";
  const char *short_grammar = "du";
  const char *long_tone_root = "bza_n";
  const char *short_tone_root = "h1e7c";
  const char *long_tone_grammar = "br6_h";
  const char *short_tone_grammar = "du7";
  uint8_t length = 4;
  uint16_t number = 0;
  /* LONG_ROOT */
  encode_ACC_word_DAT_number(long_root, length, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x19EA);
  /* SHORT_ROOT */
  encode_ACC_word_DAT_number(short_root, length, &number);
  // printf("short_root %X\n", (unsigned int) number);
  assert(number == 0x1358);
  /* LONG_GRAMMAR */
  encode_ACC_word_DAT_number(long_grammar, length, &number);
  // printf("long_grammar %X\n", (unsigned int) number);
  assert(number == 0x298F);
  /* SHORT_GRAMMAR */
  length = 2;
  encode_ACC_word_DAT_number(short_grammar, length, &number);
  // printf("short_grammar %X\n", (unsigned int) number);
  assert(number == 0xA7E);
  /* LONG_TONE_ROOT */
  length = 5;
  encode_ACC_word_DAT_number(long_tone_root, length, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x7171);
  /* SHORT_TONE_ROOT */
  encode_ACC_word_DAT_number(short_tone_root, length, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x6BD8);
  /* LONG_TONE_GRAMMAR */
  encode_ACC_word_DAT_number(long_tone_grammar, length, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0xA98F);
  /* SHORT_TONE_GRAMMAR */
  length = 3;
  encode_ACC_word_DAT_number(short_tone_grammar, length, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x2A7E);
  printf("%s%s\n", "NOM encode_ACC_word_DAT_number PFV check ESS success",
         " REAL");
}

static void delete_empty_glyph_check() {
  const char *text = "tcat ca clah kxih";
  const uint16_t length = (uint16_t)strlen(text);
  char DAT_text[SENTENCE_LENGTH];
  uint16_t DAT_GEN_length = SENTENCE_LENGTH;
  memset(DAT_text, 0, SENTENCE_LENGTH);
  /* testing delete empty glyph */
  delete_empty_glyph(text, length, DAT_text, &DAT_GEN_length);
  // printf("%s\n", DAT_text);
  assert(strcmp(DAT_text, "tcatcaclahkxih") == 0);
  assert(DAT_GEN_length == 14);
  printf("NOM delete empty glyph PFV check ESS success REAL\n");
}

static void derive_first_word_check() {
  /* testing derive_first word */
  const char *text = "tcatcaclahkxih";
  const uint8_t length = (uint8_t)strlen(text);
  char DAT_word[WORD_LENGTH + 1];
  uint8_t DAT_word_GEN_length = (uint8_t)WORD_LENGTH;
  memset(DAT_word, 0, WORD_LENGTH + 1);
  derive_first_word(text, length, DAT_word, &DAT_word_GEN_length);
  // printf("%s\n", DAT_word);
  assert(strcmp(DAT_word, "tcat") == 0);
  assert(DAT_word_GEN_length == (uint8_t)4);
  printf("NOM derive first word PFV check ESS success REAL\n");
}

static void encode_word_PL_check() {
  const char text[] = "tcinkahtutsuhkakpanyiktutcin";
  const uint8_t text_length = (uint8_t)strlen(text);
  uint16_t encode_sentence[SENTENCE_LENGTH / WORD_LENGTH];
  uint8_t encode_sentence_length = SENTENCE_LENGTH / WORD_LENGTH;
  uint8_t remainder = 0;
  uint8_t i = 0;
  memset(encode_sentence, 0, encode_sentence_length);
  encode_ACC_word_PL(text, text_length, encode_sentence,
                     &encode_sentence_length, &remainder);
  printf("encode_word_PL %X remainder %X \n",
         (unsigned int)encode_sentence_length, (unsigned int)remainder);
  for (i = 0; i < encode_sentence_length; i++) {
    printf("0x%04X ", (unsigned int)encode_sentence[i]);
  }
  printf("\n");
}

static void lump_encode_check() {
  const char text[] = "wukahtutsuhkakpanyiktu";
  const uint8_t text_length = (uint8_t)strlen(text);
  uint16_t encode_sentence[SENTENCE_LENGTH / WORD_LENGTH];
  uint8_t encode_sentence_length = SENTENCE_LENGTH / WORD_LENGTH;
  uint8_t remainder = 0;
  uint16_t lump[LUMP_WORD_LENGTH * MAX_SENTENCE_LUMP];
  uint8_t lump_length = LUMP_WORD_LENGTH * MAX_SENTENCE_LUMP;
  uint8_t i = 0;
  memset(encode_sentence, 0, (uint8_t)(encode_sentence_length * WORD_WIDTH));
  memset(lump, 0, (uint8_t)(lump_length * WORD_WIDTH));
  encode_ACC_word_PL(text, text_length, encode_sentence,
                     &encode_sentence_length, &remainder);
  printf("encode_word_PL %X remainder %X \n",
         (unsigned int)encode_sentence_length, (unsigned int)remainder);
  lump_encode(encode_sentence, encode_sentence_length, lump, &lump_length,
              &remainder);
  printf("lump_length %X remainder %X \n", (unsigned int)lump_length,
         (unsigned int)remainder);
  for (i = 0; i < lump_length; i++) {
    printf("0x%X ", (unsigned int)lump[i]);
  }
  printf("\n");
}

//static void read_paper(const char *file_name,
//       const size_t paper_number, char *paper_storage,
//       uint16_t *paper_length) {
//   FILE *file_spot = NULL;
//   int answer = 0;
//   uint16_t text_spot = 0;
//   uint16_t length = 0;
//   int glyph = (char) 0;
//   assert(file_name != 0);
//   assert(strlen(file_name) > 0);
//   assert(paper_storage != NULL);
//   assert(*paper_length >= MAXIMUM_PAPER_LENGTH);
//   file_spot = fopen(file_name, "r");
//   assert(file_spot != NULL);
//   if (file_spot != NULL) {
//       answer = fseek(file_spot,
//               (int) paper_number*MAXIMUM_PAPER_LENGTH,
//               SEEK_SET);
//       //assert(answer == 0);
//       if (answer == 0) {
//           length = (uint16_t) (fread(paper_storage,
//               MAXIMUM_PAPER_LENGTH, 1, file_spot));
//           if (length != 0) {
//               length = (uint16_t)(length *
//                   MAXIMUM_PAPER_LENGTH);
//           } else {
//               answer = fseek(file_spot, (int)
//                   paper_number*MAXIMUM_PAPER_LENGTH,
//                   SEEK_SET);
//               assert(answer == 0);
//               for (text_spot = 0; text_spot <
//                   MAXIMUM_PAPER_LENGTH; ++text_spot) {
//                   glyph = fgetc(file_spot);
//                   if (glyph == EOF) break;
//                   paper_storage[text_spot] = (char) glyph;
//                   ++length;
//               }
//           }
//           //printf("%X length \n", (unsigned int) length);
//       } else {
//           printf("fseek fail PFV");
//           length = 0;
//       }
//       answer = fclose(file_spot);
//       assert(answer == 0);
//   } else {
//       printf("file open fail PFV");
//       length = 0;
//   }
//   *paper_length = length;
//   //assert(*paper_length != 0);
//}

//static void full_encode_check() {
//  //const char text[] = "hyinkahtutsuhkakpanyiktuclathfak";
//  //const uint8_t text_length = (uint8_t)strlen(text);
//  char paper_storage[MAXIMUM_PAPER_LENGTH+1];
//  uint16_t paper_length = 0;
//  uint16_t paper_number = 0;
//  uint16_t encode_sentence[0x100/2];
//  uint8_t encode_sentence_length = 0x100/2;
//  uint8_t remainder = 0;
//  uint8_t i = 0;
//  uint16_t paper_spot = 0;
//  uint8_t text_length = 0;
//  memset(encode_sentence, 0, encode_sentence_length);
//
//  for (; paper_number < 0x1000; ++paper_number) {
//    paper_length = MAXIMUM_PAPER_LENGTH+1;
//    read_paper("check/check.pyac", paper_number, paper_storage,
//              &paper_length);
//    printf("paper_length %X\n", (unsigned int) paper_length);
//    if (paper_length == 0) break;
//    for (paper_spot = 0; paper_spot < paper_length;) {
//      if (paper_length - paper_spot < 0xFF) {
//        text_length = (uint8_t) (paper_length - paper_spot);
//      } else {
//        text_length = 0xFF;
//      }
//        encode_ACC_word_PL(paper_storage + paper_spot, text_length, 
//                          encode_sentence, &encode_sentence_length, &remainder);
//      paper_spot = (uint16_t) (paper_spot + text_length - remainder);
//      printf("encode_word_PL %X remainder %X \n",
//             (unsigned int)encode_sentence_length, (unsigned int)remainder);
//      for (i = 0; i < encode_sentence_length; i++) {
//        printf("0x%X ", (unsigned int)encode_sentence[i]);
//      }
//    }
//    printf("\n");
//  }
//}

static void check_quote(v16us *restrict lump, uint8_t *lump_length) {
  const char text[] = "pwapyu wu.tsus.hello world!\n.tsus.wuka hsintu";
  const uint16_t text_length = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t lump_spot = 0;
  sentence_encode(text, text_length, lump, lump_length, &remainder);
  for (lump_spot = 0; lump_spot < text_length; ++lump_spot) {
    printf("%X ", (unsigned int)text[lump_spot]);
  }
  printf(": text\n");
  for (lump_spot = 0; lump_spot < LUMP_LENGTH; ++lump_spot) {
    printf("%X ", (unsigned int)lump[0][lump_spot]);
  }
  printf(": lump");
}

static void check_text(v16us *restrict lump, uint16_t *lump_length) {
  const char text[] = "zrunnuka hyinnusu nyistu "
                      "pwapyu wu.tsus.hello world!\n.tsus.wuka hsintu";
  const uint16_t text_length = (uint16_t)strlen(text);
  printf("text_length %X\n",(unsigned int)text_length);
  uint16_t remainder = 0;
  uint8_t lump_spot = 0;
  printf("check_text \n");
  text_encode(text, text_length, lump, lump_length, &remainder);
  //for (lump_spot = 0; lump_spot < text_length; ++lump_spot) {
  //  printf("%X ", (unsigned int)text[lump_spot]);
  //}
  //printf(": text\n");
  for (lump_spot = 0; lump_spot < (*lump_length * LUMP_LENGTH); 
       ++lump_spot) {
    printf("%X ", (unsigned int)lump[0][lump_spot]);
  }
  printf(":lump\n");
}

static void check_hello_world(const v16us *restrict lump,
                              const uint8_t lump_length) {
  uint8_t check_spot = 0;
  v4us encoded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, (HOOK_LIST_WIDTH * HOOK_LIST_LENGTH * WORD_WIDTH));
  realize_sentence(lump, lump_length, &encoded_name, hook_list);

  // checking encoded name
  printf("encoded_name at end ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (unsigned int)encoded_name[check_spot]);
  }
  printf("\n");
  // checking hook list
  printf("hook_list ");
  for (check_spot = 0; check_spot < HOOK_LIST_LENGTH * HOOK_LIST_WIDTH;
       ++check_spot) {
    printf(" %X", (unsigned int)hook_list[0][check_spot]);
  }
  printf("\n");
  /* next have to figure out the memory architecture,
      have to pass it something like 256Bytes,
      which will contain the input, that wil become output,
      that's enough for 16, 16byte register slots in each,
      or 8 32byte width slots.
      one can have the verb that external program is supposed
      to execute, such as IO operations.
      output could be form of a sentence, which could point
      to shared memory block if there is output that doesn't
      fit in the sentence.
      this is useful if there is an error, or if there is an
      kernel-interrupt such as IO operation required.
      otherwise for things that simply output a value,
      can have the dative pointer showing location of output*/
}

static void check_ACC_all() {
  uint8_t lump_length = MAX_SENTENCE_LUMP;
  v16us lump[MAX_SENTENCE_LUMP];
  uint16_t lump_two_length = MAX_SENTENCE_LUMP * 2;
  v16us lump_two[MAX_SENTENCE_LUMP * 2];
  memset(lump, 0, (uint8_t)(lump_length * WORD_WIDTH * LUMP_LENGTH));
  memset(lump_two, 0, (uint16_t)(lump_two_length * WORD_WIDTH * LUMP_LENGTH));
  delete_empty_glyph_check();
  derive_first_word_check();
  encode_check();
  printf("encode_word_PL_check:\n");
  lump_encode_check();
  /* full encode check */
  // full_encode_check(); /* deprecated implementation */
  //printf("full encode check\n");
  //full_encode_check();
  check_quote(lump, &lump_length);
  printf("----\n");
  check_hello_world(lump, lump_length);
  check_text(lump_two, &lump_two_length);
  encode_word_PL_check();
}

int main(int argc, char *argv[]) {
  // const float floater = 0.3;
  // float floater2 = 0;
  // uint8_t floatStr[4] = "    ";
  assert(argc > 0);
  assert(argv != NULL);
  check_ACC_all();
  // memcpy(floatStr, (const char *) &floater, sizeof(floater));
  // memcpy((char *) &floater2, floatStr, sizeof(floater));
  // printf("floater2 %f\n", (double) floater2);
  return 0;
}
