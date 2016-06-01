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
    'r','l','y','w', '1','8','h','.'};
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
//static const char secondary_group[] = {'f','s','c','y', 
//    'r','w','l','x', 'z','j','v'};
//#define SECONDARY_SET_LENGTH 11
//static const char last_group[] = {'p','t','k','f', 's','c','n','m'};
//#define LAST_SET_LENGTH 8


static inline uint8_t vowel_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < vowel_group_length; i++) {
       if (vowel_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}
static inline uint8_t tone_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < tone_group_length; i++) {
       if (tone_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}
static inline uint8_t consonant_Q(const char glyph) {
    uint8_t i;
    for (i = 0; i < consonant_group_length; i += 1) {
       if (consonant_group[i] == glyph) {
            return TRUE;
       } 
    }
    return FALSE;
}

void delete_empty_glyph(const char* restrict text, 
        const uint16_t ACC_GEN_length,
        char* restrict DAT_text, 
        uint16_t* restrict DAT_length) {
    uint16_t i = 0;
    uint16_t j = 0;
    char glyph;
    assert(ACC_GEN_length <= *DAT_length);
    assert(text != NULL);
    assert(DAT_text != NULL);
    assert(text != DAT_text);
    for (i = 0; i < ACC_GEN_length; i += 1) {
        glyph = text[i];
        if(consonant_Q(glyph) == TRUE ||
                vowel_Q(glyph) == TRUE ||
                tone_Q(glyph) == TRUE) {
            DAT_text[j] = glyph;
            j += 1;
        } else {
        }
    }
    *DAT_length = j;
}

void text_copy(const char* restrict ACC_text, 
    const uint8_t length, char* restrict DAT_text) {
    uint8_t i;
    assert(ACC_text != NULL);
    assert(length > 0);
    assert(DAT_text != NULL);
    for (i = 0; i < length; i++) {
        DAT_text[i] = ACC_text[i];
    }
}
static inline void copy_ACC_text_DAT_lump(
        const char* restrict text, 
        const uint8_t text_length, 
        uint16_t* restrict lump,
        const uint8_t lump_length) {
    uint8_t text_spot;
    uint8_t lump_spot = 0;
    assert(lump_length >= text_length/2);
    for (text_spot = 0; text_spot < text_length; ++text_spot) {
        printf("text_spot %X %X ", (unsigned int) text_spot, 
            (unsigned int) text_length);
        if (text_length > text_spot + 1) {
            lump[lump_spot] = (uint16_t) text[text_spot] |
                (((uint16_t) text[text_spot + 1]) << 8);
            ++text_spot;
        printf("lump %X \n", (unsigned int) lump[lump_spot]);
        } else {
            lump[lump_spot] = (uint16_t) text[text_spot];
        }
        ++lump_spot;
    }
}

#define derive_first_word_exit \
    *DAT_GEN_length = 0; \
    return; 

inline void derive_first_word(const char* restrict ACC_sentence,
        const uint8_t ACC_GEN_length,
        char* restrict DAT_word,
        uint8_t* restrict DAT_GEN_length) {
    uint8_t start = 0;
    assert(ACC_sentence != NULL);
    if (ACC_GEN_length < 2) {
        derive_first_word_exit;
    }
    assert(ACC_GEN_length > 1);
    assert(DAT_word != NULL);
    assert(*DAT_GEN_length >= WORD_LENGTH);
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
        if (consonant_Q(ACC_sentence[start + 1]) == FALSE ||
            consonant_Q(ACC_sentence[start + 2]) == FALSE) {
                derive_first_word_exit;
        }
        assert(consonant_Q(ACC_sentence[start + 1]) == TRUE);
        assert(consonant_Q(ACC_sentence[start + 2]) == TRUE);
        start = 2;
    } 
    if (consonant_Q(ACC_sentence[start]) == TRUE) {
        if (consonant_Q(ACC_sentence[start + 1]) == TRUE) {
            if (vowel_Q(ACC_sentence[start + 2]) == FALSE) {
                derive_first_word_exit;
            }
            assert(vowel_Q(ACC_sentence[start + 2]) == TRUE);
            if (tone_Q(ACC_sentence[start + 3]) == TRUE) {
                if (consonant_Q(ACC_sentence[start + 4]) ==
                        FALSE) {
                    derive_first_word_exit; 
                }
                assert(consonant_Q(ACC_sentence[start + 4]) ==
                    TRUE);
                text_copy(ACC_sentence + start, start + 5,
                    DAT_word);
                *DAT_GEN_length = 5;
            } else {
                if(consonant_Q(ACC_sentence[start + 3]) ==
                        FALSE) {
                    derive_first_word_exit; 
                }
                assert(consonant_Q(ACC_sentence[start + 3]) ==
                    TRUE);
                text_copy(ACC_sentence + start, start + 4,
                    DAT_word);
                *DAT_GEN_length = 4;
            }
        } else if (vowel_Q(ACC_sentence[start + 1]) == TRUE) {
            if (tone_Q(ACC_sentence[start + 2]) == TRUE) {
                text_copy(ACC_sentence + start, start + 3,
                    DAT_word);
                *DAT_GEN_length = 3;
            } else {
                text_copy(ACC_sentence + start, start + 2,
                    DAT_word);
                *DAT_GEN_length = 2;
            }
        }
    } 
}

