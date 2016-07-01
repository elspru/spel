/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"
#include "machine_programmer/programmer.h"

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
  encode_ACC_word_DAT_number(length, long_root, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x61AA);
  /* SHORT_ROOT */
  encode_ACC_word_DAT_number(length, short_root, &number);
  // printf("short_root %X\n", (unsigned int) number);
  assert(number == 0x4358);
  /* LONG_GRAMMAR */
  encode_ACC_word_DAT_number(length, long_grammar, &number);
  // printf("long_grammar %X\n", (unsigned int) number);
  assert(number == 0x2E8F);
  /* SHORT_GRAMMAR */
  length = 2;
  encode_ACC_word_DAT_number(length, short_grammar, &number);
  // printf("short_grammar %X\n", (unsigned int) number);
  assert(number == 0xA7E);
  /* LONG_TONE_ROOT */
  length = 5;
  encode_ACC_word_DAT_number(length, long_tone_root, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0x7151);
  /* SHORT_TONE_ROOT */
  encode_ACC_word_DAT_number(length, short_tone_root, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0xEBD8);
  /* LONG_TONE_GRAMMAR */
  encode_ACC_word_DAT_number(length, long_tone_grammar, &number);
  // printf("%X\n", (unsigned int) number);
  assert(number == 0xAE8F);
  /* SHORT_TONE_GRAMMAR */
  length = 3;
  encode_ACC_word_DAT_number(length, short_tone_grammar, &number);
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
  delete_empty_glyph(length, text, &DAT_GEN_length, DAT_text);
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
  derive_first_word(length, text, &DAT_word_GEN_length, DAT_word);
  // printf("%s\n", DAT_word);
  assert(strcmp(DAT_word, "tcat") == 0);
  assert(DAT_word_GEN_length == (uint8_t)4);
  printf("NOM derive first word PFV check ESS success REAL\n");
}

static void encode_word_PL_check() {
  const char text[] = "zrunhyintyuttyinnu"
                      "ksatpwankcissyicnu"
                      "lwatnwuntyashyecnu"
                      "tyaftrenhkospfinnu"
                      "hsossyethdetdzinnu"
                      "tsis";
  const uint8_t text_length = (uint8_t)strlen(text);
  uint16_t encode_sentence[SENTENCE_LENGTH / WORD_LENGTH];
  uint8_t encode_sentence_length = SENTENCE_LENGTH / WORD_LENGTH;
  uint8_t remainder = 0;
  uint8_t i = 0;
  memset(encode_sentence, 0, encode_sentence_length);
  encode_ACC_word_PL(text_length, text, &encode_sentence_length,
                     encode_sentence, &remainder);
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
  encode_ACC_word_PL(text_length, text, &encode_sentence_length,
                     encode_sentence, &remainder);
  printf("encode_word_PL %X remainder %X \n",
         (unsigned int)encode_sentence_length, (unsigned int)remainder);
  lump_encode(encode_sentence_length, encode_sentence, &lump_length, lump,
              &remainder);
  printf("lump_length %X remainder %X \n", (unsigned int)lump_length,
         (unsigned int)remainder);
  for (i = 0; i < lump_length; i++) {
    printf("0x%X ", (unsigned int)lump[i]);
  }
  printf("\n");
}

static void read_paper(const char *file_name,
                       const size_t paper_number, 
                       uint16_t *paper_length,
                       char *paper_storage) {
   FILE *file_spot = NULL;
   int answer = 0;
   uint16_t text_spot = 0;
   uint16_t length = 0;
   int glyph = (char) 0;
   assert(file_name != 0);
   assert(strlen(file_name) > 0);
   assert(paper_storage != NULL);
   assert(*paper_length >= MAXIMUM_PAPER_LENGTH);
   file_spot = fopen(file_name, "r");
   assert(file_spot != NULL);
   if (file_spot != NULL) {
       answer = fseek(file_spot,
               (int) paper_number*MAXIMUM_PAPER_LENGTH,
               SEEK_SET);
       //assert(answer == 0);
       if (answer == 0) {
           length = (uint16_t) (fread(paper_storage,
               MAXIMUM_PAPER_LENGTH, 1, file_spot));
           if (length != 0) {
               length = (uint16_t)(length *
                   MAXIMUM_PAPER_LENGTH);
           } else {
               answer = fseek(file_spot, (int)
                   paper_number*MAXIMUM_PAPER_LENGTH,
                   SEEK_SET);
               assert(answer == 0);
               for (text_spot = 0; text_spot <
                   MAXIMUM_PAPER_LENGTH; ++text_spot) {
                   glyph = fgetc(file_spot);
                   if (glyph == EOF) break;
                   paper_storage[text_spot] = (char) glyph;
                   ++length;
               }
           }
           //printf("%X length \n", (unsigned int) length);
       } else {
           printf("fseek fail PFV");
           length = 0;
       }
       answer = fclose(file_spot);
       assert(answer == 0);
   } else {
       printf("file open fail PFV");
       length = 0;
   }
   *paper_length = length;
   //assert(*paper_length != 0);
}

