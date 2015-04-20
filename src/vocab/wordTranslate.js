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

var debug = true;

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

console.log("en "+process.argv[2]);

// first argument is filename
var fromFilename = "eng.txt" ;
var fromLangCode = "en";
// mandarin chinese
var toFilename = "zho.txt"  
var toLangCode = "zh";
translateUpdate(toFilename,toLangCode);
// spanish
var toFilename = "spa.txt" 
var toLangCode = "es";
translateUpdate(toFilename,toLangCode);
// arabic
var toFilename = "ara.txt"  
var toLangCode = "ar";
translateUpdate(toFilename,toLangCode);
// hindi 
var toFilename = "hin.txt"  
var toLangCode = "hi";
translateUpdate(toFilename,toLangCode);
// russian
var toFilename = "rus.txt"  
var toLangCode = "ru";
translateUpdate(toFilename,toLangCode);
// indonesian
var toFilename = "ind.txt"  
var toLangCode = "id";
translateUpdate(toFilename,toLangCode);
// japanese
var fromFilename = "zho.txt" 
var fromLangCode = "zh"
var toFilename = "jpn.txt"  
var toLangCode = "ja";
translateUpdate(toFilename,toLangCode,
fromFilename,fromLangCode);
// swahili
var toFilename = "swa.txt"  
var toLangCode = "sw";
translateUpdate(toFilename,toLangCode);
// turkish
var toFilename = "tur.txt"  
var toLangCode = "tr";
translateUpdate(toFilename,toLangCode);


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
var warnings = new Array();
var childProcess = require('child_process');
var execSync = require('exec-sync');
var i, translateFail;
var definition =  process.argv[2];
var translation;
try{
if (byService === "reversePlain")
var command = "./reversePlainTranslate.js "+fromLangCode+" "
+ definition;
else 
var command = "./gtranslate.sh "+byService+" "+fromLangCode+" "
+toLangCode+" "+ definition;
translation = execSync(command);
phonemes = execSync("espeak -q -x --ipa --voices="+toLangCode
+"translation");
}
catch(e){console.log(e);
translateFail = true;
}
if (translateFail === true){
	console.log(e);
}
// be replace ob space with dash ya
//translation.replace('\s','-');
translation = noSpace(translation);

console.log(toLangCode + " "+ translation);

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
+ sentence.toLocaleString(eng) +"\n"
+ definitions.sentences[matches].toLocaleString(eng)+"\n");
}
return output;
}
