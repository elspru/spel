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
  // printf("%X\n", (uint) number);
  assert(number == 0x61AA);
  /* SHORT_ROOT */
  encode_ACC_word_DAT_number(length, short_root, &number);
  // printf("short_root %X\n", (uint) number);
  assert(number == 0x4358);
  /* LONG_GRAMMAR */
  encode_ACC_word_DAT_number(length, long_grammar, &number);
  // printf("long_grammar %X\n", (uint) number);
  assert(number == 0x2E8F);
  /* SHORT_GRAMMAR */
  length = 2;
  encode_ACC_word_DAT_number(length, short_grammar, &number);
  // printf("short_grammar %X\n", (uint) number);
  assert(number == 0xA7E);
  /* LONG_TONE_ROOT */
  length = 5;
  encode_ACC_word_DAT_number(length, long_tone_root, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0x7151);
  /* SHORT_TONE_ROOT */
  encode_ACC_word_DAT_number(length, short_tone_root, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0xEBD8);
  /* LONG_TONE_GRAMMAR */
  encode_ACC_word_DAT_number(length, long_tone_grammar, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0xAE8F);
  /* SHORT_TONE_GRAMMAR */
  length = 3;
  encode_ACC_word_DAT_number(length, short_tone_grammar, &number);
  // printf("%X\n", (uint) number);
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
  printf("encode_word_PL %X remainder %X \n", (uint)encode_sentence_length,
         (uint)remainder);
  for (i = 0; i < encode_sentence_length; i++) {
    printf("0x%04X ", (uint)encode_sentence[i]);
  }
  printf("\n");
}

static void brick_encode_check() {
  const char text[] = "wukahtutsuhkakpanyiktu";
  const uint8_t text_length = (uint8_t)strlen(text);
  uint16_t encode_sentence[SENTENCE_LENGTH / WORD_LENGTH];
  uint8_t encode_sentence_length = SENTENCE_LENGTH / WORD_LENGTH;
  uint8_t remainder = 0;
  uint16_t brick[BRICK_WORD_LENGTH * MAX_SENTENCE_BRICK];
  uint8_t brick_length = BRICK_WORD_LENGTH * MAX_SENTENCE_BRICK;
  uint8_t i = 0;
  memset(encode_sentence, 0, (uint8_t)(encode_sentence_length * WORD_WIDTH));
  memset(brick, 0, (uint8_t)(brick_length * WORD_WIDTH));
  encode_ACC_word_PL(text_length, text, &encode_sentence_length,
                     encode_sentence, &remainder);
  printf("encode_word_PL %X remainder %X \n", (uint)encode_sentence_length,
         (uint)remainder);
  brick_encode(encode_sentence_length, encode_sentence, &brick_length, brick,
               &remainder);
  printf("brick_length %X remainder %X \n", (uint)brick_length,
         (uint)remainder);
  for (i = 0; i < brick_length; i++) {
    printf("0x%X ", (uint)brick[i]);
  }
  printf("\n");
}

