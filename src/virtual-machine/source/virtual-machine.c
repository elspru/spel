/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdint.h>
#include "seed/seed.h"

#define MAXIMUM_PAPER_LENGTH 0x1000

static void encode_check() {
    /* testing encode_ACC_word_DAT_number */
    const char* long_root = "tcan";
    const char* short_root = "hlep";
    const char* long_grammar = "br6h";
    const char* short_grammar = "du";
    const char* long_tone_root = "bza_n";
    const char* short_tone_root = "h1e7c";
    const char* long_tone_grammar = "br6_h";
    const char* short_tone_grammar = "du7";
    uint8_t length = 4;
    uint16_t number = 0;
        /* LONG_ROOT */
    encode_ACC_word_DAT_number(long_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x19EA);
        /* SHORT_ROOT */
    encode_ACC_word_DAT_number(short_root, length,
        &number);
    //printf("short_root %X\n", (unsigned int) number);
    assert(number == 0x1358);
        /* LONG_GRAMMAR */
    encode_ACC_word_DAT_number(long_grammar, length,
        &number);
    //printf("long_grammar %X\n", (unsigned int) number);
    assert(number == 0x298F);
        /* SHORT_GRAMMAR */
    length = 2;
    encode_ACC_word_DAT_number(short_grammar, length,
        &number);
    //printf("short_grammar %X\n", (unsigned int) number);
    assert(number == 0xA7E);
        /* LONG_TONE_ROOT */
    length = 5;
    encode_ACC_word_DAT_number(long_tone_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x7171);
        /* SHORT_TONE_ROOT */
    encode_ACC_word_DAT_number(short_tone_root, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x6BD8);
        /* LONG_TONE_GRAMMAR */
    encode_ACC_word_DAT_number(long_tone_grammar, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0xA98F);
        /* SHORT_TONE_GRAMMAR */
    length = 3;
    encode_ACC_word_DAT_number(short_tone_grammar, length,
        &number);
    //printf("%X\n", (unsigned int) number);
    assert(number == 0x2A7E);
    printf("%s%s\n",
        "NOM encode_ACC_word_DAT_number PFV check ESS success",
        " REAL");
}


static void delete_empty_glyph_check() {
    const char* text = "tcat ca clah kxih";
    const uint16_t length = strlen(text);
    char DAT_text[SENTENCE_LENGTH];
    uint16_t DAT_GEN_length = SENTENCE_LENGTH;
    memset(DAT_text, 0, SENTENCE_LENGTH);
    /* testing delete empty glyph */
    delete_empty_glyph(text, length, DAT_text, &DAT_GEN_length);
    //printf("%s\n", DAT_text);
    assert(strcmp(DAT_text, "tcatcaclahkxih") == 0);
    assert(DAT_GEN_length == 14);
    printf("NOM delete empty glyph PFV check ESS success REAL\n");
}

static void derive_first_word_check() {
    /* testing derive_first word */
    const char* text = "tcatcaclahkxih";
    const uint16_t length = strlen(text);
    char DAT_word[WORD_LENGTH + 1];
    uint8_t DAT_word_GEN_length = WORD_LENGTH;
    memset(DAT_word, 0, WORD_LENGTH + 1);
    derive_first_word(text, length, DAT_word, 
        &DAT_word_GEN_length);
    //printf("%s\n", DAT_word);
    assert(strcmp(DAT_word, "tcat") == 0);
    assert(DAT_word_GEN_length == 4);
    printf("NOM derive first word PFV check ESS success REAL\n");
}

static void encode_word_PL_check() {
    const char text[] = "hyinkahtutsuhkakpanyiktu";
    const uint8_t text_length = strlen(text);
    uint16_t encode_sentence[SENTENCE_LENGTH/WORD_LENGTH];
    uint8_t encode_sentence_length = SENTENCE_LENGTH/WORD_LENGTH;
    uint8_t remainder = 0;
    uint8_t i = 0;
    memset(encode_sentence, 0, encode_sentence_length);
    encode_ACC_word_PL(text, text_length, encode_sentence,
        &encode_sentence_length, &remainder);
    printf("encode_word_PL %X remainder %X \n", 
        (unsigned int) encode_sentence_length,
        (unsigned int) remainder);
    for (i = 0; i < encode_sentence_length; i++) {
        printf("0x%X ", (unsigned int) encode_sentence[i]);
    }
    printf("\n");
}

