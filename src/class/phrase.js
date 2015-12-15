"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Clause = require("./clause");
var err = require("../lib/error");
module.exports = Phrase;
function Phrase(language, input, conjLevel ){
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Phrase error: language undefined";
    }
this.be = "Phrase";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "Phrase"){
if (input.subPhrase)
this.subPhrase = new
Phrase(language,input.subPhrase,undefined,conjLevel);
if (input.clause)
this.clause = new Clause(language,input.clause);
if (typeof input.body === "object"){
if (input.body.be === "Type")
this.body = new Type(language, input.body, partOfSpeech);
else if (input.body.be === "Junction"){
var Junction = require("./junction");
this.body = new Junction(language,input.body,partOfSpeech);}
}
else  this.body = input.body;
this.head = new Word(language, input.head);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);
// phrase parsing algorithm de
// be get ob phrase do
// if clauseInitial then get phrase from end ya else
// if clauseFinal then get phrase from begining ya
// be get ob case word do
// if postpositional then last word is head case 
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
// and first word is tail ya else
// if prepositional then first word is head case 
// and last word is tail ya
// if tail word is junction then return junction ya
// be get ob genitive sub phrase do
// if genitive found then get and set genitive phrase ya
// if genitive initial then get last sub phrase word ya else
// if genitive final then get first sub phrase word ya
// be get ob adjacent clause do
// set output do
// body and limb from other tokens

var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var postpositional = wordOrder.postpositional;
var thePhrase;

// be get ob phrase do
// if clauseInitial get phrase from end
if (wordOrder.clauseInitial)
thePhrase = parse.lastPhrase(grammar,tokens);
// if clauseFinal get phrase from begining
else thePhrase = parse.firstPhrase(grammar,tokens);

// be get ob case word do
var caseWordI = null;
var caseWordsN = 1;
var tailIndex = null;
var otherTokens = new Array();
// if postpositional then last word is head case 
// yand first word is tail ya else

if (postpositional){
caseWordI = thePhrase.length-1;
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
if (thePhrase[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.phraseWords,thePhrase[caseWordI-1])){
caseWordI--;
caseWordsN++;}
tailIndex = 0;
otherTokens = thePhrase.slice(0,caseWordI);
}
// if prepositional then first word is head case 
// and last word is tail ya
else if (postpositional === false){
caseWordI = 0;
if (thePhrase[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.phraseWords,thePhrase[caseWordI+1])){
caseWordsN++;}
tailIndex = thePhrase.length-1;
otherTokens = thePhrase.slice(caseWordI+caseWordsN);
}

// if tail word is junction then return junction ya
var tail = thePhrase[tailIndex];
var Junction = require("./junction");
if (parse.wordMatch(grammar.junctions,tail)){
return new Junction(language,tokens,partOfSpeech);
}

// be get ob adjacent clause do
var clauseI = 
parse.adjacentClauseIndex(language.grammar, otherTokens);
if (clauseI){ 
var start = clauseI[0];
var end = clauseI[1];
var clauseOtherTokens = otherTokens.slice(0);
clauseOtherTokens.splice(start,end-start);
}

// be get ob genitive sub phrase do
// if genitive found then get and set genitive phrase ya
var genitiveTokens, genitiveI, genitiveOtherTokens;
var genitiveWordI = -1;
// if genitive initial then get last sub phrase ya else
if (wordOrder.genitiveInitial){
genitiveWordI = 
parse.lastSubPhraseWordIndex(grammar,otherTokens);
if (genitiveWordI !== -1){
genitiveTokens = otherTokens.slice(0,genitiveWordI+1);
genitiveI = parse.lastPhraseIndex(grammar,genitiveTokens);
var start = genitiveI[0];
var end = genitiveI[1];
genitiveOtherTokens = otherTokens.slice(0);
genitiveOtherTokens.splice(start,end-start);
}}
// if genitive final then get first sub phrase ya
else if (wordOrder.genitiveInitial === false){
genitiveWordI = 
parse.firstSubPhraseWordIndex(grammar,otherTokens);
if (genitiveWordI !== -1){
genitiveTokens = otherTokens.slice(genitiveWordI);
genitiveI = parse.firstPhraseIndex(grammar,genitiveTokens);
var start = genitiveI[0]+genitiveWordI;
var end = genitiveI[1]+genitiveWordI;
genitiveI = [start,end];
genitiveOtherTokens = otherTokens.slice(0);
genitiveOtherTokens.splice(start,end-start);
}}

