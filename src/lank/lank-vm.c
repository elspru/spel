/* Hello World program */

#include <assert.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include <stdint.h>
#include "lanklib.h"
#define INT_BYTES 4
#define SIZEOF_ARRAY( arr ) sizeof( arr ) / sizeof( arr[0] )
#define MAX_ADDRESS_VALUE (uint32_t) 0xFFFFFFFFU
#define MAX_BATCH_IDX_VALUE (uint32_t) 0xFFFFU
#define PHRASE_SIZE (uint32_t) 0xFU
#define MAX_PHRASE_IDX (uint32_t) 0xEU


/* memory */

/* memory layout in hexadecimal
0x0     ... 0xF     noun registers
0x10    ... 0x1F    type registers
0x20    ... 0x2F    phrase memory
*/

#define MEMORY_SIZE 0x60
#define TYPES   0x10
#define PHRASE  0x20
/*not used
0x30    ... 0x5F    stack memory
#define STACK   0x30 */

#define PHRASE_LENGTH  PHRASE
#define PHRASE_WORD  PHRASE+1

/* case registers */
#define IMM     0x0
#define HEY     0x1
#define ABOUT   0x2
#define SU      0x3
#define OF      0x4
#define TO      0x5
#define FROM    0x6
#define BY      0x7
#define AT      0x8
#define TIL     0x9
#define OB      0xA
#define BE      0xB
#define DATAP   0xC
#define STACKP  0xE
#define PC      0xF

/* words  */
#define SU_WORD 1
#define TIME 2
#define FROM_WORD 0x59
#define IN_WORD 0x28
#define BY_WORD 0x4
#define TO_WORD 0x3A
#define OB_WORD 0x3C
#define BE_WORD 7
#define ADD_WORD 0xC13A
#define SUB_WORD 0xC854
#define EXIT_WORD 0xA291
#define ZERO_WORD 0x9B58
#define ONE_WORD 0x9B58


/** amount of same bits
    returns how many bits are the same from smallest to largest
    up to the limit of maxLength
*/
static uint32_t amountOfSameBits(const uint32_t number,
        const uint32_t maxLength) {
    uint32_t length = 0;
    uint32_t i;
    uint32_t firstBit;
    uint32_t workNum = number;
    assert (number < MAX_INSTRUCTION_VALUE);
    assert (maxLength <= (uint32_t) sizeof(int)*8); 
    firstBit = workNum & (uint32_t) 1U;
    assert (firstBit <= (uint32_t) 1);
    for (i=0; i < maxLength; i++) {
        if ((workNum & (uint32_t) 1U) == firstBit) {
            length++;
            workNum = workNum >> 1;
        } else {
            break;
        }
    }
    assert (length <= maxLength); 
    return length;
}


static void memPhraseToLankGlyphs(const uint32_t *memory, char *glyphs) {
    unsigned int i = 0;
    assert (memory != NULL);
    assert (glyphs != NULL);
    assert (memory[PHRASE_LENGTH] > 0);
    assert (memory[PHRASE_LENGTH] <= PHRASE_SIZE);
    for (i = 0; i < (unsigned int) memory[PHRASE_LENGTH]; i++) {
        aUint32ToLankGlyphs(memory[PHRASE_WORD+i], glyphs);
    }
    assert (sizeof(glyphs) > 0);
}

/** fetch
    assumes prog is split into batches of 256bits. 
 each batch starts with a short int index that describes the
 phrase layout by alternating 1's and 0's for different
 phrases. 
    based on this index and the pc register it copies those
bytes to the phrase array, leaving the rest of it blank.
 */ 
static void fetch(const uint32_t *prog, 
        const uint32_t progLength, 
        uint32_t *memory){
    uint32_t batchIndex = 0;
    uint32_t currentBit = 0;
    uint32_t phraseWord = 0;
    uint32_t maxLength = PHRASE_SIZE;
    uint32_t i;
    uint32_t remainingLength = 0;
    assert(memory != NULL );
    if (memory[PC] >= progLength) {
        error("PC exceeded end of program");
    }
    assert(memory[PC] < progLength);
    currentBit = memory[PC]%PHRASE_SIZE;
    batchIndex = prog[memory[PC]-currentBit]; 
    /* skip index */
    if (currentBit == 0) {
        memory[PC] = memory[PC]+1;
        currentBit++;
    }
    assert (currentBit < PHRASE_SIZE);
    batchIndex = batchIndex >> currentBit;
    assert (batchIndex < MAX_BATCH_IDX_VALUE);
    remainingLength =  progLength-memory[PC];
    if (remainingLength < PHRASE_SIZE) {
        maxLength = (progLength % MAX_PHRASE_IDX)-currentBit; 
    } else {
        maxLength = PHRASE_SIZE-currentBit;
    }
    assert (maxLength <= PHRASE_SIZE);
    memory[PHRASE_LENGTH] = amountOfSameBits(batchIndex, maxLength);
    assert (memory[PHRASE_LENGTH] <= remainingLength);
    assert (memory[PHRASE_LENGTH] <= maxLength);
    for (i=0;i<memory[PHRASE_LENGTH];i++){
        memory[PC] = memory[PC]+1 ;
        phraseWord =  prog[memory[PC]-1];
        assert (phraseWord <= MAX_INSTRUCTION_VALUE); 
        memory[PHRASE_WORD+i] = phraseWord;
    }
    /* fill rest with blanks */
    /*
    for (i=memory[PHRASE_LENGTH];i<PHRASE_SIZE;i++) {
        memory[PHRASE_WORD+i] = 0;
    }*/
}



