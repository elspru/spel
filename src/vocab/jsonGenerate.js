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

var debug = false;

var hof = require("../lib/hof");
var io = require("../lib/io");
var fs = require("fs");
var tokenize = require('../compile/tokenize');
var Text = require('../class/text');
var Sentence = require('../class/sentence');
var Language = require('../lang/language');
var mwak = new Language();

// first argument is filename
var fromFilename = "eng.txt" ;
var fromLangCode = "en";
// spanish
var toFilename = "spa.txt" 
var toLangCode = "es";
translateUpdate(toFilename,toLangCode);
// french
var toFilename = "fra.txt"  
var toLangCode = "fr";
translateUpdate(toFilename,toLangCode);
// mandarin chinese
var toFilename = "cmn.txt"  
var toLangCode = "zh";
translateUpdate(toFilename,toLangCode);
// russian
var toFilename = "rus.txt"  
var toLangCode = "ru";
translateUpdate(toFilename,toLangCode);
// arabic
var toFilename = "ara.txt"  
var toLangCode = "ar";
translateUpdate(toFilename,toLangCode);
// portuguese 
var fromFilename = "spa.txt" 
var fromLangCode = "es"
var toFilename = "por.txt"  
var toLangCode = "pt";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// indonesian
var toFilename = "ind.txt"  
var toLangCode = "id";
translateUpdate(toFilename,toLangCode);
// german
var toFilename = "deu.txt"  
var toLangCode = "de";
translateUpdate(toFilename,toLangCode);
// japanese
var fromFilename = "cmn.txt" 
var fromLangCode = "zh"
var toFilename = "jpn.txt"  
var toLangCode = "ja";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// korean
var fromFilename = "jpn.txt" 
var fromLangCode = "ja"
var toFilename = "kor.txt"  
var toLangCode = "ko";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// hindi 
var toFilename = "hin.txt"  
var toLangCode = "hi";
translateUpdate(toFilename,toLangCode);
//// bengali
//var toFilename = "ben.txt"  
//var toLangCode = "bn";
//translateUpdate(toFilename,toLangCode);
//// tamil
//var toFilename = "tam.txt"  
//var toLangCode = "ta";
//translateUpdate(toFilename,toLangCode);

//translateUpdate(toFilename,toLangCode);
// italian
var toFilename = "ita.txt"  
var toLangCode = "it";
translateUpdate(toFilename,toLangCode);
// dutch 
var fromFilename = "deu.txt" 
var fromLangCode = "de"
var toFilename = "nld.txt"  
var toLangCode = "nl";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// swedish
var fromFilename = "deu.txt" 
var fromLangCode = "de"
var toFilename = "swe.txt"  
var toLangCode = "sv";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// swahili
var toFilename = "swa.txt"  
var toLangCode = "sw";
translateUpdate(toFilename,toLangCode);
// ukranian
var fromFilename = "rus.txt" ;
var fromLangCode = "ru";
var toFilename = "ukr.txt"  
var toLangCode = "uk";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// turkish
var toFilename = "tur.txt"  
var toLangCode = "tr";
translateUpdate(toFilename,toLangCode);
// hungarian
var toFilename = "hun.txt"  
var toLangCode = "hu";
translateUpdate(toFilename,toLangCode);
// esperanto
//var fromFilename = "spa.txt" 
//var fromLangCode = "es"
//var byService="apertium"
//var toFilename = "epo.txt"  
//var toLangCode = "eo";
//translateUpdate(toFilename,toLangCode,
//fromFilename,fromLangCode,byService);


function translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode,byService){
console.log("loading file " + toFilename);
if (fromFilename=== undefined){
 fromFilename = "eng.txt" ;
 fromLangCode = "en";
}
if (byService=== undefined){
byService = "google";
}
var fileContents = io.fileRead(fromFilename);
var fileText = new Text(mwak,fileContents);
var definitions = fileText.select(mwak,"ha");
var sentences = definitions.sentences;

var toFileContents = io.fileRead(toFilename);
var toFileText = new Text(mwak,toFileContents);

var newText = toFileText.copy(mwak);

var warnings = new Array();
var childProcess = require('child_process');
var execSync = require('exec-sync');
var i, translateFail;
console.log("translating");
for (i=0;i<sentences.length;i++){
var sentence = sentences[i];
var subject = String( sentence.phraseGet(mwak,"hu"));
var find = toFileText.indexOf(mwak,subject);
if (find === -1){
var obPhraseBody = sentence.phraseGet(mwak,"ha").body;
if (obPhraseBody.type && obPhraseBody.type === "lit")
var obPhraseBody = obPhraseBody.body;
var definition = String(obPhraseBody);
var translation;
console.log(definition);
try{
translation = 
execSync("gtranslate.sh "+fromLangCode+" "
+toLangCode+" "+ definition);
}
catch(e){console.log(e);
translateFail = true;
}
if (translateFail === true){
 break;
}
// be replace ob space with dash ya
//translation.replace('\s','-');
translation = noSpace(translation);
console.log(translation);
if (translation.toLower &&
translation.toLower() === definition)
warnings[warnings.length] = ("Warning: "+translation
+" has same definition");
var newSentence = new Sentence(mwak,
(subject +" "+ translation + " li ha ya"));
console.log(String(newSentence));

newText.insert(mwak,i,newSentence);
}
}
//console.log(definitions.toString());

if (debug) console.log(String(newText));
else io.fileWrite(toFilename,String(newText));

var i;
var warningString = new String();
var date = new Date();
warningString = date.toString();
for (i=0;i<warnings.length;i++)
warningString += warnings[i]+"\n";

console.log(warningString);
if (warnings.length >0){
if (true || !debug) {
var logFilename = toFilename+".log";
var newLogContents = new String();
if (fs.existsSync(logFilename)){
var logContents = io.fileRead(logFilename);
newLogContents = logContents + warningString; }
else newLogContents = warningString;
io.fileWrite(logFilename,newLogContents);
}
}

}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function noSpace(string){
var i;
var stringArray=string.split();
for (i=0;i<string.length;i++){
if (tokenize.isSpace(string[i])){
stringArray[i]='-';
}
else stringArray[i]=string[i];
}
return stringArray.join("");
}
