#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for updating dictionary files ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict"
var hof = require("./lib/hof");
var io = require("./lib/io");
var Text = require('./type/text');
var Language = require('./lang/language');
var mwak = new Language();

var debug = false;
var amount = 4;
var langDir = "../doc/lang/";
var fileStem = "vocab-mwak-";
var fileSuffix = "glyph.txt";
var fileNumbers = ["2","4","8","16"];
var COrig, XOrig, CFilename, XFilename,
    CText, XText, XPText, CPText,
    definitions, sentence, phrase;
var i,j;
function textUpdate(theText,sentence){
	//sentence = text.sentences[j];
	//console.log(String(sentence));
	var matchPhrase = String(sentence.phraseGet(mwak,".u"));
	theText.sentenceUpdate(mwak,matchPhrase,sentence);
}
for (i=0;i<amount;i++){
	CFilename = fileStem+"C"+fileNumbers[i]+fileSuffix;
	XFilename = fileStem+"X"+fileNumbers[i]+fileSuffix;
	COrig = io.fileRead(CFilename);
	//JSON.parse(io.fileRead(CFilename+".json"));
	XOrig = io.fileRead(XFilename);
	//JSON.parse(io.fileRead(XFilename+".json"));
	console.log("loading "+CFilename);
	CText = new Text(mwak,COrig,CFilename);
	console.log("loading "+XFilename);
	XText = new Text(mwak,XOrig,XFilename);
	//console.log(XText);
	// update current core based on previous
	if (typeof CPText !== "undefined"){
	console.log("updating "+CFilename);
	definitions = CPText.select(mwak,".a");
	definitions.sentences.forEach(textUpdate.curry(CText));
	if (debug)
		console.log(String(XText));
	else {
		console.log("writing "+CFilename);
		io.fileWrite(CFilename+".json",JSON.stringify(CText));
		io.fileWrite(CFilename,String(CText));
	}
	}
	// update current extended based on previous
	if (typeof XPText !== "undefined"){
	console.log("updating "+XFilename);
	definitions = XPText.select(mwak,".a");
	definitions.sentences.forEach(textUpdate.curry(XText));
	}
	// update current extended based on current core
	definitions = CText.select(mwak,".a");
	definitions.sentences.forEach(textUpdate.curry(XText));
	if (debug)
		console.log(String(XText));
	else {
		console.log("writing "+XFilename);
		io.fileWrite(XFilename+".json",JSON.stringify(XText));
		io.fileWrite(XFilename,String(XText));
	}
	CPText=CText;
	XPText=XText;
}