static void read_paper(const char *file_name, const size_t paper_number,
                       uint16_t *paper_length, char *paper_storage) {
  FILE *file_spot = NULL;
  int answer = 0;
  uint16_t text_spot = 0;
  uint16_t length = 0;
  int glyph = (char)0;
  assert(file_name != 0);
  assert(strlen(file_name) > 0);
  assert(paper_storage != NULL);
  assert(*paper_length >= MAXIMUM_PAPER_LENGTH);
  file_spot = fopen(file_name, "r");
  assert(file_spot != NULL);
  if (file_spot != NULL) {
    answer =
        fseek(file_spot, (int)paper_number * MAXIMUM_PAPER_LENGTH, SEEK_SET);
    // assert(answer == 0);
    if (answer == 0) {
      length =
          (uint16_t)(fread(paper_storage, MAXIMUM_PAPER_LENGTH, 1, file_spot));
      if (length != 0) {
        length = (uint16_t)(length * MAXIMUM_PAPER_LENGTH);
      } else {
        answer = fseek(file_spot, (int)paper_number * MAXIMUM_PAPER_LENGTH,
                       SEEK_SET);
        assert(answer == 0);
        for (text_spot = 0; text_spot < MAXIMUM_PAPER_LENGTH; ++text_spot) {
          glyph = fgetc(file_spot);
          if (glyph == EOF)
            break;
          paper_storage[text_spot] = (char)glyph;
          ++length;
        }
      }
      // printf("%X length \n", (uint) length);
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
  // assert(*paper_length != 0);
}

// static void write_paper(const char *file_name,
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
  // const char text[] = "hyinkahtutsuhkakpanyiktuclathfak";
  // const uint8_t text_length = (uint8_t)strlen(text);
  char paper[MAXIMUM_PAPER_LENGTH + WORD_LENGTH + 1];
  uint16_t paper_length = 0;
  uint16_t paper_number = 0;
  uint16_t encode_sentence[0x100 / 2];
  uint8_t encode_sentence_length = 0x100 / 2;
  uint16_t paper_spot = 0;
  uint8_t word_length_start = WORD_LENGTH;
  uint8_t word_length = WORD_LENGTH;
  uint16_t number = 0;
  char word[WORD_LENGTH + 1];
  FILE *outfile;
  outfile = fopen("check/check-out.txt", "w+");
  memset(encode_sentence, 0, encode_sentence_length);
  memset(paper, 0, MAXIMUM_PAPER_LENGTH + WORD_LENGTH + 1);
  for (; paper_number < 0x1000; ++paper_number) {
    // printf("paper_number 0x%04X\n", (uint) paper_number);
    paper_length = MAXIMUM_PAPER_LENGTH;
    read_paper("check/check.pyac", paper_number, &paper_length,
               paper + paper_spot);
    if (paper_length == 0)
      break;
    // printf("paper_spot %X\n", (uint) paper_spot);
    paper_length = (uint16_t)(paper_spot + paper_length);
    paper_spot = 0;
    // printf("paper_length %X\n", (uint) paper_length);
    // printf("paper glyph %02X \n", (uint) paper[0]);
    if (paper_length == 0)
      break;
    assert(paper_length < MAXIMUM_PAPER_LENGTH + WORD_LENGTH);
    for (paper_spot = 0; paper_spot < paper_length; ++paper_spot) {
      if (paper_length - paper_spot > WORD_LENGTH) {
        word_length_start = WORD_LENGTH;
      } else {
        word_length_start = (uint8_t)(paper_length - paper_spot);
      }
      word_length = WORD_LENGTH;
      memset(word, 0, WORD_LENGTH + 1);
      derive_first_word(word_length_start, paper + paper_spot, &word_length,
                        word);
      assert(word_length > 0 || paper_length - paper_spot < WORD_LENGTH);
      if (word_length == 0) { // copy remainder to start of paper and exit loop
        text_copy((uint8_t)(paper_length - paper_spot), paper + paper_spot,
                  paper);
        // printf("paper_spot %04X paper_length %04X\n", (uint) paper_spot,
        //      (uint) paper_length);
        paper_spot = (uint16_t)(paper_length - paper_spot);
        break;
      }
      // printf("word_length %X ", (uint) word_length);
      // if (word_length == 4) { printf("\n word %s \n", word); }
      // printf("paper_spot %04X paper_length %04X\n", (uint) paper_spot,
      //       (uint) paper_length);
      encode_ACC_word_DAT_number(word_length, word, &number);
      fprintf(outfile, "0x%04X %s \n", (uint)number, word);
      number = 0;
      paper_spot = (uint16_t)(paper_spot + word_length - 1);
    }
    if (paper_spot == paper_length) {
      paper_spot = 0;
    }
  }
  fclose(outfile);
}

static void check_quote(v16us *restrict brick, uint8_t *brick_length) {
  const char text[] = "bu.twus.hello world!\n.twus.buka hsintu";
  const uint16_t text_length = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t brick_spot = 0;
  sentence_encode(text_length, text, brick_length, brick, &remainder);
  for (brick_spot = 0; brick_spot < text_length; ++brick_spot) {
    printf("%X ", (uint)text[brick_spot]);
  }
  printf(": text\n");
  for (brick_spot = 0; brick_spot < BRICK_LENGTH; ++brick_spot) {
    printf("%X ", (uint)brick[0][brick_spot]);
  }
  printf(": brick");
}

static void check_text(v16us *restrict brick, uint16_t *brick_length) {
  const char text[] = //"zrunnuka hyindosu nyistu "
      "pwapyu bu.twus.hello world!\n.twus.buka hsintu";

  const uint16_t text_length = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t brick_spot = 0;
  printf("check_text \n");
  // printf("text_length %X\n",(uint)text_length);
  text_encode(text_length, text, brick_length, brick, &remainder);
  // for (brick_spot = 0; brick_spot < text_length; ++brick_spot) {
  //  printf("%X ", (uint)text[brick_spot]);
  //}
  // printf(": text\n");
  printf("check_text brick start \n");
  for (brick_spot = 0; brick_spot < (*brick_length * BRICK_LENGTH);
       ++brick_spot) {
    if (brick_spot % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)brick[0][brick_spot]);
  }
  printf("\n:brick check_text\n");
}
static void check_realize_text(const v16us *restrict brick,
                               const uint16_t brick_length) {
  uint8_t check_spot = 0;
  v4us encoded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, (HOOK_LIST_WIDTH * HOOK_LIST_LENGTH * WORD_WIDTH));
  realize_text(brick_length, brick, &encoded_name, hook_list);

  printf("brick ");
  for (check_spot = 0; check_spot < brick_length * BRICK_LENGTH; ++check_spot) {
    printf(" %X", (uint)brick[0][check_spot]);
  }
  printf("\n");
  // checking encoded name
  printf("encoded_name at end ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (uint)encoded_name[check_spot]);
  }
  printf("\n");
  // checking hook list
  printf("hook_list ");
  for (check_spot = 0; check_spot < HOOK_LIST_LENGTH * HOOK_LIST_WIDTH;
       ++check_spot) {
    printf(" %X", (uint)hook_list[0][check_spot]);
  }
  printf("\n");
}

