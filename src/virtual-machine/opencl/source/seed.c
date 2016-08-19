/*SPEL virtual machine
Copyright (C) 2016  Logan Streondj

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

contact: streondj at gmail dot com
*/
#include "seed.h"
#include "dictionary.h"
#include <assert.h>
#include <stdio.h>  // NOT opencl compatible
#include <string.h> // NOT opencl compatible// uses memset and memcmp

static const char consonant_group[] = {'p', 't', 'k', 'f', 's', 'c', 'x', 'b',
                                       'd', 'g', 'v', 'z', 'j', 'n', 'm', 'q',
                                       'r', 'l', 'y', 'w', '1', '8', 'h', '.'};
static const uint8_t consonant_group_size = 23;
static const char vowel_group[] = {'i', 'a', 'u', 'e', 'o', '6'};
static const uint8_t vowel_group_size = 6;
static const char tone_group[] = {'7', '_'};
static const uint8_t tone_group_size = 2;
#define CONSONANT_ONE_ENCODE_LONG 32
static const uint8_t consonant_one_code_group[CONSONANT_ONE_ENCODE_LONG][2] =
    {/* LOC 0 ESS consonant one */
     {(uint8_t)'S', 0x0},  {(uint8_t)'m', 0x1},  {(uint8_t)'k', 0x2},
     {(uint8_t)'y', 0x3},  {(uint8_t)'p', 0x4},  {(uint8_t)'w', 0x5},
     {(uint8_t)'n', 0x6},  {(uint8_t)'L', 0x7},  {(uint8_t)'S', 0x8},
     {(uint8_t)'s', 0x9},  {(uint8_t)'t', 0xA},  {(uint8_t)'l', 0xB},
     {(uint8_t)'f', 0xC},  {(uint8_t)'c', 0xD},  {(uint8_t)'r', 0xE},
     {(uint8_t)'L', 0xF},  {(uint8_t)'S', 0x10}, {(uint8_t)'b', 0x11},
     {(uint8_t)'g', 0x12}, {(uint8_t)'d', 0x13}, {(uint8_t)'z', 0x14},
     {(uint8_t)'j', 0x15}, {(uint8_t)'v', 0x16}, {(uint8_t)'L', 0x17},
     {(uint8_t)'S', 0x18}, {(uint8_t)'q', 0x19}, {(uint8_t)'x', 0x1A},
     {(uint8_t)'1', 0x1B}, {(uint8_t)'8', 0x1C}, {(uint8_t)'Q', 0x1D},
     {(uint8_t)'S', 0x1E}, {(uint8_t)'L', 0x1F}};
#define CONSONANT_TWO_ENCODE_LONG 11
static const uint8_t consonant_two_code_group[CONSONANT_TWO_ENCODE_LONG][2] = {
    /* LOC 1 ESS consonant two */
    {(uint8_t)'y', 0}, {(uint8_t)'w', 1}, {(uint8_t)'s', 2}, {(uint8_t)'z', 2},
    {(uint8_t)'l', 3}, {(uint8_t)'f', 4}, {(uint8_t)'v', 4}, {(uint8_t)'c', 5},
    {(uint8_t)'j', 5}, {(uint8_t)'r', 6}, {(uint8_t)'x', 7}};
#define VOWEL_ENCODE_LONG 8
static const uint8_t vowel_code_group[VOWEL_ENCODE_LONG][2] = {
    /* LOC 2 ESS vowel */
    {(uint8_t)'i', 0}, {(uint8_t)'a', 1}, {(uint8_t)'u', 2}, {(uint8_t)'e', 3},
    {(uint8_t)'o', 4}, {(uint8_t)'6', 5}, {(uint8_t)'U', 6}, {(uint8_t)'U', 7}};
#define TONE_ENCODE_LONG 4
static const uint8_t tone_code_group[TONE_ENCODE_LONG][2] = {
    /* LOC 3 ESS tone */
    {(uint8_t)'M', 0},
    {(uint8_t)'7', 1},
    {(uint8_t)'_', 2},
    {(uint8_t)'U', 3}};
#define CONSONANT_THREE_ENCODE_LONG 8
static const uint8_t
    consonant_three_code_group[CONSONANT_THREE_ENCODE_LONG][2] = {
        /* LOC 4 ESS consonant three */
        {(uint8_t)'m', 0}, {(uint8_t)'k', 1}, {(uint8_t)'p', 2},
        {(uint8_t)'n', 3}, {(uint8_t)'s', 4}, {(uint8_t)'t', 5},
        {(uint8_t)'f', 6}, {(uint8_t)'c', 7}};
// static const char secondary_group[] = {'f','s','c','y',
//    'r','w','l','x', 'z','j','v'};
//#define SECONDARY_SET_LONG 11
// static const char last_group[] = {'p','t','k','f', 's','c','n','m'};
//#define LAST_SET_LONG 8

static inline uint8_t vowel_Q(const char glyph) {
  uint8_t i;
  for (i = 0; i < vowel_group_size; i++) {
    if (vowel_group[i] == glyph) {
      return TRUE;
    }
  }
  return FALSE;
}
static inline uint8_t tone_Q(const char glyph) {
  uint8_t i;
  for (i = 0; i < tone_group_size; i++) {
    if (tone_group[i] == glyph) {
      return TRUE;
    }
  }
  return FALSE;
}
static inline uint8_t consonant_Q(const char glyph) {
  uint8_t i;
  for (i = 0; i < consonant_group_size; ++i) {
    if (consonant_group[i] == glyph) {
      return TRUE;
    }
  }
  return FALSE;
}

void delete_empty_glyph(const uint16_t ACC_GEN_size, const char *text,
                        uint16_t *DAT_size, char *DAT_text) {
  uint16_t i = 0;
  uint16_t j = 0;
  char glyph;
  assert(ACC_GEN_size <= *DAT_size);
  assert(text != NULL);
  assert(DAT_text != NULL);
  assert(text != DAT_text);
  for (i = 0; i < ACC_GEN_size; ++i) {
    glyph = text[i];
    if (consonant_Q(glyph) == TRUE || vowel_Q(glyph) == TRUE ||
        tone_Q(glyph) == TRUE) {
      DAT_text[j] = glyph;
      ++j;
    } else {
    }
  }
  *DAT_size = j;
}

void text_copy(const uint8_t size, const char *ACC_text, char *DAT_text) {
  uint8_t i;
  assert(ACC_text != NULL);
  assert(size > 0);
  assert(DAT_text != NULL);
  for (i = 0; i < size; ++i) {
    DAT_text[i] = ACC_text[i];
  }
}
static inline void copy_ACC_text_DAT_tablet(const char *text,
                                            const uint8_t text_size,
                                            v16us *tablet,
                                            const uint8_t tablet_offset,
                                            const uint8_t tablet_size) {
  uint8_t text_indexFinger;
  uint8_t tablet_indexFinger = 0;
  assert(tablet_size >= text_size / 2 / TABLET_LONG);
  assert(text != NULL);
  assert(tablet != NULL);
  for (text_indexFinger = 0; text_indexFinger < text_size; ++text_indexFinger) {
    if (text_size > text_indexFinger + 1) {
      ((uint16_t *)tablet)[tablet_indexFinger + tablet_offset] = (uint16_t)(
          text[text_indexFinger] | (text[text_indexFinger + 1] << 8));
      ++text_indexFinger;
    } else {
      ((uint16_t *)tablet)[tablet_indexFinger + tablet_offset] =
          (uint16_t)text[text_indexFinger];
    }
    // printf("tablet %04X \n", (uint) tablet[0][tablet_indexFinger +
    // tablet_offset]);
    ++tablet_indexFinger;
  }
}

