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

#include "machine_programmer/programmer.h"
#include "seed/seed.h"
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

#define MAXIMUM_PAPER_LONG 0x1000

static void code_quiz() {
  /* testing code_ACC_word_DAT_number */
  const char *long_root = "tcan";
  const char *short_root = "hlep";
  const char *long_grammar = "br6h";
  const char *short_grammar = "du";
  const char *long_tone_root = "bza_n";
  const char *short_tone_root = "h1e7c";
  const char *long_tone_grammar = "br6_h";
  const char *short_tone_grammar = "du7";
  uint8_t size = 4;
  uint16_t number = 0;
  /* LONG_ROOT */
  code_ACC_word_DAT_number(size, long_root, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0x61AA);
  /* SHORT_ROOT */
  code_ACC_word_DAT_number(size, short_root, &number);
  // printf("short_root %X\n", (uint) number);
  assert(number == 0x4358);
  /* LONG_GRAMMAR */
  code_ACC_word_DAT_number(size, long_grammar, &number);
  // printf("long_grammar %X\n", (uint) number);
  assert(number == 0x2E8F);
  /* SHORT_GRAMMAR */
  size = 2;
  code_ACC_word_DAT_number(size, short_grammar, &number);
  // printf("short_grammar %X\n", (uint) number);
  assert(number == 0xA7E);
  /* LONG_TONE_ROOT */
  size = 5;
  code_ACC_word_DAT_number(size, long_tone_root, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0x7151);
  /* SHORT_TONE_ROOT */
  code_ACC_word_DAT_number(size, short_tone_root, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0xEBD8);
  /* LONG_TONE_GRAMMAR */
  code_ACC_word_DAT_number(size, long_tone_grammar, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0xAE8F);
  /* SHORT_TONE_GRAMMAR */
  size = 3;
  code_ACC_word_DAT_number(size, short_tone_grammar, &number);
  // printf("%X\n", (uint) number);
  assert(number == 0x2A7E);
  printf("%s%s\n", "NOM code_ACC_word_DAT_number PFV quiz ESS success",
         " REAL");
}

static void delete_empty_glyph_quiz() {
  const char *text = "tcat ca clah kxih";
  const uint16_t size = (uint16_t)strlen(text);
  char DAT_text[INDEPENDENTCLAUSE_LONG];
  uint16_t DAT_GEN_size = INDEPENDENTCLAUSE_LONG;
  memset(DAT_text, 0, INDEPENDENTCLAUSE_LONG);
  /* testing delete empty glyph */
  delete_empty_glyph(size, text, &DAT_GEN_size, DAT_text);
  // printf("%s\n", DAT_text);
  assert(strcmp(DAT_text, "tcatcaclahkxih") == 0);
  assert(DAT_GEN_size == 14);
  printf("NOM delete empty glyph PFV quiz ESS success REAL\n");
}

static void derive_first_word_quiz() {
  /* testing derive_first word */
  const char *text = "tcatcaclahkxih";
  const uint8_t size = (uint8_t)strlen(text);
  char DAT_word[WORD_LONG + 1];
  uint8_t DAT_word_GEN_size = (uint8_t)WORD_LONG;
  memset(DAT_word, 0, WORD_LONG + 1);
  derive_first_word(size, text, &DAT_word_GEN_size, DAT_word);
  // printf("%s\n", DAT_word);
  assert(strcmp(DAT_word, "tcat") == 0);
  assert(DAT_word_GEN_size == (uint8_t)4);
  printf("NOM derive first word PFV quiz ESS success REAL\n");
}

static void code_word_PL_quiz() {
  const char text[] = "zrunhyintyuttyinnu"
                      "ksatpwankcissyicnu"
                      "lwatnwuntyashyecnu"
                      "tyaftrenhkospfinnu"
                      "hsossyethdetdzinnu"
                      "tsis";
  const uint8_t text_size = (uint8_t)strlen(text);
  uint16_t code_independentClause[INDEPENDENTCLAUSE_LONG / WORD_LONG];
  uint8_t code_independentClause_size = INDEPENDENTCLAUSE_LONG / WORD_LONG;
  uint8_t remainder = 0;
  uint8_t i = 0;
  memset(code_independentClause, 0, code_independentClause_size);
  code_ACC_word_PL(text_size, text, &code_independentClause_size,
                   code_independentClause, &remainder);
  printf("code_word_PL %X remainder %X \n", (uint)code_independentClause_size,
         (uint)remainder);
  for (i = 0; i < code_independentClause_size; i++) {
    printf("0x%04X ", (uint)code_independentClause[i]);
  }
  printf("\n");
}

