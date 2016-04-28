extern "C" {
#include <stdint.h>
#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "seed.h"

#define TRUE 1
#define FALSE 0

static const char consonant_group[] = {
    'p','t','k','f', 's','c','x','b', 
    'd','g','v','z', 'j','n','m','q', 
    'r','l','y','w', '1','8','h'};
static const uint8_t consonant_group_length = 23;
static const char vowel_group[] = {'i','a','u','e','o','6'};
static const uint8_t vowel_group_length = 6;
static const char tone_group[] = {'7','_'};
static const uint8_t tone_group_length = 2;
#define CONSONANT_ONE_ENCODE_LENGTH 32
static const uint8_t
        consonant_one_encode_group[CONSONANT_ONE_ENCODE_LENGTH][2] = 
    { /* LOC 0 ESS consonant one */
        {(uint8_t) 'S', 0x0},
        {(uint8_t) 'm', 0x1},
        {(uint8_t) 'k', 0x2},
        {(uint8_t) 'y', 0x3},
        {(uint8_t) 'p', 0x4},
        {(uint8_t) 'w', 0x5},
        {(uint8_t) 'n', 0x6},
        {(uint8_t) 'L', 0x7},
        {(uint8_t) 'S', 0x8},
        {(uint8_t) 's', 0x9},
        {(uint8_t) 't', 0xA},
        {(uint8_t) 'l', 0xB},
        {(uint8_t) 'f', 0xC},
        {(uint8_t) 'c', 0xD},
        {(uint8_t) 'r', 0xE},
        {(uint8_t) 'L', 0xF},
        {(uint8_t) 'S', 0x10},
        {(uint8_t) 'b', 0x11},
        {(uint8_t) 'g', 0x12},
        {(uint8_t) 'd', 0x13},
        {(uint8_t) 'z', 0x14},
        {(uint8_t) 'j', 0x15},
        {(uint8_t) 'v', 0x16},
        {(uint8_t) 'L', 0x17},
        {(uint8_t) 'S', 0x18},
        {(uint8_t) 'q', 0x19},
        {(uint8_t) 'x', 0x1A},
        {(uint8_t) '1', 0x1B},
        {(uint8_t) '8', 0x1C},
        {(uint8_t) 'Q', 0x1D},
        {(uint8_t) 'S', 0x1E},
        {(uint8_t) 'L', 0x1F}
};
#define CONSONANT_TWO_ENCODE_LENGTH 11
static const uint8_t
    consonant_two_encode_group[CONSONANT_TWO_ENCODE_LENGTH][2] = {
    /* LOC 1 ESS consonant two */
    {(uint8_t) 'y', 0},
    {(uint8_t) 'w', 1},
    {(uint8_t) 's', 2},
    {(uint8_t) 'z', 2},
    {(uint8_t) 'l', 3},
    {(uint8_t) 'f', 4},
    {(uint8_t) 'v', 4},
    {(uint8_t) 'c', 5},
    {(uint8_t) 'j', 5},
    {(uint8_t) 'r', 6},
    {(uint8_t) 'x', 7}
};
#define VOWEL_ENCODE_LENGTH 8
static const uint8_t
        vowel_encode_group[VOWEL_ENCODE_LENGTH][2] = { 
    /* LOC 2 ESS vowel */
    {(uint8_t) 'i', 0},
    {(uint8_t) 'a', 1},
    {(uint8_t) 'u', 2},
    {(uint8_t) 'e', 3},
    {(uint8_t) 'o', 4},
    {(uint8_t) '6', 5},
    {(uint8_t) 'U', 6},
    {(uint8_t) 'U', 7}
};
#define TONE_ENCODE_LENGTH 4
static const uint8_t tone_encode_group[TONE_ENCODE_LENGTH][2] = { 
    /* LOC 3 ESS tone */
    {(uint8_t) 'M', 0},
    {(uint8_t) '7', 1},
    {(uint8_t) '_', 2},
    {(uint8_t) 'U', 3}
};
#define CONSONANT_THREE_ENCODE_LENGTH 8
static const uint8_t
    consonant_three_encode_group[CONSONANT_THREE_ENCODE_LENGTH][2] = { 
    /* LOC 4 ESS consonant three */
    {(uint8_t) 'm', 0},
    {(uint8_t) 'k', 1},
    {(uint8_t) 'p', 2},
    {(uint8_t) 'n', 3},
    {(uint8_t) 's', 3},
    {(uint8_t) 't', 3},
    {(uint8_t) 'f', 3},
    {(uint8_t) 'c', 3}
};
/*static const char secondary_group[] = {'f','s','c','y', 
    'r','w','l','x', 'z','j','v'};
#define SECONDARY_SET_LENGTH 11
static const char last_group[] = {'p','t','k','f', 's','c','n','m'};
#define LAST_SET_LENGTH 8
*/


static uint8_t vowel_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < vowel_group_length; i++) {
       if (vowel_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}
static uint8_t tone_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < tone_group_length; i++) {
       if (tone_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}
static uint8_t consonant_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < consonant_group_length; i += 1) {
       if (consonant_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}

void delete_empty_glyph(const char* __restrict__ text, 
        const uint16_t ACC_GEN_length,
        char* __restrict__ DAT_text, 
        uint16_t* __restrict__ DAT_length) {
    uint16_t i = 0;
    uint16_t j = 0;
    char glyph;
    assert(ACC_GEN_length <= *DAT_length);
    assert(text != NULL);
    assert(DAT_text != NULL);
    for (i = 0; i < ACC_GEN_length; i += 1) {
        glyph = text[i];
        if(consonant_Q(glyph) == TRUE ||
                vowel_Q(glyph) == TRUE ||
                tone_Q(glyph) == TRUE) {
            DAT_text[j] = glyph;
            j += 1;
        }
    }
    *DAT_length = j;
}

static void text_copy(const char* __restrict__ ACC_text, 
    const uint8_t ABL_start, const uint8_t ALLA_end, 
    char* __restrict__ DAT_text) {
    uint8_t i;
    for (i = 0; i + ABL_start < ALLA_end; i++) {
        DAT_text[i] = ACC_text[i + ABL_start];
    }
}

void derive_first_word(const char* __restrict__ ACC_sentence,
        const uint8_t ACC_GEN_length,
        char* __restrict__ DAT_word,
        uint8_t* __restrict__ DAT_GEN_length) {
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
            if (tone_Q(ACC_sentence[start + 3]) == TRUE) {
                assert(consonant_Q(ACC_sentence[start + 4]) ==
                    TRUE);
                text_copy(ACC_sentence, start, start + 5,
                    DAT_word);
                *DAT_GEN_length = 5;
            } else {
                assert(consonant_Q(ACC_sentence[start + 3]) ==
                    TRUE);
                text_copy(ACC_sentence, start, start + 4,
                    DAT_word);
                *DAT_GEN_length = 4;
            }
        } else if (vowel_Q(ACC_sentence[start + 1]) == TRUE) {
            if (tone_Q(ACC_sentence[start + 2]) == TRUE) {
                text_copy(ACC_sentence, start, start + 3,
                    DAT_word);
                *DAT_GEN_length = 3;
            } else {
                text_copy(ACC_sentence, start, start + 2,
                    DAT_word);
                *DAT_GEN_length = 2;
            }
        }
    } 
}

