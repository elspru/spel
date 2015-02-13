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

var allLangs = [
["eng"], ["zho"], ["spa"], ["hin"], ["ara"], ["por"], ["rus"], 
["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"], ["tur"], 
["swa"], ["ukr"], ["nld"], ["hun"], ["swe"], ["mwak",mwak]
];

var langs = [["eng"],["mwak"]];
//var langs = allLangs;

var filename = process.argv[2];
console.log(filename);
var filenameParts = filename.split('.');
var filenameLangCodeI = filenameParts.length-2;
var format = new Object();
var conjugationLevel = 2;

var word = fromLangFileTranslate(filename);
langs.forEach(toLangFileTranslate);

function fromLangFileTranslate(filename){

var filenameParts = filename.split('.');
var filenameLangCodeI = filenameParts.length-2;
var code = filenameParts[filenameLangCodeI];
var langPairI = langs.find(function(pair){
if (pair[0]===code) return true; else return false; });
if (langPairI === null)
throw Error(code + " be not known ob language code ya ");
var lang = langs[langPairI][1];
if (!lang){
var Lang = require("./locale/"+code+"/"+code);
var lang = new Lang();
console.log(code+" language loaded"); }

var fileContents = io.fileRead(filename);
var text = new Text(lang,fileContents);
return text;
}

function toLangFileTranslate(tuple){

var code = tuple[0];
var lang = tuple[1];

if (!lang){
var Lang = require("./locale/"+code+"/"+code);
lang = new Lang();
tuple[1]=lang;
console.log(code+" language loaded"); }

filenameParts[filenameLangCodeI]=code;
io.fileWrite(filenameParts.join("."),
word.toLocaleString(lang,format,conjugationLevel));
console.log(code+" file written");
}
