#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for nodejs console ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya

"use strict"
var io = require("./lib/io");
var tokenize = require("./compile/tokenize");
var parse = require("./compile/parse");
var Phrase = require("./type/phrase");
var Sentence = require("./type/sentence");
var Type = require("./type/type");
var Text = require("./type/text");
var Dictionary = require("./lang/dictionary");
var Grammar = require("./lang/grammar");
var Language = require("./lang/language");
var Word = require("./type/word");
var Clause = require("./type/clause");
var mwak = new Language();
//var mwak = require("./lang/mwak");

//var nsentence = new Text(sentence);
//console.log("nsent"+JSON.stringify(nsentence));

//var phrase = new Sentence(mwak,"mi .u mao .a lai kai ya");
//console.log(JSON.stringify(phrase));
//console.log(phrase.isSuperset(mwak,"kai"));
//var file = JSON.parse(io.fileRead("vocab-mwak-C4bit.txt.json"));
var file = io.fileRead("vocab/vocab-mwak-C16glyph.txt");
console.log("file loaded");
var text = new Text(mwak,file);
console.log("text loaded");
var dict = new Dictionary(mwak,text);
console.log("dict loaded");
var wordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial : false,
	postpositional : false,
	phraseOrder: [".u",".i","ta",".a"]
};
//console.log(dict.fromMwak);
var grammar = new Grammar(wordOrder,dict);
console.log("grammar loaded");
var eng = new Language(grammar,dict);
console.log("english language loaded");

//var word = new Text(mwak,"mi .u sla munt .a mwa .i .ia yi kai pa ");
//	console.log(eng.grammar.phraseWords);
var string = "ha su me be say ob tha be good su hello world ya"
var mstring = " mi .u tai sla munt .a ti mwa ta .i .ia ya"
var tokens = tokenize.stringToWords(string);
var mtokens = tokenize.stringToWords(mstring);
//var word = new Sentence(mwak,mstring);
var word = new Text(eng,string);
var format = new Object();
format.glyphsTransform=darkConsoleGlyphsTransform;
console.log(word.toString());
console.log(JSON.stringify(word));
console.log(word.toLocaleString(eng,format));
console.log(word.toLocaleString(mwak,format));
console.log("synesthezia");
console.log(grayConsoleGlyphsTransform(word.toString()));
function darkConsoleGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
var colors=require("colors");
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph ==='a') glyph = glyph.red.bold;
if (glyph ==='u') glyph = glyph.blue.bold;
if (glyph ==='i') glyph = glyph.yellow.bold;
if (glyph ==='e') glyph = glyph.green.bold;
if (glyph ==='o') glyph = glyph.cyan.bold;
if (glyph ==='w') glyph = glyph.red.bold;
if (glyph ==='y') glyph = glyph.yellow.bold;
if (glyph ==='l') glyph = glyph.green.bold;
if (glyph ==='.') glyph = glyph.yellow.bold;
if (glyph ==='k') glyph = glyph.green.bold;
if (glyph ==='t') glyph = glyph.cyan.bold;
if (glyph ==='d') glyph = glyph.cyan.bold;
if (glyph ==='p') glyph = glyph.blue.bold;
if (glyph ==='b') glyph = glyph.blue.bold;
if (glyph ==='x') glyph = glyph.magneta.bold;
if (glyph ==='h') glyph = glyph.blue.bold;
if (glyph ==='c') glyph = glyph.yellow.bold;
if (glyph ==='s') glyph = glyph.yellow.bold;
if (glyph ==='r' ||  glyph === 'm' || glyph === 'c'
		|| glyph === 'r')
	glyph = glyph.red;
if (glyph ==='n')
	glyph = glyph.red.bold;
if (glyph ==='t' )
	glyph = glyph.cyan;
if (glyph ==='l' )
	glyph = glyph.green.bold;
result+=glyph;
}
return result;
}
function grayConsoleGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
var colors=require("colors");
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph ==='a' )
	glyph = glyph.red;
if (glyph ==='u' || glyph ==='p')
	glyph = glyph.blue;
if (glyph=== 'i')
	glyph = glyph.yellow.bold;
if (glyph ==='e' )
	glyph = glyph.green;
if (glyph ==='o' )
	glyph = glyph.cyan;
if (glyph ==='k' )
	glyph = glyph.green;
if (glyph ==='w')
	glyph = glyph.yellow;
if (glyph ==='h')
	glyph = glyph.blue;
if (glyph ==='b')
	glyph = glyph.magenta.bold;
if (glyph ==='d')
	glyph = glyph.blue.bold;
if (glyph ==='s' || glyph ==='.' || glyph==='y')
	glyph = glyph.yellow.bold;
if (glyph ==='r' ||  glyph === 'm' || glyph === 'c'
		|| glyph === 'r')
	glyph = glyph.red;
if (glyph ==='n')
	glyph = glyph.red.bold;
if (glyph ==='t' )
	glyph = glyph.cyan;
if (glyph ==='l' )
	glyph = glyph.green.bold;
result+=glyph;
}
return result;
}
