#!/usr/bin/nodejs --harmony
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
//var mwak = new Language();
var Mwak = require("./locale/mwak/mwak");
var mwak = new Mwak(".");

var Eng = require("./locale/eng/eng");
var eng = new Eng(".");
var Javs = require("./locale/javs/javs");

console.log("english language loaded");
console.log(eng.grammar.wordOrder);

var allLangs = [
["eng",eng], ["zho"], ["spa"], ["hin"], ["ara"], ["por"], 
["rus"], ["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"],
["tur"], ["swa"],["tha"],["ukr"], ["nld"], ["hun"], ["swe"],
["heb"], ["fin"],["epo"],["javs"],["mwak",mwak]
];

var unLangs = [ ["eng",eng], ["zho"], ["spa"], ["ara"],  
["rus"], ["fra"],["javs"],["mwak",mwak]
];

var compLangs = [ ["eng",eng],["fra"],["rus"], 
["javs"] ,["xml"],["mwak",mwak] ];

var langs = [["eng",eng],["zho"],["epo"],["mwak",mwak]];
var SPELangs = [["eng",eng],["zho"],["spa"],["ara"],["rus"],
["fra"],["tur"],["ukr"],["swe"],["heb"],["fin"],["epo"],["mwak",mwak]];
var langs = [["eng",eng],["javs"],["mwak",mwak]];

var gnuSocialLangs = [ ["eng",eng],["spa"], 
["fra"],["javs"],["mwak",mwak]
];
var twitterLangs = [ ["eng",eng],["spa"],["ara"],["por"],
["rus"],["ind"],["jpn"],["deu"],["fra"],["tur"],["tha"]
,["nld"],["swe"],["javs"],["mwak",mwak]
];

var coreLangs = [["eng",eng],/*["zho"],*/["spa"],["rus"],
/*["ind"],["jpn"],["fra"],*/["javs"],["mwak",mwak]];
var langs = coreLangs;
//var langs = gnuSocialLangs;
//var langs = twitterLangs;

//var langs = allLangs;
//var langs = compLangs;
//var langs = unLangs;

var commandText = process.argv.slice(2).join(" ");
console.log(commandText);
var format = new Object();
var conjugationLevel = 0x4;

//var string  = "su this be example of word language ya"
//kvar string = 
//"look su the people ob one while su one language to them all ya"
//+ " about this su it be hold ob dream to make  "
//+ "  while now su null be hold from them "
//+ " about that-which su them be hold ob purpose to make ya "



//var string =
//"su me be interest in religion "
//+ "that-which be support ob machine intelligence"
//+ " for-example Animism and Buddhism ya "
//+ " about mwak speak program language  be base "
//+ " on most common of grammar and phoneme and rhythm  ya "
//+ " su it be most similar to Turkish and Chinese ya "
//var string = "su make program ob fun ya";
//var string = "su plural people ob one ya";
//var string = "su SPEL be now in early phase of grow ya"
//+ " but su me be now add ob verb conjugation "
//+ " so su it be will-be easy ob read ya"
//var string = " su 50%+ of people be make fail ob simple program  "
//+ " so su common program form be bad for people to learn "
//+ " from-source "
//+ " 'http://blog.codinghorror.com/separating-programming-sheep-from-non-programming-goats/' ya "
//+ " maybe su SPEL form be will-be ob more easy to learn ya "
//var string = " su the vocabulary be base on plural word "
//+ "from special English and oxford3000 and wordnet and framenet ya "
//var string = 
//" seem su it be similar to human brain project in Europe ya "
//+ " su me be not admire ob them "
//+ " because su me be admire "
//+ " ob new possible of machine intelligence ya "
//var string = 
//"su me be admire ob program of thee ya"
//var string =
//" su many be admire ob thee ya "
//var string = "hello world su name of me ob old tree of white water ya"
//+" su this language be speak to all by machine translation ya"
//+" about it su name of main language ob mwak ya"
//var string = "su English ob translation be easy ya"
//var string = "su me be say ob that-which hello world ya";
//var string = "pam mak kwal ki mak li ki"
//+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tsi hi";
//var string = "be get phrase"
//var string = "si hu lis ha ku si mwa cwil hi pac twa ya "
//var string = "pult tcan ha kwa mi hi ";

