"use strict";
var base = "../../";
var Text = require("../../class/text");
var Phrase = require("../../class/phrase");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var mwak = new Language();
var translate = require("../../compile/translate");
var wrld = require("../../locale/wrld/wrld");
var parse = require("../../compile/parse");

module.exports = English;
function English(srcBase){
try {
var engFile = require("./eng.txt.json");
var engText = new Text(mwak,engFile);
}
catch(e){
console.log(e);
console.log("JSON load failed, attempting from text");
var io = require("../../lib/io");
var engFile = io.fileRead("./eng.txt");
var engText = new Text(mwak,engFile);
}
var engDict = new Dictionary(mwak,engText);
var engWordOrder = {
	headFinal : false,
	verbFinal : false,
	nounFinal : true,
	typeFinal : false,
	topicInitial : false,
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["hu","hi","ha"],
};
var conjugation = {
reversible:[
],
irreversible:[
[" ya$",". "],
[" ya ",". "]
]
}

var isPronoun = wrld.conjugation.isPronoun;
//conjugation.copula = "is";
//conjugation.nominal = wrld.conjugation.copulaNominal;

conjugation.subjectPhrase = subjectPhraseConjugate;
function subjectPhraseConjugate(language,phrase,format,conjLevel){
// exceptions
var joiner = " ";
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "I"+joiner;
else if (head === "tu") return "thou"+joiner;
else if (head === "yu") return "ye"+joiner;
else if (head === "si") return "they"+joiner;
// main
var newPhrase = phrase.copy(language);
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,conjLevel);
var result = new String();
result = body;
return result;
}


conjugation.objectPhrase = objectPhraseConjugate;
function 
objectPhraseConjugate(language,phrase,format,conjLevel){
console.log(" eng obj phrase "+phrase.toString());
var result = new String();
var joiner = " ";
var newPhrase = phrase.copy(language);
delete newPhrase.head;
var body;
if (newPhrase.body.type === "mwq") {
return wrld.conjugation.citationQuote(language,newPhrase.body,
    format) + " ";
}
if (phrase.body.be !== "Junction"){
if (newPhrase.body.body)
var body = 
nounConjugate(language,newPhrase.body.body,format,conjLevel,"n")
if (newPhrase.body.head)
var head = 
newPhrase.body.head.toLocaleString(language,format,conjLevel)

// pluralize
var Type = phrase.body;
result = pluralize(Type,body,head);
delete newPhrase.body.body;
delete newPhrase.body.head;}
result +=
phraseConjugate(language,newPhrase,format,conjLevel,"n")
if (isPronoun(phrase)) return result;
return result;
}

function affixStrip(word){
if (isVowel(word[word.length-1]))
word=word.replace(/.$/,"");
return word;
}
var vowels = ["a","e","i","o","e"];
function isVowel(glyph){
if (vowels.indexOf(glyph)!== -1) return true;
else false;
}

conjugation.noun = nounConjugate;
function nounConjugate(language,Word,format,conjLevel,ender){
if (ender === undefined) ender = "";
var head, body;
var fromMwak = language.dictionary.fromMwak;
var joiner = " ";
if (Word.body){
var body = 
translate.array(fromMwak,Word.body);
body = body.map(function(word){
return word+"y";});
body = body.join(joiner);
}
if (Word.head){
var head = 
translate.word(fromMwak,Word.head);
head = head+"a"+ender;
}

var result = new String();
if (body && head)
result = body+joiner+head;
else{
if (head) result = head;
else if (body)  result = body;
}
return result;
}


conjugation.nounType = nounTypeConjugate;
function nounTypeConjugate(language,Type,format,conjLevel){

var result = new String();
var body = new String();
var head = new String();
var limb = new String();
if (Type.limb)
limb = 
Type.limb.toLocaleString(language,format,"n",conjLevel);
if (Type.body)
var body = 
Type.body.toLocaleString(language,format,"n", conjLevel)
if (Type.head)
head = Type.head.toLocaleString(language,format,"th", conjLevel)

// pluralize
result = pluralize(Type,body,head)
if (limb.length>0)
result+= limb;
return result;
}

conjugation.mood = moodConjugate;
function moodConjugate(language,Word,format,conjLevel){
var fromMwak = language.dictionary.fromMwak;
var word = translate.word(fromMwak,Word.head);
word = word;
return word+"e";
}

function pluralize(Type,body,head){
var result = new String();
var joiner = " ";
var number = mwak.grammar.number;
if (body){
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
if (parse.wordMatch(number.plural,Type.head.head))
result= body.replace(/$/,"s"); 
else result= head+joiner+body.replace(/$/,"s"); 
}
else if (Type.head) result= head+joiner+body;
else result= body; 
}
else if (head) result= head;
return result+joiner;
}



conjugation.phrase = phraseConjugate;
function phraseConjugate(language,phrase,format,conjLevel,ender){
var joiner = " ";
if (phrase.body){
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
}
if (phrase.head)
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);
if(phrase.subPhrase){
var subPhrase =
phrase.subPhrase.toLocaleString(language,format,"n",conjLevel);
}

var result = new String();

if (adposition) result += adposition+joiner;
if (body) result += body+joiner;
if (subPhrase) result += subPhrase+joiner;
if (clause) result += clause+joiner;
result = result.replace(/  $/," ");
return result;
}

