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
#ifndef SEED_H
#define SEED_H

#define MAX_WRITE_MEMORY 0x8000 // GPU comput unit memory limit

#define WORD_WIDTH 2
#define GLOTTAL_STOP 0xC
#define MAX_SIZE 0xFFU
#define SENTENCE_SIZE 0xFF
#define WORD_SIZE 0x05
#define WRONG_BINARY 0
#define LONG_ROOT 1
#define SHORT_ROOT 2
#define LONG_GRAMMAR 3
#define SHORT_GRAMMAR 4
#define CONSONANT_ONE_WIDTH 5
#define CONSONANT_ONE_MASK 0x1F
#define BANNER_WIDTH 3
#define CONSONANT_TWO_WIDTH 3
#define VOWEL_WIDTH 3
#define TONE_WIDTH 2
#define BRICK_BYTE_SIZE 0x20
#define BRICK_SIZE 0x10
#define BRICK_WORD_SIZE 0xF
#define MAX_SENTENCE_BRICK 0x4
#define QUOTE_INDICATOR 0x1D
#define SINGLE_BYTE_QUOTE 0x0
#define TWO_BYTE_QUOTE 0x1
#define FOUR_BYTE_QUOTE 0x2
#define EIGHT_BYTE_QUOTE 0x3
#define SIXTEEN_BYTE_QUOTE 0x4
#define SILENCE_GLYPH '.'
#define SILENCE_GLYPH_SIZE 1

#define QUOTE_LITERAL_XOR_ADDRESS_SPOT 8
#define QUOTE_LITERAL 0
#define QUOTE_LITERAL_SPOT 8
#define QUOTE_ADDRESS 1
#define QUOTE_INTEGER_SPOT 9
#define QUOTE_GLYPH_WIDTH_SPOT 0xA
#define QUOTE_CLASS_SPOT 0xC

#define REALIS_MOOD 0x017E
#define DEONTIC_MOOD 0x095E
#define ACCUSATIVE_CASE 0x45E
#define DATIVE_CASE 0x49E
#define INSTRUMENTAL_CASE 0x05BE
#define CONDITIONAL_MOOD 0x87E
#define QUOTE_WORD_SIZE 2
#define MAX_GRAMMATICALCASE_INE_SENTENCE 8
#define HOOK_LIST_SIZE 3
#define HOOK_LIST_WIDTH 8
#define VERB_SPOT 3
#define ACCUSATIVE_SPOT 2
#define INSTRUMENTAL_SPOT 1
#define DATIVE_SPOT 0

#define QUOTE_GRAMMAR_WORD 0x0A3E  // bu
#define NUMBER_GRAMMAR_WORD 0x127E // do
#define SAY_VERB 0x6048            // hsin
#define SUBTRACTION_VERB 0xC450    // htof
#define INCREASE_VERB 0x8006       // nyis /* add */
#define EXCLUSIVEOR_VERB 0xA010
#define ANDOR_VERB 0x0130 // hnam
#define NOT_VERB 0xA130   // hnat     /* with conditional ESS toffoli gate  */
#define ABOVE_VERB 0xC118 // hyaf    /* shift above (left) */
#define DOWN_VERB 0x6068  // hcin     /* shift down (right) */
#define EXCHANGE_VERB 0x63AA // tcen /* with conditional ESS fredkin gate */
#define TEXT_WORD 0x822A     // twus
#define NUMBER_WORD 0xE130   // hnac
#define FLOAT_WORD 0xA26C    // flut
#define RATIONAL_WORD 0x640E // ryon
#define INTEGER_WORD 0xC24A  // tsuf
#define COMPLEX_WORD 0x8462  // klos

#define EQUAL_WORD 0x4124     // pwap
#define DIFFERENT_WORD 0x60AA // tcin
#define FACT_WORD 0x2160      // hfak
#define WRONG_WORD 0xA16D     // clat

