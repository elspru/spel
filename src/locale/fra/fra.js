var base = "../../";
var Text = require("../../class/text");
var Phrase = require("../../class/phrase");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var parse = require("../../compile/parse");
var svo = require("../../locale/svo/svo");
var wrld = require("../../locale/wrld/wrld");
var translate = require("../../compile/translate");
var fraFile = require("./fra.txt.json");
var mwak = new Language();

module.exports = French;
function French(srcBase){
var fraText = new Text(mwak,fraFile);
var fraDict = new Dictionary(mwak,fraText);
var fraWordOrder = {
	headFinal : false,
	verbFinal : false,
	nounFinal : false,
	typeFinal : false,
	topicInitial : false,
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["hu","hi","ha"/*,"ta","wu"*/],
};

var fromMwak = fraDict.fromMwak;

var conjugation = {
reversible:[
],
irreversible:[
[" ya$",". "],
[",. ",". "],
]
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
var verbMods = new String();
if (phrase.body && phrase.body.head
&& phrase.body.head.body){
verbMods = translate.array(fromMwak,phrase.body.head.body);
}
body = verbMods + joiner+ body;
if (head.length>0 && body.length>0) 
result = head+joiner+body; 
else if (head.length>0) result = head;
else if (body.length>0) result = body;
else result = adposition;
 
if (/er$/.test(body)){ /* -er conjugation */
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
tenseWord = phrase.body.head.head;
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
var tenseWord = phrase.body &&
phrase.body.head && phrase.body.head.head;
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
else if (parse.wordMatch(tense.past,tenseWord)){
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
else if (parse.wordMatch(tense.future,tenseWord)){
body = body.replace(/ir$/,"");
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
else  result = body+"a";
}
}
}
else if( /re$/.test(body)){ /* -re verbs */
var tense = mwak.grammar.tense
var tenseWord = phrase.body && phrase.body.head && phrase.body.head.head;
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
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = body.replace(/e$/,"a"); 
else if (subjectBody === "wi") result = body.replace(/e$/,"ons"); 
else if (subjectBody === "yu") result = body.replace(/e$/,"ez"); 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body.replace(/e$/,"ont"); 
}
}
}
else if (body.length > 0 && ! sentence.nominal){
/* default noun to verb */
var tense = mwak.grammar.tense
var tenseWord = phrase.body && phrase.body.head && phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){

/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "ai "+body;
else if (subjectBody === "tu") result= "as "+body;
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "a "+body;
else if (subjectBody === "wi") result= "avons "+body
else if (subjectBody === "yu") result= "avez "+body
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "ont "+body
else result =  "as "+body;
}
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = "eus "+body
else if (subjectBody === "tu") result= "eus "+body
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "eut "+body
else if (subjectBody === "wi") result= "eûmes "+body
else if (subjectBody === "yu") result= "eûtes "+body
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "eurent "+ body
else result = "eut "+body;
}
/* future tense */
if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = "aurai "+body
else if (subjectBody === "tu") result = "auras "+body
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "aura "+body
else if (subjectBody === "wi") result = "aurons "+ body
else if (subjectBody === "yu") result = "aurez "+body
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "auront "+body
else result = "aura " + body;

}
}
}
else if (body.length > 0 && ! sentence.nominal){
/* default noun to verb */
}
else if (body.length <= 0 && sentence.nominal)/* nominal */{
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
if (subjectBody === "mi") result = "suis"; 
else if (subjectBody === "tu") result= "es"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "est"; 
else if (subjectBody === "wi") result= "sommes"; 
else if (subjectBody === "yu") result= "êtes"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "sont"; 
else result =  "est";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "ser"
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
else if (body.length <= 0 && sentence.nominal)/* nominal */{
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
if (subjectBody === "mi") result = "suis"; 
else if (subjectBody === "tu") result= "es"; 
else if (subjectBody === "il"
||  subjectBody === "elle"
||  subjectBody === "ti") result = "est"; 
else if (subjectBody === "wi") result= "sommes"; 
else if (subjectBody === "yu") result= "êtes"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "sont"; 
else result =  "est";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "ser"
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
else if (sentence.nominal) result = adposition+joiner+head+joiner+body;
else result = "";

return result+joiner;
} // end of verbAgreement

function genderGet(word){
var result = "m";
if (/eau$/.test(word)) result = "m";
else if (/ison$/.test(word)) result = "f";
else if (/sion$/.test(word)) result = "f";
else if (/tion$/.test(word)) result = "f";
else if (/nion$/.test(word)) result = "f";
else if (/ure$/.test(word)) result = "f";
else if (/e$/.test(word)) result = "f";
return result;
}


conjugation.subjectPhrase = subjectPhraseConjugate;
function subjectPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "je"+joiner;
else if (head === "tu") return "tu"+joiner;

// main
var newPhrase = phrase.copy(language);
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,conjLevel);
var result = new String();

