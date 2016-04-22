#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>
#include "vmlib.h"

void error(const char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

char nibbleToLankGlyph(const uint8_t nibble){
    char result = 'X';
    assert(nibble <= NIBBLE_MASK );
    switch (nibble){
        case 0x0: result = 'm'; break;
        case 0x1: result = 'k'; break;
        case 0x2: result = 'i'; break;
        case 0x3: result = 'a'; break;
        case 0x4: result = 'y'; break;
        case 0x5: result = 'u'; break;
        case 0x6: result = 'p'; break;
        case 0x7: result = 'w'; break;
        case 0x8: result = 'n'; break;
        case 0x9: result = 's'; break;
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

uint8_t lankGlyphToNibble(const char glyph){
    uint8_t result = 0x10;
    if( glyph < '.' || glyph > 'y' ){
        printf("glyph '%c' 0x%X \n",glyph,(unsigned int) glyph);
        error("lankGlyphToNibble error, glyph out of bounds");
        
    }
    assert(glyph >= '.' );
    assert(glyph <= 'y' );
    switch (glyph){
        case 'm': result = 0x0; break;
        case 'k': result = 0x1; break;
        case 'y': result = 0x2; break;
        case 'p': result = 0x3; break;
        case 'w': result = 0x4; break;
        case 'n': result = 0x5; break;
        case 's': result = 0x6; break;
        case 't': result = 0x7; break;
        case 'l': result = 0x8; break;
        case 'h': result = 0x9; break;
        case 'f': result = 0xA; break;
        case 'c': result = 0xB; break;
        case '.': result = 0xC; break;
        case 'i': result = 0xD; break;
        case 'a': result = 0xE; break;
        case 'u': result = 0xF; break;
        default: error("lankGlyphToNibble: invalid glyph");
             break;
    }
    assert(result <= NIBBLE_MASK );
    return result;
}

void aUint16ToLankGlyphs(const uint16_t instruction,
        size_t glyphArrayLength, char *glyphArray){
    enum { uintLength = 4 };
    uint8_t nibbles[uintLength];
    uint8_t i;
    assert( glyphArrayLength == 9);
    assert( glyphArray != NULL ); /*char array glyphArray*/
    for (i = 0; i < uintLength; i++) {
    nibbles[i] = (uint8_t) ((instruction >> (NIBBLE_LENGTH * i)) & 
            (uint32_t) NIBBLE_MASK);
    assert (nibbles[i] <= NIBBLE_MASK);
    glyphArray[i] = nibbleToLankGlyph(nibbles[i]);
    }
    glyphArray[glyphArrayLength-1] = (char) 0; 
    assert((size_t) strlen(glyphArray) == glyphArrayLength-1);
}


void aUint32ToLankGlyphs(const uint32_t intWord,
        const size_t glyphArrayLength,
        char *glyphArray){
    enum { uintLength = 8 };
    uint8_t nibbles[uintLength];
    uint8_t i;
    assert( glyphArrayLength == (size_t) uintLength+1);
    assert( glyphArray != NULL ); /*char array glyphArray*/
    for (i = 0; i < uintLength; i++) {
        nibbles[i] = (uint8_t) ((intWord >> (NIBBLE_LENGTH * i)) & 
            (uint32_t) NIBBLE_MASK);
        assert (nibbles[i] <= NIBBLE_MASK);
        glyphArray[i] = nibbleToLankGlyph(nibbles[i]);
    }
    glyphArray[glyphArrayLength-1] = (char) 0; 
    assert((size_t) strlen(glyphArray) == glyphArrayLength-1);
}

void uint32ArrayToLankGlyphs(const size_t intArrayLength,
        const uint32_t *intArray, const size_t
        glyphArrayLength, char *glyphArray){
    enum { uintLength = 8 };
    size_t i;
    unsigned int j;
    char tempGlyphArray[uintLength+1]=" ";
    assert(intArray != NULL);
    assert(glyphArray != NULL);
    assert((glyphArrayLength-1)/(size_t) uintLength 
        == intArrayLength);
    for (i = 0; i < intArrayLength; i++) {
        aUint32ToLankGlyphs(intArray[i],
            (size_t) uintLength+1, tempGlyphArray);
        for (j = 0; j < uintLength; j++) {
            glyphArray[i*uintLength+j] = tempGlyphArray[j];
        }
    }
    glyphArray[glyphArrayLength-1] = (char) 0; 
    assert((size_t) strlen(glyphArray) == glyphArrayLength-1);
}


/* lankGlyphsToChar8Array,
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
void lankGlyphsToChar8Array(const size_t glyphsLength,
    const char *glyphs, const size_t resultLength, char *result){
    size_t i = 0;
    assert(glyphs != NULL);
    assert(result != NULL);
    assert(resultLength-1 == (glyphsLength-1)/2);
    for (i = 0; i < resultLength-1; i++){
        result[i] = (char) (lankGlyphToNibble(glyphs[i * 2]) +
            lankGlyphToNibble(glyphs[i * 2 + 1]) * 0x10);
    }
    result[resultLength-1]=(char)0;
}

void lankGlyphsToUint16Array(const size_t glyphsLength,
    const char *glyphs, const size_t resultLength, 
    uint16_t *result){
    size_t i = 0;
    uint8_t j = 0;
    assert(glyphs != NULL);
    assert(result != NULL);
    assert(resultLength == (glyphsLength-1)/4);
    for (i = 0; i <  resultLength; i++){
        for (j = 0; j < 4; j++){
        result[i] += (uint16_t) 
            (lankGlyphToNibble(glyphs[i * 4 + j]) << (4 * j));
        }
    }
}


void lankGlyphsToUint32Array(const size_t glyphsLength,
    const char *glyphs, const size_t resultLength, 
    uint32_t *result){
    size_t i = 0;
    uint8_t j = 0;
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

/* sets charArray and charArrayLength 
    this is for charArrays or uint8_t arrays a binary format,
if you want ASCII look for the GlyphLank versions*/
void uint16ArrayToCharArray(const size_t
        uint16ArrayLength, const uint16_t *uint16Array, 
        size_t *charArrayLength, char *charArray){
        size_t i;
        uint16_t elem;
        assert(uint16ArrayLength *2 <= *charArrayLength);
        assert(uint16Array != NULL);
        assert(charArray != NULL);
        for (i = 0; i < uint16ArrayLength; i++) {
            elem = uint16Array[i];
            charArray[i*2]= (char) (elem & 0xFF);
            charArray[i*2+1]= (char) (elem >> 0x8);
        }
        *charArrayLength = uint16ArrayLength*2;
}
/* sets uint16Array and uint16ArrayLength 
    this is for charArrays or uint8_t arrays a binary format,
if you want ASCII look for the GlyphLank versions*/
void charArrayToUint16Array(const size_t
        charArrayLength, const char *charArray, 
        size_t *uint16ArrayLength, uint16_t *uint16Array){
        size_t i;
        assert(charArrayLength % 2 == 0);
        assert(*uint16ArrayLength * 2 <= charArrayLength);
        assert(uint16Array != NULL);
        assert(charArray != NULL);
        for (i = 0; i < charArrayLength/2; i++) {
            uint16Array[i] = ((uint16_t) charArray[i*2]) +
            (((uint16_t) charArray[i*2+1]) >> 0x4) ;
        }
        *uint16ArrayLength = charArrayLength/2;
}
