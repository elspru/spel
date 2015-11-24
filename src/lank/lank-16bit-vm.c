/* Hello World program */

#include<assert.h>
#include<stdio.h>
#include<stdlib.h>
#define NUM_REGS 5
#define SIZEOF_ARRAY( arr ) sizeof( arr ) / sizeof( arr[0] )
#define MAX_INSTRUCTION_VALUE 0xFFFFU
#define MAX_ADDRESS_VALUE 0xFFFFU
#define BATCH_SIZE 0x10U
#define MAX_BATCH_IDX 0xFU

static void throw(char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

/** amount of same bits
    returns how many bits are the same from smallest to largest
    up to the limit of maxLength
*/
static unsigned int amountOfSameBits(unsigned int number,
        unsigned int maxLength) {
    unsigned int length = 0;
    unsigned int i;
    unsigned int firstBit;
    assert (number < MAX_INSTRUCTION_VALUE);
    assert (maxLength <= (unsigned int) sizeof(int)*8); 
    firstBit = number & 1U;
    assert (firstBit <= 1);
    for (i=0; i < maxLength; i++) {
        if ((number & 1U) == firstBit) {
            length++;
            number = number >> 1;
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
 instruction layout by alternating 1's and 0's for different
 phrases. 
    based on this index and the pc register it copies those
bytes to the instruction array, leaving the rest of it blank.
 */ 
static void fetch(unsigned int *prog, unsigned int progLength,
        unsigned int *pc, unsigned int *instruction, 
        unsigned int *batchLength){
    unsigned int shortIndex;
    unsigned int currentBit;
    unsigned int result;
    unsigned int maxLength;
    unsigned int i;
    /* Program Counter must be defined and valid*/
    assert(pc != NULL );
    assert(*pc < progLength);
    if (*pc >= progLength) {
        throw("PC exceeded end of program");
    }
    shortIndex = prog[*pc&(MAX_ADDRESS_VALUE-MAX_BATCH_IDX)]; 
    currentBit = *pc&((~MAX_ADDRESS_VALUE)+MAX_BATCH_IDX);
    /* skip index */
    if (currentBit == 0) {
        *pc = *pc+1;
        currentBit++;
    }
    assert (currentBit < BATCH_SIZE);
    shortIndex = shortIndex >> currentBit;
    maxLength = BATCH_SIZE-currentBit;
    assert (maxLength <= BATCH_SIZE);
    *batchLength = amountOfSameBits(shortIndex, maxLength);
    assert (*batchLength <= maxLength);
    for (i=0;i<*batchLength;i++){
        *pc = *pc+1 ;
        result =  prog[*pc-1];
        assert (result <= MAX_INSTRUCTION_VALUE); 
        instruction[i] = result;
    }
    /* fill rest with blanks */
    for (i=*batchLength;i<BATCH_SIZE;i++) {
        instruction[i] = 0;
    }
}

static void decode(unsigned int *instruction, unsigned int
        batchLength, unsigned int *regs){
    unsigned int immediateValue = 0;
    unsigned int i = 0;
    immediateValue = instruction[0];
    assert (immediateValue <= MAX_INSTRUCTION_VALUE);
    for (i = 0; i < batchLength; i++) {
        regs[0]= immediateValue;   
    }
}

static char nibbleToLankGlyph(unsigned int nibble){
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

static void FourNibblesToLankGlyphs(unsigned int instruction,
 char *result){
    unsigned int nibbles[4];
    assert( instruction <= MAX_INSTRUCTION_VALUE);
    assert( result != NULL ); /*char array result*/
    result[4] = (char) 0; /* make null terminated string */
    nibbles[0] =  instruction & 0x0000000F;
    nibbles[1] = (instruction & 0x000000F0 )>> 0x4;
    nibbles[2] = (instruction & 0x00000F00 )>> 0x8;
    nibbles[3] = (instruction & 0x0000F000 )>> 0xC;
    result[3] = nibbleToLankGlyph(nibbles[3]);
    result[2] = nibbleToLankGlyph(nibbles[2]);
    result[1] = nibbleToLankGlyph(nibbles[1]);
    result[0] = nibbleToLankGlyph(nibbles[0]);
}

static void EightNibblesToLankGlyphs(unsigned int instruction,
 char *result){
    unsigned int nibbles[8];
    assert( instruction <= MAX_INSTRUCTION_VALUE);
    assert( result != NULL ); /*char array result*/
    result[8] = (char) 0; /* make null terminated string */
    nibbles[0] =  instruction & 0x0000000F;
    nibbles[1] = (instruction & 0x000000F0 )>> 0x4;
    nibbles[2] = (instruction & 0x00000F00 )>> 0x8;
    nibbles[3] = (instruction & 0x0000F000 )>> 0xC;
    nibbles[4] = (instruction & 0x000F0000 )>> 0x10;
    nibbles[5] = (instruction & 0x00F00000 )>> 0x14;
    nibbles[6] = (instruction & 0x0F000000 )>> 0x18;
    nibbles[7] = (instruction & 0xF0000000 )>> 0x1C;
    result[7] = nibbleToLankGlyph(nibbles[7]);
    result[6] = nibbleToLankGlyph(nibbles[6]);
    result[5] = nibbleToLankGlyph(nibbles[5]);
    result[4] = nibbleToLankGlyph(nibbles[4]);
    result[3] = nibbleToLankGlyph(nibbles[3]);
    result[2] = nibbleToLankGlyph(nibbles[2]);
    result[1] = nibbleToLankGlyph(nibbles[1]);
    result[0] = nibbleToLankGlyph(nibbles[0]);
}


/** print whole instruction
prints whole instruction from instruction array
returns the cumulative value of printf
*/
static unsigned int printWholeInstruction(unsigned int
        *instruction, unsigned int batchLength) {
    unsigned int printedLength = 0;
    unsigned int i = 0;
    char glyphs[9];
    glyphs[0]='X'; /* set initial value */
    assert (batchLength <= BATCH_SIZE);
    for (i = 0; i < batchLength; i++) {
        FourNibblesToLankGlyphs(instruction[i], glyphs);
        printedLength += printf("%s ",glyphs);
    }
    printedLength += printf("\n");
    assert (printedLength > 0);
    return printedLength;
}

int main()
{
   unsigned int prog[] = { 0x19E1, 0xC2D6, 0x9B58, 0x0064, 0x3C38,
           0xC2D6, 0x9B58, 0x00C8, 0x3A38,
           0xC03A, 0x342C,
           0xA291, 0x342C
        }; 
    unsigned int progLength = 13;
/* pfih nuls mmpy naha pfih nuls mmhn nata tamh hiya
    cwah hiya */
    unsigned int regs[ NUM_REGS ];
    unsigned int *pc;
    unsigned int instruction[BATCH_SIZE];
    unsigned int printedLength = 0;
    unsigned int batchLength = 0;
    unsigned int i = 0;
    instruction[0]=0; /* set initial value */
    /* initialize registers */
    regs[0] = 0;
    regs[4] = 0;
    pc = regs+4; /* program counter */
    /* fetch instructions */
    for (i = 0; i < 5; i++) {
        fetch(prog, progLength, pc, instruction, &batchLength);
        decode(instruction,batchLength,regs);
        assert(instruction[0] <= MAX_INSTRUCTION_VALUE); 
        printf("PC %X INSTR %X\n",*pc,instruction[0]);
        printedLength = printWholeInstruction(instruction, 
            batchLength);
        assert(printedLength > 0);
    }
    /* exit */
    return 0;
}
