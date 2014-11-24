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
var mwak = new Language();
//var mwak = require("./lang/mwak");

//var nsentence = new Text(sentence);
//console.log("nsent"+JSON.stringify(nsentence));

//var file = JSON.parse(io.fileRead("vocab-mwak-C4bit.txt.json"));
var file = io.fileRead("vocab-mwak-C16glyph.txt");
var text = new Text(mwak,file);
//////console.log(String(text));
////////console.log(String(text));
var dict = new Dictionary(mwak,text);
var wordOrder = {
	headFinal : false,
	verbFinal : true,
	postpositional : false,
	phraseOrder: [".u",".i","ta",".a"]
};
var grammar = new Grammar(wordOrder,dict);
var eng = new Language(grammar,dict);

//console.log(text.toString(eng));
console.log(text.toLocaleString(eng));
//console.log(word);
//var emitter = require("events").EventEmitter;
//var d = require("domain").create();
//d.on("warn",function(err){console.log(err)});
//d.on("error",function(err){console.log(err)});
//d.run(function(){
var word = new Text(mwak,"mi .u sla munt .a mwa .i pa ");
console.log(word.toString());
console.log(word.toLocaleString(eng));
