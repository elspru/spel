#ifndef _LANKLIB_H
#define _LANKLIB_H

#define MAX_INSTRUCTION_VALUE (uint32_t) 0xFFFFFFFFU
#define NIBBLE_LENGTH 4
#define NIBBLE_MASK 0xF
#define HIGHEST_CONSONANT 0xC
#define GLOTTAL_STOP 0xC

extern void error(const char *message);
extern uint8_t lankGlyphToNibble(const char glyph);
extern char nibbleToLankGlyph(const uint8_t nibble);
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
extern void lankGlyphsToChar8Array(const size_t glyphsLength,
    const char *glyphs, const size_t resultLength, char *result);
/* lankGlyphsToUint
similar to Char8Array version, but result array doesn't need a final
null character. 
Uint16 result is (glyphsLength-1)/4 long
Uint32 result is (glyphsLength-1)/8 long
*/
extern void lankGlyphsToUint16Array(const size_t glyphsLength,
        const char *glyphs, const size_t resultLength, 
        uint16_t *result);
extern void lankGlyphsToUint32Array(const size_t glyphsLength,
        const char *glyphs, const size_t resultLength, 
        uint32_t *result);

extern void aUint16ToLankGlyphs(const uint16_t instruction,
        size_t glyphArrayLength, char *result);
extern void aUint32ToLankGlyphs(const uint32_t intWord,
        size_t glyphArrayLength, char *result);

extern void uint32ArrayToLankGlyphs(const size_t
        intArrayLength, const uint32_t *intArray, const size_t
         glyphArrayLength, char *glyphArray);

extern void uint16ArrayToCharArray(const size_t
        uint16ArrayLength, const uint16_t *uint16Array, 
        size_t *uint8ArrayLength, char *charArray);

extern void charArrayToUint16Array(const size_t
        charArrayLength, const char *charArray, 
        size_t *uint8ArrayLength, uint16_t *uint16Array);

#endif
