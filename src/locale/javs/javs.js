var base = "../../";
var hof = require("../../lib/hof");
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var mwak = new Language();
var wrld = require("../../locale/wrld/wrld");
var translate = require("../../compile/translate");

module.exports = Javascript;
function Javascript(dictionary){
//var io = require("../../lib/io");
//var javsFile = io.fileRead(srcBase+"/locale/javs/javs.txt");
if (dictionary !== undefined) javsDict = dictionary;
else{
var javsFile = require("./javs.txt.json");
var javsText = new Text(mwak,javsFile);
var javsDict = new Dictionary(mwak,javsText);
}
var javsWordOrder = {
	headFinal : false,
	verbFinal : false,
	nounFinal : false,
	typeFinal : false,
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa","hu","hi","ha"],
};
var conjugation = {
reversible:[
["asdfasdf","kjkjk"],
],
irreversible:[
[" ya$","; "],
[" ya ","; "]
]
}
conjugation.noun = nounConjugate;
function nounConjugate(language,noun,format,conjLevel) {
format.joiner = " .";
var nounString =
noun.toLocaleString(language,format);
return nounString;
}


//conjugation.verb = verbConjugate;
//function verbConjugate() {
//return verbString.replace(/ /,"_")+"(";}

conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(language,phrase,format,conjLevel) {
var Type = phrase.body;
if (Type.head)
var typeHead = Type.head.toLocaleString(language,format,"th",
conjLevel);

if (Type.body)
var typeBody = Type.body.toLocaleString(language,format,"n",
conjLevel);

var result =  new String();

if (typeHead&&typeBody)
result+=typeHead+"."+typeBody;
else if (typeHead) result+=typeHead;
else if (typeBody)
result+=typeBody;

return result
}

conjugation.phrase = phraseConjugate;
function phraseConjugate(language,phrase,format,type,conjLevel){

var joiner = " ";
var ender = new String();
var body = new String();
if (phrase.be === "Junction"){
body = 
junctionConjugate(language,phrase,format,"n",conjLevel);
}
else {
if (phrase.body){
if (phrase.body.be === "Junction") body =
junctionConjugate(language,phrase.body,format,"n",conjLevel);
else body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
}
if (phrase.head)
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
}

var nominal = false;

if (phrase.clause){
clauseWord = language.grammar.clauseWords[0];
var clause = 
clauseWord+"("+
phrase.clause.body.toLocaleString(language,format,"n",
conjLevel)+")";
}

var result = new String();
if (adposition)
result += '"'+adposition+'":';
if (nominal){ result += '{'; ender = '}'+ender;}
else if (adposition) {result += '('; ender = ')'+ender;}
if(phrase.subPhrase){
if (phrase.subPhrase.body.be === "Junction"){
var subPhrase =
subJunctionConjugate(language,
phrase.subPhrase.body,format,"n",conjLevel,body);}
else {
var subPhrase =
phrase.subPhrase.body.
toLocaleString(language,format,type,conjLevel);
}
if (subPhrase)
result += subPhrase.replace(/[.]$/,"")+"[";
ender = "]"+ender;
}
if (body)
result += body;

if (clause&&body)
result += " ."+clause;
else if (clause) result += clause;

return result+ender;
}

conjugation.copula = "=";
conjugation.nominal = copulaNominal;
function 
copulaNominal(language, sentence,format,type, conjLevel){

var sentence = sentence.copy();
var result = new String();
var joiner = "";
var phrases = sentence.phrases;

var sentenceHead = new String();
if (sentence.head)
sentenceHead =
sentence.head.toLocaleString(language,format,"sh",conjLevel);
var copula = "=";
if (type === "n") {
copula = ":";
}


var subjectIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body 
&& phrase.head.body.head === "hu")
return true; else return false;
});
if (subjectIndex !== null){
var subjectPhrase = phrases[subjectIndex];
result = ''+
subjectPhrase.toLocaleString(language,format,"n",conjLevel)
.replace(/[.]$/,"") +''+ result;
sentence.byIndexPhraseDelete(subjectIndex);
}
else {
result = objectMake(language,phrases,format,type,conjLevel)
if (sentenceHead === ";")
return result+sentenceHead
else
return sentenceHead+"("+result+");";
}