#define derive_first_word_exit                                                 \
  *DAT_GEN_size = (uint8_t)0;                                                  \
  return;

inline void derive_first_word(const uint8_t ACC_GEN_size,
                              const char *ACC_independentClause,
                              uint8_t *DAT_GEN_size, char *DAT_word) {
  uint8_t start = 0;
  assert(ACC_independentClause != NULL);
  if (ACC_GEN_size < 2) {
    derive_first_word_exit;
  }
  assert(ACC_GEN_size > 1);
  assert(DAT_word != NULL);
  assert(*DAT_GEN_size >= WORD_LONG);
  /* algorithm:
      if glyph zero ESS vowel
      then if glyph two not ESS consonant
          then answer ACC DEP wrong ACC glyph LOC two
          else restart ABL glyph two
      if glyph zero ESS consonant
      then
          if glyph one ESS consonant CNJ glyph two ESS vowel
              CNJ glyph three ESS consonant
          then copy ACC independentClause ABL glyph zero ALLA glyph
                  four DAT word
              CNJ copy ACC number four DAT size
              answer
          else if glyph one ESS vowel
          then copy ACC independentClause ABL glyph zero ALLA glyph two
              DAT word CNJ
              copy ACC number two DAT size
  */
  assert(vowel_Q(ACC_independentClause[start + 0]) == TRUE ||
         consonant_Q(ACC_independentClause[start + 0]) == TRUE);
  if (vowel_Q(ACC_independentClause[start]) == TRUE) {
    if (consonant_Q(ACC_independentClause[start + 1]) == FALSE ||
        consonant_Q(ACC_independentClause[start + 2]) == FALSE) {
      derive_first_word_exit;
    }
    assert(consonant_Q(ACC_independentClause[start + 1]) == TRUE);
    assert(consonant_Q(ACC_independentClause[start + 2]) == TRUE);
    start = 2;
  }
  if (consonant_Q(ACC_independentClause[start]) == TRUE) {
    if (consonant_Q(ACC_independentClause[start + 1]) == TRUE) {
      if (vowel_Q(ACC_independentClause[start + 2]) == FALSE) {
        derive_first_word_exit;
      }
      assert(vowel_Q(ACC_independentClause[start + 2]) == TRUE);
      if (tone_Q(ACC_independentClause[start + 3]) == TRUE) {
        if (consonant_Q(ACC_independentClause[start + 4]) == FALSE) {
          derive_first_word_exit;
        }
        assert(consonant_Q(ACC_independentClause[start + 4]) == TRUE);
        text_copy((uint8_t)(start + 5), ACC_independentClause + start,
                  DAT_word);
        *DAT_GEN_size = (uint8_t)5;
      } else {
        if (consonant_Q(ACC_independentClause[start + 3]) == FALSE) {
          derive_first_word_exit;
        }
        assert(consonant_Q(ACC_independentClause[start + 3]) == TRUE);
        text_copy((uint8_t)(start + 4), ACC_independentClause + start,
                  DAT_word);
        *DAT_GEN_size = (uint8_t)4;
      }
    } else if (vowel_Q(ACC_independentClause[start + 1]) == TRUE) {
      if (tone_Q(ACC_independentClause[start + 2]) == TRUE) {
        text_copy((uint8_t)(start + 3), ACC_independentClause + start,
                  DAT_word);
        *DAT_GEN_size = (uint8_t)3;
      } else {
        text_copy((uint8_t)(start + 2), ACC_independentClause + start,
                  DAT_word);
        *DAT_GEN_size = (uint8_t)2;
      }
    }
  }
  if (ACC_GEN_size < *DAT_GEN_size) {
    *DAT_GEN_size = 0;
  }
}

static inline void code_ACC_consonant_one(const uint8_t type,
                                          const uint8_t consonant_one,
                                          uint16_t *number) {
  uint8_t i, consonant_number = CONSONANT_ONE_ENCODE_LONG;
  assert(consonant_Q((char)consonant_one) == TRUE);
  if (consonant_one != 0 && type != SHORT_ROOT) {
    for (i = 0; i < CONSONANT_ONE_ENCODE_LONG; i++) {
      if (consonant_one_code_group[i][0] == consonant_one) {
        consonant_number = consonant_one_code_group[i][1];
        assert(consonant_number < CONSONANT_ONE_ENCODE_LONG);
        if (type == LONG_ROOT) {
          *number = consonant_number;
          break;
        } else if (type == LONG_GRAMMAR) {
          *number |= (uint16_t)(consonant_number << BANNER_THICK);
          break;
        } else if (type == SHORT_GRAMMAR) {
          *number |= (uint16_t)(consonant_number << CONSONANT_ONE_THICK);
          break;
        }
      }
    }
  }
  assert(consonant_number != CONSONANT_ONE_ENCODE_LONG);
}

static inline void code_ACC_consonant_two(const uint8_t type,
                                          const uint8_t consonant_two,
                                          uint16_t *number) {
  uint8_t i, consonant_number = CONSONANT_TWO_ENCODE_LONG;
  uint16_t start_number = *number;
  // printf("n %04X, t %X c2 %c \n", (uint) *number,
  //       (uint) type, (char) consonant_two);
  assert(consonant_Q((char)consonant_two) == TRUE);
  if (consonant_two != 0 && type == SHORT_ROOT) {
    for (i = 0; i < CONSONANT_ONE_ENCODE_LONG; i++) {
      if (consonant_one_code_group[i][0] == consonant_two) {
        consonant_number = consonant_one_code_group[i][1];
        assert(consonant_number < CONSONANT_ONE_ENCODE_LONG);
        *number |= (uint16_t)(consonant_number << BANNER_THICK);
        break;
      }
    }
  }
  if (consonant_two != 0 && type != SHORT_ROOT && type != SHORT_GRAMMAR) {
    for (i = 0; i < CONSONANT_TWO_ENCODE_LONG; i++) {
      if (consonant_two_code_group[i][0] == consonant_two) {
        consonant_number = consonant_two_code_group[i][1];
        assert(consonant_number < CONSONANT_TWO_ENCODE_LONG);
        if (type == LONG_ROOT) {
          // printf("C2LR cn %04X\n", (uint) consonant_number);
          // printf("C2LR %04X\n", (uint) consonant_number <<
          //       (CONSONANT_ONE_THICK));
          *number |= (uint16_t)(consonant_number << CONSONANT_ONE_THICK);
          break;
        } else if (type == LONG_GRAMMAR) {
          *number |= (uint16_t)(consonant_number
                                << (BANNER_THICK + CONSONANT_ONE_THICK));
          break;
        }
      }
    }
  }
  assert(consonant_number == 0 || *number != start_number);
  assert(consonant_number != CONSONANT_ONE_ENCODE_LONG);
}

static inline void code_ACC_vowel(const uint8_t type, const uint8_t vowel,
                                  uint16_t *number) {
  uint8_t i, vowel_number = VOWEL_ENCODE_LONG;
  // uint16_t start_number = *number;
  // printf("n %04X, t %X v %c \n", (uint) *number,
  //       (uint) type, (char) vowel);
  assert(vowel_Q((char)vowel) == TRUE);
  if (vowel != 0) {
    for (i = 0; i < VOWEL_ENCODE_LONG; i++) {
      if (vowel_code_group[i][0] == vowel) {
        vowel_number = vowel_code_group[i][1];
        assert(vowel_number < VOWEL_ENCODE_LONG);
        if (type == LONG_ROOT) {
          // printf("VLR %04X\n", (uint) vowel_number << (
          //       CONSONANT_ONE_THICK + CONSONANT_TWO_THICK));
          *number |= (uint16_t)(vowel_number
                                << (CONSONANT_ONE_THICK + CONSONANT_TWO_THICK));
          break;
        } else if (type == SHORT_ROOT) {
          *number |=
              (uint16_t)(vowel_number << (BANNER_THICK + CONSONANT_ONE_THICK));
          break;
        } else if (type == LONG_GRAMMAR) {
          // printf("VLG %04X\n", (uint) vowel_number << (BANNER_THICK +
          //       CONSONANT_ONE_THICK + CONSONANT_TWO_THICK));
          *number |=
              (uint16_t)(vowel_number << (BANNER_THICK + CONSONANT_ONE_THICK +
                                          CONSONANT_TWO_THICK));
          break;
        } else if (type == SHORT_GRAMMAR) {
          *number |= (uint16_t)(vowel_number << (CONSONANT_ONE_THICK * 2));
          break;
        }
      }
    }
  }
  // assert(vowel_number == 0 || *number != start_number);
  assert(vowel_number != VOWEL_ENCODE_LONG);
}