static inline void encode_ACC_consonant_one(const uint8_t type,
        const uint8_t consonant_one,
        uint16_t* restrict number) {
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
        uint16_t* restrict number) {
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
    assert(consonant_number != CONSONANT_ONE_ENCODE_LENGTH);
}

static inline void encode_ACC_vowel(const uint8_t type,
        const uint8_t vowel,
        uint16_t* restrict number) {
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
    //printf("w %s\n", word);
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
    } else if (ACC_GEN_length == 4) {
        *type = LONG_ROOT;
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
        *type = WRONG_WORD;
        *number = 0;
    }
    assert(*type != WRONG_WORD);
}

static inline void encode_ACC_tone(const uint8_t type,
        const uint8_t tone,
        uint16_t* restrict number) {
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
    assert(consonant_number != CONSONANT_THREE_ENCODE_LENGTH);
}
#define encode_exit \
    *DAT_number = 0; \
    return;
void encode_ACC_word_DAT_number(const char* restrict word,
        const uint8_t ACC_GEN_length,
        uint16_t* restrict DAT_number){
/* Algorithm:
    TEL set ACC NUM zero DAT number DEO
    identify type of word
    if ACC word class ESS short root word
    then TEL mark ACC first three binary DAT NUM zero
    else-if ACC word class ESS long grammar word
    then TEL mark ACC first three binary DAT NUM one 
    else-if ACC word class ESS short grammar word
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
    //printf("type %X\n", (unsigned int) number);
    /* TEL fill ACC glyph variable PL */
    consonant_one = (uint8_t) word[0];
    if (consonant_Q((char) consonant_one) == FALSE) {
        encode_exit;
    }
    assert(consonant_Q((char) consonant_one) == TRUE);
    if (ACC_GEN_length == 2) {
        vowel =  (uint8_t) word[1];
        if(vowel_Q((char) vowel) == FALSE) {
            encode_exit;
        }
        assert(vowel_Q((char) vowel) == TRUE);
    } else if (ACC_GEN_length == 3) {
        vowel =  (uint8_t) word[1];
        tone =  (uint8_t) word[2];
        if (vowel_Q((char) vowel) == FALSE ||
                tone_Q((char) tone) == FALSE) {
            encode_exit;
        }
        assert(vowel_Q((char) vowel) == TRUE);
        assert(tone_Q((char) tone) == TRUE);
    } else if (ACC_GEN_length == 4) {
        consonant_two   = (uint8_t) word[1];
        vowel           = (uint8_t) word[2];
        consonant_three = (uint8_t) word[3];
        if (consonant_Q((char) consonant_two) == FALSE ||
                vowel_Q((char) vowel) == FALSE ||
                consonant_Q((char) consonant_three) ==  FALSE) {
            encode_exit;
        }
        assert(consonant_Q((char) consonant_two) == TRUE);
        assert(vowel_Q((char) vowel) == TRUE);
        assert(consonant_Q((char) consonant_three) == TRUE);
    } else if (ACC_GEN_length == 5) {
        consonant_two   = (uint8_t) word[1];
        vowel           = (uint8_t) word[2];
        tone            = (uint8_t) word[3];
        consonant_three = (uint8_t) word[4];
        if (consonant_Q((char) consonant_two) == FALSE ||
                vowel_Q((char) vowel) ==  FALSE ||
                tone_Q((char) tone) == FALSE ||
                consonant_Q((char) consonant_three) == FALSE) {
            encode_exit;
        }
        assert(consonant_Q((char) consonant_two) == TRUE);
        assert(vowel_Q((char) vowel) == TRUE);
        assert(tone_Q((char) tone) == TRUE);
        assert(consonant_Q((char) consonant_three) == TRUE);
    }
    if (consonant_one != 0 && type != SHORT_ROOT) {
        encode_ACC_consonant_one(type, consonant_one, &number);
        //printf("c1 %X\n", (unsigned int) number);
    }
    if (consonant_two != 0) {
        encode_ACC_consonant_two(type, consonant_two, &number);
        //printf("c2 %X\n", (unsigned int) number);
    }
    encode_ACC_vowel(type, vowel, &number);
    //printf("v %X\n", (unsigned int) number);
    if (tone != 0) {
        encode_ACC_tone(type, tone, &number);
        //printf("tone %X\n", (unsigned int) number);
    }
    if (consonant_three != 0 && type != LONG_GRAMMAR) {
        encode_ACC_consonant_three(type, consonant_three, tone,
            &number);
        //printf("c3 %X\n", (unsigned int) number);
    }
    *DAT_number = number;
}

