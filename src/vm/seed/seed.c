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

void delete_empty_glyph(const char* restrict letter, 
        const uint16_t ACC_GEN_length,
        char* restrict neatLetter, 
        uint16_t* restrict freshLength) {
    assert(ACC_GEN_length <= *freshLength);
    assert(letter != NULL);
    assert(neatLetter != NULL);
    uint16_t i = 0;
    uint16_t j = 0;
    char g;
    for (i = 0; i < ACC_GEN_length; i += 1) {
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

static void text_copy(const char* restrict ACC_text, 
    const uint8_t ABL_start, const uint8_t ALLA_end, 
    char* restrict DAT_text) {
    uint8_t i;
    for (i = 0; i + ABL_start < ALLA_end; i++) {
        DAT_text[i] = ACC_text[i + ABL_start];
    }
}

void derive_first_word(const char* restrict ACC_sentence,
        const uint8_t ACC_GEN_length,
        char* restrict DAT_word,
        uint8_t* restrict DAT_GEN_length) {
    assert(ACC_sentence != NULL);
    assert(ACC_GEN_length > 0);
    assert(DAT_word != NULL);
    assert(*DAT_GEN_length >= 4);
/* algorithm:
    if glyph zero ESS vowel
    then if glyph two not ESS consonant
        then answer ACC DEP wrong ACC glyph LOC two
        else restart ABL glyph two
    if glyph zero ESS consonant
    then 
        if glyph one ESS consonant CNJ glyph two ESS vowel
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
    assert(vowel_Q(ACC_sentence[start + 0]) == true ||
            consonant_Q(ACC_sentence[start + 0]));
    if (vowel_Q(ACC_sentence[start]) == true) {
        assert(consonant_Q(ACC_sentence[start + 1]) == true);
        assert(consonant_Q(ACC_sentence[start + 2]) == true);
        start = 2;
    } 
    if (consonant_Q(ACC_sentence[start]) == true){
        if (consonant_Q(ACC_sentence[start + 1]) == true) {
            assert(vowel_Q(ACC_sentence[start + 2]) == true);
            assert(consonant_Q(ACC_sentence[start + 3]) == true);
            text_copy(ACC_sentence, start, start + 4, DAT_word);
            *DAT_GEN_length = 4;
        } else if (vowel_Q(ACC_sentence[start + 1]) == true) {
            text_copy(ACC_sentence, start, start + 2, DAT_word);
            *DAT_GEN_length = 2;
        }
    } 
}
void align_word(const char* restrict ACC_sentence, 
        const uint8_t ACC_GEN_length,
        uint32_t* restrict DAT_sentence,
        uint8_t* restrict DAT_GEN_length) {
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
    assert(ACC_sentence != NULL);
    assert(ACC_GEN_length > 0);
    assert(DAT_sentence != NULL);
    assert(*DAT_GEN_length >= ACC_GEN_length / 4);
}

void encode_spel_word(const char* restrict word,
        const uint8_t* restrict ACC_GEN_length,
        uint16_t* restrict number){
    assert(*ACC_GEN_length > 0);
    assert(word != NULL);
    assert(number != NULL);
}