result += copula; 

var ender = new String();
var verbIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hi"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hi")
return true; else return false;
});

if (verbIndex !== null){
var verbPhrase = phrases[verbIndex];
var verbString =
verbPhrase.toLocaleString(language,format,"v",conjLevel)
.replace(/[.]$/,'');
result += "/*"+verbString+"*/";
//ender += ')';
sentence.byIndexPhraseDelete(verbIndex);
} 
//else {
//result += language.grammar.verbWord;
//}




//var objectIndex = phrases.find(function(phrase){
//if ( phrase.head.head === "ha"
//|| phrase.head.head === "fa" && phrase.head.body
//&& phrase.head.body.head === "ha")
//return true; else return false;
//});
//if (objectIndex !== null){
//var objectPhrase = phrases[objectIndex];
//result += "{"+
//objectPhrase.toLocaleString(language,format,"n",conjLevel);
//if (copula = ":")
//ender = "}"+ender;
//sentence.byIndexPhraseDelete(objectIndex);
//if (phrases.length >0) result += ", ";
//}

var nominal = sentence.nominal;

if (phrases.length > 0) {
result += 
objectMake(language,phrases,format,type,conjLevel,nominal);
}

result += ender;

if (sentenceHead === ";")
result = result+sentenceHead
else
result = sentenceHead+"("+result+");";


return  result;
}


function 
objectMake(language,phrases,format,type,conjLevel,nominal){
// for each phrase make object tag

var i;
var result = new String();
if (phrases.length === 1
&& phrases[0].head.head === "ha"){
var phrase = phrases[0].body.toLocaleString(language,
format,type,conjLevel);

return phrase;
}


result += "{";
for (i=0;i<phrases.length;i++){
var phrase = phrases[i];
result +=
phraseConjugate(language,phrase,format,type,conjLevel);
if (i<phrases.length-1) result+=', ';
}
result +="}";
return result;
}

conjugation.text = textConjugate;
function 
textConjugate(language,text,format, type, conjLevel){
console.log("sub Text Conjugation");
var newText = text.copy();
var sentences = newText.sentences;
var firstSentence = sentences[0];
var lastSentence = sentences[sentences.length-1];
// if first sentence is start, make function for it
console.log("FS "+firstSentence);
var subjectPhrase = firstSentence.phraseGet(mwak,"hu");
console.log("SP "+subjectPhrase);
var name =
subjectPhrase.body.toLocaleString(language,format,type,conjLevel);
sentences.pop();
console.log("N "+name);
// if last sentence is end then close brace for it.
sentences.shift();
var contents =
 newText.toLocaleString(language,format,type,conjLevel);
return "function "+name+"(){ \n"+contents+"\n}/*"+name+" end*/\n";
}

conjugation.numeral = numeralConjugate;
function numeralConjugate(language,Type,format,type,conjLevel){
var contents = Type.body[0];
return contents;
}

conjugation.sentence = sentenceConjugate;
function 
sentenceConjugate(language,sentence,format, type, conjLevel){

var sentence = sentence.copy();
var result = new String();
format.joiner = " ";
var phrases = sentence.phrases;

if (sentence.mood){
var mood = 
moodConjugate(language,sentence.mood,format,type,conjLevel);
result += mood}


var conditionalIndex = phrases.find(function(phrase){
if ( phrase.be === "TopClause" &&
phrase.head && phrase.head.head === "ku"
|| phrase.head.head === "fa" && 
phrase.head.body && phrase.head.body.head === "ku")
return true; else return false;
});
if (conditionalIndex !== null ){
result = 
conditionalConjugate(language,sentence,format,type,conjLevel);
return result;

}

var subjectIndex = phrases.find(function(phrase){
if ( phrase.head && phrase.head.head === "hu"
|| phrase.head.head === "fa" && 
phrase.head.body && phrase.head.body.head === "hu")
return true; else return false;
});
if (subjectIndex !== null){
var subjectPhrase = phrases[subjectIndex];
result += 
subjectPhrase.toLocaleString(language,format,"n",conjLevel)
.replace(/ $/,'');
sentence.byIndexPhraseDelete(subjectIndex);
}

var ender = new String();

var verbIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hi"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hi")
return true; else return false;
});
if (verbIndex !== null && subjectIndex !== null)
result += " .";
if (verbIndex !== null){
var verbPhrase = phrases[verbIndex];
result += 
verbPhrase.toLocaleString(language,format,"v",conjLevel)
.replace(/ $/,'')+"(";
ender = ")";
sentence.byIndexPhraseDelete(verbIndex);
}