// set output ya

// set the closest of either clause or genitive ya
// if genitiveInitial and clauseInitial then set the greater ya
// else if genitiveFinal and clauseFinal then set the lesser ya
// else be set ob both if available ya

function clauseSet(){
if (clauseI && clauseI.length > 0){
var cTokens = otherTokens.slice(clauseI[0],clauseI[1]);
return  new Clause(language, cTokens );
}}
function
genitiveSet(language,genitiveI,otherTokens,conjLevel){
if (genitiveI){
var gTokens = otherTokens.slice(genitiveI[0],genitiveI[1]);
return new Phrase(language, gTokens,conjLevel);
}}

// if genitiveInitial and clauseInitial then set the greater ya

if (clauseI && genitiveI){
if (wordOrder.genitiveInitial && wordOrder.clauseInitial){
if (clauseI[1]>genitiveI[1]){
this.clause = clauseSet(); 
otherTokens=clauseOtherTokens;}
else {
this.subPhrase =
genitiveSet(language,genitiveI,otherTokens,conjLevel);
otherTokens=genitiveOtherTokens;}
}
// else if genitiveFinal and clauseFinal then set the lesser ya
else if (!wordOrder.genitiveInitial &&!wordOrder.clauseInitial){
if (clauseI[0]<genitiveI[0]) {
this.clause = clauseSet();
otherTokens=clauseOtherTokens;}
else {
this.subPhrase =
genitiveSet(language,otherTokens,genitiveI,conjLevel);
otherTokens=genitiveOtherTokens;}
}
}
// else be set ob both if available ya
else{ 
if (clauseI){
this.clause = clauseSet(clauseI,otherTokens); 
otherTokens = clauseOtherTokens;}
if (genitiveI){
this.subPhrase =
genitiveSet(language,genitiveI,otherTokens,conjLevel); 
otherTokens = genitiveOtherTokens;
}}


// identify body part of speech

var caseWord = new Word(language,
tokens.slice(caseWordI,caseWordI+caseWordsN), "adposition");
var partOfSpeech;
if (caseWord.head === "hi" 
|| caseWord.head.body && caseWord.head.body[0] === "hi")
partOfSpeech = "verb";
else partOfSpeech = "noun";
//if (partOfSpeech === "noun")

// body and limb from other tokens
if (otherTokens && otherTokens.length >0){
this.body = new Type(language,otherTokens,partOfSpeech);
}
this.head = caseWord;

return this;
}

