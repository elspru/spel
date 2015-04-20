var base = "../../";
var Text = require("../../class/text");
var Phrase = require("../../class/phrase");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var mwak = new Language();
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
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["hu","hi","ha","ta","wu"],
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
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "I";
else if (head === "tu") return "thou";
else if (head === "si") return "they";
// main
var newPhrase = phrase.copy();
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,"n",conjLevel);
var result = new String();
result = body;
return result;
}


conjugation.objectPhrase = objectPhraseConjugate;
function 
objectPhraseConjugate(language,phrase,format,conjLevel){
var newPhrase = phrase.copy();
delete newPhrase.head;
var result =
phraseConjugate(language,newPhrase,format,"n",conjLevel)

if (isPronoun(language,result)) return result;
result = "the "+result;
return result;
}


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



conjugation.phrase = phraseConjugate;
function phraseConjugate(language,phrase,format,type,conjLevel){
var joiner = " ";
if (phrase.body)
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
if (phrase.head)
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);

if(phrase.subPhrase){
var subPhrase =
phrase.subPhrase.toLocaleString(language,format,type,conjLevel);
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
var body = new String();
if (phrase.body){
if (phrase.body.body)
body = phrase.body.body.toLocaleString(language,format,"v",
conjLevel);
if (phrase.body.head)
head = phrase.body.head.toLocaleString(language,format,"v",
conjLevel);
}
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();
/* infinitive tense is default */
if (head.length>0 && body.length>0) result = head+joiner+body; 
else if (head.length>0) result = head;
else if (body.length>0) result = body;
else result = adposition;
 
if (/er$/.test(body)){ /* -er conjugation */
var tense = mwak.grammar.tense
var tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/er$/,"é"); 
else if (subjectBody === "tu") result= body.replace(/er$/,"é"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/er$/,"é"); 
else if (subjectBody === "wi") 
result = body.replace(/er$/,"és"); 
else if (subjectBody === "yu") result= body.replace(/er$/,"és"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/er$/,"és"); 
}
/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = body.replace(/er$/,"e"); 
else if (subjectBody === "tu") result= body.replace(/er$/,"es"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/er$/,"e"); 
else if (subjectBody === "wi") 
result = body.replace(/er$/,"ons"); 
else if (subjectBody === "yu") result= body.replace(/er$/,"ez"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/er$/,"ent"); 
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body+"ai"; 
else if (subjectBody === "tu") result = body+"as"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body+"a"; 
else if (subjectBody === "wi") result = body+"ons"; 
else if (subjectBody === "yu") result = body+"ez"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body+"ont"; 
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
if (subjectBody === "mi") result = body.replace(/ir$/,"is"); 
else if (subjectBody === "tu") result= body.replace(/ir$/,"is"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/ir$/,"it"); 
else if (subjectBody === "wi") 
result = body.replace(/er$/,"ons"); 
else if (subjectBody === "yu") result= body.replace(/ir$/,"ez"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/ir$/,"ent"); 
}
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/ir$/,"i"); 
else if (subjectBody === "tu") result= body.replace(/ir$/,"i"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/ir$/,"i"); 
else if (subjectBody === "wi") result= body.replace(/ir$/,"is"); 
else if (subjectBody === "yu") result= body.replace(/ir$/,"is"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/ir$/,"is"); 
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body+"ai"; 
else if (subjectBody === "tu") result = body+"as"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body+"a"; 
else if (subjectBody === "wi") result = body+"ons"; 
else if (subjectBody === "yu") result = body+"ez"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body+"ont"; 
}
}
}
else if( /re$/.test(body)){ /* -re verbs */
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head )
tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){

/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = body.replace(/re$/,"s"); 
else if (subjectBody === "tu") result= body.replace(/re$/,"s"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/re$/,""); 
else if (subjectBody === "wi") result= body.replace(/re$/,"ons"); 
else if (subjectBody === "yu") result= body.replace(/re$/,"ez"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/re$/,"ent"); 
}
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/re$/,"ré"); 
else if (subjectBody === "tu") result= body.replace(/re$/,"ré"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/re$/,"ré"); 
else if (subjectBody === "wi") result= body.replace(/re$/,"rés"); 
else if (subjectBody === "yu") result= body.replace(/re$/,"rés"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/re$/,"rés"); 
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = body.replace(/e$/,"ai"); 
else if (subjectBody === "tu") result = body.replace(/e$/,"as"); 
else if (subjectBody === "tila"
||  subjectBody === "tifi"
||  subjectBody === "ti") result = body.replace(/e$/,"a"); 
else if (subjectBody === "wi") result = body.replace(/e$/,"ons"); 
else if (subjectBody === "yu") result = body.replace(/e$/,"ez"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/e$/,"ont"); 
}
}
}
else if (body.length <= 0)/* nominal */{
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
var body = adposition; /* etre */
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body.replace(/re$/,"ré"); 
else if (subjectBody === "tu") result= body.replace(/re$/,"ré"); 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/re$/,"ré"); 
else if (subjectBody === "wi") result= body.replace(/re$/,"rés"); 
else if (subjectBody === "yu") result= body.replace(/re$/,"rés"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/re$/,"rés"); 
else result =  body.replace(/re$/,"ré");
}
/* present tense */
else if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "am"; 
else if (subjectBody === "tu") result= "arst"; 
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
body = "will-be"
//if (subjectBody === "mi") result = body+"ai"; 
//else if (subjectBody === "tu") result = body+"as"; 
//else if (subjectBody === "il"
//||  subjectBody === "elle"
//||  subjectBody === "ti") result = body+"a"; 
//else if (subjectBody === "wi") result = body+"ons"; 
//else if (subjectBody === "yu") result = body+"ez"; 
//else if (subjectBody === "ils"
//||  subjectBody === "elles"
//||  subjectBody === "si") result = body+"ont"; 
}
}
}
else result = head+joiner+body;

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
