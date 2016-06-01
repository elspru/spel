#ifndef _SEED_H
#define _SEED_H

#define GLOTTAL_STOP 0xC
#define MAX_LENGTH 0xFFU
#define SENTENCE_LENGTH 0xFF
#define WORD_LENGTH 0x05
#define WRONG_WORD 0
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
#define TWO_BYTE_QUOTE 0x1
#define FOUR_BYTE_QUOTE 0x2
#define EIGHT_BYTE_QUOTE 0x3
#define SIXTEEN_BYTE_QUOTE 0x4

#define DEONTIC_MOOD 0x95E
#define ACCUSATIVE_CASE 0x45E
#define DATIVE_CASE 0x49E
#define INSTRUMENTAL_CASE 0x93E
#define CONDITIONAL_MOOD 0X87E
#define QUOTE_WORD 0x8BE
#define MAX_GRAMMATICALCASE_INE_SENTENCE 8
#define HOOK_LIST_LENGTH 5
#define VERB_SPOT 4
#define ACCUSATIVE_SPOT 3
#define INSTRUMENTAL_SPOT 2
#define DATIVE_SPOT 1
#define NOMINATIVE_SPOT 0

#define SAY_VERB 0x1948
#define SUBTRACTION_VERB 0x1B2D
#define INCREASE_VERB 0x19EA /* add */
#define EXCLUSIVEOR_VERB 0x1810
#define ANDOR_VERB 0x150
#define NOT_VERB 0x1830 
#define UP_VERB 0x1118 /* shift up */
#define DOWN_VERB 0x1868 /* shift down */
#define EXCHANGE_VERB 0x1BEA /* fredkin gate */

typedef int v4si __attribute__ ((vector_size (16)));
typedef uint8_t v16uc __attribute__ ((vector_size (16)));
typedef uint16_t v8us __attribute__ ((vector_size (16)));
/*#define NULL 0*/


extern void delete_empty_glyph(const char*  letter,
        const uint16_t  length,
        char*  neatLetter,
        uint16_t*  fresh_length);
/*@unused@*/ extern void derive_first_word(const char* sentence,
        const uint8_t length,
        char* word,
        uint8_t* fresh_length);
extern void encode_ACC_word_PL(const char* restrict ACC_sentence,
        const uint8_t ACC_GEN_length,
        uint16_t* restrict DAT_encode_sentence,
        uint8_t* restrict DAT_GEN_length,
        uint8_t* restrict DAT_GEN_remainder);
/*@unused@*/extern void encode_ACC_word_DAT_number(const char* word,
        const uint8_t word_length,
        uint16_t*  number);
extern void encode_PL_word(const uint32_t* PL_word,
        const uint8_t*  length,
        uint16_t*  PL_number);

/*@unused@*/ extern void text_copy(const char* restrict ACC_text, 
    const uint8_t ALLA_end, char* restrict DAT_text);
#endif

/*@unused@*/ extern void lump_encode(
    const uint16_t* encode_text,
    const uint8_t encode_text_length,
    uint16_t* lump,
    uint8_t* lump_length,
    uint8_t* remainder);
/*@unused@*/ extern void sentence_encode(
        const char* text,
        const uint8_t text_length,
        uint16_t* lump,
        uint8_t* lump_length,
        uint8_t* remainder);
/*@unused@*/ extern void realize(
        const uint16_t* lump,
        const uint16_t* grammaticalCase_list,
        const uint8_t* hook_list,
        const uint8_t grammaticalCase_spot,
        const uint16_t verb);
