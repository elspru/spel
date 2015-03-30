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

var allLangs = [
["eng",eng], ["zho"], ["spa"], ["hin"], ["ara"], ["por"], 
["rus"], ["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"],
["tur"], ["swa"],["tha"],["ukr"], ["nld"], ["hun"], ["swe"],
["heb"], ["fin"],["epo"],["mwak",mwak]
];

var unLangs = [ ["eng",eng], ["zho"], ["spa"], ["ara"],  
["rus"], ["fra"],["javs"],["mwak",mwak]
];

var compLangs = [ ["eng",eng], ["javs"],["mwak",mwak]
];

var langs = [["eng",eng],["zho"],["epo"],["mwak",mwak]];
var SPELangs = [["eng",eng],["zho"],["spa"],["ara"],["rus"],
["fra"],["tur"],["ukr"],["swe"],["heb"],["fin"],["epo"],["mwak",mwak]];
var langs = [["eng",eng],["ara"],["mwak",mwak]];

var langs = allLangs;
var langs = compLangs;
//var langs = unLangs;

var commandText = process.argv.slice(2).join(" ");
console.log(commandText);
var format = new Object();
var conjugationLevel = 3;

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

//var string = " su test be start ya " 
//+ " be start of test2 ya "
//+ " su content of test2 ya "
//+ " su test be end ya "
//+ " be other ob text ya "
var string = "ob num 23 43 ya";
var string = "C4 kya .i li .u be li .a wiyp kast .i ya"
//var string = " su test be start ya "
//+ " su me be go to the shop for bread ya "
//+" su false be end ya "
//+ " su test be end ya blah ya";
//var string = " li unquote";
//var string = "ksa yo hello hello yo world world yo tsi .u ya";
var string = 
"look su the people ob one while su one language to them all ya"
+ " about this su it be hold ob dream to make  "
+ "  while now su null be hold from them "
+ " about that-which su them be hold ob purpose to make ya "

var string = 
 " su class be give ob main access "
+ "to config property file and to few general utility method "
+ " while capable be give to program ob context ya"

//
//
//var string = "pam mak kwal ta ki mak li ta ki"
//+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tsi ta";

//var string = "wins pi psit wint ni tyup ka lasp .i myin ya"
var string = "be say ob quote phrase hello world phrase unquote ya ";
//var string = "pam mak kwal ki mak li ki"
//+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tsi .i";
//var string = "be get phrase"
//var string = "si .u lis .a ku si mwa cwil .i pac twa ya "
//var string = "pult tcan .a kwa mi .i ";
console.log(string)
//var tokens = tokenize.stringToWords(string);
//var word = parse.subText(eng.grammar,tokens);
//var word = parse.quotesExtract(eng,tokens);
//var string = "ha if su me then be say ob which hello world be "
//+ "example of good ya";
var word = new Text(eng,string);
console.log(word.toString());
console.log(JSON.stringify(word));
langs.forEach(toLangStringTranslate.curry(conjugationLevel).curry(word));

function toLangStringTranslate(conjugationLevel,word,tuple){

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