function phraseInputToMatch(language,input,conjLevel){
	if (typeof input === "string"
		|| Array.isArray(input))
	return new Phrase(language, input, conjLevel);
	else if (typeof input === "object"
		&& input.be === "Phrase")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"Phrase");
}
Phrase.prototype.isSubset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(!match.body && this.body 
|| !match.head && this.head
|| !match.clause && this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSubset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSubset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSubset(language,match.clause))
result = false;
return result;
};
Phrase.prototype.isSuperset= function(language,input){
var match = phraseInputToMatch(language,input);
var result = true;
if(match.body && !this.body 
|| match.head && ! this.head
|| match.clause && !this.clause)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
else if (this.clause && match.clause
&& !this.clause.isSuperset(language,match.clause))
result = false;
return result;
};
Phrase.prototype.isLike= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Phrase.prototype.copy = function(language,conjLevel){
return new Phrase(language,
JSON.parse(JSON.stringify(this)),conjLevel);
}
Phrase.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	//console.log(this.body);
	return this.body.valueGet();
}
Phrase.prototype.toString = function(format){
var joiner = ' ';
var content,result;
var result = new String();
if (this.clause) result+= this.clause.toString()+ joiner;
if (this.subPhrase) result+= this.subPhrase.toString();
if (typeof this.body === "object")
content = this.body.toString();
else content = this.body;
if (Array.isArray(content) && content.length>1
&& tokenize.isTokens(content))
joiner = ' ';
if (content) result += content.toString() + joiner;
if (this.head) result += this.head.toString() +joiner;
return result;
};
Phrase.prototype.toLocaleString = 
function(language, format,type,conjLevel){
// algorithm


var conj = new Object();
if (conjLevel >= 3){
 conj = language.grammar.conjugation;

if (this.head && this.head.head){
if( conj.verbPhrase && this.head.head === "hi"){
return conj.verbPhrase(language,this,format,conjLevel);
}
else if( conj.subjectPhrase && this.head.head === "hu"){
return conj.subjectPhrase(language,this,format,conjLevel);
}
else if( conj.objectPhrase && this.head.head === "ha"){
return conj.objectPhrase(language,this,format,conjLevel);
}
else if( conj.dativePhrase && this.head.head === "ta"){
return conj.dativePhrase(language,this,format,conjLevel);
}
else if( conj.instrumentalPhrase && 
(this.head.head === "wu" || this.head.head === "mwa")){
return conj.instrumentalPhrase(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}
else if(conj.phrase)
return conj.phrase(language,this,format,conjLevel);
}

var joiner = " ";
if (format && format.joiner !== undefined) joiner = format.joiner;
if (conj && conj.format && conj.format.joiner !== undefined) {
var joiner = conj.format.joiner;}
var phraseJoiner = " ";
var clauseJoiner = " ";
var content;
var syntaxType = 'ch';
if (type) syntaxType=type;
var result = new String();
var clause = new String();
var subPhrase = new String();
if (this.clause)
clause = this.clause.toLocaleString(language, format, undefined,
conjLevel);
if (this.subPhrase)
subPhrase =
this.subPhrase.toLocaleString(language,format,'gh',conjLevel);
if (typeof this.body === "object" ){

if (this.head && 
(this.head.head === "hi" 
|| this.head.body && this.head.body[0] === "hi"))
content =
this.body.toLocaleString(language,format,"v",conjLevel);
else content = this.body.toLocaleString(language,format,"n",
conjLevel);
}
else if (this.body) content = this.body;
else content = '';
if (!/ $/.test(content)) content += joiner;
var caseWord = new String();
if (this.head && this.head.head === "hi")
caseWord = this.head.toLocaleString( language,format,"vh",
conjLevel);
else if (this.head ) 
caseWord = this.head.toLocaleString( language,format
,"ch", conjLevel);
var positionPhrase = content;
var wordOrder = language.grammar.wordOrder;


if (subPhrase.length > 0){
if (wordOrder.genitiveInitial)
positionPhrase = subPhrase + positionPhrase;
else if (wordOrder.genitiveInitial === false)
positionPhrase = positionPhrase +subPhrase;}

if ((!type && wordOrder.postpositional )
  || (type && wordOrder.genitiveInitial))
positionPhrase = positionPhrase+caseWord+phraseJoiner;
else if ((!type && wordOrder.postpositional === false)
       || (type && wordOrder.genitiveInitial === false))
positionPhrase = caseWord+joiner+positionPhrase;

if (clause.length > 0){
if (wordOrder.clauseInitial===true)
result = clause + clauseJoiner + positionPhrase;
else if (wordOrder.clauseInitial===false)
result = positionPhrase + clause;}
else result = positionPhrase;
return(result);
};