static inline void code_ACC_type(const char *word, const uint8_t ACC_GEN_size,
                                 uint8_t *type, uint16_t *number) {
  assert(word != NULL);
  assert(ACC_GEN_size <= WORD_LONG);
  // printf("w %s\n", word);
  if (ACC_GEN_size == 2 || ACC_GEN_size == 3) {
    *type = SHORT_GRAMMAR;
    *number = 30;
  } else if (ACC_GEN_size == 4 && word[3] == 'h') {
    *type = LONG_GRAMMAR;
    *number = 7;
  } else if (ACC_GEN_size == 4 && word[0] == 'h') {
    *type = SHORT_ROOT;
    *number = 0;
  } else if (ACC_GEN_size == 4) {
    *type = LONG_ROOT;
    *number = 0;
  } else if (ACC_GEN_size == 5 && word[0] == 'h') {
    *type = SHORT_ROOT;
    *number = 0;
  } else if (ACC_GEN_size == 5 && word[4] == 'h') {
    *type = LONG_GRAMMAR;
    *number = 7;
  } else if (ACC_GEN_size == 5) {
    *type = LONG_ROOT;
    *number = 0;
  } else {
    *type = ERROR_BINARY;
    *number = 0;
  }
  assert(*type != ERROR_BINARY);
}

static inline void code_ACC_tone(const uint8_t type, const uint8_t tone,
                                 uint16_t *number) {
  uint8_t i, tone_number = TONE_ENCODE_LONG;
  uint16_t start_number = *number;
  // printf("n %04X, t %X tn %c \n", (uint) *number,
  //       (uint) type, (char) tone);
  assert(tone_Q((char)tone) == TRUE);
  if (tone != 0) {
    for (i = 0; i < TONE_ENCODE_LONG; i++) {
      if (tone_code_group[i][0] == tone) {
        tone_number = tone_code_group[i][1];
        if (type == LONG_ROOT) {
          // printf("TLR %X\n", (uint)(tone_number <<
          //       (CONSONANT_ONE_THICK + CONSONANT_TWO_THICK + VOWEL_THICK)));
          *number |=
              (uint16_t)(tone_number << (CONSONANT_ONE_THICK +
                                         CONSONANT_TWO_THICK + VOWEL_THICK));
          break;
        } else if (type == SHORT_ROOT) {
          *number |=
              (uint16_t)(tone_number
                         << (BANNER_THICK + CONSONANT_ONE_THICK + VOWEL_THICK));
          break;
        } else if (type == LONG_GRAMMAR) {
          *number |=
              (uint16_t)(tone_number << (BANNER_THICK + CONSONANT_ONE_THICK +
                                         CONSONANT_TWO_THICK + VOWEL_THICK));
          break;
        } else if (type == SHORT_GRAMMAR) {
          *number |= (uint16_t)(tone_number
                                << (CONSONANT_ONE_THICK * 2 + VOWEL_THICK));
          break;
        }
      }
    }
  }
  assert(tone_number == 0 || *number != start_number);
  assert(tone_number != TONE_ENCODE_LONG);
}

static inline void code_ACC_consonant_three(const uint8_t type,
                                            const uint8_t consonant_three,
                                            const uint8_t tone,
                                            uint16_t *number) {
  uint8_t i, consonant_number = CONSONANT_THREE_ENCODE_LONG;
  uint16_t start_number = *number;
  // printf("n %04X, t %X c %c  tn %c\n", (uint) *number,
  //       (uint) type, (char) consonant_three, (char) tone);
  if (consonant_three != 0 && type != SHORT_GRAMMAR && type != LONG_GRAMMAR) {
    for (i = 0; i < CONSONANT_THREE_ENCODE_LONG; i++) {
      if (consonant_three_code_group[i][0] == consonant_three) {
        consonant_number = consonant_three_code_group[i][1];
        if (type == LONG_ROOT && tone == 0) {
          // printf("C3LR %04X \n", (uint) (consonant_number
          //               << (CONSONANT_ONE_THICK + CONSONANT_TWO_THICK +
          //                  VOWEL_THICK + TONE_THICK)));
          *number |= (uint16_t)(consonant_number
                                << (CONSONANT_ONE_THICK + CONSONANT_TWO_THICK +
                                    VOWEL_THICK + TONE_THICK));
          break;
        } else if (type == SHORT_ROOT && tone == 0) {
          // printf("SR %04X \n", (uint) (consonant_number
          //               << (BANNER_THICK + CONSONANT_ONE_THICK +
          //               VOWEL_THICK)));
          *number |= (uint16_t)(consonant_number
                                << (BANNER_THICK + CONSONANT_ONE_THICK +
                                    VOWEL_THICK + TONE_THICK));
          break;
        } else if (type == LONG_ROOT && tone != 0) {
          *number |= (uint16_t)(consonant_number
                                << (CONSONANT_ONE_THICK + CONSONANT_TWO_THICK +
                                    VOWEL_THICK + TONE_THICK));
          break;
        } else if (type == SHORT_ROOT && tone != 0) {
          *number |= (uint16_t)(consonant_number
                                << (BANNER_THICK + CONSONANT_ONE_THICK +
                                    VOWEL_THICK + TONE_THICK));
          break;
        }
      }
    }
  }
  assert(consonant_number == 0 || *number != start_number);
  assert(consonant_number != CONSONANT_THREE_ENCODE_LONG);
}
#define code_exit                                                              \
  *DAT_number = 0;                                                             \
  return;
