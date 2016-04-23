extern "C" {
/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"

#define  SENTENCE_LENGTH 0xFF
#define  WORD_LENGTH 0x04

/*int main(int argc, char *argv[]) { */
int main() { 
    const char* text = " t cat ca clah kxih";
    const uint16_t length = 17;
    char DAT_text[SENTENCE_LENGTH];
    uint16_t DAT_GEN_length = SENTENCE_LENGTH;
    char DAT_word[WORD_LENGTH + 1];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    memset(DAT_text, 0, SENTENCE_LENGTH);
    memset(DAT_word, 0, WORD_LENGTH + 1);
    printf("hello world\n");
    delete_empty_glyph(text, length, DAT_text, &DAT_GEN_length);
    printf("%s\n", DAT_text);
    derive_first_word(DAT_text, DAT_GEN_length, DAT_word, 
        &DAT_word_GEN_length);
    printf("%s\n", DAT_word);
    return 0;
}
}
