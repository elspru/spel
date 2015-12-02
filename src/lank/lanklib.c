#include <stdint.h>
#include <stdio.h>
#include <assert.h>
#include <stdlib.h>
#include "lanklib.h"

void error(const char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

char nibbleToLankGlyph(const uint8_t nibble){
    char result = 'X';
    assert(nibble <= 0xF );
    switch (nibble){
        case 0: result = 'm'; break;
        case 1: result = 'k'; break;
        case 2: result = 'i'; break;
        case 3: result = 'a'; break;
        case 4: result = 'y'; break;
        case 5: result = 'u'; break;
        case 6: result = 'p'; break;
        case 7: result = 'w'; break;
        case 8: result = 'n'; break;
        case 9: result = 's'; break;
        case 0xA: result = 't'; break;
        case 0xB: result = 'l'; break;
        case 0xC: result = 'h'; break;
        case 0xD: result = 'f'; break;
        case 0xE: result = '.'; break;
        case 0xF: result = 'c'; break;
        default: error("nibbleToLankGlyph: invalid nibble"); 
            break;
    }
    assert(result >= '.' && result <='z' );
    return result;
}

void aUint16ToLankGlyphs(const uint16_t instruction,
 char *result){
    uint8_t nibbles[4];
    uint8_t i;
    assert( result != NULL ); /*char array result*/
    result[4] = (char) 0; /* make null terminated string */
    for (i = 0; i < 4; i++) {
    nibbles[i] = (uint8_t) ((instruction >> (4 * i)) & 
            (uint32_t) 0xF);
    assert (nibbles[i] <= 0xF);
    result[i] = nibbleToLankGlyph(nibbles[i]);
    }
}


void aUint32ToLankGlyphs(const uint32_t intWord,
        char *result){
    uint8_t nibbles[8];
    uint8_t i;
    assert( result != NULL ); /*char array result*/
    result[8] = (char) 0; /* make null terminated string */
    for (i = 0; i < 8; i++) {
    nibbles[i] = (uint8_t) ((intWord >> (4 * i)) & 
            (uint32_t) 0xF);
    assert (nibbles[i] <= 0xF);
    result[i] = nibbleToLankGlyph(nibbles[i]);
    }
}

uint8_t lankGlyphToNibble(const char glyph){
    uint8_t result = 0x10;
    assert(glyph >= '.' );
    assert(glyph <= 'w' );
    switch (glyph){
        case '.': result = 0x0; break;
        case 'm': result = 0x1; break;
        case 'k': result = 0x2; break;
        case 'i': result = 0x3; break;
        case 'a': result = 0x4; break;
        case 'y': result = 0x5; break;
        case 'u': result = 0x6; break;
        case 'p': result = 0x7; break;
        case 'w': result = 0xA; break;
        case 'n': result = 0x9; break;
        case 's': result = 0xA; break;
        case 't': result = 0xB; break;
        case 'l': result = 0xC; break;
        case 'h': result = 0xD; break;
        case 'f': result = 0xE; break;
        case 'c': result = 0xF; break;
        default: error("lankGlyphToNibble: invalid glyph");
             break;
    }
    assert(result <= 0xF );
    return result;
}

/* lankGlyphsToChar8,
compression facter of 2 from ASCII,
so need half as much space in result array,
taking into account that C-strings require extra char for null.
little endian output.  
example
'ya'
'y' = 5
'a' = 4
result 0x45
*/
void lankGlyphsToChar8(const int glyphsLength,
    const char *glyphs, const int resultLength, char *result){
    int i = 0;
    assert(glyphs != NULL);
    assert(result != NULL);
    assert(resultLength-1 == (glyphsLength-1)/2);
    for (i = 0; i < resultLength-1; i++){
        result[i] = (char) (lankGlyphToNibble(glyphs[i * 2]) +
            lankGlyphToNibble(glyphs[i * 2 + 1]) * 0x10);
    }
    result[resultLength-1]=(char)0;
}

void lankGlyphsToUint16(const unsigned int glyphsLength,
    const char *glyphs, const unsigned int resultLength, 
    uint16_t *result){
    unsigned int i = 0;
    unsigned int j = 0;
    assert(glyphs != NULL);
    assert(result != NULL);
    assert(resultLength == (glyphsLength-1)/4);
    for (i = 0; i < resultLength; i++){
        for (j = 0; j < 4; j++){
        result[i] += (uint16_t) 
            (lankGlyphToNibble(glyphs[i * 4 + j]) << (4 * j));
        }
    }
}


void lankGlyphsToUint32(const unsigned int glyphsLength,
    const char *glyphs, const unsigned int resultLength, 
    uint32_t *result){
    unsigned int i = 0;
    unsigned int j = 0;
    assert(glyphs != NULL);
    assert(result != NULL);
    assert(resultLength == (glyphsLength-1)/8);
    for (i = 0; i < resultLength; i++){
        for (j = 0; j < 8; j++){
        result[i] += (uint32_t) 
            (lankGlyphToNibble(glyphs[i * 4 + j]) << (4 * j));
        }
    }
}