void code_ACC_word_DAT_number(const uint8_t ACC_GEN_size, const char *word,
                              uint16_t *DAT_number) {
  /* Algorithm:
      TEL set ACC NUM zero DAT number DEO
      identify type of word
      if ACC word class ESS short root word
      then TEL mark ACC first three binary DAT NUM zero
      else-if ACC word class ESS long grammar word
      then TEL mark ACC first three binary DAT NUM one
      else-if ACC word class ESS short grammar word
      then TEL mark ACC first byte DAT NUM thirty
      UNQ glyph INE indexFinger POSC word QUOT process
      ATEL search ACC code table BEN glyph DAT glyph number DEO
      TEL multiply ACC glyph number INS indexFinger DAT indexFinger number DEO
      TEL add ACC indexFinger number DAT number DEO
      process QUOT DEO
  */
  uint8_t consonant_one = 0, consonant_two = 0, vowel = 0, tone = 0,
          consonant_three = 0, type = LONG_ROOT;
  uint16_t number = 0;
  assert(ACC_GEN_size > 0);
  assert(ACC_GEN_size <= WORD_LONG);
  assert(word != NULL);
  assert(DAT_number != NULL);
  code_ACC_type(word, ACC_GEN_size, &type, &number);
  // printf("type %X\n", (uint) number);
  /* TEL fill ACC glyph variable PL */
  consonant_one = (uint8_t)word[0];
  if (consonant_Q((char)consonant_one) == FALSE) {
    code_exit;
  }
  assert(consonant_Q((char)consonant_one) == TRUE);
  if (ACC_GEN_size == 2) {
    vowel = (uint8_t)word[1];
    if (vowel_Q((char)vowel) == FALSE) {
      code_exit;
    }
    assert(vowel_Q((char)vowel) == TRUE);
  } else if (ACC_GEN_size == 3) {
    vowel = (uint8_t)word[1];
    tone = (uint8_t)word[2];
    if (vowel_Q((char)vowel) == FALSE || tone_Q((char)tone) == FALSE) {
      code_exit;
    }
    assert(vowel_Q((char)vowel) == TRUE);
    assert(tone_Q((char)tone) == TRUE);
  } else if (ACC_GEN_size == 4) {
    consonant_two = (uint8_t)word[1];
    vowel = (uint8_t)word[2];
    consonant_three = (uint8_t)word[3];
    if (consonant_Q((char)consonant_two) == FALSE ||
        vowel_Q((char)vowel) == FALSE ||
        consonant_Q((char)consonant_three) == FALSE) {
      code_exit;
    }
    assert(consonant_Q((char)consonant_two) == TRUE);
    assert(vowel_Q((char)vowel) == TRUE);
    assert(consonant_Q((char)consonant_three) == TRUE);
  } else if (ACC_GEN_size == 5) {
    consonant_two = (uint8_t)word[1];
    vowel = (uint8_t)word[2];
    tone = (uint8_t)word[3];
    consonant_three = (uint8_t)word[4];
    if (consonant_Q((char)consonant_two) == FALSE ||
        vowel_Q((char)vowel) == FALSE || tone_Q((char)tone) == FALSE ||
        consonant_Q((char)consonant_three) == FALSE) {
      code_exit;
    }
    assert(consonant_Q((char)consonant_two) == TRUE);
    assert(vowel_Q((char)vowel) == TRUE);
    assert(tone_Q((char)tone) == TRUE);
    assert(consonant_Q((char)consonant_three) == TRUE);
  }
  if (consonant_one != 0 && type != SHORT_ROOT) {
    code_ACC_consonant_one(type, consonant_one, &number);
    // printf("c1 %X\n", (uint) number);
  }
  if (consonant_two != 0) {
    code_ACC_consonant_two(type, consonant_two, &number);
    // printf("c2 %X\n", (uint) number);
  }
  code_ACC_vowel(type, vowel, &number);
  // printf("v %X\n", (uint) number);
  if (tone != 0) {
    code_ACC_tone(type, tone, &number);
    // printf("tone %X\n", (uint) number);
  }
  if (consonant_three != 0 && type != LONG_GRAMMAR) {
    code_ACC_consonant_three(type, consonant_three, tone, &number);
    // printf("c3 %X\n", (uint) number);
  }
  *DAT_number = number;
}

void code_ACC_word_PL(const uint8_t ACC_GEN_size,
                      const char *ACC_independentClause, uint8_t *DAT_GEN_size,
                      uint16_t *DAT_code_independentClause,
                      uint8_t *DAT_GEN_remainder) {
  /* identify if two glyph or four glyph word
      if there is a bad parse
      then return an error message,
          which indicates the location of the error.
  assumptions:
      this is can be used in a reduce like manner,
      so many function together, which is enabled if size is
      full width, or 0xFF the last two glyphs can
      overlap with next independentClause, so if they are a four glyph word
      then keep them, otherwise ignore.
  algorithm:
  */
  char DAT_word[WORD_LONG];
  uint8_t DAT_word_GEN_size = WORD_LONG;
  uint8_t i = 0;
  uint8_t j = 0;
  uint16_t number = 0;
  // uint8_t size = ACC_GEN_size;
  // if (ACC_GEN_size == 0xFF) { // see assumptions
  //    size = 0xFF - 2;
  //}
  memset(DAT_word, 0, WORD_LONG);
  assert(ACC_independentClause != NULL);
  assert(ACC_GEN_size > 0);
  assert(DAT_code_independentClause != NULL);
  assert(*DAT_GEN_size >= ACC_GEN_size / 2);
  for (; i < ACC_GEN_size; j++) {
    derive_first_word((uint8_t)(ACC_GEN_size - i), ACC_independentClause + i,
                      &DAT_word_GEN_size, DAT_word);
    // printf("%s %d \n", ACC_independentClause +i,
    //    (int) DAT_word_GEN_size);
    if (DAT_word_GEN_size == 0) {
      *DAT_GEN_remainder = (uint8_t)(ACC_GEN_size - i);
      break;
    }
    code_ACC_word_DAT_number(DAT_word_GEN_size, DAT_word, &number);
    i = (uint8_t)(i + DAT_word_GEN_size);
    DAT_code_independentClause[j] = number;
    DAT_word_GEN_size = WORD_LONG;
  }
  *DAT_GEN_size = j;
}

/* remember if binary_phrase_list beginning is one
    then is last tablet or only of independentClause
    else if binary_phrase_list begining is zero,
    then is part tablet of independentClause
*/
static inline void establish_ACC_binary_phrase_list(
    const uint16_t *code_text, const uint8_t independentClause_size,
    uint16_t *binary_phrase_list, uint16_t *tablet) {
  uint8_t current = 0;
  uint8_t i = 0;
  assert(code_text != NULL);
  assert(independentClause_size != 0);
  assert(independentClause_size <=
         TABLET_WORD_LONG * MAX_INDEPENDENTCLAUSE_TABLET + 1);
  assert(binary_phrase_list != NULL);
  if (*binary_phrase_list == 0) {
    current = (uint8_t)~current;
  }
  for (i = 0; i < independentClause_size; i++) {
    if (current == 2)
      break;
    switch (current) {
    /*case 0:
        *binary_phrase_list |= 0 << (i + 1);
        break; */
    case 0xFF:
      *binary_phrase_list = (uint16_t)(*binary_phrase_list | (1 << (i + 1)));
      break;
    default:
      break;
    }
    tablet[i + 1] = code_text[i];
    switch (code_text[i]) {
    case ACCUSATIVE_CASE:
      current = (uint8_t)(~current);
      break;
    case INSTRUMENTAL_CASE:
      current = (uint8_t)(~current);
      break;
    case DATIVE_CASE:
      current = (uint8_t)(~current);
      break;
    case DEONTIC_MOOD:
      current = 2;
      break;
    case REALIS_MOOD:
      current = 2;
      break;
    default:
      break;
    }
  }
  tablet[0] = *binary_phrase_list;
}
void tablet_code(const uint8_t code_text_size, const uint16_t *code_text,
                 uint8_t *tablet_size, uint16_t *tablet, uint8_t *remainder) {
  uint16_t binary_phrase_list = 0;
  uint8_t i = 0;
  uint8_t independentClause_size = 0;
  uint8_t tablet_number = 0;
  assert(code_text != NULL);
  assert(code_text_size > 0);
  assert(tablet != NULL);
  assert(tablet_size != NULL);
  assert(remainder != NULL);
  assert(*tablet_size >= 16);
  /* algorithm:
      detect end of independentClause marker deontic-mood,
      set remainder as the rest.
      determine if can fit in one tablet or need multiple*/
  for (i = 0; i < code_text_size; i++) {
    if (code_text[i] == DEONTIC_MOOD || code_text[i] == REALIS_MOOD) {
      independentClause_size = (uint8_t)(i + 1);
      break;
    }
  }
  assert(independentClause_size > 0);
  for (i = 0; i < independentClause_size; i = (uint8_t)(i + TABLET_WORD_LONG)) {
    if (independentClause_size - i > TABLET_WORD_LONG) {
      binary_phrase_list = 0;
    } else {
      binary_phrase_list = 1;
    }
    establish_ACC_binary_phrase_list(
        code_text + i, (uint8_t)(independentClause_size - i),
        &binary_phrase_list, tablet + tablet_number);
    ++tablet_number;
  }
  *remainder = (uint8_t)(code_text_size - independentClause_size);
  *tablet_size = (uint8_t)(tablet_number);
}