static inline void encode_ACC_consonant_one(const uint8_t type,
        const uint8_t consonant_one,
        uint16_t* __restrict__ number) {
    uint8_t i,
        consonant_number = CONSONANT_ONE_ENCODE_LENGTH;
    assert(consonant_Q((char) consonant_one) == TRUE);
    if (consonant_one != 0 && type != SHORT_ROOT) {
        for (i = 0; i < CONSONANT_ONE_ENCODE_LENGTH; i++) {
            if (consonant_one_encode_group[i][0] ==
                    consonant_one) {
                consonant_number = consonant_one_encode_group[i][1];
                assert(consonant_number <
                    CONSONANT_ONE_ENCODE_LENGTH);
                if (type == LONG_ROOT) {
                    *number = consonant_number;
                    break;
                } else if (type == LONG_GRAMMAR) {
                    *number |= (uint16_t)
                        consonant_number << BANNER_WIDTH;
                    break;
                } else if (type == SHORT_GRAMMAR) {
                    *number |= (uint16_t)
                        consonant_number << CONSONANT_ONE_WIDTH;
                    break;
                }
            }
        }
    }
    assert(consonant_number != CONSONANT_ONE_ENCODE_LENGTH);
}

static inline void encode_ACC_consonant_two(const uint8_t type,
        const uint8_t consonant_two,
        uint16_t* __restrict__ number) {
    uint8_t i,
        consonant_number = CONSONANT_TWO_ENCODE_LENGTH;
    assert(consonant_Q((char) consonant_two) == TRUE);
    if (consonant_two != 0 && type == SHORT_ROOT) {
        for (i = 0; i < CONSONANT_ONE_ENCODE_LENGTH; i++) {
            if (consonant_one_encode_group[i][0] ==
                    consonant_two) {
                consonant_number = 
                    consonant_one_encode_group[i][1];
                assert(consonant_number <
                    CONSONANT_ONE_ENCODE_LENGTH);
                *number |= (uint16_t)
                    consonant_number << 
                    BANNER_WIDTH;
                break;
            }
        }
    }
    if (consonant_two != 0 && type != SHORT_ROOT &&
            type != SHORT_GRAMMAR) {
        for (i = 0; i < CONSONANT_TWO_ENCODE_LENGTH; i++) {
            if (consonant_two_encode_group[i][0] ==
                    consonant_two) {
                consonant_number = 
                    consonant_one_encode_group[i][1];
                assert(consonant_number <
                    CONSONANT_TWO_ENCODE_LENGTH);
                if (type == LONG_ROOT) {
                    *number |= (uint16_t)
                        consonant_number <<
                        CONSONANT_ONE_WIDTH;
                    break;
                } else if (type == LONG_GRAMMAR) {
                    *number |= (uint16_t)
                        consonant_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH);
                    break;
                }
            }
        }
    }
    assert(consonant_number != CONSONANT_TWO_ENCODE_LENGTH);
}