conjugation.verbAgreement = verbAgreementConjugate;
function verbAgreementConjugate(language,sentence,format,conjLevel){
var phrases = sentence.phrases;

var subjectIndex = phrases.find(function(phrase){
if (
( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hu"))
return true; else return false;
});

var subjectBody = new String();
if (subjectIndex !== null) 
subjectBody = phrases[subjectIndex].body.toString();

var verbIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hi"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hi")
return true; else return false;
});

if (verbIndex === null) var phrase = new Phrase(mwak,"hi");
else var phrase = phrases[verbIndex];

var joiner = " ";
var head = new String();
var verb = new String();
var adverbs = new Array();
if (phrase.body){
if (phrase.body.body){
var mwakVerb = phrase.body.body.head;
var mwakParticiples = phrase.body.body.body;
var fromMwak = language.dictionary.fromMwak;
verb = translate.word(fromMwak,mwakVerb);
if (mwakParticiples){
adverbs = translate.array(fromMwak,mwakParticiples);
}
}
if (phrase.body.head){
head = phrase.body.head.toLocaleString(language,format,"v",
conjLevel);}
}
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();
/* infinitive tense is default */

var verbMods = new String();
if (phrase.body && phrase.body.head
&& phrase.body.head.body){
verbMods = translate.array(fromMwak,phrase.body.head.body);
}
if (head.length>0 && verb.length>0) 
result = head+joiner+verbMods+verb+"en";  
else if (head.length>0) result = head;
else if (verb.length>0) result = affixStrip(verb)+"en";
else result = adposition;
 
if (verb.length > 0)/* normal conjugation */{
var tense = mwak.grammar.tense
var tenseWord = phrase.body 
&& phrase.body.head && phrase.body.head.head;
if (phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){

/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
verb = verbMods + joiner +affixStrip(verb);
if (subjectBody === "mi") result = verb+"e"; 
else if (subjectBody === "tu") result= verb+"est";
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = verb+"eth"; 
else if (subjectBody === "wi") result = verb;
else if (subjectBody === "yu") result= verb;
else if (subjectBody === "gents"
||  subjectBody === "ladies"
||  subjectBody === "si") result = verb+"eth"; 
else result = verb+"eth";


}
/* past tense */
else if (parse.wordMatch(tense.past,tenseWord)){
verb = verb;
if (subjectBody === "mi") result = verb+"ed"; 
else if (subjectBody === "tu") result= verb+"ed"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = verb+"ed"; 
else if (subjectBody === "wi") result = verb+"ed";
else if (subjectBody === "yu") result= verb+"ed"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = verb+"ed"; 
else result = verb+"ed";

}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
verb = verb;
if (subjectBody === "mi") result = "will "+verb+"e"; 
else if (subjectBody === "tu") result = "will "+verb+"est"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "will "+verb+"eth"; 
else if (subjectBody === "wi") result = "will "+verb+"eth"; 
else if (subjectBody === "yu") result = "will "+verb+"eth"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "will "+verb; 
else result = "will "+verb+"eth";
}
}
}
else if (verb.length <= 0 && sentence.nominal)/* nominal */{
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head){
tenseWord = phrase.body.head.head;
}
if (subjectBody.length > 0 && phrase.body && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
var body = adposition; /* be */
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = "was"; 
else if (subjectBody === "tu") result= "was"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "was"; 
else if (subjectBody === "wi") result= "were"; 
else if (subjectBody === "yu") result= "were"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "were"; 
else result =  "were";
}
/* present tense */
else if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "am"; 
else if (subjectBody === "tu") result= "is"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = "is"; 
else if (subjectBody === "wi") result= "are"; 
else if (subjectBody === "yu") result= "are"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "are"; 
else result =  "is";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "will"
//if (subjectBody === "mi") result = body; 
//else if (subjectBody === "tu") result = body; 
//else if (subjectBody === "il"
//||  subjectBody === "elle"
//||  subjectBody === "ti") result = body; 
//else if (subjectBody === "wi") result = body; 
//else if (subjectBody === "yu") result = body; 
//else if (subjectBody === "ils"
//||  subjectBody === "elles"
//||  subjectBody === "si") result = body; 
}
}
}
else result = head+joiner+verb;


if (adverbs.length>0){
adverbs = adverbs.map(function(word){
return word + "ly"});
adverbs = adverbs.join(joiner);
result += joiner + adverbs;
}

return result+joiner;
} // end of verbAgreement

conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();


// tense
var tense = mwak.grammar.tense
if (phrase.body.head && phrase.body.head.head
&& parse.wordMatch(tense.all,phrase.body.head.head)){
result = body; 
}
else if (adposition)
result = adposition+joiner+body;
else result = body;
return result+joiner;
}

//conjugation.verbHead = verbHeadConjugate;
//function verbHeadConjugate(string) {
//return 'to';}
//conjugation.phraseHead = phraseHeadConjugate;
//function phraseHeadConjugate(string) {
//return string;}

conjugation.foreignQuote = 
wrld.conjugation.citationQuote;

var engGrammar = new Grammar(engWordOrder,engDict,conjugation);
var eng = new Language(engGrammar,engDict);
return eng;
}

exports.code = "eng";
