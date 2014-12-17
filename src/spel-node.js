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
console.log(dict.toString());
var wordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial : false,
	genitiveInitial : false,
	postpositional : false,
	phraseOrder: [".u",".i","ta",".a"]
};
//console.log(dict.fromMwak);
var grammar = new Grammar(wordOrder,dict);
console.log("grammar loaded");
var eng = new Language(grammar,dict);
console.log("english language loaded");

console.log(dict.toLocaleString(eng));
//var word = new Text(mwak,"mi .u sla munt .a mwa .i .ia yi kai pa ");
//	console.log(eng.grammar.phraseWords);
//var string = "ha btw cool su me be say ob tha be good su hello world ya"
var string = "  su tha be good of me ya "
var mstring = " mi .u tai sla munt .a ti mwa ta .i .ia ya"
var mstring = " mi pi pam .i ti .u ya "
var tokens = tokenize.stringToWords(string);
var mtokens = tokenize.stringToWords(mstring);
//var word = new Sentence(mwak,mstring);
//var word = parse.lastPhrase(mwak.grammar,mtokens);
var word = new Sentence(eng,string);
var format = new Object();
var synesthesia = require('./lang/synesthesia');
format.glyphsTransform=synesthesia.darkConsoleGlyphsTransform;
console.log(word.toString());
console.log(JSON.stringify(word));
console.log(word.toLocaleString(eng,format));
console.log(word.toLocaleString(mwak,format));
//console.log("synesthezia");
//console.log(synesthesia.
//grayConsoleGlyphsTransform(word.toString()));
