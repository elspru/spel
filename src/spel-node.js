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
["tur"], ["swa"],["tha"],["ukr"], ["nld"], ["hun"], ["swe"],
["heb"], ["fin"],["mwak",mwak]
];

var langs = [["eng",eng],["mwak",mwak]];
var langs = [["eng",eng],["zho"],["spa"],["ara"],["rus"],
["fra"],["tur"],["ukr"],["swe"],["heb"],["fin"],["mwak",mwak]];
var commandText = process.argv.slice(2).join(" ");
console.log(commandText);
var format = new Object();
var conjugationLevel = 2;

//var string = " hello world ya ";
//var mstring = " maw .i blak .u fa ya ";
//var word = new Text(mwak,mstring);
//var string = " su me be go to the shop ya"
//+ " question su you be enjoy ob bread eh? "
//+ " su you be enjoy ob what eh? ";
//var string = "hello world about ob blak be think su blah tha be blah " 
//+ " clause-tail hello world eh?";
//var string = " pam man .u fa ya ";
//var string = " su the language be have ob source grammar "
//+ "from-source Kjell write ya ";
//var string  = "su this be example of word language ya"
//var word = new Text(eng,string);

var string = " ob quote phrase hello world phrase unquote ya ";
//var string = " li unquote";
//var string = "ksa yo hello hello yo world world yo tsi .u ya";
console.log(string)
var tokens = tokenize.stringToWords(string);
//var word = parse.quotesExtract(eng,tokens);
var word = new Text(eng,string);
console.log(word.toString());
console.log(JSON.stringify(word));
langs.forEach(toLangFileTranslate.curry(word));
//langs.forEach(toLangFileTranslate);

function toLangFileTranslate(word,tuple){

var code = tuple[0];
var lang = tuple[1];

if (!lang){
var Lang = require("./locale/"+code+"/"+code);
lang = new Lang();
tuple[1]=lang;
//console.error(code+" language loaded"); 
}

console.log(code + " : " +
word.toLocaleString(lang,format,conjugationLevel));
}

//console.log("worker starting");
//var Worker = require('webworker-threads').Worker;
////var workerScript = require("./worker");
//var worker = new Worker(workerScript);
//worker.onmessage = function(event){
//console.log(event.data);
//}
//worker.postMessage(word);
//
////var Threads= require('webworker-threads');
////var thread = Threads.create();
////function hello(){
////return "hello threads";}
////function hmmm(){
////var word = "the word";
////return word;}
////var JASON = require("JASON");
////var threadCallBack  = function(err,data){
////process.stdout.write(data);
////this.destroy()}
////
//////thread.eval("JASON= "+ JASON.stringify(JASON));
////thread.eval(hello).eval("hello()", threadCallBack);
////var thread = Threads.create();
////thread.eval(hmmm).eval("hmmm()", threadCallBack);
////