#define TEXT_CLASS 0x0
#define NUMBER_CLASS 0x1
#define INTEGER_CLASS 0x2
#define FLOAT_CLASS 0x3
#define RATIONAL_CLASS 0x4
#define COMPLEX_CLASS 0x5

#define UNSIGNED_CHAR_QUOTE 0x009D
#define SIGNED_CHAR_QUOTE 0x029D
#define SHORT_NUMBER_QUOTE 0x143D
// numbers
#define ZERO_WORD 0x62D4  // zrun
#define ONE_WORD 0x6028   // hwin
#define TWO_WORD 0xA20A   // tyut
#define THREE_WORD 0x600A // tyin
#define FOUR_WORD 0xA260  // hfut
#define FIVE_WORD 0x612C  // fwan
#define SIX_WORD 0x80A2
#define SEVEN_WORD 0xE009
#define EIGHT_WORD 0xA106 // nyat
#define NINE_WORD 0x6226
#define TEN_WORD 0x810A
#define ELEVEN_WORD 0xE318
#define TWELVE_WORD 0xC10A
#define THIRTEEN_WORD 0x63CA
#define FOURTEEN_WORD 0x8410 // krot
#define FIFTEEN_WORD 0xE184
#define SIXTEEN_WORD 0x8448
#define SEVENTEEN_WORD 0xA309
#define EIGHTEEN_WORD 0xA398
#define NINETEEN_WORD 0x6053
#define TWENTY_WORD 0x804A

typedef unsigned int uint;
typedef int v4si __attribute__((vector_size(16)));
typedef uint8_t v16uc __attribute__((vector_size(16)));
typedef uint16_t v16us __attribute__((vector_size(32)));
typedef uint16_t v8us __attribute__((vector_size(16)));
typedef uint16_t v4us __attribute__((vector_size(8)));
#define V8US_SIZE 16
/*#define NULL 0*/

extern void delete_empty_glyph(const uint16_t size, const char *letter,
                               uint16_t *fresh_size, char *tidyLetter);
/*@unused@*/ extern void derive_first_word(const uint8_t size,
                                           const char *sentence,
                                           uint8_t *fresh_size, char *word);
extern void code_ACC_word_PL(const uint8_t ACC_GEN_size,
                             const char *restrict ACC_sentence,
                             uint8_t *restrict DAT_GEN_size,
                             uint16_t *restrict DAT_code_sentence,
                             uint8_t *restrict DAT_GEN_remainder);
/*@unused@*/ extern void code_ACC_word_DAT_number(const uint8_t word_size,
                                                  const char *word,
                                                  uint16_t *number);

/*@unused@*/ extern void text_copy(const uint8_t size,
                                   const char *restrict ACC_text,
                                   char *restrict DAT_text);

/*@unused@*/ extern void tablet_code(const uint8_t code_text_size,
                                     const uint16_t *code_text,
                                     uint8_t *tablet_size, uint16_t *tablet,
                                     uint8_t *remainder);
/*@unused@*/ extern void sentence_code(const uint16_t text_size,
                                       const char *text, uint8_t *tablet_size,
                                       v16us *tablet, uint16_t *remainder);
/*@unused@*/ extern void text_code(const uint16_t text_size, const char *text,
                                   uint16_t *tablet_size, v16us *tablet,
                                   uint16_t *text_remainder);
/*@unused@*/ extern void play(const v4us coded_name, v8us *hook_list);
/*@unused@*/ extern void burden_hook_list(const uint8_t tablet_size,
                                          const v16us *tablet,
                                          uint8_t *tablet_spot,
                                          v4us *coded_name, v8us *hook_list);
/*@unused@*/ extern void play_sentence(const uint8_t tablet_size,
                                       const v16us *tablet, v4us *coded_name,
                                       v8us *hook_list);
/*@unused@*/ extern void play_text(const uint16_t tablet_size,
                                   const v16us *tablet, v4us *coded_name,
                                   v8us *hook_list);
#endif