static void tablet_code_quiz() {
  const char text[] = "wukahtutsuhkakpanyiktu";
  const uint8_t text_size = (uint8_t)strlen(text);
  uint16_t code_independentClause[INDEPENDENTCLAUSE_LONG / WORD_LONG];
  uint8_t code_independentClause_size = INDEPENDENTCLAUSE_LONG / WORD_LONG;
  uint8_t remainder = 0;
  uint16_t tablet[TABLET_WORD_LONG * MAX_INDEPENDENTCLAUSE_TABLET];
  uint8_t tablet_size = TABLET_WORD_LONG * MAX_INDEPENDENTCLAUSE_TABLET;
  uint8_t i = 0;
  memset(code_independentClause, 0,
         (uint8_t)(code_independentClause_size * WORD_THICK));
  memset(tablet, 0, (uint8_t)(tablet_size * WORD_THICK));
  code_ACC_word_PL(text_size, text, &code_independentClause_size,
                   code_independentClause, &remainder);
  printf("code_word_PL %X remainder %X \n", (uint)code_independentClause_size,
         (uint)remainder);
  tablet_code(code_independentClause_size, code_independentClause, &tablet_size,
              tablet, &remainder);
  printf("tablet_size %X remainder %X \n", (uint)tablet_size, (uint)remainder);
  for (i = 0; i < tablet_size; i++) {
    printf("0x%X ", (uint)tablet[i]);
  }
  printf("\n");
}

static void read_paper(const char *file_name, const size_t paper_number,
                       uint16_t *paper_size, char *paper_storage) {
  FILE *file_spot = NULL;
  int answer = 0;
  uint16_t text_spot = 0;
  uint16_t size = 0;
  int glyph = (char)0;
  assert(file_name != 0);
  assert(strlen(file_name) > 0);
  assert(paper_storage != NULL);
  assert(*paper_size >= MAXIMUM_PAPER_LONG);
  file_spot = fopen(file_name, "r");
  assert(file_spot != NULL);
  if (file_spot != NULL) {
    answer = fseek(file_spot, (int)paper_number * MAXIMUM_PAPER_LONG, SEEK_SET);
    // assert(answer == 0);
    if (answer == 0) {
      size = (uint16_t)(fread(paper_storage, MAXIMUM_PAPER_LONG, 1, file_spot));
      if (size != 0) {
        size = (uint16_t)(size * MAXIMUM_PAPER_LONG);
      } else {
        answer =
            fseek(file_spot, (int)paper_number * MAXIMUM_PAPER_LONG, SEEK_SET);
        assert(answer == 0);
        for (text_spot = 0; text_spot < MAXIMUM_PAPER_LONG; ++text_spot) {
          glyph = fgetc(file_spot);
          if (glyph == EOF)
            break;
          paper_storage[text_spot] = (char)glyph;
          ++size;
        }
      }
      // printf("%X size \n", (uint) size);
    } else {
      printf("fseek fail PFV");
      size = 0;
    }
    answer = fclose(file_spot);
    assert(answer == 0);
  } else {
    printf("file open fail PFV");
    size = 0;
  }
  *paper_size = size;
  // assert(*paper_size != 0);
}

// static void write_paper(const char *file_name,
//                        const size_t paper_number,
//                        uint16_t paper_size,
//                        char *paper_storage) {
//   FILE *file_spot = NULL;
//   int answer = 0;
//   uint16_t size = 0;
//   assert(file_name != 0);
//   assert(strlen(file_name) > 0);
//   assert(paper_storage != NULL);
//   assert(paper_size <= MAXIMUM_PAPER_LONG);
//   file_spot = fopen(file_name, "w");
//   assert(file_spot != NULL);
//   if (file_spot != NULL) {
//       answer = fseek(file_spot,
//                      (int) paper_number*MAXIMUM_PAPER_LONG,
//                      SEEK_SET);
//       //assert(answer == 0);
//       if (answer == 0) {
//           size = (uint16_t) (fwrite(paper_storage,
//               paper_size, 1, file_spot));
//           if (size != paper_size) {
//            printf("write to file failed");
//           }
//
//       } else {
//           printf("fseek fail PFV");
//           size = 0;
//       }
//       answer = fclose(file_spot);
//       assert(answer == 0);
//   } else {
//       printf("file open fail PFV");
//       size = 0;
//   }
//}