var objectIndex = phrases.find(function(phrase){
if ( phrase.head.head === "ha"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "ha")
return true; else return false;
});
if (objectIndex !== null){
var objectPhrase = phrases[objectIndex];
result +=
objectPhrase.toLocaleString(language,format,"n",conjLevel)
.replace(/ $/,'');
sentence.byIndexPhraseDelete(objectIndex);
if (phrases.length >0) result += ", ";
}

if (phrases.length > 0)
result +=
objectMake(language,phrases,format,type,conjLevel);

//result +=")";

result += ender;
var sentenceHead = undefined;
if (sentence.head)
sentenceHead =
sentence.head.toLocaleString(language,format,"sh",conjLevel);
if (sentenceHead){
if (sentenceHead === ";")
result += sentenceHead
//else 
//result = sentenceHead+"("+result+");";
}

return  result;
}


function
conditionalConjugate(language,sentence,format,type,conjLevel){
var result = new String();
var phrases = sentence.phrases;
var conditionalIndex = phrases.find(function(phrase){
if ( phrase.be === "TopClause" &&
phrase.head && phrase.head.head === "ku"
|| phrase.head.head === "fa" && 
phrase.head.body && phrase.head.body.head === "ku")
return true; else return false;
});
if (conditionalIndex >= 0){
var innerSentence = sentence.phrases[conditionalIndex].body
result += "if ("+
comparativeConjugate(language,innerSentence
,format,type,conjLevel)+") ";
}
var thenIndex = phrases.find(function(phrase){
if ( phrase.be === "TopClause" &&
phrase.head && phrase.head.head === "twa"
|| phrase.head.head === "fa" && 
phrase.head.body && phrase.head.body.head === "twa")
return true; else return false;
});
if (thenIndex >= 0&& thenIndex !== null){
var innerSentence = sentence.phrases[thenIndex].body
result += "{ "+
sentenceConjugate(language,innerSentence
,format,type,conjLevel)+"} ";
}
result +=";";
return result;
}

function comparativeConjugate(language,innerSentence,format,
type,conjLevel){
// get verb
// if one of comparatives replace it
// else return it as normal sentence
var result = new String();

var subjectIndex = innerSentence.indexOf(mwak,"hu");
var fromIndex = innerSentence.indexOf(mwak,"su");
var verbIndex = innerSentence.indexOf(mwak,"hi");
if (verbIndex !== null){
var verb = innerSentence.phrases[verbIndex].body.toString();
var subject = new String();
var from = new String();
if (subjectIndex!== null && subjectIndex >= 0)
subject =
innerSentence.phrases[subjectIndex].body.toLocaleString(language)
if (fromIndex!== null)
from =
innerSentence.phrases[fromIndex].body.toLocaleString(language);
result += subject+" ";
if (verb === "sam")
result +=  " === ";
else if (verb === "sam nyi")
result +=  "!== ";
else if (verb === "tyuf")
result +=  "!== ";
else if (verb === "wul")
result +=  "> ";
else if (verb === "kuc")
result +=  "< " ;
else if (verb === "kuc sam" || verb === "sam kuc")
result +=  "<== ";
else if (verb === "wul sam" || verb === "sam wul")
result +=  ">== ";

result+= from;
}
else result = sentenceConjugate(language,innerSentence,format,
type,conjLevel);
return result;

}

