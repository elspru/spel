
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


/** print whole instruction
prints whole instruction from instruction array
returns the cumulative value of printf
*/
static unsigned int printWholeInstruction(const unsigned int
        *instruction, const unsigned int instructionLength) {
    unsigned int printedLength = 0;
    unsigned int i = 0;
    char glyphs[9];
    glyphs[0]='X'; /* set initial value */
    assert (instructionLength <= BATCH_SIZE);
    for (i = 0; i < instructionLength; i++) {
        EightNibblesToLankGlyphs(instruction[i], glyphs);
        printedLength += printf("%s ", glyphs);
    }
    printedLength += printf("\n");
    assert (printedLength > 0);
    return printedLength;
}

