"use strict";
var base = "../../";
var parse = require("../../compile/parse");
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var spaFile = require("./spa.txt.json");
var svo = require("../../locale/svo/svo");
var wrld = require("../../locale/wrld/wrld");
var mwak = new Language();

module.exports = Spanish;
function Spanish(srcBase){
//var spaFile = io.fileRead(srcBase+"/locale/spa/spa.txt.json");
var spaText = new Text(mwak,spaFile);
var spaDict = new Dictionary(mwak,spaText);
var spaWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
],
irreversible:[
[" yah$",". "],
]
}

conjugation.foreignQuote = 
wrld.conjugation.guillemetQuote;


conjugation.nounType = nounTypeConjugate;
function nounTypeConjugate(language,Type,format,conjLevel){
var joiner = " ";
var result = new String();
var number = mwak.grammar.number;
var body = new String();
var head = new String();
if (Type.body)
var body = 
Type.body.toLocaleString(language,format,"n", conjLevel)
if (Type.head)
head = Type.head.toLocaleString(language,format,"th", conjLevel)

// pluralize
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
if (parse.wordMatch(number.plural,Type.head.head))
result = body.replace(/$/,"s"); 
else
result = head+joiner+body.replace(/$/,"s"); 
}
else if (Type.head)result = head+joiner+body;
else result = body; 

return result;
}


conjugation.verbAgreement = verbAgreementConjugate;
function verbAgreementConjugate(language,sentence,format,conjLevel){

var phrases = sentence.phrases;

var subjectIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hu")
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

if (verbIndex === null) return "";
var phrase = phrases[verbIndex];

var joiner = " ";
var head = new String()
var body = new String();
if (phrase.body.body)
body = phrase.body.body.toLocaleString(language,format,"v",
conjLevel);
if (phrase.body.head)
head = phrase.body.head.toLocaleString(language,format,"v",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();
/* infinitive tense is default */

if (head.length>0 && body.length>0) result = head+joiner+body; 
else if (head.length>0) result = head;
else if (body.length>0) result = body;
else result = adposition;
 
if (/ar$/.test(body)){ /* -ar conjugation */
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/ar$/,"ada"); 
else if (subjectBody === "tu") result= body.replace(/ar$/,"ada"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/ar$/,"ada"); 
else if (subjectBody === "wi") result= body.replace(/ar$/,"adas"); 
else if (subjectBody === "yu") result= body.replace(/ar$/,"adas"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/ar$/,"adas"); 
}
/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = body.replace(/ar$/,"o"); 
else if (subjectBody === "tu") result= body.replace(/ar$/,"as"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/ar$/,"a"); 
else if (subjectBody === "wi") result= body.replace(/ar$/,"amos"); 
else if (subjectBody === "yu") result= body.replace(/ar$/,"áis"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/ar$/,"an"); 
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body+"é"; 
else if (subjectBody === "tu") result = body+"ás"; 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body+"á"; 
else if (subjectBody === "wi") result = body+"emos"; 
else if (subjectBody === "yu") result = body+"éis"; 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body+"án"; 
}
}
}
else if(/ir$/.test(body)) { /* -ir conjugation */
var tense = mwak.grammar.tense
var tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = body.replace(/ir$/,"o"); 
else if (subjectBody === "tu") result= body.replace(/ir$/,"es"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/ir$/,"e"); 
else if (subjectBody === "wi") result = body.replace(/ir$/,"imos"); 
else if (subjectBody === "yu") result= body.replace(/ir$/,"iais"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/ir$/,"en"); 
}
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/ir$/,"ida"); 
else if (subjectBody === "tu")result= body.replace(/ir$/,"ida"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/ir$/,"ida"); 
else if (subjectBody === "wi") result= body.replace(/ir$/,"idas"); 
else if (subjectBody === "yu") result= body.replace(/ir$/,"idas"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/ir$/,"idas"); 
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body+"é"; 
else if (subjectBody === "tu") result = body+"ás"; 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body+"á"; 
else if (subjectBody === "wi") result = body+"emos"; 
else if (subjectBody === "yu") result = body+"éis"; 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body+"án"; 
}
}
}
else if( /er$/.test(body)){ /* -er verbs */
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = body.replace(/er$/,"o"); 
else if (subjectBody === "tu") result= body.replace(/er$/,"es"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/er$/,"e"); 
else if (subjectBody === "wi") result= body.replace(/er$/,"emos"); 
else if (subjectBody === "yu") result= body.replace(/er$/,"éis"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/er$/,"en"); 
}
/* past tense */
else if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/er$/,"ida"); 
else if (subjectBody === "tu") result= body.replace(/er$/,"ida"); 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body.replace(/er$/,"ida"); 
else if (subjectBody === "wi") result= body.replace(/er$/,"idas"); 
else if (subjectBody === "yu") result= body.replace(/er$/,"idas"); 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body.replace(/er$/,"idas"); 
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body+"é"; 
else if (subjectBody === "tu") result = body+"ás"; 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body+"á"; 
else if (subjectBody === "wi") result = body+"emos"; 
else if (subjectBody === "yu") result = body+"éis"; 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body+"án"; 
}
}
}
else if (body.length >= 0)/* nominal */{
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
var tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
var body = adposition; /* ser */
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
result =  "sido";
}
/* present tense */
else if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "soy"; 
else if (subjectBody === "tu") result= "eres"; 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = "es"; 
else if (subjectBody === "wi") result= "somos"; 
else if (subjectBody === "yu") result= "sois"; 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = "son"; 
else result =  "es";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "ser"
if (subjectBody === "mi") result = body+"é"; 
else if (subjectBody === "tu") result = body+"ás"; 
else if (subjectBody === "él"
||  subjectBody === "ella"
||  subjectBody === "ti") result = body+"á"; 
else if (subjectBody === "wi") result = body+"emos"; 
else if (subjectBody === "yu") result = body+"éis"; 
else if (subjectBody === "ellos"
||  subjectBody === "ellas"
||  subjectBody === "si") result = body+"án"; 
}
}
}
else result = adposition+joiner+head+joiner+body;