conjugation.header = 
 '#!/usr/bin/nodejs \n'
+'/*translated by SPEL.*/\n'
+'var ls = require("./libspel");\n'
+'Object.keys(ls).forEach(function(k){global[k]=ls[k]});\n'
+'"use strict";\n'


conjugation.subjectPhrase = subjectPhraseConjugate;
function
subjectPhraseConjugate(language,phrase,format,conjLevel){
var newPhrase = phrase.copy();
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,"n",conjLevel);
return body;
}

conjugation.objectPhrase = objectPhraseConjugate;
function objectPhraseConjugate(language,phrase,format,conjLevel)
{
var result = new String;

var newPhrase = phrase.copy();
delete newPhrase.head;
var body = phraseConjugate(language,newPhrase,format,"n",conjLevel);

result = body;
//format.joiner = "";
//var type = "n";
//if (phrase.body){
//var body =
//phrase.body.toLocaleString(language,format,"n", conjLevel);
result = body.replace(/[.]$/,'');
//
//if (phrase.clause){
//var newClause = phrase.clause.copy();
//delete newClause.head;
//var clause =
//newClause.toLocaleString(language,format,type, conjLevel);
//result += clause+joiner;}
//
//if(phrase.subPhrase){
//var subPhrase =
//phrase.subPhrase.toLocaleString(language,format,type,conjLevel);
//if (subPhrase)
//result = subPhrase+"["+result+"]";
//}

return result;
}

conjugation.mood = moodConjugate;
function moodConjugate(language,mood,format,type,conjLevel) {
var moodString =
mood.toLocaleString(language,format,type,conjLevel);
return '/*'+moodString+'*/';
}

conjugation.sentenceHead = sentenceHeadConjugate;
function sentenceHeadConjugate(language,word,format,conjLevel) {
if (word.head === "ci") {
var queryWord =  word.toLocaleString(language,format,conjLevel)
return queryWord.replace(/\?/,"");
}
return ';';}

//conjugation.phraseHead = nounConjugate;

conjugation.verbHead = verbHeadConjugate;
function verbHeadConjugate(string) {
return '';}


conjugation.phraseJoiner = ', ';

conjugation.foreignQuote = foreignQuoteConjugation;
function foreignQuoteConjugation(language,
foreignQuoteObject,format){
return '/*'+ foreignQuoteObject.name.toLocaleString(language)
+'*/ '+ '"'+foreignQuoteObject.body.join(" ")+'"';
}

var javsGrammar = new Grammar(javsWordOrder,javsDict,conjugation);
var javs = new Language(javsGrammar,javsDict);
return javs;
}

function 
junctionConjugate(language,phrase,format,type,conjLevel){
var head = phrase.head.head;
var result = new String();
var joiner = " ";
var junction = new String();
if (head === "ki") junction = "&&"
else if (head === "wa") junction = "||"
else junction =
head.toLocaleString(language,format,type,conjLevel);
var bodyA = phrase.body;
var bodyL = bodyA.length;
var i;
for (i=0;i<bodyL;i++){
result +=
bodyA[i].toLocaleString(language,format,type,conjLevel);
if (i < bodyL-1)
result += joiner+junction+joiner;
}
return result;
}

function 
subJunctionConjugate(language,phrase,format,type,conjLevel
,body){
var head = phrase.head.head;
var result = new String();
var joiner = " ";
var junction = new String();
if (head === "ki") junction = "+";
else if (head === "wa") junction = "||"
else junction =
head.toLocaleString(language,format,type,conjLevel);
var bodyA = phrase.body;
var bodyL = bodyA.length;
var i;
for (i=0;i<bodyL;i++){
result +=
bodyA[i].toLocaleString(language,format,type,conjLevel);
if (i < bodyL-1){
result += "["+body+"]";
result += joiner+junction+joiner;}
}
return result;
}

exports.code = "javs";