void encode_ACC_word_PL(const char* restrict ACC_sentence, 
        const uint8_t ACC_GEN_length,
        uint16_t* restrict DAT_encode_sentence,
        uint8_t* restrict DAT_GEN_length,
        uint8_t* restrict DAT_GEN_remainder) {
/* identify if two glyph or four glyph word
    if there is a bad parse
    then return an error message, 
        which indicates the location of the error. 
assumptions:
    this is can be used in a reduce like manner, 
    so many function together, which is enabled if length is
    full width, or 0xFF the last two glyphs can 
    overlap with next sentence, so if they are a four glyph word
    then keep them, otherwise ignore. 
algorithm:
*/
    char DAT_word[WORD_LENGTH];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    uint8_t i = 0;
    uint8_t j = 0;
    uint16_t number = 0;
    uint8_t length = ACC_GEN_length;
    if (ACC_GEN_length == 0xFF) { // see assumptions
        length = 0xFF - 2;
    }
    memset(DAT_word, 0, WORD_LENGTH);
    assert(ACC_sentence != NULL);
    assert(ACC_GEN_length > 0);
    assert(DAT_encode_sentence != NULL);
    assert(*DAT_GEN_length >= ACC_GEN_length / 2);
    for(; i < ACC_GEN_length; j++) { 
        derive_first_word(ACC_sentence + i, ACC_GEN_length - i,
            DAT_word, &DAT_word_GEN_length);
        //printf("%s %d \n", ACC_sentence +i, 
        //    (int) DAT_word_GEN_length);
        if (DAT_word_GEN_length == 0) {
            *DAT_GEN_remainder = ACC_GEN_length - i;
            break;
        }
        encode_ACC_word_DAT_number(DAT_word, 
            DAT_word_GEN_length, &number);
        i += DAT_word_GEN_length;
        DAT_encode_sentence[j] = number;
        DAT_word_GEN_length = WORD_LENGTH;
    }
    *DAT_GEN_length = j;
}