static void full_code_quiz() {
  // const char text[] = "hyinkahtutsuhkakpanyiktuclathfak";
  // const uint8_t text_size = (uint8_t)strlen(text);
  char paper[MAXIMUM_PAPER_LONG + WORD_LONG + 1];
  uint16_t paper_size = 0;
  uint16_t paper_number = 0;
  uint16_t code_independentClause[0x100 / 2];
  uint8_t code_independentClause_size = 0x100 / 2;
  uint16_t paper_spot = 0;
  uint8_t word_size_start = WORD_LONG;
  uint8_t word_size = WORD_LONG;
  uint16_t number = 0;
  char word[WORD_LONG + 1];
  FILE *outfile;
  outfile = fopen("quiz/quiz-out.txt", "w+");
  memset(code_independentClause, 0, code_independentClause_size);
  memset(paper, 0, MAXIMUM_PAPER_LONG + WORD_LONG + 1);
  for (; paper_number < 0x1000; ++paper_number) {
    // printf("paper_number 0x%04X\n", (uint) paper_number);
    paper_size = MAXIMUM_PAPER_LONG;
    read_paper("quiz/quiz.pyac", paper_number, &paper_size, paper + paper_spot);
    if (paper_size == 0)
      break;
    // printf("paper_spot %X\n", (uint) paper_spot);
    paper_size = (uint16_t)(paper_spot + paper_size);
    paper_spot = 0;
    // printf("paper_size %X\n", (uint) paper_size);
    // printf("paper glyph %02X \n", (uint) paper[0]);
    if (paper_size == 0)
      break;
    assert(paper_size < MAXIMUM_PAPER_LONG + WORD_LONG);
    for (paper_spot = 0; paper_spot < paper_size; ++paper_spot) {
      if (paper_size - paper_spot > WORD_LONG) {
        word_size_start = WORD_LONG;
      } else {
        word_size_start = (uint8_t)(paper_size - paper_spot);
      }
      word_size = WORD_LONG;
      memset(word, 0, WORD_LONG + 1);
      derive_first_word(word_size_start, paper + paper_spot, &word_size, word);
      assert(word_size > 0 || paper_size - paper_spot < WORD_LONG);
      if (word_size == 0) { // copy remainder to start of paper and exit loop
        text_copy((uint8_t)(paper_size - paper_spot), paper + paper_spot,
                  paper);
        // printf("paper_spot %04X paper_size %04X\n", (uint) paper_spot,
        //      (uint) paper_size);
        paper_spot = (uint16_t)(paper_size - paper_spot);
        break;
      }
      // printf("word_size %X ", (uint) word_size);
      // if (word_size == 4) { printf("\n word %s \n", word); }
      // printf("paper_spot %04X paper_size %04X\n", (uint) paper_spot,
      //       (uint) paper_size);
      code_ACC_word_DAT_number(word_size, word, &number);
      fprintf(outfile, "0x%04X %s \n", (uint)number, word);
      number = 0;
      paper_spot = (uint16_t)(paper_spot + word_size - 1);
    }
    if (paper_spot == paper_size) {
      paper_spot = 0;
    }
  }
  fclose(outfile);
}

static void quiz_quote(v16us *restrict tablet, uint8_t *tablet_size) {
  const char text[] = "bu.twus.hello world!\n.twus.buka hsintu";
  const uint16_t text_size = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t tablet_spot = 0;
  independentClause_code(text_size, text, tablet_size, tablet, &remainder);
  for (tablet_spot = 0; tablet_spot < text_size; ++tablet_spot) {
    printf("%X ", (uint)text[tablet_spot]);
  }
  printf(": text\n");
  for (tablet_spot = 0; tablet_spot < TABLET_LONG; ++tablet_spot) {
    printf("%X ", (uint)tablet[0][tablet_spot]);
  }
  printf(": tablet");
}

