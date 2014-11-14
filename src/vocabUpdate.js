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

var debug = true;
var amount = 2;
var langDir = "../doc/lang/";
var fileStem = "vocab-mwak-";
var fileSuffix = "bit.txt";
var COrig, XOrig, CFilename, XFilename,
    CText, XText, XPText, CPText,
    definitions, sentence, phrase;
var i,j;
function textUpdate(theText,sentence){
	//sentence = text.sentences[j];
	//console.log(String(sentence));
	var matchPhrase = String(sentence.phraseGet(".u"));
	theText.sentenceUpdate(matchPhrase,sentence);
}
for (i=1;i<=amount;i++){
	CFilename = "./vocab-mwak-C"+i+"bit.txt";
	XFilename = "./vocab-mwak-X"+i+"bit.txt";
	COrig = io.fileRead(CFilename);
	//JSON.parse(io.fileRead(CFilename+".json"));
	XOrig = io.fileRead(XFilename);
	//JSON.parse(io.fileRead(XFilename+".json"));
	console.log("loading "+CFilename);
	CText = new Text(COrig,CFilename);
	console.log("loading "+XFilename);
	XText = new Text(XOrig,XFilename);
	//console.log(XText);
	// update current core based on previous
	if (typeof CPText !== "undefined"){
	console.log("updating "+CFilename);
	definitions = CPText.select(".a");
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
	definitions = XPText.select(".a");
	definitions.sentences.forEach(textUpdate.curry(XText));
	}
	// update current extended based on current core
	definitions = CText.select(".a");
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
