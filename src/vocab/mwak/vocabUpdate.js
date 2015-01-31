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
var base = "../../"
var hof = require(base+"lib/hof");
var io = require(base+"lib/io");
var Text = require(base+'class/text');
var Language = require(base+'lang/language');
var mwak = new Language();

var debug = false;
var amount = 1;
var langDir = "../../doc/lang/";
var fileStem = "vocab-mwak-";
var fileSuffix = "glyph.txt";
//var fileNumbers = ["2","4","5","7","8","12","16","19","24"];
var fileNumbers = ["16"];
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
	//JSON.parse(io.fileRead(CFilename+".json"));
	//JSON.parse(io.fileRead(XFilename+".json"));
	console.log("loading "+CFilename);
	COrig = io.fileRead(CFilename);
	CText = new Text(mwak,COrig);
	console.log("loading "+XFilename);
	XOrig = io.fileRead(XFilename);
	XText = new Text(mwak,XOrig);
	//console.log(XText);
	// update current core based on previous
	if (CPText === undefined){
	var CString = CText.toLocaleString(mwak);
		console.log("writing "+CFilename);
	io.fileWrite(CFilename,CString);
}
else if (CPText !== undefined){
	console.log("updating "+CFilename);
	definitions = CPText.select(mwak,".a");
//console.log("C selections "+definitions);
	definitions.sentences.forEach(textUpdate.curry(CText));
	var CString = CText.toLocaleString(mwak);
	if (debug)
		console.log(CString);
	else {
		console.log("writing "+CFilename);
		//io.fileWrite(CFilename+".json",JSON.stringify(CText));
		io.fileWrite(CFilename,CString);
	}
	}
	// update current extended based on previous
	if (typeof XPText !== "undefined"){
	console.log("updating "+XFilename);
	definitions = XPText.select(mwak,".a");
//console.log("X selections "+definitions);
	definitions.sentences.forEach(textUpdate.curry(XText));
	}
	// update current extended based on current core
	definitions = CText.select(mwak,".a");
	definitions.sentences.forEach(textUpdate.curry(XText));
	var XString = XText.toLocaleString(mwak);
	if (debug)
		console.log(XString);
	else {
		console.log("writing "+XFilename);
	//	io.fileWrite(XFilename+".json",JSON.stringify(XText));
		io.fileWrite(XFilename,XString);
	}
	CPText=CText;
	XPText=XText;
}
