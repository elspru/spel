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

var Eng = require("./locale/eng/eng");
var eng = new Eng(".");
console.log("english language loaded");

var langs = [
["eng",eng], ["zho"], ["spa"], ["hin"], ["ara"], ["por"], 
["rus"], ["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"],
["tur"], ["swa"], ["ukr"], ["nld"], ["hun"], ["swe"], 
["mwak",mwak]
];

var commandText = process.argv.slice(2).join(" ");
console.log(commandText);
var format = new Object();
var conjugationLevel = 2;

var string = " hello world ya ";
var word = new Text(eng,string);
console.log(word.toString());
console.log(JSON.stringify(word));
langs.forEach(toLangFileTranslate);
langs.forEach(toLangFileTranslate);

function toLangFileTranslate(tuple){

var code = tuple[0];
var lang = tuple[1];

if (!lang){
var Lang = require("./locale/"+code+"/"+code);
lang = new Lang();
tuple[1]=lang;
console.error(code+" language loaded"); }

console.log(code + " : " +
word.toLocaleString(lang,format,conjugationLevel));
}