/* remember if binary_phrase_list beginning is one
    then is last lump or only of sentence
    else if binary_phrase_list begining is zero,
    then is part lump of sentence
*/
static inline void establish_ACC_binary_phrase_list(
        const uint16_t* restrict encode_text,
        const uint8_t sentence_length, 
        uint16_t* binary_phrase_list,
        uint16_t* lump) {
    uint8_t current = 0;
    uint8_t i = 0;
    assert(encode_text != NULL);
    assert(sentence_length != 0);
    assert(sentence_length <= LUMP_WORD_LENGTH *
        MAX_SENTENCE_LUMP + 1);
    assert(binary_phrase_list != NULL);
    if (*binary_phrase_list == 0) {
        current = ~current;
    }
    for (i = 0; i < sentence_length; i++) {
        if (current == 2) break;
        switch (current) {
            /*case 0: 
                *binary_phrase_list |= 0 << (i + 1);
                break; */
            case 0xFF: 
                *binary_phrase_list |= 1 << (i + 1);
                break;
            default: 
                break;
        }
        lump[i + 1] = encode_text[i];
        switch (encode_text[i]) {
            case ACCUSATIVE_CASE:
                current = ~current; 
                break;
            case INSTRUMENTAL_CASE:
                current = ~current; 
                break;
            case DATIVE_CASE:
                current = ~current; 
                break;
            case DEONTIC_MOOD:
                current = 2;
                break;
            default: 
                break;
        }
        
    }
    lump[0] = *binary_phrase_list;
    
}
void lump_encode(
        const uint16_t* encode_text,
        const uint8_t encode_text_length,
        uint16_t* lump,
        uint8_t* lump_length,
        uint8_t* remainder) {
    uint16_t binary_phrase_list = 0;
    uint8_t i = 0;
    uint8_t sentence_length = 0;
    uint8_t lump_number = 0;
    assert(encode_text != NULL);
    assert(encode_text_length > 0);
    assert(lump != NULL);
    assert(lump_length != NULL);
    assert(remainder != NULL);
    assert(*lump_length >= 16);
    /* algorithm:
        detect end of sentence marker deontic-mood,
        set remainder as the rest.
        determine if can fit in one lump or need multiple*/
    for (i = 0; i < encode_text_length; i++) {
        if (encode_text[i] == DEONTIC_MOOD) {
            sentence_length = i + 1;
            break;
        }
    }
    assert(sentence_length > 0);
    for (i = 0; i < sentence_length; i += LUMP_WORD_LENGTH) {
        if (sentence_length - i >  LUMP_WORD_LENGTH) {
            binary_phrase_list = 0;
        } else {
            binary_phrase_list = 1;
        }
        establish_ACC_binary_phrase_list(encode_text + i,
            sentence_length - i, &binary_phrase_list, lump +
            lump_number);
        ++lump_number;
    }
    *remainder = encode_text_length - sentence_length;
    *lump_length = LUMP_LENGTH * lump_number;
}

static inline void detect_ACC_quote_length(const char* text,
    const uint8_t text_length,
    uint8_t* quote_spot,
    uint8_t* quote_length) {
    uint8_t class_length = 0;
    uint8_t text_spot = 0;
    uint8_t class_spot = 0;
    uint8_t found = FALSE;
    assert(text != NULL);
    assert(text_length > 0);
    assert(quote_spot != 0);
    assert(quote_length != NULL);
    /* algorithm:
        detect silence glyph surrounding quote class word
        search for same word to conclude quote
        answer quote_spot and quote_length*/
    // assure silence glyph at zero spot
    assert(text[0] == '.');
    ++class_length;
    // detect length of class word
    for(text_spot = 1; text_spot < text_length; ++text_spot) {
        ++class_length;
        if (text[text_spot] == '.') {
            break;
        } 
    }
    printf("class word length found\n");
    *quote_spot = class_length;
    // detect next class word COM quote word
    for(text_spot = class_length; text_spot < text_length; 
            ++text_spot) {
        if (text_spot + class_length > text_length) {
            *quote_length = 0;
            break;
        }
        for(class_spot = 0; class_spot <= class_length; 
                ++class_spot) {
            if (class_spot == class_length) {
                // found
                *quote_length = text_spot - class_length;
                found = TRUE;
            }
            if (text[text_spot + class_spot] != 
                    text[class_spot]) {
                break;
            }
        }
        if (found == TRUE) {
            break;
        }
    }
    
}

