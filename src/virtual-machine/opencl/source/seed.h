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

#ifdef __APPLE__
#include <OpenCL/opencl.h>
#else
#include <CL/cl.h>
#endif
#define MAX_WRITE_MEMORY 0x8000 // GPU comput unit memory limit

#define WORD_THICK 2
#define GLOTTAL_STOP 0xC
#define MAX_LONG 0xFFU
#define INDEPENDENTCLAUSE_LONG 0xFF
#define WORD_LONG 0x05
#define ERROR_BINARY 0
#define LONG_ROOT 1
#define SHORT_ROOT 2
#define LONG_GRAMMAR 3
#define SHORT_GRAMMAR 4
#define CONSONANT_ONE_THICK 5
#define CONSONANT_ONE_MASK 0x1F
#define BANNER_THICK 3
#define CONSONANT_TWO_THICK 3
#define VOWEL_THICK 3
#define TONE_THICK 2
#define TABLET_BYTE_LONG 0x20
#define TABLET_LONG 0x10
#define TABLET_WORD_LONG 0xF
#define MAX_INDEPENDENTCLAUSE_TABLET 0x4
#define QUOTED_REFERENTIAL 0x1D
#define SINGLE_BYTE_QUOTED 0x0
#define TWO_BYTE_QUOTED 0x1
#define FOUR_BYTE_QUOTED 0x2
#define EIGHT_BYTE_QUOTED 0x3
#define SIXTEEN_BYTE_QUOTED 0x4
#define SILENCE_GLYPH '.'
#define SILENCE_GLYPH_LONG 1

#define QUOTED_LITERAL_XOR_ADDRESS_INDEXFINGER 8
#define QUOTED_LITERAL 0
#define QUOTED_LITERAL_INDEXFINGER 8
#define QUOTED_ADDRESS 1
#define QUOTED_INTEGER_INDEXFINGER 9
#define QUOTED_GLYPH_THICK_INDEXFINGER 0xA
#define QUOTED_CLASS_INDEXFINGER 0xC

#define TRUE 1
#define FALSE 0
#define REALIS_MOOD 0x017E
#define DEONTIC_MOOD 0x095E
#define CONDITIONAL_MOOD 0x9BE
#define COUNTERFACTUAL_CONDITIONAL_MOOD 0x159E
#define ACCUSATIVE_CASE 0x45E
#define DATIVE_CASE 0x007E
#define INSTRUMENTAL_CASE 0x087E
#define QUOTED_WORD_LONG 2
#define MAX_GRAMMATICALCASE_INE_INDEPENDENTCLAUSE 8
#define HOOK_LIST_LONG 3
#define HOOK_LIST_THICK 8
#define VERB_INDEXFINGER 3
#define ACCUSATIVE_INDEXFINGER 2
#define INSTRUMENTAL_INDEXFINGER 1
#define DATIVE_INDEXFINGER 0

#define QUOTED_GRAMMAR_WORD 0x0A3E // bu
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
#define TRUTH_WORD 0x6109     // syan
#define LIE_WORD 0x600D       // cyin
#define ERROR_WORD 0xE4CD     // croc

#define TEXT_CLASS 0x0
#define NUMBER_CLASS 0x1
#define INTEGER_CLASS 0x2
#define FLOAT_CLASS 0x3
#define RATIONAL_CLASS 0x4
#define COMPLEX_CLASS 0x5

#define UNSIGNED_CHAR_QUOTED 0x009D
#define SIGNED_CHAR_QUOTED 0x029D
#define SHORT_NUMBER_QUOTED 0x143D
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
typedef cl_uchar uint8_t;
typedef cl_ushort uint16_t;
typedef cl_uint uint32_t;
typedef cl_ulong uint64_t;
typedef cl_short4 v4si;
typedef cl_uchar16 v16uc;
typedef cl_ushort16 v16us;
typedef cl_ushort8 v8us;
typedef cl_ushort4 v4us;
#define V8US_LONG 16
/*#define NULL 0*/

void delete_empty_glyph(const uint16_t size, const char *letter,
                        uint16_t *fresh_size, char *tidyLetter);
void derive_first_word(const uint8_t size, const char *independentClause,
                       uint8_t *fresh_size, char *word);
void code_ACC_word_PL(const uint8_t ACC_GEN_size,
                      const char *ACC_independentClause, uint8_t *DAT_GEN_size,
                      uint16_t *DAT_code_independentClause,
                      uint8_t *DAT_GEN_remainder);
void code_ACC_word_DAT_number(const uint8_t word_size, const char *word,
                              uint16_t *number);

void text_copy(const uint8_t size, const char *ACC_text, char *DAT_text);

void tablet_code(const uint8_t code_text_size, const uint16_t *code_text,
                 uint8_t *tablet_size, uint16_t *tablet, uint8_t *remainder);
void independentClause_code(const uint16_t text_size, const char *text,
                            uint8_t *tablet_size, v16us *tablet,
                            uint16_t *remainder);
void text_code(const uint16_t text_size, const char *text,
               uint16_t *tablet_size, v16us *tablet, uint16_t *text_remainder);
void play(const v4us coded_name, v8us *hook_list);
void burden_hook_list(const uint8_t tablet_size, const v16us *tablet,
                      uint8_t *tablet_indexFinger, v4us *coded_name,
                      v8us *hook_list);
void play_independentClause(const uint8_t tablet_size, const v16us *tablet,
                            v4us *coded_name, v8us *hook_list);
void play_text(const uint16_t tablet_size, const v16us *tablet,
               v4us *coded_name, v8us *hook_list);
#endif
