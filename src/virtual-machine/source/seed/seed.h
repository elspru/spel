#ifndef _SEED_H
#define _SEED_H

#define GLOTTAL_STOP 0xC
#define MAX_LENGTH 0xFFU
#define SENTENCE_LENGTH 0xFF
#define WORD_LENGTH 0x05
#define WRONG_TYPE 0
#define LONG_ROOT 1
#define SHORT_ROOT 2
#define LONG_GRAMMAR 3
#define SHORT_GRAMMAR 4
#define CONSONANT_ONE_WIDTH 5
#define BANNER_WIDTH 3
#define CONSONANT_TWO_WIDTH 3
#define VOWEL_WIDTH 3
#define TONE_WIDTH 2
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
extern void align_PL_word_ELA_sentence(const char* sentence,
        const uint8_t  length,
        uint32_t* neat_sentence,
        uint8_t* fresh_length);
/*@unused@*/extern void encode_ACC_word_DAT_number(const char* word,
        const uint8_t word_length,
        uint16_t*  number);
extern void encode_PL_word(const uint32_t* PL_word,
        const uint8_t*  length,
        uint16_t*  PL_number);

#endif