static inline void detect_ACC_quote_size(const uint8_t text_size,
                                         const char *text, uint8_t *quote_size,
                                         uint8_t *quote_indexFinger) {
  uint8_t class_size = 0;
  uint8_t text_indexFinger = 0;
  uint8_t class_indexFinger = 0;
  uint8_t found = FALSE;
  assert(text != NULL);
  assert(text_size > 0);
  assert(quote_indexFinger != 0);
  assert(quote_size != NULL);
  /* algorithm:
      detect silence glyph surrounding quote class word
      search for same word to conclude quote
      answer quote_indexFinger and quote_size*/
  // assure silence glyph at zero indexFinger
  assert(text[0] == SILENCE_GLYPH);
  ++class_size;
  // detect size of class word
  for (text_indexFinger = 1; text_indexFinger < text_size; ++text_indexFinger) {
    ++class_size;
    if (text[text_indexFinger] == '.') {
      break;
    }
  }
  // printf("class_size %X\n", (uint)class_size);
  *quote_indexFinger = class_size;
  // detect next class word COM quote word
  for (text_indexFinger = class_size; text_indexFinger < text_size;
       ++text_indexFinger) {
    if (text_indexFinger + class_size > text_size) {
      *quote_size = 0;
      break;
    }
    for (class_indexFinger = 0; class_indexFinger <= class_size;
         ++class_indexFinger) {
      if (class_indexFinger == class_size) {
        // found
        *quote_size = (uint8_t)(text_indexFinger - class_size);
        found = TRUE;
      }
      if (text[text_indexFinger + class_indexFinger] !=
          text[class_indexFinger]) {
        break;
      }
    }
    if (found == TRUE) {
      break;
    }
  }
}

static inline void derive_quote_word(const uint8_t quote_class_size,
                                     const char *quote_class,
                                     const uint8_t quote_size,
                                     const char *quote_text,
                                     uint16_t *quote_word) {
  char word[WORD_LONG];
  uint16_t quote_number = 0;
  uint8_t word_size = WORD_LONG;
  memset(word, 0, WORD_LONG);
  // printf("quote_class_size %X\n", (uint)quote_class_size);
  assert(quote_class != NULL);
  assert(quote_class_size > 0);
  assert(quote_size > 0);
  assert(quote_size < 16);
  assert(quote_word != NULL);
  if (quote_size == 1) {
    *quote_word =
        (uint16_t)(QUOTED_REFERENTIAL |
                   ((quote_text[0] - 0x30) << QUOTED_LITERAL_INDEXFINGER));
    return;
  } else if (quote_size == 2) {
    *quote_word =
        (uint16_t)QUOTED_REFERENTIAL | (TWO_BYTE_QUOTED << CONSONANT_ONE_THICK);
  } else if (quote_size > 2 && quote_size <= 4) {
    *quote_word = (uint16_t)QUOTED_REFERENTIAL |
                  (FOUR_BYTE_QUOTED << CONSONANT_ONE_THICK);
  } else if (quote_size > 4 && quote_size <= 8) {
    *quote_word = (uint16_t)QUOTED_REFERENTIAL |
                  (EIGHT_BYTE_QUOTED << CONSONANT_ONE_THICK);
  } else if (quote_size > 8 && quote_size <= 16) {
    *quote_word = (uint16_t)QUOTED_REFERENTIAL |
                  (SIXTEEN_BYTE_QUOTED << CONSONANT_ONE_THICK);
  }
  // constant data
  *quote_word |= QUOTED_LITERAL << QUOTED_LITERAL_XOR_ADDRESS_INDEXFINGER;
  *quote_word |= FALSE << QUOTED_INTEGER_INDEXFINGER;
  derive_first_word(quote_class_size, quote_class, &word_size, word);
  assert(word_size > 0 && "to derive type of quote");
  if (word_size > 0)
    code_ACC_word_DAT_number(word_size, word, &quote_number);
  else {
    *quote_word = 0;
    return;
  }
  // printf("quote_number %X\n", (uint) quote_number);
  switch (quote_number) {
  case TEXT_WORD:
    *quote_word |= SINGLE_BYTE_QUOTED << QUOTED_GLYPH_THICK_INDEXFINGER;
    *quote_word |= TEXT_CLASS << QUOTED_CLASS_INDEXFINGER;
    break;
  case NUMBER_WORD:
    *quote_word |= NUMBER_CLASS << QUOTED_CLASS_INDEXFINGER;
    break;
  default:
    printf("unknown quote_number %X\n", (uint)quote_number);
    assert(1 == 0);
    break;
  }
}

static inline void fit_quote_size(const uint8_t quote_size,
                                  uint8_t *quote_tablet_size) {
  assert(quote_tablet_size != NULL);
  assert(quote_size > 0);
  assert(quote_size < 16);
  if (quote_size == 1) {
    *quote_tablet_size = 0x0;
  } else if (quote_size == 2) {
    *quote_tablet_size = 0x1;
  } else if (quote_size > 2 && quote_size <= 4) {
    *quote_tablet_size = 0x2;
  } else if (quote_size > 4 && quote_size <= 8) {
    *quote_tablet_size = 0x4;
  } else if (quote_size > 8 && quote_size <= 16) {
    *quote_tablet_size = 0x8;
  }
}