static inline void derive_quote_word(
    const uint8_t quote_length,
    uint16_t* restrict quote_word) {
    assert(quote_length > 0);
    assert(quote_length < 16);
    assert(quote_word != NULL);
    if (quote_length == 1) {
        *quote_word = 0x1D;
    } else if (quote_length == 2) {
        *quote_word = (uint16_t) 0x1D | (TWO_BYTE_QUOTE <<
            CONSONANT_ONE_WIDTH);
    } else if (quote_length > 2 && quote_length <= 4) {
        *quote_word = (uint16_t) 0x1D | (FOUR_BYTE_QUOTE <<
            CONSONANT_ONE_WIDTH);
    } else if (quote_length > 4 && quote_length <= 8) {
        *quote_word = (uint16_t) 0x1D | (EIGHT_BYTE_QUOTE <<
            CONSONANT_ONE_WIDTH);
    } else if (quote_length > 8 && quote_length <= 16) {
        *quote_word = (uint16_t) 0x1D | (SIXTEEN_BYTE_QUOTE <<
            CONSONANT_ONE_WIDTH);
    }
}
    
static inline void fit_quote_length(
    const uint8_t quote_length,
    uint8_t* restrict quote_lump_length) {
    assert(quote_lump_length != NULL);
    assert(quote_length > 0);
    assert(quote_length < 16);
    if (quote_length == 1) {
        *quote_lump_length = 0x0;
    } else if (quote_length == 2) {
        *quote_lump_length = 0x1;
    } else if (quote_length > 2 && quote_length <= 4) {
        *quote_lump_length = 0x2;
    } else if (quote_length > 4 && quote_length <= 8) {
        *quote_lump_length = 0x4;
    } else if (quote_length > 8 && quote_length <= 16) {
        *quote_lump_length = 0x8;
    }
}
    