static void lump_encode_check() {
    const char text[] = "wukahtutsuhkakpanyiktu";
    const uint8_t text_length = strlen(text);
    uint16_t encode_sentence[SENTENCE_LENGTH/WORD_LENGTH];
    uint8_t encode_sentence_length = SENTENCE_LENGTH/WORD_LENGTH;
    uint8_t remainder = 0;
    uint16_t lump[LUMP_WORD_LENGTH * MAX_SENTENCE_LUMP];
    uint8_t lump_length = LUMP_WORD_LENGTH * MAX_SENTENCE_LUMP;
    uint8_t i = 0;
    memset(encode_sentence, 0, encode_sentence_length*2);
    memset(lump, 0, lump_length*2);
    encode_ACC_word_PL(text, text_length, encode_sentence,
        &encode_sentence_length, &remainder);
    printf("encode_word_PL %X remainder %X \n", 
        (unsigned int) encode_sentence_length,
        (unsigned int) remainder);
    lump_encode(encode_sentence, encode_sentence_length,
        lump, &lump_length, &remainder);
    printf("lump_length %X remainder %X \n", 
        (unsigned int) lump_length,
        (unsigned int) remainder);
    for (i = 0; i < lump_length; i++) {
        printf("0x%X ", (unsigned int) lump[i]);
    }
    printf("\n");
}

static void read_paper(const char *file_name,
        const size_t paper_number, char *paper_storage, 
        uint16_t *paper_length) {
    FILE *file_spot = NULL; 
    int answer = 0;
    uint16_t i = 0;
    uint16_t length = 0;
    int glyph = (char) 0;
    assert(file_name != 0);
    assert(strlen(file_name) > 0);
    assert(paper_storage != NULL);
    assert(*paper_length >= MAXIMUM_PAPER_LENGTH);
    file_spot = fopen(file_name, "r");
    assert(file_spot != NULL);
    if (file_spot != NULL) {
        answer = fseek(file_spot, 
                (int) paper_number*MAXIMUM_PAPER_LENGTH,
                SEEK_SET);
        //assert(answer == 0);
        if (answer == 0) {
            length = fread(paper_storage, 
                MAXIMUM_PAPER_LENGTH, 1, file_spot);
            //printf("%X length \n", (unsigned int) length);
            if (length != 0) {
                length *= MAXIMUM_PAPER_LENGTH;
            } else {
                answer = fseek(file_spot, (int) 
                    paper_number*MAXIMUM_PAPER_LENGTH,
                    SEEK_SET);
                assert(answer == 0);
                for (i = 0; i < MAXIMUM_PAPER_LENGTH; ++i) {
                    glyph = fgetc(file_spot);
                    if (glyph == EOF) break;
                    paper_storage[i] = (char) glyph;
                    length += 1;
                }
            }
        } else {
            printf("fseek fail PFV");
            length = 0;
        }
        answer = fclose(file_spot);
        assert(answer == 0);
    } else {
        printf("file open fail PFV");
        length = 0;
    }
    *paper_length = length;
    //assert(*paper_length != 0);
}

