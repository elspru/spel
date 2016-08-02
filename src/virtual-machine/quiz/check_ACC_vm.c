#include <check.h>
#include <stdio.h>
#include "../source/seed/seed.h"
START_TEST (delete_empty_glyph_check) {
    const char* text = "1ce7h tcat ca clah kxih";
    const uint16_t length = 18;
    char DAT_text[SENTENCE_LENGTH];
    uint16_t DAT_GEN_length = SENTENCE_LENGTH;
    char DAT_word[WORD_LENGTH + 1];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    uint16_t DAT_number = 0;
    memset(DAT_text, 0, SENTENCE_LENGTH);
    memset(DAT_word, 0, WORD_LENGTH + 1);
    printf("hello world\n");
    delete_empty_glyph(text, length, DAT_text, &DAT_GEN_length);
    ck_assert_str_eq(DAT_text, "1ce7htcatcaclahkxih");
    printf("%s\n", DAT_text);
    
}
END_TEST