//static void write_paper(const char *file_name,
//                        const size_t paper_number, 
//                        uint16_t paper_length,
//                        char *paper_storage) {
//   FILE *file_spot = NULL;
//   int answer = 0;
//   uint16_t length = 0;
//   assert(file_name != 0);
//   assert(strlen(file_name) > 0);
//   assert(paper_storage != NULL);
//   assert(paper_length <= MAXIMUM_PAPER_LENGTH);
//   file_spot = fopen(file_name, "w");
//   assert(file_spot != NULL);
//   if (file_spot != NULL) {
//       answer = fseek(file_spot,
//                      (int) paper_number*MAXIMUM_PAPER_LENGTH,
//                      SEEK_SET);
//       //assert(answer == 0);
//       if (answer == 0) {
//           length = (uint16_t) (fwrite(paper_storage,
//               paper_length, 1, file_spot));
//           if (length != paper_length) {
//            printf("write to file failed");
//           }
//           
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
//}

static void full_encode_check() {
  //const char text[] = "hyinkahtutsuhkakpanyiktuclathfak";
  //const uint8_t text_length = (uint8_t)strlen(text);
  char paper[MAXIMUM_PAPER_LENGTH+WORD_LENGTH+1];
  uint16_t paper_length = 0;
  uint16_t paper_number = 0;
  uint16_t encode_sentence[0x100/2];
  uint8_t encode_sentence_length = 0x100/2;
  uint16_t paper_spot = 0;
  uint8_t word_length_start = WORD_LENGTH;
  uint8_t word_length = WORD_LENGTH;
  uint16_t number = 0;
  char word[WORD_LENGTH + 1];
  FILE * outfile;
  outfile = fopen("check/check-out.txt", "w+");
  memset(encode_sentence, 0, encode_sentence_length);
    memset(paper, 0, MAXIMUM_PAPER_LENGTH+WORD_LENGTH+1);
  for (; paper_number < 0x1000; ++paper_number) {
    //printf("paper_number 0x%04X\n", (unsigned int) paper_number);
    paper_length = MAXIMUM_PAPER_LENGTH;
    read_paper("check/check.pyac", paper_number, &paper_length, paper +
               paper_spot);
    if (paper_length == 0) break;
    //printf("paper_spot %X\n", (unsigned int) paper_spot);
    paper_length = (uint16_t)(paper_spot + paper_length);
    paper_spot = 0;
    //printf("paper_length %X\n", (unsigned int) paper_length);
    //printf("paper glyph %02X \n", (unsigned int) paper[0]);
    if (paper_length == 0) break;
    assert(paper_length <  MAXIMUM_PAPER_LENGTH + WORD_LENGTH);
    for (paper_spot = 0; paper_spot < paper_length; ++paper_spot) {
      if (paper_length - paper_spot > WORD_LENGTH) {
        word_length_start = WORD_LENGTH;
      } else {
        word_length_start = (uint8_t)(paper_length - paper_spot);
      }
      word_length = WORD_LENGTH;
      memset(word, 0, WORD_LENGTH + 1);
      derive_first_word(word_length_start, paper + paper_spot,
                        &word_length, word);
      assert(word_length > 0 || paper_length - paper_spot < WORD_LENGTH);
      if (word_length == 0) {// copy remainder to start of paper and exit loop
        text_copy((uint8_t)(paper_length - paper_spot), paper + paper_spot,
                 paper);
      //printf("paper_spot %04X paper_length %04X\n", (unsigned int) paper_spot,
      //      (unsigned int) paper_length);
        paper_spot = (uint16_t)(paper_length - paper_spot);
        break;
      }
      //printf("word_length %X ", (unsigned int) word_length);
      //if (word_length == 4) { printf("\n word %s \n", word); }
      //printf("paper_spot %04X paper_length %04X\n", (unsigned int) paper_spot,
      //       (unsigned int) paper_length);
      encode_ACC_word_DAT_number(word_length, word, &number);
      fprintf(outfile, "0x%04X %s \n", (unsigned int) number, word);
      number = 0;
      paper_spot = (uint16_t)(paper_spot + word_length - 1);
    }
    if (paper_spot == paper_length) {
      paper_spot = 0;
    }
  }
  fclose(outfile);
}

