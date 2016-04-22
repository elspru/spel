/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"

#define  SENTENCE_LENGTH 0xFF

/*int main(int argc, char *argv[]) { */
int main() { 
    const char* letter = "tcat ca clah kxih";
    const uint16_t length = 17;
    char neatLetter[SENTENCE_LENGTH];
    uint16_t freshLength = SENTENCE_LENGTH;
    memset(neatLetter, 0, SENTENCE_LENGTH);
    printf("hello world\n");
    delete_empty_glyph(letter, length, neatLetter, &freshLength);
    printf("%s\n", neatLetter);
    return 0;
}
