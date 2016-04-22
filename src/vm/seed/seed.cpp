extern "C" {
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>
#include <ctype.h>
#include "seed.h"


#define true 1
#define false 0

static const char consonant_set[] = {
    'p','t','k','f', 's','c','x','b', 
    'd','g','v','z', 'j','n','m','q', 
    'r','l','y','w', '1','8'};
static const uint8_t consonant_set_length = 22;
static const char vowel_set[] = {'i','a','e','o','u','6'};
static const uint8_t vowel_set_length = 6;
/*static const char secondary_set[] = {'f','s','c','y', 
    'r','w','l','x', 'z','j','v'};
#define SECONDARY_SET_LENGTH 11;
static const char tone_set[] = {'7','_'};
#define TONE_SET_LENGTH 2;
static const char last_set[] = {'p','t','k','f', 's','c','n','m'};
#define LAST_SET_LENGTH 8;
*/

void delete_empty_glyph(const char* __restrict__ letter, 
        const uint16_t length,
        char* __restrict__ neatLetter, 
        uint16_t* __restrict__ freshLength) {
    assert(length <= *freshLength);
    assert(letter != NULL);
    assert(neatLetter != NULL);
    uint16_t i = 0;
    uint16_t j = 0;
    char g;
    for (i = 0; i < length; i += 1) {
        g = *(letter + i);
        if(!isspace(g)) {
            *(neatLetter + j) = g;
            j += 1;
        }
    }
}

uint8_t vowel_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < vowel_set_length; i++) {
       if (vowel_set[i] == glyph) {
            return true;
       } 
    }
    return false;
}
uint8_t consonant_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < consonant_set_length; i += 1) {
       if (consonant_set[i] == glyph) {
            return true;
       } 
    }
    return false;
}

void derive_first_word(const char* __restrict__ sentence,
        const uint8_t length,
        char* __restrict__ word,
        uint8_t* __restrict__ fresh_length) {
    assert(sentence != NULL);
    assert(length > 0);
    assert(word != NULL);
    assert(*fresh_length >= 4);
/* algorithm:
    if glyph zero ESS vowel
    then if glyph two not ESS consonant
        then answer ACC DEP wrong ACC glyph LOC two
        else restart ABL glyph two
    if glyph zero ESS consonant
    then if glyph one ESS consonant CNJ glyph two ESS vowel
            CNJ glyph three ESS consonant
        then copy ACC sentence ABL glyph zero ALLA glyph
                four DAT word
            CNJ copy ACC number four DAT length
            answer
    else if glyph one ESS vowel
    then copy ACC sentence ABL glyph zero ALLA glyph two 
        DAT word CNJ 
        copy ACC number two DAT length 
*/
    uint8_t start = 0;
    if (vowel_Q(sentence[start]) == true) {
        assert(consonant_Q(sentence[start + 1]) == true);
        start = 2;
    } 
    if (consonant_Q(sentence[start]) == true){
        if (consonant_Q(sentence[start + 1]) == true) {
            assert(vowel_Q(sentence[start + 2]) == true);
            assert(consonant_Q(sentence[start + 3]) == true);
        }
    }
}
void align_word(const char* __restrict__ sentence, 
        const uint8_t length,
        uint32_t* __restrict__ neat_sentence,
        uint8_t* __restrict__ fresh_length) {
/* identify if two glyph or four glyph word
    if there is a three glyph word or bad parse
    then return an error message, 
    which indicates the location of the error. 
assumptions:
    this is used in a reduce like manner, so many function
    together, the last two glyphs can overlap with next 
    sentence, so if they are a four glyph word then keep them, 
    otherwise ignore. 
algorithm:
       
*/
    assert(sentence != NULL);
    assert(length > 0);
    assert(neat_sentence != NULL);
    assert(*fresh_length >= length / 4);
}

void encode_spel_word(const char* __restrict__ word,
        const uint8_t* __restrict__ length,
        uint16_t* __restrict__ number){
    assert(*length > 0);
    assert(word != NULL);
    assert(number != NULL);
}
}