static inline void encode_ACC_vowel(const uint8_t type,
        const uint8_t vowel,
        uint16_t* __restrict__ number) {
    uint8_t i,
        vowel_number = VOWEL_ENCODE_LENGTH;
    assert(vowel_Q((char) vowel) == TRUE);
    if (vowel != 0) {
        for (i = 0; i < VOWEL_ENCODE_LENGTH; i++) {
            if (vowel_encode_group[i][0] == vowel) {
                vowel_number = vowel_encode_group[i][1];
                assert(vowel_number < VOWEL_ENCODE_LENGTH);
                if (type == LONG_ROOT) {
                    *number |= (uint16_t) vowel_number <<
                        (CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH);
                    break;
                } else if (type == SHORT_ROOT) {
                    *number |= (uint16_t)
                        vowel_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH);
                    break;
                } else if (type == LONG_GRAMMAR) {
                    *number |= (uint16_t)
                        vowel_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH);
                    break;
                } else if (type == SHORT_GRAMMAR) {
                    *number |= (uint16_t)
                        vowel_number << 
                        (CONSONANT_ONE_WIDTH * 2);
                    break;
                }
            }
        }
    }
    assert(vowel_number != VOWEL_ENCODE_LENGTH);
}

static inline void encode_ACC_type(const char* word,
        const uint8_t ACC_GEN_length, 
        uint8_t *type,
        uint16_t *number) {
    assert(word != NULL);
    assert(ACC_GEN_length <= WORD_LENGTH);
    if (ACC_GEN_length == 2 || ACC_GEN_length == 3) {
        *type = SHORT_GRAMMAR;
        *number = 30;
    } else if (ACC_GEN_length == 4 &&
        word[3] == 'h') {
        *type = LONG_GRAMMAR;
        *number = 7;
    } else if (ACC_GEN_length == 4 &&
        word[0] == 'h') {
        *type = SHORT_ROOT;
        *number = 0;
    } else if (ACC_GEN_length == 5 &&
        word[0] == 'h') {
        *type = SHORT_ROOT;
        *number = 0;
    } else if (ACC_GEN_length == 5 &&
        word[4] == 'h') {
        *type = LONG_GRAMMAR;
        *number = 7;
    } else if (ACC_GEN_length == 5) {
        *type = LONG_ROOT;
        *number = 0;
    } else {
        *type = WRONG_TYPE;
        *number = 0;
    }
    assert(*type != WRONG_TYPE);
}