static void quiz_text(v16us *restrict tablet, uint16_t *tablet_size) {
  const char text[] = //"zrunnuka hyindosu nyistu "
      "pwapyu bu.twus.hello world!\n.twus.buka hsintu";

  const uint16_t text_size = (uint16_t)strlen(text);
  uint16_t remainder = 0;
  uint8_t tablet_spot = 0;
  printf("quiz_text \n");
  // printf("text_size %X\n",(uint)text_size);
  text_code(text_size, text, tablet_size, tablet, &remainder);
  // for (tablet_spot = 0; tablet_spot < text_size; ++tablet_spot) {
  //  printf("%X ", (uint)text[tablet_spot]);
  //}
  // printf(": text\n");
  printf("quiz_text tablet start \n");
  for (tablet_spot = 0; tablet_spot < (*tablet_size * TABLET_LONG);
       ++tablet_spot) {
    if (tablet_spot % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)tablet[0][tablet_spot]);
  }
  printf("\n:tablet quiz_text\n");
}
static void quiz_play_text(const v16us *restrict tablet,
                           const uint16_t tablet_size) {
  uint8_t quiz_spot = 0;
  v4us coded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LONG];
  memset(hook_list, 0, (HOOK_LIST_THICK * HOOK_LIST_LONG * WORD_THICK));
  play_text(tablet_size, tablet, &coded_name, hook_list);

  printf("tablet ");
  for (quiz_spot = 0; quiz_spot < tablet_size * TABLET_LONG; ++quiz_spot) {
    printf(" %X", (uint)tablet[0][quiz_spot]);
  }
  printf("\n");
  // quizing coded name
  printf("coded_name at end ");
  for (quiz_spot = 0; quiz_spot < 4; ++quiz_spot) {
    printf(" %X", (uint)coded_name[quiz_spot]);
  }
  printf("\n");
  // quizing hook list
  printf("hook_list ");
  for (quiz_spot = 0; quiz_spot < HOOK_LIST_LONG * HOOK_LIST_THICK;
       ++quiz_spot) {
    printf(" %X", (uint)hook_list[0][quiz_spot]);
  }
  printf("\n");
}

static void quiz_hello_world(const v16us *restrict tablet,
                             const uint8_t tablet_size) {
  uint8_t quiz_spot = 0;
  v4us coded_name = {0, 0, 0, 0};
  v8us hook_list[HOOK_LIST_LONG];
  memset(hook_list, 0, (HOOK_LIST_THICK * HOOK_LIST_LONG * WORD_THICK));
  printf("coded_name at start ");
  for (quiz_spot = 0; quiz_spot < 4; ++quiz_spot) {
    printf(" %X", (uint)coded_name[quiz_spot]);
  }
  play_independentClause(tablet_size, tablet, &coded_name, hook_list);

  // quizing coded name
  printf("coded_name at end ");
  for (quiz_spot = 0; quiz_spot < 4; ++quiz_spot) {
    printf(" %X", (uint)coded_name[quiz_spot]);
  }
  printf("\n");
  // quizing tablet
  printf("tablet ");
  for (quiz_spot = 0; quiz_spot < tablet_size * TABLET_LONG; ++quiz_spot) {
    printf(" %X", (uint)tablet[0][quiz_spot]);
  }
  printf("\n");
  // quizing hook list
  printf("hook_list ");
  for (quiz_spot = 0; quiz_spot < HOOK_LIST_LONG * HOOK_LIST_THICK;
       ++quiz_spot) {
    printf(" %X", (uint)hook_list[0][quiz_spot]);
  }
  printf("\n");
  /* next have to figure out the memory architecture,
      have to pass it something like 256Bytes,
      which will contain the input, that wil become output,
      that's enough for 16, 16byte register slots in each,
      or 8 32byte width slots.
      one can have the verb that external program is supposed
      to execute, such as IO operations.
      output could be form of a independentClause, which could point
      to shared memory block if there is output that doesn't
      fit in the independentClause.
      this is useful if there is an error, or if there is an
      kernel-interrupt such as IO operation required.
      otherwise for things that simply output a value,
      can have the dative pointer showing location of output*/
}

static void quiz_ACC_all() {
  uint8_t tablet_size = MAX_INDEPENDENTCLAUSE_TABLET;
  v16us tablet[MAX_INDEPENDENTCLAUSE_TABLET];
  uint16_t tablet_two_size = MAX_INDEPENDENTCLAUSE_TABLET * 2;
  v16us tablet_two[MAX_INDEPENDENTCLAUSE_TABLET * 2];
  memset(tablet, 0, (uint8_t)(tablet_size * WORD_THICK * TABLET_LONG));
  memset(tablet_two, 0, (uint16_t)(tablet_two_size * WORD_THICK * TABLET_LONG));
  full_code_quiz();
  delete_empty_glyph_quiz();
  derive_first_word_quiz();
  code_quiz();
  printf("code_word_PL_quiz:\n");
  tablet_code_quiz();
  /* full code quiz */
  // full_code_quiz(); /* deprecated implementation */
  // printf("full code quiz\n");
  quiz_quote(tablet, &tablet_size);
  printf("quiz_hello_world\n");
  quiz_hello_world(tablet, tablet_size);
  // printf("quiz_text\n");
  quiz_text(tablet_two, &tablet_two_size);
  printf("CRT quiz_play_text\n");
  quiz_play_text(tablet_two, tablet_two_size);
  printf("ECRT end quiz_play_text\n");
  code_word_PL_quiz();
}