return result+joiner;
} // end of verbAgreement


conjugation.subjectPhrase = subjectPhraseConjugate;
function subjectPhraseConjugate(language,phrase,format,conjLevel){

// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "yo ";
else if (head === "tu") return "tú ";

// main
var newPhrase = phrase.copy();
delete newPhrase.head;
var body = newPhrase.toLocaleString(language,newPhrase,format,"n",conjLevel);
var result = new String();

//var gender = "m";
//if (phrase.body && phrase.body.body && phrase.body.body.head){
//var headWord = translate.word(fromMwak,phrase.body.body.head);
//gender = genderGet(headWord);
//}

// results
result = body;
// return
return result+" ";
}

function phraseConjugate(language,phrase,format,type,conjLevel){
var joiner = " ";
var body = new String();
var adposition = new String();
if (phrase.body)
body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
if (phrase.head)
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();

if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);
if(phrase.subPhrase)
var subPhrase =
phrase.subPhrase.toLocaleString(language,format,type,conjLevel);


var result = new String();

if (adposition.length>0) result += adposition+joiner;
if (body.length >0) result += body+joiner;
if (subPhrase) result += subPhrase+joiner;
if (clause) result += clause+joiner;

///* le la les */
//if (result[0].isVowel()) result = "l'"+result;
//else{
//var gender = "m";
//if (phrase.body && phrase.body.body && phrase.body.body.head){
//var headWord = translate.word(fromMwak,phrase.body.body.head);
//gender = genderGet(headWord);
//}
//var result = new String();
//if (gender === "m")
//result = "le "+result;
//else if (gender === "f")
//result = "la "+result;
//}

return result.replace(/ *$/," ");
}

conjugation.objectPhrase = objectPhraseConjugate;
function 
objectPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";

var newPhrase = phrase.copy();
delete newPhrase.head;
var body = 
phraseConjugate(language,newPhrase,format,"n",conjLevel);
var result = new String();

//var gender = "m";
//if (phrase.body && phrase.body.body && phrase.body.body.head){
//var headWord = translate.word(fromMwak,phrase.body.body.head);
//gender = genderGet(headWord);
//}
//
//var result = new String();
//if (gender === "m")
//result = "le "+body;
//else if (gender === "f")
//result = "la "+body;
var result = body;
if (isPronoun(language,body)) {
if (/mí /.test(result)) return "me ";
else if (/tí /.test(result)) return "te ";
else if (/nostros /.test(result)) return "nos ";
else if (/ustedes /.test(result)) return "les ";
else if (/ellos /.test(result)) return "los ";
else return result;
}
else result = "lo "+body;
return result+joiner;
}

var isPronoun = wrld.conjugation.isPronoun;


var spaGrammar = new Grammar(spaWordOrder,spaDict,conjugation);
var spa = new Language(spaGrammar,spaDict);
return spa;
}

Spanish.prototype.code = function(){console.log("blah"); return "spa"};
exports.code = function(){console.log("blah"); return "spa"};