static void check_quote(v16us *restrict lump, uint8_t *lump_length) {
  const char text[] = "wu.twus.hello world!\n.twus.wuka hsintu";
  const uint16_t text_length = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t lump_spot = 0;
  sentence_encode(text_length, text, lump_length, lump, &remainder);
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
  const char text[] = //"zrunnuka hyinnusu nyistu " 
                      "pwapyu wu.twus.hello world!\n.twus.wuka hsintu";
                      
  const uint16_t text_length = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t lump_spot = 0;
  printf("check_text \n");
  //printf("text_length %X\n",(unsigned int)text_length);
  text_encode(text_length, text, lump_length, lump, &remainder);
  //for (lump_spot = 0; lump_spot < text_length; ++lump_spot) {
  //  printf("%X ", (unsigned int)text[lump_spot]);
  //}
  //printf(": text\n");
  printf("lump start \n");
  for (lump_spot = 0; lump_spot < (*lump_length * LUMP_LENGTH); 
       ++lump_spot) {
    if (lump_spot % 0x10 == 0) printf("\n");
    printf("%04X ", (unsigned int)lump[0][lump_spot]);
  }
  printf("\n:lump\n");
}
static void check_realize_text(const v16us *restrict lump,
                              const uint16_t lump_length) {
  uint8_t check_spot = 0;
  v4us encoded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, (HOOK_LIST_WIDTH * HOOK_LIST_LENGTH * WORD_WIDTH));
  realize_text(lump_length, lump, &encoded_name, hook_list);

  printf("lump ");
  for (check_spot = 0; check_spot < lump_length * LUMP_LENGTH;
       ++check_spot) {
    printf(" %X", (unsigned int)lump[0][check_spot]);
  }
  printf("\n");
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
}

static void check_hello_world(const v16us *restrict lump,
                              const uint8_t lump_length) {
  uint8_t check_spot = 0;
  v4us encoded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, (HOOK_LIST_WIDTH * HOOK_LIST_LENGTH * WORD_WIDTH));
  printf("encoded_name at start ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (unsigned int)encoded_name[check_spot]);
  }
  realize_sentence(lump_length, lump, &encoded_name, hook_list);

  // checking encoded name
  printf("encoded_name at end ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (unsigned int)encoded_name[check_spot]);
  }
  printf("\n");
  // checking lump
  printf("lump ");
  for (check_spot = 0; check_spot < lump_length * LUMP_LENGTH;
       ++check_spot) {
    printf(" %X", (unsigned int)lump[0][check_spot]);
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
  full_encode_check();
  delete_empty_glyph_check();
  derive_first_word_check();
  encode_check();
  printf("encode_word_PL_check:\n");
  lump_encode_check();
  /* full encode check */
  // full_encode_check(); /* deprecated implementation */
  //printf("full encode check\n");
  check_quote(lump, &lump_length);
  printf("check_hello_world\n");
  check_hello_world(lump, lump_length);
  //printf("check_text\n");
  check_text(lump_two, &lump_two_length);
  //printf("check_realize_text\n");
  check_realize_text(lump_two, lump_two_length);
  encode_word_PL_check();
}

static void check_programmer() {
  const char* activity_elements_text = "nyistu cruttu hnictu htamtu";
  const uint16_t activity_elements_text_length = 
                   (uint16_t)(strlen(activity_elements_text));
  const char* check_sentence_list_text = //"zrunnuka hyinnusu hyinnupa nyistu"
                                         //"hyinnuka tyutnusu tyinnupa nyistu"
                                         //"tyutnuka tyutnusu hkutnupa nyistu";
       // "wu.twus.hello world!.twus.wuka nyistu";
                      " wu.twus.hello world!\n.twus.wuka hsintu";
  const uint16_t check_sentence_list_text_length = 
                   (uint16_t)strlen(check_sentence_list_text);
  uint16_t check_sentence_list_length = 8;
  v16us check_sentence_list[8];
  uint16_t activity_elements_length = MAX_SENTENCE_LUMP*1;
  v16us activity_elements[MAX_SENTENCE_LUMP*1];
  uint16_t text_remainder = 0;
  uint16_t plan_worth = 0;
  const uint16_t plan_length = 1;
  uint64_t random_seed = 0x1;
  v16us plan;
  text_encode(activity_elements_text_length, activity_elements_text,
      &activity_elements_length, activity_elements, &text_remainder);
  assert(text_remainder == 0);
  text_encode(check_sentence_list_text_length, check_sentence_list_text,
      &check_sentence_list_length, check_sentence_list, &text_remainder);
  create_plan((uint8_t) activity_elements_length, activity_elements, 
              plan_length, &random_seed, &plan);
  printf("plan %04X random_seed %08X\n", (unsigned int) plan[1], (unsigned int)
         (random_seed));
  check_plan(check_sentence_list_length, check_sentence_list, plan_length,
                &plan, &plan_worth);
  
}

int main(int argc, char *argv[]) {
  // const float floater = 0.3;
  // float floater2 = 0;
  // uint8_t floatStr[4] = "    ";
  assert(argc > 0);
  assert(argv != NULL);
  check_ACC_all();
  check_programmer();
  // memcpy(floatStr, (const char *) &floater, sizeof(floater));
  // memcpy((char *) &floater2, floatStr, sizeof(floater));
  // printf("floater2 %f\n", (double) floater2);
  return 0;
}