static void quiz_programmer() {
  const char *activity_atom_text = "nyistu htoftu hnattu hnamtu";
  const uint16_t activity_atom_text_size =
      (uint16_t)(strlen(activity_atom_text));
  const char *quiz_independentClause_list_text =
      "zrundoka hwindocayu hwindokali"
      "hwindoka tyutdocayu tyindokali"
      "tyutdoka tyutdocayu hfutdokali"
      "tyindoka fwandocayu nyatdokali";
  //"bu.hnac.2.hnac.buka bu.hnac.2.hnac.buca yu "
  //"bu.hnac.4.hnac.bukali";
  const uint16_t quiz_independentClause_list_text_size =
      (uint16_t)strlen(quiz_independentClause_list_text);
  uint16_t quiz_independentClause_list_size = 4;
  v16us quiz_independentClause_list[8];
  uint16_t activity_atom_size = MAX_INDEPENDENTCLAUSE_TABLET * 1;
  v16us activity_atom[MAX_INDEPENDENTCLAUSE_TABLET * 1];
  uint16_t text_remainder = 0;
  uint16_t program_worth = 0;
  const uint16_t program_size = 1;
  uint64_t random_seed = 0x123456789ABCDEF;
  uint16_t tablet_spot = 0;
  uint8_t population_size = 4;
  uint8_t champion = 0;
  uint16_t champion_worth = 0;
  v16us program = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
  v16us population[4] = {{0}, {0}, {0}, {0}};
  // memset(activity_atom, 0, MAX_INDEPENDENTCLAUSE_TABLET * TABLET_BYTE_LONG);
  memset(quiz_independentClause_list, 0,
         (size_t)(quiz_independentClause_list_size * TABLET_LONG * WORD_THICK));
  text_code(activity_atom_text_size, activity_atom_text, &activity_atom_size,
            activity_atom, &text_remainder);
  assert(text_remainder == 0);
  text_code(quiz_independentClause_list_text_size,
            quiz_independentClause_list_text, &quiz_independentClause_list_size,
            quiz_independentClause_list, &text_remainder);
  printf("quiz_programmer tablet start \n");
  for (tablet_spot = 0;
       tablet_spot < (quiz_independentClause_list_size * TABLET_LONG);
       ++tablet_spot) {
    if (tablet_spot % 0x10 == 0)
      printf("\n");
    printf("%04X ", (uint)quiz_independentClause_list[0][tablet_spot]);
  }
  printf("\n:tablet\n");
  composition_program((uint8_t)activity_atom_size, activity_atom, program_size,
                      &random_seed, &program);
  printf("program %04X random_seed %08X\n", (uint)program[1],
         (uint)(random_seed));
  quiz_program(quiz_independentClause_list_size, quiz_independentClause_list,
               program_size, &program, &program_worth);
  composition_population((uint8_t)activity_atom_size, activity_atom,
                         program_size, population_size, &random_seed,
                         population);
  printf("random_seed %08X\n", (uint)(random_seed));
  quiz_population(quiz_independentClause_list_size, quiz_independentClause_list,
                  program_size, population_size, population, &champion,
                  &champion_worth);
  printf("champion %02X champion_worth %04X \n", (uint)(champion),
         (uint)champion_worth);
}

int main(int argc, char *argv[]) {
  // const float floater = 0.3;
  // float floater2 = 0;
  // uint8_t floatStr[4] = "    ";
  assert(argc > 0);
  assert(argv != NULL);
  quiz_ACC_all();
  quiz_programmer();
  // memcpy(floatStr, (const char *) &floater, sizeof(floater));
  // memcpy((char *) &floater2, floatStr, sizeof(floater));
  // printf("floater2 %f\n", (double) floater2);
  return 0;
}
