#ifndef _SEED_H
#define _SEED_H

#define GLOTTAL_STOP 0xC
#define MAX_LENGTH 0xFFU


extern void delete_empty_glyph(const char*  letter,
        const uint16_t  length,
        char*  neatLetter,
        uint16_t*  fresh_length);
extern uint8_t vowel_Q(const char glyph);
extern uint8_t consonant_Q(const char glyph);
extern void derive_first_word(const char* sentence,
        const uint8_t length,
        char* word,
        uint8_t* fresh_length);
extern void align_PL_word_ELA_sentence(const char* sentence,
        const uint8_t  length,
        uint32_t* neat_sentence,
        uint8_t* fresh_length);
extern void encode_word(const uint32_t word,
        uint16_t*  number);
extern void encode_PL_word(const uint32_t* PL_word,
        const uint8_t*  length,
        uint16_t*  PL_number);

#endif
