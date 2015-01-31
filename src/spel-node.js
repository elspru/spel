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
//var mwak = require("./lang/mwak");

//var nsentence = new Text(sentence);
var Eng = require("./locale/eng/eng");
var eng = new Eng(".");
console.log("english language loaded");
var Cmn = require("./locale/cmn/cmn");
var cmn = new Cmn(".");
console.log("mandarin language loaded");
var Spa = require("./locale/spa/spa");
var spa = new Spa(".");
console.log("spanish language loaded");
var Hin = require("./locale/hin/hin");
var hin = new Hin(".");
console.log("hindi language loaded");
var Ara = require("./locale/ara/ara");
var ara = new Ara(".");
console.log("arabic language loaded");
var Por = require("./locale/por/por");
var por = new Por(".");
console.log("portuguese language loaded");
var Rus = require("./locale/rus/rus");
var rus = new Rus(".");
console.log("russian language loaded");
var Ind = require("./locale/ind/ind");
var ind = new Ind(".");
console.log("indonesian language loaded");
var Jpn = require("./locale/jpn/jpn");
var jpn = new Jpn(".");
console.log("japanese language loaded");
var Deu = require("./locale/deu/deu");
var deu = new Deu(".");
console.log("german language loaded");
var Ita = require("./locale/ita/ita");
var ita = new Ita(".");
console.log("italian language loaded");
var Kor = require("./locale/kor/kor");
var kor = new Kor(".");
console.log("korean language loaded");
var Fra = require("./locale/fra/fra");
var fra = new Fra(".");
console.log("french language loaded");
var Tur = require("./locale/tur/tur");
var tur = new Tur(".");
console.log("turkish language loaded");
var Swa = require("./locale/swa/swa");
var swa = new Swa(".");
console.log("swahili language loaded");
var Ukr = require("./locale/ukr/ukr");
var ukr = new Ukr(".");
console.log("ukranian language loaded");
var Nld = require("./locale/nld/nld");
var nld = new Nld(".");
console.log("dutch language loaded");
var Hun = require("./locale/hun/hun");
var hun = new Hun(".");
console.log("hungarian language loaded");
var Swe = require("./locale/swe/swe");
var swe = new Swe(".");
console.log("swedish language loaded");

//console.log(dict.toLocaleString(eng));
//var word = new Text(mwak,"mi 'u sla munt 'a mwa 'i 'ia yi kai pa ");
//	console.log(eng.grammar.phraseWords);
var string = "ha if btw cool then su me be say ob tha be good su hello world ya"
//var string = " ha be say if su me ya "
var string = " ha if su me be the say love me  ya "
var string = " su me and su world be love ob thee ya"
var string = "ob me be world ya";
var string = " su world ob me tha be love ya"
var string = " su language of you tha be speak with all ya "
var mstring = " mi ki tu ki munt ki mi munt"
var mstring = " mi .u tu .a C7G kya ya "
var tokens = tokenize.stringToWords(string);
var mtokens = tokenize.stringToWords(mstring);
//var word = parse.lastType(mwak.grammar,mtokens);
//var word = new Sentence(mwak,mstring);
//var word = parse.firstType(eng.grammar,tokens);
var word = new Sentence(eng,tokens);
var format = new Object();
var synesthesia = require('./lang/synesthesia');
//format.glyphsTransform=synesthesia.darkConsoleGlyphsTransform;
var conjugationLevel = 2;
console.log(word.toString());
console.log(JSON.stringify(word));
console.log("eng: "
+ word.toLocaleString(eng,format,conjugationLevel));
//console.log("cmn: "
//+ word.toLocaleString(cmn,format,conjugationLevel));
//console.log("spa: "
//+ word.toLocaleString(spa,format,conjugationLevel));
//console.log("hin: "
//+ word.toLocaleString(hin,format,conjugationLevel));
//console.log("ara: "
//+ word.toLocaleString(ara,format,conjugationLevel));
//console.log("por: "
//+ word.toLocaleString(por,format,conjugationLevel));
console.log("rus: "
+ word.toLocaleString(rus,format,conjugationLevel));
//console.log("ind: "
//+ word.toLocaleString(ind,format,conjugationLevel));
//console.log("jpn: "
//+ word.toLocaleString(jpn,format,conjugationLevel));
//console.log("deu: "
//+ word.toLocaleString(deu,format,conjugationLevel));
//console.log("ita: "
//+ word.toLocaleString(ita,format,conjugationLevel));
//console.log("kor: "
//+ word.toLocaleString(kor,format,conjugationLevel));
console.log("fra: "
+ word.toLocaleString(fra,format,conjugationLevel));
console.log("tur: "
+ word.toLocaleString(tur,format,conjugationLevel));
//console.log("swa: "
//+ word.toLocaleString(swa,format,conjugationLevel));
//console.log("ukr: "
//+ word.toLocaleString(ukr,format,conjugationLevel));
//console.log("nld: "
//+ word.toLocaleString(nld,format,conjugationLevel));
//console.log("hun: "
//+ word.toLocaleString(hun,format,conjugationLevel));
console.log("swe: "
+ word.toLocaleString(swe,format,conjugationLevel));
console.log("mwak: " + word.toLocaleString(mwak,format));
//console.log("synesthezia");
//console.log(synesthesia.
//grayConsoleGlyphsTransform(word.toString()));
