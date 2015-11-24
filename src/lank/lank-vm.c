/* Hello World program */

#include<assert.h>
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>
#include<string.h>
#define INT_BYTES 4
#define SIZEOF_ARRAY( arr ) sizeof( arr ) / sizeof( arr[0] )
#define MAX_INSTRUCTION_VALUE 0xFFFFFFFFU
#define MAX_ADDRESS_VALUE 0xFFFFFFFFU
#define MAX_BATCH_IDX_VALUE 0xFFFFU
#define PHRASE_SIZE 0xFU
#define MAX_PHRASE_IDX 0xEU


/* memory */

/* memory layout in hexadecimal
0x0     ... 0xF     noun registers
0x10    ... 0x1F    type registers
0x20    ... 0x2F    phrase memory
0x30    ... 0x5F    meta memory
*/

#define MEMORY_SIZE 0x60
#define TYPES   0x10
#define PHRASE  0x20
#define STACK   0x30

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

static void error(const char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

/** amount of same bits
    returns how many bits are the same from smallest to largest
    up to the limit of maxLength
*/
static unsigned int amountOfSameBits(const unsigned int number,
        const unsigned int maxLength) {
    unsigned int length = 0;
    unsigned int i;
    unsigned int firstBit;
    unsigned int workNum = number;
    assert (number < MAX_INSTRUCTION_VALUE);
    assert (maxLength <= (unsigned int) sizeof(int)*8); 
    firstBit = workNum & 1U;
    assert (firstBit <= 1);
    for (i=0; i < maxLength; i++) {
        if ((workNum & 1U) == firstBit) {
            length++;
            workNum = workNum >> 1;
        } else {
            break;
        }
    }
    assert (length <= maxLength); 
    return length;
}

/** fetch
    assumes prog is split into batches of 256bits. 
 each batch starts with a short int index that describes the
 phrase layout by alternating 1's and 0's for different
 phrases. 
    based on this index and the pc register it copies those
bytes to the phrase array, leaving the rest of it blank.
 */ 
static void fetch(const unsigned int *prog, 
        const unsigned int progLength, 
        unsigned int *memory){
    unsigned int batchIndex = 0;
    unsigned int currentBit = 0;
    unsigned int phraseWord = 0;
    unsigned int maxLength = PHRASE_SIZE;
    unsigned int i;
    unsigned int remainingLength = 0;
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

static char nibbleToLankGlyph(const unsigned int nibble){
    char result;
    assert(nibble <= 0xF );
    switch (nibble){
        case 0: result = 'm'; break;
        case 1: result = 'k'; break;
        case 2: result = 'i'; break;
        case 3: result = 'a'; break;
        case 4: result = 'y'; break;
        case 5: result = 'u'; break;
        case 6: result = 'p'; break;
        case 7: result = 'w'; break;
        case 8: result = 'n'; break;
        case 9: result = 's'; break;
        case 0xA: result = 't'; break;
        case 0xB: result = 'l'; break;
        case 0xC: result = 'h'; break;
        case 0xD: result = 'f'; break;
        case 0xE: result = '.'; break;
        case 0xF: result = 'c'; break;
        default: result = 'X'; break;
    }
    assert(result >= '.' && result <='z' );
    return result;
}


static void EightNibblesToLankGlyphs(const unsigned int intWord,
        char *result){
    unsigned int nibbles[8];
    assert( intWord <= MAX_INSTRUCTION_VALUE);
    assert( result != NULL ); /*char array result*/
    result[8] = (char) 0; /* make null terminated string */
    nibbles[0] =  intWord & 0x0000000F;
    nibbles[1] = (intWord & 0x000000F0 )>> 0x4;
    nibbles[2] = (intWord & 0x00000F00 )>> 0x8;
    nibbles[3] = (intWord & 0x0000F000 )>> 0xC;
    nibbles[4] = (intWord & 0x000F0000 )>> 0x10;
    nibbles[5] = (intWord & 0x00F00000 )>> 0x14;
    nibbles[6] = (intWord & 0x0F000000 )>> 0x18;
    nibbles[7] = (intWord & 0xF0000000 )>> 0x1C;
    result[0] = nibbleToLankGlyph(nibbles[0]);
    result[1] = nibbleToLankGlyph(nibbles[1]);
    result[2] = nibbleToLankGlyph(nibbles[2]);
    result[3] = nibbleToLankGlyph(nibbles[3]);
    result[4] = nibbleToLankGlyph(nibbles[4]);
    result[5] = nibbleToLankGlyph(nibbles[5]);
    result[6] = nibbleToLankGlyph(nibbles[6]);
    result[7] = nibbleToLankGlyph(nibbles[7]);
}

/** whole phrase to glyph 
needs glyph array of phraseLength times phrase word size
*/
static void wholePhraseToGlyph(const unsigned int
        *memory, char * glyphs) {
    unsigned int i = 0;
    assert (memory != NULL);
    assert (glyphs != NULL);
    assert (memory[PHRASE_LENGTH] > 0);
    assert (memory[PHRASE_LENGTH] <= PHRASE_SIZE);
    for (i = 0; i < memory[PHRASE_LENGTH]; i++) {
        EightNibblesToLankGlyphs(memory[PHRASE_WORD+i], glyphs);
    }
    assert (sizeof(glyphs) > 0);
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
static void printRegs(const unsigned int *memory) {
    unsigned int printedLength = 0;
    assert(memory != NULL);
    printedLength += printf("registers: \n");
    printedLength += printf("      Value\tType \n");
    printedLength += printf(" IMM    %d\t0x%X,\n",
        (int)memory[IMM ], memory[TYPES+IMM ]); 
    printedLength += printf(" HEY    %d\t0x%X,\n",
        (int)memory[HEY], memory[TYPES+HEY]);
    printedLength += printf(" ABOUT  %d\t0x%X,\n",
        (int)memory[ABOUT], memory[TYPES+ABOUT]);
    printedLength += printf(" SU     %d\t0x%X,\n",
        (int)memory[SU  ], memory[TYPES+SU  ]); 
    printedLength += printf(" OF     %d\t0x%X,\n",
        (int)memory[OF  ], memory[TYPES+OF  ]); 
    printedLength += printf(" TO     %d\t0x%X,\n",
        (int)memory[TO  ], memory[TYPES+TO  ]);
    printedLength += printf(" FROM   %d\t0x%X,\n",
        (int)memory[FROM], memory[TYPES+FROM]);
    printedLength += printf(" BY     %d\t0x%X,\n",
        (int)memory[BY  ], memory[TYPES+BY  ]);
    printedLength += printf(" TO     %d\t0x%X,\n",
        (int)memory[AT  ], memory[TYPES+AT  ]);
    printedLength += printf(" BE     %d\t0x%X,\n",
        (int)memory[TIL  ], memory[TYPES+TIL  ]);
    printedLength += printf(" OB     %d\t0x%X,\n",
        (int)memory[TIL  ], memory[TYPES+TIL  ]);
    printedLength += printf(" BE     %d\t0x%X,\n",
        (int)memory[BE  ], memory[TYPES+BE  ]);
    printedLength += printf(" DATAP  %d\t0x%X,\n",
        (int)memory[DATAP  ], memory[TYPES+DATAP  ]);
    printedLength += printf(" STACKP %d\t0x%X,\n",
        (int)memory[STACKP  ], memory[TYPES+STACKP  ]);
    printedLength += printf(" PC     %d\t0x%X,\n",
        (int)memory[PC  ], memory[TYPES+PC  ]);
    assert(printedLength > 0);
}

static void phraseDecode(const unsigned int phraseWord, 
    const unsigned short int typeWord, unsigned int *memory) {
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
static void decode(unsigned int *memory){
    unsigned int immediateValue = 0;
    unsigned int immediateLengthWord = 0;
    unsigned int phraseWord = 0;
    unsigned short int typeWord = 0;
    if ((memory[PHRASE_WORD+0] & 0x0000C2D6U) == 0x0000C2D6U) {
        assert(memory[PHRASE_LENGTH] > 1);
        immediateLengthWord = (memory[PHRASE_WORD+0] & 0xFFFF0000U) >> 
            0x10;
        assert(immediateLengthWord > 0);
        assert(0xFFFF >= immediateLengthWord);
        switch(immediateLengthWord) {
            case ZERO_WORD:
                immediateValue = memory[PHRASE_WORD+1] & 0x0000FFFFU;
                assert (immediateValue <= MAX_INSTRUCTION_VALUE);
                memory[IMM]= immediateValue;   
                phraseWord = (memory[PHRASE_WORD+1] & 0xFF000000U) >> 
                    0x18;
                typeWord = (unsigned short int) 
                    ((memory[PHRASE_WORD+1] & 0x00FF0000U) >> 0x10);
                break;
            default: 
                error("decode: unknown immediateLengthWord");
                break;
        }
    }
    phraseDecode(phraseWord,typeWord,memory);
}


static void eval(unsigned int *memory, bool *running) {
    unsigned int command;
    if ((memory[PHRASE_WORD+0] & 0x342C0000U) == 0x342C0000U) {
        /* can add compound verbs later */
        assert(memory[PHRASE_LENGTH] == 1); /*single verbs for now*/
        command = memory[PHRASE_WORD+0] & 0x0000FFFFU;
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

static void run(const unsigned int *prog, 
        const unsigned int progLength) {
    unsigned int memory[MEMORY_SIZE];
    unsigned int i = 0;
    bool running = true;
    char glyphs[9];
    memset(glyphs,(char) 0,9);
    memset(memory,0,MEMORY_SIZE*INT_BYTES);
    /* fetch phrases */
    for (i = 0; i < progLength; i++) {
        fetch(prog, progLength, memory);
        decode(memory);
        assert(memory[PHRASE_WORD+0] <= MAX_INSTRUCTION_VALUE); 
        printf("PC %X INSTR %X\n",memory[PC],memory[PHRASE_WORD+0]);
        wholePhraseToGlyph(memory, glyphs);
        printf("%s\n",glyphs);
        eval(memory, &running);
        if (running == false) {
            break;
        }
    }
}

int main()
{
   unsigned int prog[] = { 0x126, 0x9B58C2D6U, 0x3C380064U,
           0x9B58C2D6U, 0x3A3800C8U, 
           0x342CC13AU,
           0x9B58C2D6U, 0x593800D8U, 
           0x342CC854U,
           0x342CA291U
        }; 
    unsigned int progLength = 0xA;
    assert(progLength > 0);
/* pfihnuls mmpynaha pfihnuls mmhnnata takhhiya
    cwahhiya */
    run(prog, progLength);
    /* exit */
    return 0;
}