static void convert_last_number_to_quote(uint8_t *last_tablet_indexFinger,
                                         v16us *tablet) {
  uint8_t tablet_indexFinger;
  uint8_t number_indexFinger = 0;
  uint64_t number = 0;
  uint8_t finish = FALSE;
  assert(*last_tablet_indexFinger > 0);
  assert(tablet != NULL);
  tablet_indexFinger = *last_tablet_indexFinger;
  for (; tablet_indexFinger > 0; --tablet_indexFinger) {
    // printf("word %X ", (uint) tablet[0][tablet_indexFinger-1]);
    switch (((uint16_t *)(tablet))[tablet_indexFinger - 1]) {
    case ZERO_WORD:
      ++number_indexFinger;
      break;
    case ONE_WORD:
      number |= (uint64_t)(1 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case TWO_WORD:
      number |= (uint64_t)(2 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case THREE_WORD:
      number |= (uint64_t)(3 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case FOUR_WORD:
      number |= (uint64_t)(4 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case FIVE_WORD:
      number |= (uint64_t)(5 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case SIX_WORD:
      number |= (uint64_t)(6 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case SEVEN_WORD:
      number |= (uint64_t)(7 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case EIGHT_WORD:
      number |= (uint64_t)(8 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case NINE_WORD:
      number |= (uint64_t)(9 << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case TEN_WORD:
      number |= (uint64_t)(0xA << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case ELEVEN_WORD:
      number |= (uint64_t)(0xB << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case TWELVE_WORD:
      number |= (uint64_t)(0xC << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case THIRTEEN_WORD:
      number |= (uint64_t)(0xD << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case FOURTEEN_WORD:
      number |= (uint64_t)(0xE << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    case FIFTEEN_WORD:
      number |= (uint64_t)(0xF << number_indexFinger * 4);
      ++number_indexFinger;
      break;
    default:
      finish = TRUE;
      break;
    }
    if (finish == TRUE)
      break;
  }
  /* set up quote and number if necessary (number_indexFinger > 2)*/
  // printf("number %X, tablet_indexFinger %X, number_indexFinger %X\n",
  // (uint)number,
  //       (uint)tablet_indexFinger, (uint)number_indexFinger);
  if (number <= 0xFFFF) {
    *last_tablet_indexFinger = (uint8_t)(tablet_indexFinger + 1);
    ((uint16_t *)tablet)[tablet_indexFinger] = (uint16_t)(SHORT_NUMBER_QUOTED);
    ++tablet_indexFinger;
    ((uint16_t *)tablet)[tablet_indexFinger] = (uint16_t)(number);
  }
  assert(number_indexFinger <= 2);
}

void independentClause_code(const uint16_t text_size, const char *text,
                            uint8_t *tablet_size, v16us *tablet,
                            uint16_t *text_remainder) {
  /* algorithm:
      loop through glyphs,
      derive words
      if word is quote then add it to tablet,
          and add proper quote identifier.
      if word is accusative, instrumental, or dative,
          flip the index representation for it.
      if word is deontic-mood then set as ending tablet.
  */
  char glyph;
  uint8_t text_indexFinger = 0;
  uint8_t tablet_indexFinger = 1;
  uint8_t quote_indexFinger = 0;
  char word[WORD_LONG];
  uint8_t word_size = 0;
  char derived_word[WORD_LONG];
  uint8_t derived_word_size = WORD_LONG;
  uint16_t number = 0;
  uint16_t quote_word = 0;
  uint16_t binary_phrase_list = (uint16_t)1;
  uint8_t quote_size = 0;
  uint8_t quote_tablet_size = 0;
  uint8_t current = 0x0;
  memset(word, 0, WORD_LONG);
  memset(derived_word, 0, WORD_LONG);
  assert(text != NULL);
  assert(text_size > 0);
  assert(tablet != NULL);
  assert(tablet_size != NULL);
  assert(text_remainder != NULL);
  // printf("tablet_size %X text %s\n",(uint) *tablet_size, text);
  // assert(*tablet_size >= text_size/2/15 /*MAX_INDEPENDENTCLAUSE_TABLET*/);
  // printf("independentClause encoding\n");
  for (text_indexFinger = 0; text_indexFinger < text_size; ++text_indexFinger) {
    glyph = text[text_indexFinger];
    if (consonant_Q(glyph) == TRUE || vowel_Q(glyph) == TRUE ||
        tone_Q(glyph) == TRUE) {
      word[word_size] = glyph;
      // printf("%c", glyph);
      word_size = (uint8_t)(word_size + 1);
    }
    if (word_size >= 2) {
      // printf("tablet_indexFinger %X\n", (uint) tablet_indexFinger);
      memset(derived_word, 0, WORD_LONG);
      derived_word_size = WORD_LONG;
      derive_first_word(word_size, word, &derived_word_size, derived_word);
      if (derived_word_size > 0) {
        number = 0;
        code_ACC_word_DAT_number(derived_word_size, derived_word, &number);
        // printf("n 0x%X \n", (uint) number);
        if (number != 0) {
          memset(word, 0, WORD_LONG);
          switch (number) {
          case NUMBER_GRAMMAR_WORD:
            /* if preceded by a quote word, then do as a default.
               if preceded by numbers then convert them to a quote,
               and adjust tablet_indexFinger accordingly */
            if ((((uint16_t *)tablet)[tablet_indexFinger - 1] &
                 QUOTED_REFERENTIAL) == QUOTED_REFERENTIAL) {
              // tablet[0][tablet_indexFinger] = number;
              //++tablet_indexFinger;
              break;
            } else {
              // convert last of tablet to number quote
              // printf("pre tablet_indexFinger %X\n",
              // (uint)tablet_indexFinger);
              convert_last_number_to_quote(&tablet_indexFinger, tablet);
              // printf("post tablet_indexFinger %X\n",
              // (uint)tablet_indexFinger);
              // tablet[0][tablet_indexFinger] = number;
              ++tablet_indexFinger;
              break;
            }
          case QUOTED_GRAMMAR_WORD:
            // printf("detected quote word %X\n", (uint)text_indexFinger);
            ++text_indexFinger;
            detect_ACC_quote_size((uint8_t)(text_size - text_indexFinger),
                                  text + text_indexFinger, &quote_size,
                                  &quote_indexFinger);
            // printf("detected quote size %X\n", (uint) quote_size);
            // printf("quote_indexFinger %X\n", (uint) quote_indexFinger -
            // text_indexFinger);
            // printf("quote %s\n", text + text_indexFinger +
            // SILENCE_GLYPH_LONG);
            derive_quote_word(
                (uint8_t)(quote_indexFinger - SILENCE_GLYPH_LONG),
                text + text_indexFinger + SILENCE_GLYPH_LONG, quote_size,
                text + text_indexFinger + quote_indexFinger, &quote_word);
            // printf("quote_word %X\n", (uint)quote_word);
            ((uint16_t *)tablet)[tablet_indexFinger] = quote_word;
            ++tablet_indexFinger;
            copy_ACC_text_DAT_tablet(
                text + text_indexFinger + quote_indexFinger, quote_size, tablet,
                tablet_indexFinger,
                (uint8_t)(*tablet_size * TABLET_LONG - tablet_indexFinger));
            // printf("text_indexFinger %X, quote_indexFinger %X, quote_size
            // %X\n",
            //       (uint)text_indexFinger, (uint)quote_indexFinger,
            //       (uint)quote_size);
            text_indexFinger =
                (uint8_t)(text_indexFinger + (quote_indexFinger)*2 +
                          QUOTED_WORD_LONG + quote_size - 1);
            word_size = 0;
            fit_quote_size(quote_size, &quote_tablet_size);
            // printf("qll %X\n", (uint)
            //     quote_tablet_size);
            tablet_indexFinger =
                (uint8_t)(tablet_indexFinger + quote_tablet_size);
            //    printf("ls %X\n", (uint)
            //        tablet_indexFinger);
            break;
          case ACCUSATIVE_CASE:
            binary_phrase_list =
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            ++tablet_indexFinger;
            break;
          case INSTRUMENTAL_CASE:
            binary_phrase_list =
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            ++tablet_indexFinger;
            break;
          case DATIVE_CASE:
            binary_phrase_list ^=
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            ++tablet_indexFinger;
            break;
          case CONDITIONAL_MOOD:
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            binary_phrase_list =
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            ++tablet_indexFinger;
            break;
          case DEONTIC_MOOD:
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            binary_phrase_list =
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            current = 2;
            ++tablet_indexFinger;
            break;
          case REALIS_MOOD:
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            binary_phrase_list =
                (uint16_t)(binary_phrase_list ^ (1 << tablet_indexFinger));
            current = 2;
            ++tablet_indexFinger;
            break;
          default:
            ((uint16_t *)tablet)[tablet_indexFinger] = number;
            ++tablet_indexFinger;
            break;
          }
          if (current == 2)
            break;
          word_size = 0;
        } else {
        }
      }
    }
  }
  ++text_indexFinger;
  // printf("se text_indexFinger %X\n", (uint)text_indexFinger);
  *tablet_size = 1;
  *text_remainder = (uint16_t)(text_size - text_indexFinger);
  ((uint16_t *)tablet)[0] = binary_phrase_list;
}
inline void play(const v4us coded_name, v8us *hook_list) {
  void *accusative = NULL;
  void *instrumental = NULL;
  // void *dative =  NULL;
  assert(((uint16_t *)&coded_name)[VERB_INDEXFINGER] != 0);
  assert(hook_list != NULL);
  // quizing hash key name
  printf("coded_name play %04X%04X%04X%04X\n",
         (uint)((uint16_t *)&coded_name)[3], (uint)((uint16_t *)&coded_name)[2],
         (uint)((uint16_t *)&coded_name)[1],
         (uint)((uint16_t *)&coded_name)[0]);
  // switch (coded_name[ACCUSATIVE_INDEXFINGER]) {
  // case UNSIGNED_CHAR_QUOTED:
  //  accusative = (unsigned char *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
  //  break;
  // case SIGNED_CHAR_QUOTED:
  //  accusative = (char *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
  //  break;
  // case SHORT_NUMBER_QUOTED:
  //  accusative = (uint16_t *)&(hook_list[ACCUSATIVE_INDEXFINGER]);
  //  break;
  // case ERROR_BINARY:
  //  break;
  // default:
  //  printf("unrecognized type %04X",
  //  (uint)coded_name[ACCUSATIVE_INDEXFINGER]);
  //  assert(0 != 0);
  //  break;
  //}
  switch (((uint16_t *)&coded_name)[INSTRUMENTAL_INDEXFINGER]) {
  case UNSIGNED_CHAR_QUOTED:
    instrumental = (unsigned char *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
    break;
  case SIGNED_CHAR_QUOTED:
    instrumental = (char *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
    break;
  case SHORT_NUMBER_QUOTED:
    instrumental = (uint16_t *)&(hook_list[INSTRUMENTAL_INDEXFINGER]);
    break;
  case ERROR_BINARY:
    break;
  default:
    printf("unrecognized type %04X",
           (uint)((uint16_t *)&coded_name)[ACCUSATIVE_INDEXFINGER]);
    assert(0 != 0);
    break;
  }
  switch (*((uint64_t *)&coded_name)) {
  case 0x6048009D00000000: /* say unsigned char* */
    x6048009D00000000((unsigned char *)accusative);
    break;
  case 0x6048029D00000000: /* say signed char* */
    x6048029D00000000((signed char *)accusative);
    break;
  case 0x4124000000000000: /* equal */
    x4124000000000000((v8us *)hook_list);
    break;
  case 0x8006000000000000: /* different */
    x8006000000000000((v8us *)hook_list);
    break;
  case 0xA130143D143D0000: /* not CCNOT */
    xA130143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
    break;
  case 0xC450143D143D0000: /* not CCNOT */
    xC450143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
    break;
  case 0x8006143D143D0000: /* not CCNOT */
    x8006143D143D0000((uint16_t *)accusative, (uint16_t *)instrumental);
    break;
  default:
    printf(
        "unrecognized coded_name %04X%04X%04X%04X\n",
        (uint)((uint16_t *)&coded_name)[3], (uint)((uint16_t *)&coded_name)[2],
        (uint)((uint16_t *)&coded_name)[1], (uint)((uint16_t *)&coded_name)[0]);
    assert(0 != 0);
    break;
  }
}
static inline void play_quote(const v16us *tablet,
                              const uint8_t tablet_indexFinger,
                              const uint8_t tablet_size, uint16_t *quote_word,
                              v8us *quote_fill) {
  uint16_t word;
  uint8_t quote_indexFinger = 0;
  uint8_t quote_size;
  assert(tablet != NULL);
  assert(tablet_indexFinger < TABLET_LONG);
  assert(tablet_size < MAX_INDEPENDENTCLAUSE_TABLET);
  assert(quote_word != NULL);
  assert(quote_fill != NULL);
  word = ((uint16_t *)tablet)[tablet_indexFinger];
  // printf("quote quizing, word %04X\n", (uint) (*tablet)[tablet_indexFinger]);
  if ((word & CONSONANT_ONE_MASK) == QUOTED_REFERENTIAL) {
    // then is quote
    *quote_word = word;
    // printf("quote detected %04X\n", (uint)word);
    quote_size = (uint8_t)(
        1 << (((*quote_word >> CONSONANT_ONE_THICK) & 7 /* 3 bit mask */) - 1));
    // printf("quote_size %X \n", (uint)quote_size);
    // printf("tablet_indexFinger %X \n", (uint)tablet_indexFinger);
    assert(quote_size < tablet_size * TABLET_LONG * WORD_THICK);
    // printf("quote_fill ");
    if (quote_size == 0) {
      ((uint16_t *)quote_fill)[0] =
          (uint16_t)(word >> QUOTED_LITERAL_INDEXFINGER);
      // printf("%04X ", (uint)(*quote_fill)[0]);
    }
    for (quote_indexFinger = 0; quote_indexFinger < quote_size;
         ++quote_indexFinger) {
      ((uint16_t *)quote_fill)[quote_indexFinger] =
          ((uint16_t *)tablet)[tablet_indexFinger + quote_indexFinger + 1];
      // printf("%04X ", (uint)(*quote_fill)[quote_indexFinger]);
    }
    // printf("\n");
  }
}
void burden_hook_list(const uint8_t tablet_size, const v16us *tablet,
                      uint8_t *tablet_indexFinger, v4us *coded_name,
                      v8us *hook_list) {
  assert(tablet_size != 0);
  assert(tablet != NULL);
  assert(coded_name != NULL);
  assert(hook_list != NULL);
  assert(tablet_indexFinger != NULL);
  assert(*tablet_indexFinger >= 1);
  uint16_t indicator_list = 0;
  uint8_t indicator = 0;
  uint8_t tablet_number = 0;
  uint8_t exit = FALSE;
  uint16_t word = 0;
  uint16_t quote_word = 0;
  v8us quote_fill = {{0}};
  indicator_list = ((uint16_t *)tablet)[0];
  indicator = (uint8_t)1 & indicator_list;
  // printf("indicator %X\n", (uint) indicator);
  // printf("indicator_list %X\n", (uint) indicator_list);
  for (tablet_number = 0; tablet_number < tablet_size; ++tablet_number) {
    for (; *tablet_indexFinger < TABLET_LONG; ++*tablet_indexFinger) {
      // printf("BHL tablet_indexFinger %X\n", (uint)*tablet_indexFinger);
      // if previous is indicated then quiz if is quote
      if (((indicator_list & (1 << (*tablet_indexFinger - 1))) >>
           (*tablet_indexFinger - 1)) == indicator) {
        // printf("quote's word %X \n", (uint)tablet[0][*tablet_indexFinger]);
        play_quote(tablet, *tablet_indexFinger, tablet_size, &quote_word,
                   &quote_fill);
      }
      // if current is indicated then quiz if is case or
      // verb
      if (((indicator_list & (1 << *tablet_indexFinger)) >>
           *tablet_indexFinger) == indicator) {
        word = ((uint16_t **)&tablet)[tablet_number][*tablet_indexFinger];
        // printf("BHL word %X\n", (uint)word);
        switch (word) {
        case ACCUSATIVE_CASE:
          // printf("detected accusative case\n");
          if (quote_word != 0) {
            ((uint16_t *)coded_name)[ACCUSATIVE_INDEXFINGER] = quote_word;
            // printf("coded_name ACC %04X%04X%04X%04X\n",
            //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
            //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
            hook_list[ACCUSATIVE_INDEXFINGER] = quote_fill;
            // printf("ACC quote_fill %X\n", (uint)quote_fill[0]);
            // printf("ACC hook_list %X\n",
            // (uint)hook_list[ACCUSATIVE_INDEXFINGER][0]);
            quote_word = 0;
          }
          break;
        case DATIVE_CASE:
          if (quote_word != 0) {
            ((uint16_t *)coded_name)[DATIVE_INDEXFINGER] = quote_word;
            hook_list[DATIVE_INDEXFINGER] = quote_fill;
            quote_word = 0;
          }
          break;
        case INSTRUMENTAL_CASE:
          if (quote_word != 0) {
            ((uint16_t *)coded_name)[INSTRUMENTAL_INDEXFINGER] = quote_word;
            hook_list[INSTRUMENTAL_INDEXFINGER] = quote_fill;
            quote_word = 0;
          }
          break;
        default:
          exit = TRUE;
          break;
        }
      }
      if (exit == TRUE)
        break;
    }
    if (exit == TRUE)
      break;
  }
}
inline void play_independentClause(const uint8_t tablet_size,
                                   const v16us *tablet, v4us *coded_name,
                                   v8us *hook_list) {
  /* go through coded independentClause,
      loading quotes into temporary register,
      append to case list,
      when get to case, move to appropriate case register,
      add to case counter, and append to case list,
      when get to verb,
      match to available functions by number of cases,
      match to available functions by case list,
      make 64bit hash key, ACC DAT INS verb,
      with appropriate quotes filling in place of ACC DAT INS
      or a 0 if there is none.
      execute proper function.
  */
  uint16_t indicator_list = 0;
  uint8_t indicator = 0;
  uint8_t tablet_number = 0;
  uint8_t tablet_indexFinger = 1;
  uint8_t exit = FALSE;
  uint16_t word = 0;
  assert(tablet_size != 0);
  assert(tablet != NULL);
  assert(coded_name != NULL);
  assert(hook_list != NULL);
  indicator_list = ((uint16_t *)tablet)[0];
  indicator = (uint8_t)1 & indicator_list;
  // printf("indicator %X\n", (uint) indicator);
  // printf("indicator_list %X\n", (uint) indicator_list);
  burden_hook_list(tablet_size, tablet, &tablet_indexFinger, coded_name,
                   hook_list);
  // printf("coded_name burden %04X%04X%04X%04X\n", (uint)(*coded_name)[3],
  //       (uint)(*coded_name)[2], (uint)(*coded_name)[1],
  //       (uint)(*coded_name)[0]);
  for (tablet_number = 0; tablet_number < tablet_size; ++tablet_number) {
    for (; tablet_indexFinger < TABLET_LONG; ++tablet_indexFinger) {
      // if current is indicated then quiz if is case or
      // verb
      if (((indicator_list & (1 << tablet_indexFinger)) >>
           tablet_indexFinger) == indicator) {
        word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger];
        // printf("word %X\n", (uint)word);
        switch (word) {
        case CONDITIONAL_MOOD:
          word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger - 1];
          // printf("COND word %04X \n", (uint) word);
          ((uint16_t *)coded_name)[VERB_INDEXFINGER] = word;
          // printf("coded_name COND %04X%04X%04X%04X\n",
          //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
          //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
          play(*coded_name, hook_list);
          // if dative is ERROR_WORD then skip to next independentClause
          if (((uint16_t **)&hook_list)[DATIVE_INDEXFINGER][0] == ERROR_WORD) {
            exit = TRUE;
          } else {
            ++tablet_indexFinger;
            burden_hook_list(tablet_size, tablet, &tablet_indexFinger,
                             coded_name, hook_list);
            printf("coded_name burden2 %04X%04X%04X%04X\n",
                   (uint)((uint16_t *)&coded_name)[3],
                   (uint)((uint16_t *)&coded_name)[2],
                   (uint)((uint16_t *)&coded_name)[1],
                   (uint)((uint16_t *)&coded_name)[0]);
            printf("tablet_indexFinger %X\n", (uint)tablet_indexFinger);
            --tablet_indexFinger;
          }
          break;
        case DEONTIC_MOOD:
          // quizing verb
          word = ((uint16_t **)tablet)[tablet_number][tablet_indexFinger - 1];
          ((uint16_t *)&coded_name)[VERB_INDEXFINGER] = word;
          // printf("coded_name DEO %04X%04X%04X%04X\n",
          //       (uint)(*coded_name)[3], (uint)(*coded_name)[2],
          //       (uint)(*coded_name)[1], (uint)(*coded_name)[0]);
          // printf("realizing");
          play((*coded_name), hook_list);
          exit = TRUE;
          break;
        case REALIS_MOOD:
          // quizing verb
          word = ((uint16_t **)&tablet)[tablet_number][tablet_indexFinger - 1];
          ((uint16_t *)coded_name)[VERB_INDEXFINGER] = word;
          printf("coded_name REAL %04X%04X%04X%04X\n",
                 (uint)((uint16_t *)&coded_name)[3],
                 (uint)((uint16_t *)&coded_name)[2],
                 (uint)((uint16_t *)&coded_name)[1],
                 (uint)((uint16_t *)&coded_name)[0]);
          printf("realizing");
          play((*coded_name), hook_list);
          exit = TRUE;
          break;
        case ERROR_BINARY:
          assert(ERROR_BINARY != ERROR_BINARY);
          break;
        default:
          // printf("tablet_indexFinger %X\n", (uint)tablet_indexFinger);
          // assert(1 == 0); // indicated wrong point
          break;
        }
      }
      if (exit == TRUE)
        break;
    }
    if (indicator == 1 || exit == TRUE)
      break;
  }
  assert(indicator == 1); /* must finish properly */
                          // quizing grammtical-case list
  // printf("\n");
}

void text_code(const uint16_t max_text_size, const char *text,
               uint16_t *tablet_size, v16us *tablet, uint16_t *text_remainder) {
  /* find end of independentClause for each,
    then pass each independentClause to independentClause code,
    return the result */
  const uint16_t max_tablet_size = *tablet_size;
  uint8_t independentClause_tablet_size = MAX_INDEPENDENTCLAUSE_TABLET;
  uint16_t text_indexFinger = 0;
  assert(text != NULL);
  assert(max_text_size != 0);
  assert(tablet != NULL);
  assert(tablet_size != NULL);
  assert(*tablet_size * TABLET_BYTE_LONG <= MAX_WRITE_MEMORY);
  assert(text_remainder != NULL);
  *tablet_size = 0;
  *text_remainder = max_text_size;
  for (; *tablet_size < max_tablet_size;) {
    if ((max_tablet_size - *tablet_size) < MAX_INDEPENDENTCLAUSE_TABLET) {
      independentClause_tablet_size = (uint8_t)(max_tablet_size - *tablet_size);
    } else {
      independentClause_tablet_size = (uint8_t)MAX_INDEPENDENTCLAUSE_TABLET;
    }
    independentClause_code(*text_remainder, text + text_indexFinger,
                           &independentClause_tablet_size,
                           &tablet[*tablet_size], text_remainder);
    *tablet_size = (uint16_t)(*tablet_size + independentClause_tablet_size);
    if (*text_remainder == 0) {
      break;
    }
    text_indexFinger = (uint16_t)(max_text_size - *text_remainder);
    // printf("ct text_indexFinger %X, text %s\n", (uint)text_indexFinger,
    //  text + text_indexFinger);
    // printf("ct text_remainder %X\n",(uint)*text_remainder);
    // printf("ct tablet_size %X\n",(uint)*tablet_size);
  }
  // printf("ctf text_remainder %X\n",(uint)*text_remainder);
  // printf("ctf tablet_size %X\n",(uint)*tablet_size);
}
inline void play_text(const uint16_t max_tablet_size, const v16us *tablet,
                      v4us *coded_name, v8us *hook_list) {
  /*
    identify independentClause tablet,
    then pass to independentClause_play,
    and so on until reach end.
  */
  uint16_t tablet_indexFinger = 0;
  assert(tablet != NULL);
  assert(max_tablet_size > 0);
  assert(coded_name != NULL);
  assert(hook_list != NULL);
  for (; tablet_indexFinger < max_tablet_size; ++tablet_indexFinger) {
    play_independentClause((uint8_t)(max_tablet_size - tablet_indexFinger),
                           &tablet[tablet_indexFinger], coded_name, hook_list);
  }
}
