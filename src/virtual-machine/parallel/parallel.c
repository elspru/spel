#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>
#include "vmlib.h"

void error(const char *message) {
    fprintf(stderr,"%s\n",message);
    exit(EXIT_FAILURE);
}

char nibbleToLankGlyph(const uint8_t nibble){
    char result = 'X';
    assert(nibble <= NIBBLE_MASK );
    switch (nibble){
        case 0x0: result = 'm'; break;
        case 0x1: result = 'k'; break;
        case 0x2: result = 'i'; break;
        case 0x3: result = 'a'; break;
        case 0x4: result = 'y'; break;
        case 0x5: result = 'u'; break;
        case 0x6: result = 'p'; break;
        case 0x7: result = 'w'; break;
        case 0x8: result = 'n'; break;
        case 0x9: result = 's'; break;
        case 0xA: result = 't'; break;
        case 0xB: result = 'l'; break;
        case 0xC: result = 'h'; break;
        case 0xD: result = 'f'; break;
        case 0xE: result = '.'; break;
        case 0xF: result = 'c'; break;
        default: error("nibbleToLankGlyph: invalid nibble"); 
            break;
    }
    assert(result >= '.' && result <='z' );
    return result;
}