static void full_encode_check() {
    char paper_storage[MAXIMUM_PAPER_LENGTH+1];
    char DAT_storage[MAXIMUM_PAPER_LENGTH+WORD_LENGTH+1];
    char word[WORD_LENGTH+1];
    uint16_t paper_length = MAXIMUM_PAPER_LENGTH+1;
    uint16_t DAT_length = MAXIMUM_PAPER_LENGTH+WORD_LENGTH+1;
    uint16_t i = 0;
    uint16_t number = 0;
    uint16_t encode_text[MAXIMUM_PAPER_LENGTH/2];
    uint16_t encode_text_length = MAXIMUM_PAPER_LENGTH/2;
    uint8_t word_length = WORD_LENGTH+1;
    uint8_t remains_length = 0;
    uint16_t paper_number = 0;
    uint8_t derive_length = 0;
    FILE *file_spot = 0;
    int answer = 0;
    size_t write_spot = 0;
    memset(paper_storage, 0, paper_length);
    memset(word, 0, word_length);
    memset(DAT_storage, 0, DAT_length);
    memset(encode_text, 0, encode_text_length * 2);
    file_spot = fopen( "check/encode.lyac" , "w" );
    assert(file_spot != NULL);
    answer = fclose(file_spot);
    for (; paper_number < 0x1000; ++paper_number) {
        paper_length = MAXIMUM_PAPER_LENGTH+1;
        read_paper("check/check.txt", paper_number, 
            paper_storage, &paper_length);
        if (paper_length == 0) {
            break;
        }
        //printf("%s\n %X read_paper \n", paper_storage, (unsigned
         //   int) paper_length);
        delete_empty_glyph(paper_storage, paper_length, 
            DAT_storage + remains_length, &DAT_length);
      //  printf("%s\n", DAT_storage);
        //printf("%X delete_empty_glyph \n", (unsigned int) DAT_length);
        encode_text_length = 0;
        DAT_length += remains_length;
        derive_length = 0x10;
        for (i = 0; i < DAT_length;) {
            word_length = WORD_LENGTH;
            if (DAT_length - i < 0x10) {
                derive_length = DAT_length -i;
            }
            derive_first_word(DAT_storage + i, derive_length, word,
                &word_length);
            i += word_length;
            if (word_length > 0) {
                encode_ACC_word_DAT_number(word, word_length, 
                    &number);
                if (number > 0) {
                    encode_text[encode_text_length] = number;
                    //printf("%X encode_text\n", (unsigned int)
                     //   encode_text[encode_text_length]);
                    ++encode_text_length;
                    word_length = WORD_LENGTH;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        remains_length = (uint8_t) DAT_length - i;
        //printf("%s %X remainder\n", DAT_storage +i, 
         //   (unsigned int) remains_length);
        //printf("%X encode_text_length\n", (unsigned int) 
         //       encode_text_length);
    /* write file start */
        file_spot = fopen( "check/encode.lyac" , "a" );
        assert(file_spot != NULL);
        //answer = fseek(file_spot, 
        //        (int) write_spot*2,
        //        SEEK_SET);
        //assert(answer == 0);
        answer = (int) fwrite(encode_text, 2, 
            encode_text_length, file_spot);
        assert((int) encode_text_length == answer);
        answer = fclose(file_spot);
        assert(answer == 0);
    /* write file end */
        write_spot += encode_text_length;
        //printf("%X write_spot\n", (unsigned int) 
         //       write_spot);
        //if (DAT_length > i) break;
        if (remains_length > 0) 
        text_copy(DAT_storage + i, remains_length, DAT_storage);
        DAT_length = MAXIMUM_PAPER_LENGTH+WORD_LENGTH+1 - 
            remains_length;
        memset(DAT_storage + remains_length, 0, DAT_length);
        //printf("%s DAT_storage %X remains_length \n", 
         //   DAT_storage, (unsigned int) remains_length);
    }
}
    

static void check_quote() {
    const char text[] = 
        "wu.htet.hello world!.htet.wuka hlucpa hsactu";
    const uint8_t text_length = strlen(text);
    uint8_t remainder = 0;
    uint8_t lump_spot = 0;
    uint8_t lump_length = LUMP_LENGTH * MAX_SENTENCE_LUMP;
    uint16_t lump[LUMP_LENGTH * MAX_SENTENCE_LUMP];
    memset(lump, 0, lump_length*2);
    sentence_encode(text, text_length, lump, &lump_length,
        &remainder);
    for (lump_spot = 0; lump_spot < text_length; ++lump_spot) {
        printf("%X ", (unsigned int) text[lump_spot]);
    }
    printf(": text\n");
    for (lump_spot = 0; lump_spot < lump_length; ++lump_spot) {
        printf("%X ", (unsigned int) lump[lump_spot]);
    }
    
}

static void check_hello_world() {
    /*const char* text = "tcatkahsactu";
    const uint8_t text_length = strlen(text); */
}

static void check_ACC_all() {
    delete_empty_glyph_check();
    derive_first_word_check();
    encode_check();
    encode_word_PL_check();
    lump_encode_check();
    /* full encode check */
    full_encode_check();
    check_hello_world();
    printf("----\n");
    check_quote();
}

int main(int argc, char *argv[]) { 
    assert(argc > 0);
    assert(argv != NULL);
    check_ACC_all();
    return 0;
}
