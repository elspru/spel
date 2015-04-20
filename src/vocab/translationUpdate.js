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

var Eng = require("../locale/eng/eng");
var eng = new Eng(".");

// first argument is filename
var fromFilename = "eng.txt" ;
var fromLangCode = "en";
// english
var toFilename = "eng.txt" 
var toLangCode = "en";
try{
translateUpdate(toFilename,toLangCode);
}
catch(e){
console.log(toFilename+" problem");
console.log(e);
}


var Eng = require("../locale/eng/eng");
var eng = new Eng(".");
// spanish
var toFilename = "spa.txt" 
var toLangCode = "es";
translateUpdate(toFilename,toLangCode);
// portuguese 
var fromFilename = "spa.txt" 
var fromLangCode = "es"
var toFilename = "por.txt"  
var toLangCode = "pt";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// french
var toFilename = "fra.txt"  
var toLangCode = "fr";
translateUpdate(toFilename,toLangCode);
// mandarin chinese
var toFilename = "zho.txt"  
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
// indonesian
var toFilename = "ind.txt"  
var toLangCode = "id";
translateUpdate(toFilename,toLangCode);
// german
var toFilename = "deu.txt"  
var toLangCode = "de";
translateUpdate(toFilename,toLangCode);
// japanese
var fromFilename = "zho.txt" 
var fromLangCode = "zh"
var toFilename = "jpn.txt"  
var toLangCode = "ja";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// korean
//var fromFilename = "jpn.txt" 
//var fromLangCode = "ja"
var toFilename = "kor.txt"  ;
var toLangCode = "ko";
translateUpdate(toFilename,toLangCode);//,
// farsi
//var toFilename = "fas.txt"  ;
//var toLangCode = "fa";
//translateUpdate(toFilename,toLangCode);
//fromFilename,fromLangCode);
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
// thai 
var toFilename = "tha.txt"  
var toLangCode = "th";
translateUpdate(toFilename,toLangCode);
// dutch 
var fromFilename = "deu.txt" 
var fromLangCode = "de"
var toFilename = "nld.txt"  
var toLangCode = "nl";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// hebrew
var toFilename = "heb.txt"  
var toLangCode = "he";
translateUpdate(toFilename,toLangCode);
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
// finnish
var toFilename = "fin.txt"  
var toLangCode = "fi";
translateUpdate(toFilename,toLangCode);
// esperanto
var byService="reversePlain"
var toFilename = "epo.txt"  
var toLangCode = "eo";
var fromLangCode = "esperanto-list.txt";
translateUpdate(toFilename,toLangCode,"eng.txt",fromLangCode,byService);


function translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode,byService){
if (fromFilename=== undefined){
 fromFilename = "eng.txt" ;
}
if (fromLangCode=== undefined){
 fromLangCode = "en" ;
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
console.log("translating "+ toFilename );
for (i=0;i<sentences.length;i++){
var sentence = sentences[i];
var subject = String( sentence.phraseGet(mwak,"hu"));
try{
var find = toFileText.indexOf(mwak,subject);
}catch(e){
throw new Error("error at "+sentence);
}
if (find === -1){
var obPhraseBody = sentence.phraseGet(mwak,"ha").body;
if (obPhraseBody.type && obPhraseBody.type === "lit")
var obPhraseBody = obPhraseBody.body;
var definition = String(obPhraseBody);
var translation;
try{
if (byService === "reversePlain")
var command = "./reversePlainTranslate.js "+fromLangCode+" "
+ definition;
else 
var command = "./gtranslate.sh "+byService+" "+fromLangCode+" "
+toLangCode+" "+ definition;
translation = execSync(command);
}
catch(e){
console.log("fail for "+command);
console.log(e);
translateFail = true;
}
if (translateFail === true){
 break;
}
// be replace ob space with dash ya
//translation.replace('\s','-');
translation = noSpace(translation);
console.log( translation);
if (translation.toLower &&
translation.toLower() === definition){
var warning = ("Warning: "+translation
+" has same definition");
warnings[warnings.length] = warning;
}
var newSentence = new Sentence(mwak,
(subject +" "+ translation + " li ha ya"));
warnings[warnings.length] = (
newSentence.toLocaleString(eng)
+ "\n"
+newSentence.toLocaleString(mwak)
);
newText.insert(mwak,i,newSentence);
}
}

if (debug) console.log(newText.toLocaleString(mwak));
else {
io.fileWrite(toFilename,newText.toLocaleString(mwak));
io.fileWrite(toFilename+".json",JSON.stringify(newText));}

var uniqueWarnings = uniqueVerify(toFilename);
warnings[warnings.length] = uniqueWarnings;

var i;
var warningString = new String();
var date = new Date();
warningString = date.toString()+"\n";
for (i=0;i<warnings.length;i++)
warningString += warnings[i]+"\n";

console.log(warningString);
if (warnings.length >0){
if (!debug) {
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

function uniqueVerify(filename){
// first argument is filename
//console.log("****** "+ filename);
var filename = filename;//process.argv[2];
var fileContents = io.fileRead(filename);
var fileText = new Text(mwak,fileContents);
var definitions = fileText.select(mwak,"ha");
var sentences = definitions.sentences;
var i;
var output =  new String();
// clean up text
for (i=0;i<sentences.length;i++){
sentences[i].phraseDelete(mwak,"kya");
sentences[i].phraseDelete(mwak,"nya");
sentences[i].phraseDelete(mwak,".i");
//sentences[i].phraseDelete(mwak,"hu");
}
// check if same definition is found twice
for (i=0;i<sentences.length;i++){
var phrase = sentences[1].phraseGet(mwak,"ha");
var sentence = sentences[1].copy();
sentences.splice(1,1);
//console.log(phrase.toString());
var matches = definitions.indexOf(mwak,phrase.toString());
if (matches !== -1)
output += ("duplicate error: \n "
+ sentence.toLocaleString(mwak) +"\n"
+ definitions.sentences[matches].toLocaleString(mwak)+"\n");
}
return output;
}