static void check_hello_world(const v16us *restrict brick,
                              const uint8_t brick_length) {
  uint8_t check_spot = 0;
  v4us encoded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LENGTH];
  memset(hook_list, 0, (HOOK_LIST_WIDTH * HOOK_LIST_LENGTH * WORD_WIDTH));
  printf("encoded_name at start ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (uint)encoded_name[check_spot]);
  }
  realize_sentence(brick_length, brick, &encoded_name, hook_list);

  // checking encoded name
  printf("encoded_name at end ");
  for (check_spot = 0; check_spot < 4; ++check_spot) {
    printf(" %X", (uint)encoded_name[check_spot]);
  }
  printf("\n");
  // checking brick
  printf("brick ");
  for (check_spot = 0; check_spot < brick_length * BRICK_LENGTH; ++check_spot) {
    printf(" %X", (uint)brick[0][check_spot]);
  }
  printf("\n");
  // checking hook list
  printf("hook_list ");
  for (check_spot = 0; check_spot < HOOK_LIST_LENGTH * HOOK_LIST_WIDTH;
       ++check_spot) {
    printf(" %X", (uint)hook_list[0][check_spot]);
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
  uint8_t brick_length = MAX_SENTENCE_BRICK;
  v16us brick[MAX_SENTENCE_BRICK];
  uint16_t brick_two_length = MAX_SENTENCE_BRICK * 2;
  v16us brick_two[MAX_SENTENCE_BRICK * 2];
  memset(brick, 0, (uint8_t)(brick_length * WORD_WIDTH * BRICK_LENGTH));
  memset(brick_two, 0,
         (uint16_t)(brick_two_length * WORD_WIDTH * BRICK_LENGTH));
  full_encode_check();
  delete_empty_glyph_check();
  derive_first_word_check();
  encode_check();
  printf("encode_word_PL_check:\n");
  brick_encode_check();
  /* full encode check */
  // full_encode_check(); /* deprecated implementation */
  // printf("full encode check\n");
  check_quote(brick, &brick_length);
  printf("check_hello_world\n");
  check_hello_world(brick, brick_length);
  // printf("check_text\n");
  check_text(brick_two, &brick_two_length);
  printf("CRT check_realize_text\n");
  check_realize_text(brick_two, brick_two_length);
  printf("ECRT end check_realize_text\n");
  encode_word_PL_check();
}

static void check_programmer() {
  const char *activity_elements_text = "nyistu cruttu hnattu htamtu";
  const uint16_t activity_elements_text_length =
      (uint16_t)(strlen(activity_elements_text));
  const char *check_sentence_list_text =
      "zrundoka hyindocayu hyindokali"
      "hyindoka tyutdocayu tyindokali"
      "tyutdoka tyutdocayu hkutdokali"
      "bu.hnac.2.hnac.buka bu.hnac.2.hnac.buca yu "
      "bu.hnac.4.hnac.bukali";
  const uint16_t check_sentence_list_text_length =
      (uint16_t)strlen(check_sentence_list_text);
  uint16_t check_sentence_list_length = 8;
  v16us check_sentence_list[8];
  uint16_t activity_elements_length = MAX_SENTENCE_BRICK * 1;
  v16us activity_elements[MAX_SENTENCE_BRICK * 1];
  uint16_t text_remainder = 0;
  uint16_t plan_worth = 0;
  const uint16_t plan_length = 1;
  uint64_t random_seed = 0x1;
  uint16_t brick_spot = 0;
  v16us plan;
  memset(check_sentence_list, 0,
         (size_t)(check_sentence_list_length * BRICK_LENGTH * WORD_WIDTH));
  text_encode(activity_elements_text_length, activity_elements_text,
              &activity_elements_length, activity_elements, &text_remainder);
  assert(text_remainder == 0);
  text_encode(check_sentence_list_text_length, check_sentence_list_text,
              &check_sentence_list_length, check_sentence_list,
              &text_remainder);
  printf("check_programmer brick start \n");
  for (brick_spot = 0; brick_spot < (check_sentence_list_length * BRICK_LENGTH);
       ++brick_spot) {
    if (brick_spot % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)check_sentence_list[0][brick_spot]);
  }
  printf("\n:brick\n");
  create_plan((uint8_t)activity_elements_length, activity_elements, plan_length,
              &random_seed, &plan);
  printf("plan %04X random_seed %08X\n", (uint)plan[1], (uint)(random_seed));
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