var gender = "m";
if (phrase.body && phrase.body.body && phrase.body.body.head){
var headWord = translate.word(fromMwak,phrase.body.body.head);
gender = genderGet(headWord);
}

// results
result = body;
// return
return result;
}


conjugation.dativePhrase = dativePhraseConjugate;
function dativePhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "me"+joiner;
else if (head === "tu") return "te"+joiner;

// main
var newPhrase = phrase.copy(language);
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,conjLevel);
var result = new String();

var gender = "m";
if (phrase.body && phrase.body.body && phrase.body.body.head){
var headWord = translate.word(fromMwak,phrase.body.body.head);
gender = genderGet(headWord);
}

// results
result = body;
if (gender !== "m") result = "à "+result;
else result = "au "+result.replace(/^le /,"").replace(/l\'/,"");
// return
return result;
}

conjugation.phrase = phraseConjugate;
function phraseConjugate(language,phrase,format,conjLevel){
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
var type = "n";

if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);
if(phrase.subPhrase)
var subPhrase =
phrase.subPhrase.toLocaleString(language,format,type,conjLevel);


var result = new String();

if (body.length >0) result += body+joiner;
if (subPhrase) result += subPhrase+joiner;
if (clause) result += clause+joiner;


if (isPronoun(phrase)) {
if (adposition.length>0) result = adposition+joiner+result;
return result;
}

result = articlize(phrase,body);
if (adposition.length>0) result = adposition+joiner+result;

return result+joiner;
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
var tenseWord = Type.head && Type.head.head;
if (Type.head && Type.head.head
&& (parse.wordMatch(number.all,tenseWord)
| number.indefinite === tenseWord)){
if (number.indefinite === tenseWord){
result = body;}
if (parse.wordMatch(number.all,tenseWord)){
if (parse.wordMatch(number.plural,Type.head.head))
result = body.replace(/$/,"s"); 
else
result = head+joiner+body.replace(/$/,"s"); 
}
}
else if (Type.head)result = head+joiner+body;
else result = body; 

return result;
}

conjugation.objectPhrase = objectPhraseConjugate;
function 
objectPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";

var newPhrase = phrase.copy(language);
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,conjLevel);

return body;
}

function articlize(phrase,phraseString){
var result = phraseString;
/* le la les */
var Type = phrase.body;
var number = mwak.grammar.number;
if (Type && Type.head && Type.head.head){
if (parse.wordMatch(number.all,Type.head.head)){
result = "les "+result;
}
else if(parse.wordMatch(number.indefinite,Type.head.head)){
var headWord = translate.word(fromMwak,phrase.body.body.head);
var gender = genderGet(headWord);
if (gender === "f") result = "une "+result;
else result = "un "+result;
}
}
else if (isVowel(result[0])) result = "l'"+result;
else{
var gender = "m";
if (phrase.body && phrase.body.body && phrase.body.body.head){
var headWord = translate.word(fromMwak,phrase.body.body.head);
gender = genderGet(headWord);
}
if (gender === "m")
result = "le "+result;
else if (gender === "f")
result = "la "+result;
}

return result;
}

var isPronoun = wrld.conjugation.isPronoun;

var vowels = ["a","e","i","o","e"];
function isVowel(glyph){
if (vowels.indexOf(glyph)!== -1) return true;
else false;
}

conjugation.foreignQuote = 
wrld.conjugation.guillemetSpaceQuote;

var fraGrammar = new Grammar(fraWordOrder,fraDict,conjugation);
var fra = new Language(fraGrammar,fraDict);
return fra;
}