void sentence_encode(
    const char* text,
    const uint8_t text_length,
    uint16_t* lump,
    uint8_t* lump_length,
    uint8_t* remainder) {
/* algorithm:
    loop through glyphs, 
    derive words
    if word is quote then add it to lump, 
        and add proper quote identifier.
    if word is accusative, instrumental, or dative,
        flip the index representation for it.
    if word is deontic-mood then set as ending lump. 
*/
    char glyph;
    uint8_t text_spot = 0;
    uint8_t lump_spot = 1;
    uint8_t quote_spot = 0;
    char word[WORD_LENGTH];
    uint8_t word_length = 0;
    char derived_word[WORD_LENGTH];
    uint8_t derived_word_length = WORD_LENGTH;
    uint16_t number = 0;
    uint16_t quote_word = 0;
    uint16_t binary_phrase_list = (uint16_t) 1;
    uint8_t quote_length = 0;
    uint8_t quote_lump_length = 0;
    uint8_t current = 0x0;
    memset(word, 0, WORD_LENGTH);
    memset(derived_word, 0, WORD_LENGTH);
    assert(text != NULL);
    assert(text_length > 0 );
    assert(lump != NULL);
    assert(lump_length != NULL);
    assert(remainder != NULL);
    assert(*lump_length >= LUMP_LENGTH * MAX_SENTENCE_LUMP);
    printf("sentence encoding\n");
    for (text_spot = 0; text_spot < text_length; 
            ++text_spot) {
        glyph = text[text_spot];
        if(consonant_Q(glyph) == TRUE ||
                vowel_Q(glyph) == TRUE ||
                tone_Q(glyph) == TRUE) {
            word[word_length] = glyph;
            //printf("%c", glyph);
            word_length += 1;
        } 
        if (word_length >= 2) {
            //printf("wl %X\n", (unsigned int) word_length);
            derived_word_length = WORD_LENGTH;
            derive_first_word(word, word_length, derived_word, 
                &derived_word_length);
            if (derived_word_length > 0) {
                encode_ACC_word_DAT_number(derived_word,
                    derived_word_length, &number);
                printf("n 0x%X \n", (unsigned int) number);
                if(number != 0) {
                switch(number) {
                    case QUOTE_WORD:
                        printf("detected quote word %X\n",
                            (unsigned int) text_spot);
                        ++text_spot;
                        detect_ACC_quote_length(
                            text + text_spot, 
                            text_length - text_spot, 
                            &quote_spot,
                            &quote_length);
                        printf("detected quote length %X\n",
                            (unsigned int) quote_length);
                        derive_quote_word(quote_length, 
                            &quote_word);
                        lump[lump_spot] = quote_word;
                        ++lump_spot;
                        copy_ACC_text_DAT_lump(
                            text + quote_spot + 2, 
                            quote_length, 
                            lump + lump_spot, 
                            *lump_length - lump_spot);
                        text_spot += (quote_spot - text_spot) *
                            2 + quote_length + 5;
                        word_length = 0;
                        fit_quote_length(quote_length, 
                            &quote_lump_length);
                        //if (current == 0xFF) {
                        //    binary_phrase_list |= (uint16_t)
                        //        (0xFFFF >> (0x10 -
                        //        (quote_lump_length + 1))) <<
                        //        (lump_spot - 1);
                        //}
                        printf("qll %X\n", (unsigned int)
                            quote_lump_length);
                        lump_spot += quote_lump_length;
                        printf("ls %X\n", (unsigned int)
                            lump_spot);
                        break;
                    case ACCUSATIVE_CASE:
                        binary_phrase_list ^= 
                            1 << lump_spot;
                        lump[lump_spot] = number;
                        ++lump_spot;
                        break;
                    case INSTRUMENTAL_CASE:
                        binary_phrase_list ^= 
                            1 << lump_spot;
                        lump[lump_spot] = number;
                        ++lump_spot;
                        break;
                    case DATIVE_CASE:
                        binary_phrase_list ^= 
                            1 << lump_spot;
                        lump[lump_spot] = number;
                        ++lump_spot;
                        break;
                    case CONDITIONAL_MOOD:
                        lump[lump_spot] = number;
                        binary_phrase_list ^= 
                            1 << lump_spot;
                        ++lump_spot;
                        break;
                    case DEONTIC_MOOD:
                        lump[lump_spot] = number;
                        binary_phrase_list ^= 
                            1 << lump_spot;
                        current = 2;
                        ++lump_spot;
                        break;
                    default:
                        lump[lump_spot] = number;
                        ++lump_spot;
                        break;
                }
                if (current == 2) break;
                word_length = 0;
                } else {
                    
                }
            }
        }
    }
    lump[0] = binary_phrase_list;
}
inline void realize(
        const uint16_t* lump,
        const uint16_t* grammaticalCase_list,
        const uint8_t* hook_list,
        const uint8_t grammaticalCase_spot,
        const uint16_t verb) {
    uint16_t quote = 0;
    uint8_t quote_spot = 0;
    uint8_t quote_length = 0;
    uint8_t lump_spot = 0;
    uint16_t word = 0;
    assert(lump != NULL);
    assert(grammaticalCase_list != NULL);
    assert(hook_list != NULL);
    assert(grammaticalCase_spot != 0);
    assert(verb != 0);
    switch (verb) {
        case SAY_VERB:
            quote_spot = hook_list[ACCUSATIVE_SPOT];
            assert(quote_spot != 0);
            quote = lump[quote_spot];
            quote_length = (uint8_t) 1 << ((quote >> 
                CONSONANT_ONE_WIDTH) & 7 /* three bit mask */);
            assert(quote_length != 1);
            for (lump_spot = quote_spot + 1; 
                        lump_spot < (quote_length/2 +
                            quote_spot + 1); ++lump_spot) {
                word = lump[lump_spot];
                printf("%c%c", (unsigned char) word & 0xFF,
                    (unsigned char) (word >> 8));
            }
            break;
        default: 
            printf("unrecognized verb %X\n", 
                (unsigned int) verb);
            assert(1 == 0);
            break;
    }
}
