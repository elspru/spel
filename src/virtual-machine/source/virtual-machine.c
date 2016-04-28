/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"


static void encode_check() {
    /* testing encode_ACC_word_DAT_number */
    const char* long_root = "tcan";
    const char* short_root = "hlep";
    const char* long_grammar = "br6h";
    const char* short_grammar = "du";
    const char* long_tone_root = "bza_n";
    const char* short_tone_root = "h1e7c";
    const char* long_tone_grammar = "br6_h";
    const char* short_tone_grammar = "du7";
    uint8_t length = 4;
    uint16_t number = 0;
        /* LONG_ROOT */
    encode_ACC_word_DAT_number(long_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x19EA);
        /* SHORT_ROOT */
    encode_ACC_word_DAT_number(short_root, length,
        &number);
    //printf("short_root %X\n", (unsigned int) number);
    assert(number == 0x1358);
        /* LONG_GRAMMAR */
    encode_ACC_word_DAT_number(long_grammar, length,
        &number);
    //printf("long_grammar %X\n", (unsigned int) number);
    assert(number == 0x298F);
        /* SHORT_GRAMMAR */
    length = 2;
    encode_ACC_word_DAT_number(short_grammar, length,
        &number);
    //printf("short_grammar %X\n", (unsigned int) number);
    assert(number == 0xA7E);
        /* LONG_TONE_ROOT */
    length = 5;
    encode_ACC_word_DAT_number(long_tone_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x7171);
        /* SHORT_TONE_ROOT */
    encode_ACC_word_DAT_number(short_tone_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x6BD8);
        /* LONG_TONE_GRAMMAR */
    encode_ACC_word_DAT_number(long_tone_grammar, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0xA98F);
        /* SHORT_TONE_GRAMMAR */
    length = 3;
    encode_ACC_word_DAT_number(short_tone_grammar, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x2A7E);
    printf("%s\n",
        "NOM encode_ACC_word_DAT_number PFV check ESS success");
}


static void delete_empty_glyph_check() {
    const char* text = "tcat ca clah kxih";
    const uint16_t length = 18;
    char DAT_text[SENTENCE_LENGTH];
    uint16_t DAT_GEN_length = SENTENCE_LENGTH;
    memset(DAT_text, 0, SENTENCE_LENGTH);
    /* testing delete empty glyph */
    delete_empty_glyph(text, length, DAT_text, &DAT_GEN_length);
    //printf("%s\n", DAT_text);
    assert(strcmp(DAT_text, "tcatcaclahkxih") == 0);
    assert(DAT_GEN_length == 14);
    printf("NOM delete empty glyph PFV check ESS success\n");
}

static void derive_first_word_check() {
    /* testing derive_first word */
    const char* text = "tcatcaclahkxih";
    const uint16_t length = 14;
    char DAT_word[WORD_LENGTH + 1];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    memset(DAT_word, 0, WORD_LENGTH + 1);
    derive_first_word(text, length, DAT_word, 
        &DAT_word_GEN_length);
    //printf("%s\n", DAT_word);
    assert(strcmp(DAT_word, "tcat") == 0);
    assert(DAT_word_GEN_length == 4);
    printf("NOM derive first word PFV check ESS success\n");
}

static void check_ACC_all() {
    delete_empty_glyph_check();
    derive_first_word_check();
    encode_check();
}

int main(int argc, char *argv[]) { 
    assert(argc > 0);
    assert(argv != NULL);
    check_ACC_all();
    return 0;
}
