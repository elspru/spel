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
var file = io.fileRead("vocab-mwak-C4bit.txt");
var text = new Text(mwak,file);
//////console.log(String(text));
////////console.log(String(text));
var dict = new Dictionary(mwak,text);
var wordOrder = {
	verbFinal : true,
	postpositional : false,
	phraseOrder: [".u","ta",".a","ki",".i"]
};
var grammar = new Grammar(wordOrder,dict);
var eng = new Language(grammar,dict);

//console.log(word);
//var emitter = require("events").EventEmitter;
//var d = require("domain").create();
//d.on("warn",function(err){console.log(err)});
//d.on("error",function(err){console.log(err)});
//d.run(function(){
var word = new Text(mwak,"mi .u mwa .i sla asdf munt .a ya ");
console.log(word.toString());
console.log(word.toLocaleString(eng));
//});
//console.log(JSON.stringify(mwak));
//console.log(word.toLocaleString(lang)+" "+word2.toLocaleString(lang));//JSON.stringify(dict));
//console.log("sent "+text.toLocaleString(lang));
////console.log("done");
//io.fileWrite("vocab-mwak-C1bit.txt.json",JSON.stringify(text));
//var jsonFile = io.fileRead("vocab-mwak-X4bit.txt.json");
//var jsonObject = JSON.parse(jsonFile);
//var textObject = new Text(jsonObject);
//console.log("done");
//console.log(typeof textObject);
//var phraseJsonObject = JSON.parse(JSON.stringify(new Phrase("mi .u")));
//var sentence = new Sentence("mi .u register .a ya");
//var jsonSentenceObject = JSON.parse(JSON.stringify(sentence));
//console.log(jsonSentenceObject);
//var newSentence = new Sentence(jsonSentenceObject);
//console.log(newSentence.isLike(jsonSentenceObject));
//console.log(typeof phraseJsonObject + " " + phraseJsonObject.be);
//var phraseObject = new Phrase(phraseJsonObject);
//console.log(phraseObject);
//var tokens = tokenize.stringToWords("hey ya yi yi wha wha ya yi");
//var quotesExtracted = parse.quotesExtract(tokens);
//console.log(parse.firstSentence(quotesExtracted));
//var langDir = "../doc/lang/";

//var fileContents = fileRead(langDir+"vocab-mwak-2bit.txt");
//var bit3DictOrig = fileRead(langDir+"vocab-mwak-3bit.txt");
///// be say bo hello do
//var tokenize = require("./compile/tokenize");
//var parse = require("./compile/parse");
//var glyphs = tokenize
//	.stringToGlyphs(fileContents);
////console.log(glyphs);
//var tokens = tokenize.glyphsToTokens(glyphs);
////console.log(tokens);
//var words = tokenize.glyphsToWords(glyphs);
////console.log(words);
//var sentence = parse.firstSentence(words);
////console.log(sentence);
//var a_phrase = parse.firstSpecificPhrase(sentence,".a");
//var u_phrase = parse.lastSpecificPhrase(sentence,".u");
//var quote = parse.firstSingleWordQuote(tokens);
////var maybeQuote = parse.surroundingQuote(0,quote);
////console.log(words);
//console.log(sentence);
////console.log(quote);
//console.log(a_phrase);
//console.log(u_phrase);
////console.log(maybeQuote);
//var Phrase = require('./type/phrase');
//var phrase = new Phrase(u_phrase);
////console.log(phrase.isLike(".u "));
////console.log(phrase.caseWords);
////console.log(phrase.content);
//var Sentence = require('./type/sentence');
//var sentence2 = new Sentence("mi .u type .a ya");
////console.log(sentence2.toString());
////console.log(sentence2.endWords);
////console.log(sentence2.phrases);
////console.log(sentence2.isLike("mi  .u blah type .a ya"));
////var sentence3 = sentence2.phraseSet(0,"may .u");
////console.log(String(sentence2));
////console.log(sentence3.toString());
//var bit3DictText =  new Text(bit3DictOrig);
//var C2bitOrig = io.fileRead("./vocab-mwak-C2bit.txt");
//var X2bitOrig = io.fileRead("./vocab-mwak-X2bit.txt");
//var Text = require('./type/text');
//var C2bitText = new Text(C2bitOrig);
////console.log(String(text.select(".u")));
////console.log(String(text.sentenceUpdate("kiyk .u ","kiyk .u blah .a ya")));
//var X2bitText = new Text(X2bitOrig);
////console.log(String(bit3DictText));
//var text = C2bitText.select(".a");
//var theSentence, thePhrase, i;
//for (i=0; i<text.sentences.length; i++){
//	theSentence = text.sentences[i];
//	thePhrase = String(theSentence.phraseGet(".u"));
//	X2bitText.sentenceUpdate(thePhrase,theSentence);
//}
////console.log(String(X2bitText));
//io.fileWrite("./vocab-mwak-X2bit.txt",String(X2bitText));
////phrase = new Phrase(tokenize.stringToWords(".u"));
//var phrase2 = new Phrase(tokenize.stringToWords("mi .u"));
//console.log(phrase.equals(phrase2));
//
//console.log(phrase.isSubset(phrase2));
//console.log("sent3");
//var sentence3 = sentence2.copy();//.copy();
//console.log(String(sentence3));
//console.log("sent del");
//var sentenceDel = sentence2.phraseFindDel(".a");
//console.log("-a"+sentenceDel);
//sentenceDel = sentenceDel.phraseFindDel(".u");
//console.log("-u"+sentenceDel);
//console.log("sent2");
//console.log(String(sentence2));
//console.log("sent3");
//console.log(String(sentence3));