static inline void encode_ACC_tone(const uint8_t type,
        const uint8_t tone,
        uint16_t* __restrict__ number) {
    uint8_t i,
        tone_number = TONE_ENCODE_LENGTH;
    assert(tone_Q((char) tone) == TRUE);
    if (tone != 0) {
        for (i = 0; i < TONE_ENCODE_LENGTH; i++) {
            if (tone_encode_group[i][0] == tone) {
                tone_number = tone_encode_group[i][1];
                if (type == LONG_ROOT) {
                    *number |= (uint16_t) tone_number <<
                        (CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH + VOWEL_WIDTH);
                    break;
                } else if (type == SHORT_ROOT) {
                    *number |= (uint16_t) tone_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH +
                            VOWEL_WIDTH);
                    break;
                } else if (type == LONG_GRAMMAR) {
                    *number |= (uint16_t) tone_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH + VOWEL_WIDTH);
                    break;
                } else if (type == SHORT_GRAMMAR) {
                    *number |= (uint16_t) tone_number << 
                        (CONSONANT_ONE_WIDTH * 2 + VOWEL_WIDTH);
                    break;
                }
            }
        }
    }
    assert(tone_number != TONE_ENCODE_LENGTH);
}

static inline void encode_ACC_consonant_three(
        const uint8_t type,
        const uint8_t consonant_three,
        const uint8_t tone,
        uint16_t *number) {
    uint8_t i,
        consonant_number = CONSONANT_THREE_ENCODE_LENGTH;
    if (consonant_three != 0 && type != SHORT_GRAMMAR &&
            type != LONG_GRAMMAR) {
        for (i = 0; i < CONSONANT_THREE_ENCODE_LENGTH; i++) {
            if (consonant_three_encode_group[i][0] == 
                    consonant_three) {
                consonant_number = 
                    consonant_three_encode_group[i][1];
                if (type == LONG_ROOT && tone == 0) {
                    *number |= (uint16_t) 
                        consonant_number <<
                        (CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH + VOWEL_WIDTH);
                    break;
                } else if (type == SHORT_ROOT && tone == 0) {
                    *number |= (uint16_t)
                        consonant_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH +
                            VOWEL_WIDTH);
                    break;
                } else if (type == LONG_ROOT && tone != 0) {
                    *number |= (uint16_t)
                        consonant_number << 
                        (CONSONANT_ONE_WIDTH +
                            CONSONANT_TWO_WIDTH +
                            VOWEL_WIDTH + TONE_WIDTH);
                    break;
                } else if (type == SHORT_ROOT && tone != 0) {
                    *number |= (uint16_t)
                        consonant_number << 
                        (BANNER_WIDTH + CONSONANT_ONE_WIDTH +
                            VOWEL_WIDTH + TONE_WIDTH);
                    break;
                }
            }
        }
    }
    assert(consonant_number !=
        CONSONANT_THREE_ENCODE_LENGTH);
}
void encode_ACC_word_DAT_number(const char* __restrict__ word,
        const uint8_t ACC_GEN_length,
        uint16_t* __restrict__ DAT_number){
/* Algorithm:
    TEL set ACC NUM zero DAT number DEO
    identify type of word
    if ACC word kind ESS short root word
    then TEL mark ACC first three binary DAT NUM zero
    else-if ACC word kind ESS long grammar word
    then TEL mark ACC first three binary DAT NUM one 
    else-if ACC word kind ESS short grammar word
    then TEL mark ACC first byte DAT NUM thirty 
    UNQ glyph INE spot POSC word QUOT process
    ATEL search ACC encode table BEN glyph DAT glyph number DEO
    TEL multiply ACC glyph number INS spot DAT spot number DEO
    TEL add ACC spot number DAT number DEO 
    process QUOT DEO
*/ 
    uint8_t 
        consonant_one = 0, 
        consonant_two = 0, 
        vowel = 0, 
        tone = 0,
        consonant_three = 0,
        type = LONG_ROOT;
    uint16_t number = 0;
    assert(ACC_GEN_length > 0);
    assert(ACC_GEN_length <= WORD_LENGTH);
    assert(word != NULL);
    assert(DAT_number != NULL);
    encode_ACC_type(word, ACC_GEN_length, &type, &number);
    printf("t %X\n", (unsigned int) number);
    /* TEL fill ACC glyph variable PL */
    consonant_one = (uint8_t) word[0];
    assert(consonant_Q((char) consonant_one) == TRUE);
    if (ACC_GEN_length == 2) {
        vowel =  (uint8_t) word[1];
        assert(vowel_Q((char) vowel) == TRUE);
    } else if (ACC_GEN_length == 3) {
        vowel =  (uint8_t) word[1];
        tone =  (uint8_t) word[2];
        assert(vowel_Q((char) vowel) == TRUE);
        assert(tone_Q((char) tone) == TRUE);
    } else if (ACC_GEN_length == 4) {
        consonant_two   = (uint8_t) word[1];
        vowel           = (uint8_t) word[2];
        consonant_three = (uint8_t) word[3];
        assert(consonant_Q((char) consonant_two) == TRUE);
        assert(vowel_Q((char) vowel) == TRUE);
        assert(consonant_Q((char) consonant_three) == TRUE);
    } else if (ACC_GEN_length == 5) {
        consonant_two   = (uint8_t) word[1];
        vowel           = (uint8_t) word[2];
        tone            = (uint8_t) word[3];
        consonant_three = (uint8_t) word[4];
        assert(consonant_Q((char) consonant_two) == TRUE);
        assert(vowel_Q((char) vowel) == TRUE);
        assert(tone_Q((char) tone) == TRUE);
        assert(consonant_Q((char) consonant_three) == TRUE);
    }
    encode_ACC_consonant_one(type, consonant_one, &number);
    printf("c1 %X\n", (unsigned int) number);
    if (consonant_two != 0 && type == SHORT_ROOT) {
        encode_ACC_consonant_two(type, consonant_two, &number);
        printf("c2 %X\n", (unsigned int) number);
    }
    encode_ACC_vowel(type, vowel, &number);
    printf("v %X\n", (unsigned int) number);
    if (tone != 0) {
        encode_ACC_tone(type, tone, &number);
        printf("t %X\n", (unsigned int) number);
    }
    if (consonant_three != 0 && type != LONG_GRAMMAR) {
        encode_ACC_consonant_three(type, consonant_three, tone,
            &number);
        printf("c3 %X\n", (unsigned int) number);
    }
    *DAT_number = number;
}

void align_word(const char* __restrict__ ACC_sentence, 
        const uint8_t ACC_GEN_length,
        uint16_t* __restrict__ DAT_encode_sentence,
        uint8_t* __restrict__ DAT_GEN_length) {
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

}