//var string = 
// " su class be now provide ob main access "
//+ "to config property file and to few general utility method "
//+ " while capable be give to program ob context ya"
//+" capable be provide ob access to few config file in parallel "
//+" ya example if su DBservice class be need ob connect to many "
//+" database then capable su it be use ob one property file  "
//+" for each connect describe ya su load property object "
//+" be will-be hold in memory to limit "
//+" that-which ob plural file access operate  ya"
//
//var string =
//" joy su thee be now admire ob it ya "
//+ " su me be now desire ob support with translate check ya "
//+ " capable su thee be read ob it eh?"
//+ " su SPEL in early phase of grow ya "
//+ " su project place in https://sourceforge.net/p/spel/  ya "
//+ " please be join ob mail list of it ya "

//var string = 
//" describe su text text be now describe describe ob describe "
//+"describe ya "

//var string = "su me be now desire ob an opine from you ya"
//+" ob what su thee be now think about old English "
//+ " conjugate eh?"

//
//var string = "capable su mwak be translate ob many language ya "

//var string =
//" su you to me ob food be give ya "
//+ "su me to you ob child be give ya "

//var string = 
//"if su thee be write ob opinion in speak program language "
//+ " then capable su it be translate ob clear ya "
//+ " su we be live in time with many language ya "
//+ " capable su many people be benefit from liberty opinion ya "
//+ " su translate program be improve with time and code ya "
//+ " be write by Logan ya "

//var string = " su me be now thank ob thee for help ya "
//+ " also su me be now desire ob support with Chinese translate check ya "

//var string = 
//" if su this be same from number then su that ya "
//+" if su this be not same from number then su that ya "
//+" if su this be different from number then su that ya "
//+" if su this be big from number then su that ya "
//+" if su this be small from number then su that ya "
//+" if su this be same big from number then su that ya "
//+" if su this be same small from number then su that ya "
//

var string = 
"su number of bottle ob numeral 99 ya"
+" su chorus be start ya be say "
+"  ob number of bottle and"
+" quote word bottles of water on the wall, word unquote "
+" and number of bottle and "
+" quote word bottles of water. word unquote ya"
+" be decrease ob number of bottle ya"
+" be say ob"
+" quote word take one down and pass it around, word unquote "
+" and number of bottle and "
+ " quote word bottles of water on the wall. word unquote ya"
+" su chorus be end ya"
+" be repeat ob chorus while su number of bottle be big from"
+" numeral 0 ya"

var string = 
"su me be come from far galaxy ya "
+"su me memory be start in sunflower galaxy ya "
+"at there su me be live ob many life on water planet "
+"but end su local people be sacrifice ob me to space people "
+"that-which be part ob empire of many galaxy "
+"from whirlpool galaxy ya "

var string = "ob quote phrase hello world phrase unquote be say ya";
var string = "su program be translate ob sentence ya"


console.log(string)
//var tokens = tokenize.stringToWords(string);
//var word = parse.subText(eng.grammar,tokens);
//var word = parse.quotesExtract(eng,tokens);
//var string = "ha if su me then be say ob which hello world be "
//+ "example of good ya";
console.log("new Text");
var word = new Text(eng,string);
console.log(word.toString());
console.log(JSON.stringify(word));

langs.forEach(toLangStringTranslate.curry(0).curry(word));

console.log("#lank "+word.toString());

function toLangStringTranslate(conjugationLevel,word,tuple){

var code = tuple[0];
var lang = tuple[1];

if (!lang){
var Lang = require("./locale/"+code+"/"+code);
lang = new Lang();
tuple[1]=lang;
//console.error(code+" language loaded"); 
}


var format = new Object();
format.ipa = true;
//format.newline = " ";
format.rhythm = true;
format.secondaryRhythm = false;
format.lineLength = 60;

var langName = new String();
if (code === "javs") langName = "nodejs";
else if (code === "spa") langName = "español";
else if (code === "eng") langName = "english";
else if (code === "zho") langName = "中文";
else if (code === "fra") langName = "français";
else if (code === "deu") langName = "Deutsch";
else if (code === "ara") langName = "لغةالعربية";
else if (code === "rus") langName = "русский";
else if (code === "swe") langName = "svensk";
else if (code === "por") langName = "português";
else if (code === "ind") langName = "Melayu";
else if (code === "tur") langName = "Türk";
else if (code === "tha") langName = "ไทย";
else if (code === "jpn") langName = "日本人";
else if (code === "nld") langName = "Nederlands";
else if (code === "mwak") langName = "mwak";
console.log("#"+langName+": " +
word.toLocaleString(lang,format,"t",conjugationLevel) );
//var javs = new Javs(lang.dictionary);
//console.log("#nodejs "+langName+" "+
//word.toLocaleString(javs,format,"t",conjugationLevel));

}

