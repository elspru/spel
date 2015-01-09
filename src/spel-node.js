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

"use strict";
var io = require("./lib/io");
var tokenize = require("./compile/tokenize");
var parse = require("./compile/parse");
var Phrase = require("./class/phrase");
var Sentence = require("./class/sentence");
var Type = require("./class/type");
var Text = require("./class/text");
var Dictionary = require("./lang/dictionary");
var Grammar = require("./lang/grammar");
var Language = require("./lang/language");
var Word = require("./class/word");
var Clause = require("./class/clause");
var Junction = require("./class/junction");
var mwak = new Language();
//var mwak = require("./lang/mwak");

//var nsentence = new Text(sentence);
//console.log("nsent"+JSON.stringify(nsentence));

//var phrase = new Sentence(mwak,"mi .u mao .a lai kai ya");
//console.log(JSON.stringify(phrase));
//console.log(phrase.isSuperset(mwak,"kai"));
var file = io.fileRead("vocab/vocab-mwak-C16glyph.txt");
console.log("file loaded");
var text = new Text(mwak,file);
console.log("text loaded");
var dict = new Dictionary(mwak,text);
console.log("dict loaded");
//console.log(dict.toString());
var wordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial : false,
	genitiveInitial : false,
	postpositional : false,
	phraseOrder: ["ku","tua",".u",".i","ta",".a"]
};
//console.log(dict.fromMwak);
var grammar = new Grammar(wordOrder,dict);
console.log("grammar loaded");
var eng = new Language(grammar,dict);
console.log("english language loaded");

//console.log(dict.toLocaleString(eng));
//var word = new Text(mwak,"mi .u sla munt .a mwa .i .ia yi kai pa ");
//	console.log(eng.grammar.phraseWords);
var string = "ha if btw cool then su me be say ob tha be good su hello world ya"
//var string = " ha be say if su me ya "
var string = " ha if su me be the say love me  ya "
var string = " su me and su world be love ob thee ya"
var string = " su me and thee and world and me world ya"
//var string = "  su me and su thee and su world and su me world "
var mstring = " mi .u tai sla munt .a ti mwa ta .i .ia ya"
var mstring = " mi .u ku yam .i sla munt .a tua .ia ya "
var mstring = " mi yam munt .a .ia ya "
var mstring = "  mi .a ki tu .a ki tu pi munt .a "
var mstring = "  mi ki tu ki munt ki mi munt"
var tokens = tokenize.stringToWords(string);
var mtokens = tokenize.stringToWords(mstring);
//var word = parse.lastType(mwak.grammar,mtokens);
//var word = new Type(mwak,mstring);
//var word = parse.firstType(eng.grammar,tokens);
var word = new Sentence(eng,tokens);
var format = new Object();
var synesthesia = require('./lang/synesthesia');
format.glyphsTransform=synesthesia.darkConsoleGlyphsTransform;
console.log(word.toString());
console.log(JSON.stringify(word));
//console.log(word.body.length);
console.log(word.toLocaleString(eng,format));
console.log(word.toLocaleString(mwak,format));
//console.log("synesthezia");
//console.log(synesthesia.
//grayConsoleGlyphsTransform(word.toString()));