/*
#define IMM     0x0
#define HEY     0x1
#define ABOUT   0x2
#define SU      0x3
#define OF      0x4
#define TO      0x5
#define FROM    0x6
#define BY      0x7
#define AT      0x8
#define TIL     0x9
#define OB      0xA
#define BE      0xB
#define DATAP   0xC
#define STACKP  0xE
#define PC  0xF
*/
static void printRegs(const uint32_t *memory) {
    uint32_t printedLength = 0;
    assert(memory != NULL);
    printedLength += printf("registers: \n");
    printedLength += printf("      Value\tType \n");
    printedLength += printf(" IMM    %d\t0x%X,\n",
        (int)memory[IMM ], (unsigned int) memory[TYPES+IMM ]); 
    printedLength += printf(" HEY    %d\t0x%X,\n",
        (int)memory[HEY], (unsigned int) memory[TYPES+HEY]);
    printedLength += printf(" ABOUT  %d\t0x%X,\n",
        (int)memory[ABOUT], (unsigned int) memory[TYPES+ABOUT]);
    printedLength += printf(" SU     %d\t0x%X,\n",
        (int)memory[SU  ], (unsigned int) memory[TYPES+SU  ]); 
    printedLength += printf(" OF     %d\t0x%X,\n",
        (int)memory[OF  ], (unsigned int) memory[TYPES+OF  ]); 
    printedLength += printf(" TO     %d\t0x%X,\n",
        (int)memory[TO  ], (unsigned int) memory[TYPES+TO  ]);
    printedLength += printf(" FROM   %d\t0x%X,\n",
        (int)memory[FROM], (unsigned int) memory[TYPES+FROM]);
    printedLength += printf(" BY     %d\t0x%X,\n",
        (int)memory[BY  ], (unsigned int) memory[TYPES+BY  ]);
    printedLength += printf(" TO     %d\t0x%X,\n",
        (int)memory[AT  ], (unsigned int) memory[TYPES+AT  ]);
    printedLength += printf(" BE     %d\t0x%X,\n",
        (int)memory[TIL  ], (unsigned int) memory[TYPES+TIL  ]);
    printedLength += printf(" OB     %d\t0x%X,\n",
        (int)memory[TIL  ], (unsigned int) memory[TYPES+TIL  ]);
    printedLength += printf(" BE     %d\t0x%X,\n",
        (int)memory[BE  ], (unsigned int) memory[TYPES+BE  ]);
    printedLength += printf(" DATAP  %d\t0x%X,\n",
        (int)memory[DATAP  ], (unsigned int) memory[TYPES+DATAP  ]);
    printedLength += printf(" STACKP %d\t0x%X,\n",
        (int)memory[STACKP  ], (unsigned int) memory[TYPES+STACKP  ]);
    printedLength += printf(" PC     %d\t0x%X,\n",
        (int)memory[PC  ], (unsigned int) memory[TYPES+PC  ]);
    assert(printedLength > 0);
}

