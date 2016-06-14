#ifndef _SEED_H
#define _SEED_H

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
#define LUMP_BYTE_LENGTH 0x20
#define LUMP_LENGTH 0x10
#define LUMP_WORD_LENGTH 0xF
#define MAX_SENTENCE_LUMP 0x4
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
#define QUOTE_ADDRESS 1
#define QUOTE_INTEGER_SPOT 9
#define QUOTE_GLYPH_WIDTH_SPOT 0xA
#define QUOTE_CLASS_SPOT 0xC

#define DEONTIC_MOOD 0x95E
#define ACCUSATIVE_CASE 0x45E
#define DATIVE_CASE 0x49E
#define INSTRUMENTAL_CASE 0x93E
#define CONDITIONAL_MOOD 0X87E
#define QUOTE_WORD 0x8BE
#define QUOTE_WORD_LENGTH 2
#define MAX_GRAMMATICALCASE_INE_SENTENCE 8
#define HOOK_LIST_LENGTH 3
#define HOOK_LIST_WIDTH 8
#define VERB_SPOT 3
#define ACCUSATIVE_SPOT 2
#define INSTRUMENTAL_SPOT 1
#define DATIVE_SPOT 0

#define SAY_VERB 0x1848
#define SUBTRACTION_VERB 0x1D2D
#define INCREASE_VERB 0x19EA /* add */
#define EXCLUSIVEOR_VERB 0x1806
#define ANDOR_VERB 0x150
#define NOT_VERB 0x1830      /* with conditional ESS toffoli gate  */
#define UP_VERB 0x1118       /* shift up (left) */
#define DOWN_VERB 0x1868     /* shift down (right) */
#define EXCHANGE_VERB 0x1BEA /* with conditional ESS fredkin gate */
#define TEXT_WORD 0x1A4A
#define NUMBER_WORD 0x1930
#define FLOAT_WORD 0x1A8C
#define RATIONAL_WORD 0x1C0E
#define INTEGER_WORD 0x1A2A
#define COMPLEX_WORD 0x1C82
#define TEXT_CLASS 0x0
#define NUMBER_CLASS 0x1
#define INTEGER_CLASS 0x2
#define FLOAT_CLASS 0x3
#define RATIONAL_CLASS 0x4
#define COMPLEX_CLASS 0x5

#define EQUAL_WORD 0x1124
#define DIFFERENT_WORD 0x18EA
#define FACT_WORD 0x0960
#define WRONG_WORD 0x198D

#define UNSIGNED_CHAR_QUOTE 0x009D
#define SIGNED_CHAR_QUOTE 0x029D

typedef int v4si __attribute__((vector_size(16)));
typedef uint8_t v16uc __attribute__((vector_size(16)));
typedef uint16_t v16us __attribute__((vector_size(32)));
typedef uint16_t v8us __attribute__((vector_size(16)));
typedef uint16_t v4us __attribute__((vector_size(8)));
/*#define NULL 0*/

extern void delete_empty_glyph(const char *letter, const uint16_t length,
                               char *neatLetter, uint16_t *fresh_length);
/*@unused@*/ extern void derive_first_word(const char *sentence,
                                           const uint8_t length, char *word,
                                           uint8_t *fresh_length);
extern void encode_ACC_word_PL(const char *restrict ACC_sentence,
                               const uint8_t ACC_GEN_length,
                               uint16_t *restrict DAT_encode_sentence,
                               uint8_t *restrict DAT_GEN_length,
                               uint8_t *restrict DAT_GEN_remainder);
/*@unused@*/ extern void encode_ACC_word_DAT_number(const char *word,
                                                    const uint8_t word_length,
                                                    uint16_t *number);
extern void encode_PL_word(const uint32_t *PL_word, const uint8_t *length,
                           uint16_t *PL_number);

/*@unused@*/ extern void text_copy(const char *restrict ACC_text,
                                   const uint8_t ALLA_end,
                                   char *restrict DAT_text);
#endif

/*@unused@*/ extern void lump_encode(const uint16_t *encode_text,
                                     const uint8_t encode_text_length,
                                     uint16_t *lump,
                                     uint8_t *lump_length,
                                     uint8_t *remainder);
/*@unused@*/ extern void sentence_encode(const char *text,
                                         const uint8_t text_length,
                                         v16us *lump,
                                         uint8_t *lump_length,
                                         uint8_t *remainder);
/*@unused@*/ extern void text_encode(const char *text,
                                     const uint16_t text_length,
                                     v16us *lump,
                                     uint16_t *lump_length,
                                     uint16_t *text_remainder);
/*@unused@*/ extern void realize(const v4us encoded_name, v8us *hook_list);
/*@unused@*/ extern void realize_sentence(const v16us *lump,
                                          const uint8_t lump_length,
                                          v4us* encoded_name,
                                          v8us *hook_list);
