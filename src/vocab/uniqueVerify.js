#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for verifiing dictionary definition uniqueness ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict"
var hof = require("../lib/hof");
var io = require("../lib/io");
var Text = require('../class/text');
var Language = require('../lang/language');
var mwak = new Language();

var Eng = require("../locale/eng/eng");
var eng = new Eng(".");

uniqueVerify("eng.txt");
uniqueVerify("zho.txt");
uniqueVerify("spa.txt");
uniqueVerify("hin.txt");
uniqueVerify("ara.txt");
uniqueVerify("por.txt");
uniqueVerify("rus.txt");
uniqueVerify("ind.txt");
uniqueVerify("jpn.txt");
uniqueVerify("deu.txt");
uniqueVerify("ita.txt");
uniqueVerify("kor.txt");
uniqueVerify("fra.txt");
uniqueVerify("tur.txt");
uniqueVerify("swa.txt");
uniqueVerify("tha.txt");
uniqueVerify("ukr.txt");
uniqueVerify("nld.txt");
uniqueVerify("swe.txt");
uniqueVerify("hun.txt");
uniqueVerify("heb.txt");
uniqueVerify("fin.txt");
uniqueVerify("epo.txt");

function uniqueVerify(filename){
// first argument is filename
console.log("****** "+ filename);
var filename = filename;//process.argv[2];
var fileContents = io.fileRead(filename);
var fileText = new Text(mwak,fileContents);
var definitions = fileText.select(mwak,"ha");
var sentences = definitions.sentences;
var i;
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
var sentence = sentences[1].copy(mwak);
sentences.splice(1,1);
//console.log(phrase.toString());
var matches = definitions.indexOf(mwak,phrase.toString());
if (matches !== -1)
console.log("duplicate error: \n "
//+ sentence.toString() +"\n"
+ sentence.toLocaleString(mwak)+"\n"
//+ definitions.sentences[matches].toString() +"\n"
+ definitions.sentences[matches].toLocaleString(mwak));
//if (matches && matches.length > 0)
//console.log("warning:" +matches.toString());
}
//console.log(definitions.toString());
}