static void phraseDecode(const uint32_t phraseWord, 
    const uint16_t typeWord, uint32_t *memory) {
    if (phraseWord != 0) {
        switch(phraseWord) {
            case OB_WORD: /*ha */
                memory[OB]= memory[IMM];
                memory[TYPES+OB]= typeWord;
                break;
            case TO_WORD: /*ta */
                memory[TO]= memory[IMM];
                memory[TYPES+TO]= typeWord;
                break;
            case FROM_WORD: /*su */
                memory[FROM]= memory[IMM];
                memory[TYPES+FROM]= typeWord;
                break;
            default:
                error("phraseDecode: unknown phraseWord");
                break;
        }
    }
}
/* decode algorithm:
   if starts with pfih, then identify how long,
    once identified set immediate value
    and extract command portion,
    match command portion to register,
    load register with immediate value.
*/
static void decode(uint32_t *memory){
    uint32_t immediateValue = 0;
    uint32_t immediateLengthWord = 0;
    uint32_t phraseWord = 0;
    uint16_t typeWord = 0;
    if ((memory[PHRASE_WORD+0] & 
            (uint32_t) 0x0000C2D6U) == (uint32_t) 0x0000C2D6U) {
        assert(memory[PHRASE_LENGTH] > 1);
        immediateLengthWord = (memory[PHRASE_WORD+0] & 
            (uint32_t) 0xFFFF0000U) >> 0x10;
        assert(immediateLengthWord > 0);
        assert(0xFFFF >= immediateLengthWord);
        switch(immediateLengthWord) {
            case ZERO_WORD:
                immediateValue = memory[PHRASE_WORD+1] & 
                    (uint32_t) 0x0000FFFFU;
                assert (immediateValue <= MAX_INSTRUCTION_VALUE);
                memory[IMM]= immediateValue;   
                phraseWord = (memory[PHRASE_WORD+1] & 
                    (uint32_t) 0xFF000000U) >> 0x18;
                typeWord = (uint16_t) 
                    ((memory[PHRASE_WORD+1] & 
                        (uint32_t) 0x00FF0000U) >> 0x10);
                break;
            default: 
                error("decode: unknown immediateLengthWord");
                break;
        }
    }
    phraseDecode(phraseWord,typeWord,memory);
}


static void eval(uint32_t *memory, bool *running) {
    uint32_t command;
    if ((memory[PHRASE_WORD+0] & (uint32_t) 0x342C0000U) == 
            (uint32_t) 0x342C0000U) {
        /* can add compound verbs later */
        assert(memory[PHRASE_LENGTH] == 1); /*single verbs for now*/
        command = memory[PHRASE_WORD+0] & (uint32_t) 0x0000FFFFU;
        assert(command != 0);
        switch(command) {
            case EXIT_WORD: /*ksit exit*/
                printf("exit\n"); 
                *running = false;
                break;
            case ADD_WORD: /*takh add*/
                assert (memory[TYPES+TO] == memory[TYPES+OB]);
                memory[TO] = memory[TO] + memory[OB] + memory[FROM];
                printf("added\n");
                printRegs(memory);
                break;
            case SUB_WORD: /*yunh sub*/
                assert (memory[TYPES+FROM] == memory[TYPES+OB]);
                memory[TO] = memory[FROM] - memory[OB];
                printf("subtracted\n");
                printRegs(memory);
                break;
            default:
                error("eval: unknown command");
                break;
        }
    }
}

void run(const uint32_t *prog, 
        const uint32_t progLength, uint32_t *memory) {
    uint32_t i = 0;
    bool running = true;
    char glyphs[9];
    memset(glyphs,(char) 0,9);
    /* fetch phrases */
    for (i = 0; i < progLength; i++) {
        fetch(prog, progLength, memory);
        decode(memory);
        assert(memory[PHRASE_WORD+0] <= MAX_INSTRUCTION_VALUE); 
        printf("PC %X INSTR %X\n",
            (unsigned int) memory[PC],
            (unsigned int) memory[PHRASE_WORD+0]);
        memPhraseToLankGlyphs(memory, glyphs);
        printf("%s\n",glyphs);
        eval(memory, &running);
        if (running == false) {
            break;
        }
    }
}

int main()
{
   uint32_t prog[] = { 
            (uint32_t) 0x126, 
            (uint32_t) 0x9B58C2D6U, 
            (uint32_t) 0x3C380064U,
            (uint32_t) 0x9B58C2D6U, 
            (uint32_t) 0x3A3800C8U, 
            (uint32_t) 0x342CC13AU,
            (uint32_t) 0x9B58C2D6U, 
            (uint32_t) 0x593800B8U, 
            (uint32_t) 0x342CC854U,
            (uint32_t) 0x342CA291U
        }; 
    uint32_t progLength = 0xA;
    uint32_t memory[MEMORY_SIZE];
    const char lankGlyphs[] = "salhmunt";
    char lankResult[5] = "    ";
    uint16_t lankResult16[2] = {0,0};
    uint32_t lankResult32[1] = {0};
    memset(memory,0,MEMORY_SIZE*INT_BYTES);
    assert(progLength > 0);
/* pfihnuls mmpynaha pfihnuls mmhnnata takhhiya
    cwahhiya */
    run(prog, progLength, memory);
    /* exit */
    lankGlyphsToChar8(9,lankGlyphs,5,lankResult);
    printf("glyphs %s result %X\n",lankGlyphs,
            (unsigned int) lankResult[0]);
    lankGlyphsToUint16(9,lankGlyphs,2,lankResult16);
    printf("glyphs %s result %X\n",lankGlyphs,
            (unsigned int) lankResult16[0]);
    lankGlyphsToUint32(9,lankGlyphs,1,lankResult32);
    printf("glyphs %s result %X\n",lankGlyphs,
            (unsigned int) lankResult32[0]);
    return 0;
}
