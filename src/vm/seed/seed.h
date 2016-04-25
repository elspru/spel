#ifndef _SEED_H
#define _SEED_H

#define GLOTTAL_STOP 0xC
#define MAX_LENGTH 0xFFU
#define  SENTENCE_LENGTH 0xFF
#define  WORD_LENGTH 0x04
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
