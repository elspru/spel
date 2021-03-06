#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for extracting dictionary definitions ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict"
var hof = require("../lib/hof");
var io = require("../lib/io");
var Text = require('../class/text');
var Language = require('../lang/language');
var mwak = new Language();

// first argument is filename
var filename = "mwak/C16glyph.txt";  //process.argv[2];
console.log("reading "+filename);
var fileContents = io.fileRead(filename);
console.log("creating text");
var fileText = new Text(mwak,fileContents);
console.log("selecting definitions");
var definitions = fileText.select(mwak,"ha");
console.log("filtering");
var sentences = definitions.sentences;
var i;
for (i=0;i<sentences.length;i++){
sentences[i].phraseDelete(mwak,"kya");
sentences[i].phraseDelete(mwak,"su");
sentences[i].phraseDelete(mwak,"psu");
sentences[i].phraseDelete(mwak,"hi");
}
console.log(definitions.toString());
io.fileWrite("eng.txt",definitions.toString());
