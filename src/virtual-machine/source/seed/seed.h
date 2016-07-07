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
#define MAX_LENGTH 0xFFU
#define SENTENCE_LENGTH 0xFF
#define WORD_LENGTH 0x05
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
#define BRICK_BYTE_LENGTH 0x20
#define BRICK_LENGTH 0x10
#define BRICK_WORD_LENGTH 0xF
#define MAX_SENTENCE_BRICK 0x4
#define QUOTE_INDICATOR 0x1D
#define SINGLE_BYTE_QUOTE 0x0
#define TWO_BYTE_QUOTE 0x1
#define FOUR_BYTE_QUOTE 0x2
#define EIGHT_BYTE_QUOTE 0x3
#define SIXTEEN_BYTE_QUOTE 0x4
#define SILENCE_GLYPH '.'
#define SILENCE_GLYPH_LENGTH 1

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
#define INSTRUMENTAL_CASE 0x93E
#define CONDITIONAL_MOOD 0X87E
#define QUOTE_WORD_LENGTH 2
#define MAX_GRAMMATICALCASE_INE_SENTENCE 8
#define HOOK_LIST_LENGTH 3
#define HOOK_LIST_WIDTH 8
#define VERB_SPOT 3
#define ACCUSATIVE_SPOT 2
#define INSTRUMENTAL_SPOT 1
#define DATIVE_SPOT 0

#define QUOTE_GRAMMAR_WORD 0x8BE  // wu
#define NUMBER_GRAMMAR_WORD 0x8DE // nu
#define SAY_VERB 0x6048           // hsin
#define SUBTRACTION_VERB 0xA2CD   // crut
#define INCREASE_VERB 0x8006      // nyis /* add */
#define EXCLUSIVEOR_VERB 0xA010
#define ANDOR_VERB 0x0150 // htam
#define NOT_VERB 0xE030   // hnic     /* with conditional ESS toffoli gate  */
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
// numbers
#define ZERO_WORD 0x62D4
#define ONE_WORD 0x6018
#define TWO_WORD 0xA20A
#define THREE_WORD 0x600A
#define FOUR_WORD 0xA210
#define FIVE_WORD 0x6124
#define SIX_WORD 0x80A2
#define SEVEN_WORD 0xE009
#define EIGHT_WORD 0xA12B
#define NINE_WORD 0x6226
#define TEN_WORD 0x810A
#define ELEVEN_WORD 0xE318
#define TWELVE_WORD 0xC10A
#define THIRTEEN_WORD 0x63CA
#define FOURTEEN_WORD 0x8410
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
/*#define NULL 0*/

extern void delete_empty_glyph(const uint16_t length, const char *letter,
                               uint16_t *fresh_length, char *neatLetter);
/*@unused@*/ extern void derive_first_word(const uint8_t length,
                                           const char *sentence,
                                           uint8_t *fresh_length, char *word);
extern void encode_ACC_word_PL(const uint8_t ACC_GEN_length,
                               const char *restrict ACC_sentence,
                               uint8_t *restrict DAT_GEN_length,
                               uint16_t *restrict DAT_encode_sentence,
                               uint8_t *restrict DAT_GEN_remainder);
/*@unused@*/ extern void encode_ACC_word_DAT_number(const uint8_t word_length,
                                                    const char *word,
                                                    uint16_t *number);

/*@unused@*/ extern void text_copy(const uint8_t length,
                                   const char *restrict ACC_text,
                                   char *restrict DAT_text);

/*@unused@*/ extern void brick_encode(const uint8_t encode_text_length,
                                      const uint16_t *encode_text,
                                      uint8_t *brick_length, uint16_t *brick,
                                      uint8_t *remainder);
/*@unused@*/ extern void sentence_encode(const uint16_t text_length,
                                         const char *text,
                                         uint8_t *brick_length, v16us *brick,
                                         uint16_t *remainder);
/*@unused@*/ extern void text_encode(const uint16_t text_length,
                                     const char *text, uint16_t *brick_length,
                                     v16us *brick, uint16_t *text_remainder);
/*@unused@*/ extern void realize(const v4us encoded_name, v8us *hook_list);
/*@unused@*/ extern void realize_sentence(const uint8_t brick_length,
                                          const v16us *brick,
                                          v4us *encoded_name, v8us *hook_list);
/*@unused@*/ extern void realize_text(const uint16_t brick_length,
                                      const v16us *brick, v4us *encoded_name,
                                      v8us *hook_list);
#endif
