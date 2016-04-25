#include <stdint.h>
#include <assert.h>
#include <string.h>
#include "seed.h"

#define TRUE 1
#define FALSE 0

static const char consonant_set[] = {
    'p','t','k','f', 's','c','x','b', 
    'd','g','v','z', 'j','n','m','q', 
    'r','l','y','w', '1','8'};
static const uint8_t consonant_set_length = 22;
static const char vowel_set[] = {'i','a','u','e','o','6'};
static const uint8_t vowel_set_length = 6;
static const uint8_t consonant_one_encode_set[32][2] = 
    { /* LOC 0 ESS consonant one */
        {'S', 0x0},
        {'m', 0x1},
        {'k', 0x2},
        {'y', 0x3},
        {'p', 0x4},
        {'w', 0x5},
        {'n', 0x6},
        {'L', 0x7},
        {'S', 0x8},
        {'s', 0x9},
        {'t', 0xA},
        {'l', 0xB},
        {'f', 0xC},
        {'c', 0xD},
        {'r', 0xE},
        {'L', 0xF},
        {'S', 0x10},
        {'b', 0x11},
        {'g', 0x12},
        {'d', 0x13},
        {'z', 0x14},
        {'j', 0x15},
        {'v', 0x16},
        {'L', 0x17},
        {'S', 0x18},
        {'q', 0x19},
        {'x', 0x1A},
        {'1', 0x1B},
        {'8', 0x1C},
        {'Q', 0x1D},
        {'S', 0x1E},
        {'L', 0x1F}
};
static const uint8_t consonant_two_encode_set[11][2] = 
    { /* LOC 1 ESS consonant two */
        {'y', 0},
        {'w', 1},
        {'s', 2},
        {'z', 2},
        {'l', 3},
        {'f', 4},
        {'v', 4},
        {'c', 5},
        {'j', 5},
        {'r', 6},
        {'x', 7}
};
static const uint8_t vowel_encode_set[8][2] = { 
    /* LOC 2 ESS vowel */
        {'i', 0},
        {'a', 1},
        {'u', 2},
        {'e', 3},
        {'o', 4},
        {'6', 5},
        {'U', 6},
        {'U', 7}
};
static const uint8_t tone_encode_set[4][2] = { 
    /* LOC 3 ESS tone */
        {'M', 0},
        {'7', 1},
        {'_', 2},
        {'U', 3}
};
static const uint8_t consonant_three_encode_set[8][2] = { 
     /* LOC 4 ESS consonant three */
        {'m', 0},
        {'k', 1},
        {'p', 2},
        {'n', 3},
        {'s', 3},
        {'t', 3},
        {'f', 3},
        {'c', 3}
};
/*static const char secondary_set[] = {'f','s','c','y', 
    'r','w','l','x', 'z','j','v'};
#define SECONDARY_SET_LENGTH 11;
static const char tone_set[] = {'7','_'};
#define TONE_SET_LENGTH 2;
static const char last_set[] = {'p','t','k','f', 's','c','n','m'};
#define LAST_SET_LENGTH 8;
*/


static uint8_t vowel_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < vowel_set_length; i++) {
       if (vowel_set[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}
static uint8_t consonant_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < consonant_set_length; i += 1) {
       if (consonant_set[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}

void delete_empty_glyph(const char* restrict letter, 
        const uint16_t ACC_GEN_length,
        char* restrict neatLetter, 
        uint16_t* restrict freshLength) {
    uint16_t i = 0;
    uint16_t j = 0;
    char g;
    assert(ACC_GEN_length <= *freshLength);
    assert(letter != NULL);
    assert(neatLetter != NULL);
    for (i = 0; i < ACC_GEN_length; i += 1) {
        g = *(letter + i);
        if(vowel_Q(g) == FALSE && consonant_Q(g) == FALSE) {
            *(neatLetter + j) = g;
            j += 1;
        }
    }
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
    uint8_t start = 0;
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
    assert(vowel_Q(ACC_sentence[start + 0]) == TRUE ||
            consonant_Q(ACC_sentence[start + 0]) == TRUE);
    if (vowel_Q(ACC_sentence[start]) == TRUE) {
        assert(consonant_Q(ACC_sentence[start + 1]) == TRUE);
        assert(consonant_Q(ACC_sentence[start + 2]) == TRUE);
        start = 2;
    } 
    if (consonant_Q(ACC_sentence[start]) == TRUE) {
        if (consonant_Q(ACC_sentence[start + 1]) == TRUE) {
            assert(vowel_Q(ACC_sentence[start + 2]) == TRUE);
            assert(consonant_Q(ACC_sentence[start + 3]) == TRUE);
            text_copy(ACC_sentence, start, start + 4, DAT_word);
            *DAT_GEN_length = 4;
        } else if (vowel_Q(ACC_sentence[start + 1]) == TRUE) {
            text_copy(ACC_sentence, start, start + 2, DAT_word);
            *DAT_GEN_length = 2;
        }
    } 
}

void encode_ACC_word_DAT_number(const char* restrict word,
        const uint8_t ACC_GEN_length,
        uint16_t* restrict number){
    assert(ACC_GEN_length > 0);
    assert(word != NULL);
    assert(number != NULL);
}

void align_word(const char* restrict ACC_sentence, 
        const uint8_t ACC_GEN_length,
        uint16_t* restrict DAT_encode_sentence,
        uint8_t* restrict DAT_GEN_length) {
/* identify if two glyph or four glyph word
    if there is a three glyph word or bad parse
    then return an error message, 
        which indicates the location of the error. 
    if there is a two or four glyph word
    then convert it to a uint32_t and store in DAT_sentence
assumptions:
    this is used in a reduce like manner, so many function
    together, the last two glyphs can overlap with next 
    sentence, so if they are a four glyph word then keep them, 
    otherwise ignore. 
algorithm:
       
*/
    char DAT_word[WORD_LENGTH];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    uint8_t i = 0;
    uint8_t j = 0;
    uint16_t number = 0;
    memset(DAT_word, 0, WORD_LENGTH);
    assert(ACC_sentence != NULL);
    assert(ACC_GEN_length > 0);
    assert(DAT_encode_sentence != NULL);
    assert(*DAT_GEN_length >= ACC_GEN_length / 2);
    for(; i < ACC_GEN_length / 2; j++) {
        derive_first_word(ACC_sentence + i, ACC_GEN_length - i,
            DAT_word, &DAT_word_GEN_length);
            encode_ACC_word_DAT_number(DAT_word, 
                DAT_word_GEN_length, &number);
            i += DAT_word_GEN_length;
            DAT_word_GEN_length = 4;
            DAT_encode_sentence[j] = number;
    }

}

