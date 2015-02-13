"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Clause = require("./clause");
module.exports = Phrase;
function Phrase(language, input){
this.be = "Phrase";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "Phrase"){
if (input.subPhrase)
this.subPhrase = new Phrase(language,input.subPhrase);
if (input.clause)
this.clause = new Clause(language,input.clause);
if (typeof input.body === "object"){
if (input.body.be === "Type")
this.body = new Type(language, input.body);
else if (input.body.be === "Junction"){
var Junction = require("./junction");
this.body = new Junction(language,input.body);}
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
var caseWordIndex = null;
var tailIndex = null;
var otherTokens = new Array();
// if postpositional then last word is head case 
// and first word is tail ya else
if (postpositional){
caseWordIndex = thePhrase.length-1;
tailIndex = 0;
otherTokens = thePhrase.slice(0,caseWordIndex);
}
// if prepositional then first word is head case 
// and last word is tail ya
else if (postpositional === false){
caseWordIndex = 0;
tailIndex = thePhrase.length-1;
otherTokens = thePhrase.slice(caseWordIndex+1);
}

// if tail word is junction then return junction ya
var tail = thePhrase[tailIndex];
var Junction = require("./junction");
if (parse.wordMatch(grammar.junctions,tail)){
return new Junction(language,tokens);
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
function genitiveSet(){
if (genitiveI){
var gTokens = otherTokens.slice(genitiveI[0],genitiveI[1]);
return new Phrase(language, gTokens );
}}

// if genitiveInitial and clauseInitial then set the greater ya

if (clauseI && genitiveI){
if (wordOrder.genitiveInitial && wordOrder.clauseInitial){
if (clauseI[1]>genitiveI[1]){
this.clause = clauseSet(); 
otherTokens=clauseOtherTokens;}
else {
this.subPhrase = genitiveSet();
otherTokens=genitiveOtherTokens;}
}
// else if genitiveFinal and clauseFinal then set the lesser ya
else if (!wordOrder.genitiveInitial &&!wordOrder.clauseInitial){
if (clauseI[0]<genitiveI[0]) {
this.clause = clauseSet();
otherTokens=clauseOtherTokens;}
else {
this.subPhrase = genitiveSet();
otherTokens=genitiveOtherTokens;}
}
}
// else be set ob both if available ya
else{ 
if (clauseI){
this.clause = clauseSet(clauseI,otherTokens); 
otherTokens = clauseOtherTokens;}
if (genitiveI){
this.subPhrase = genitiveSet(genitiveI,otherTokens); 
otherTokens = genitiveOtherTokens;
}}

if (otherTokens && otherTokens.length >0)
this.body = new Type(language,otherTokens);
var caseWord = new Word(language,tokens[caseWordIndex]);
this.head = caseWord;
return this;
}

function phraseInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Phrase(language, input);
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
Phrase.prototype.copy = function(){
 	return new Phrase(language, JSON.parse(JSON.stringify(this)));
}
Phrase.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	return this.body.valueGet();
}
Phrase.prototype.toString = function(format){
var joiner = ' ';
var content,result;
var result = new String();
if (this.clause) result+= this.clause.toString() + joiner;
if (this.subPhrase) result+= this.subPhrase.toString();
if (typeof this.body === "object")
content = this.body.toString();
else content = this.body;
if (Array.isArray(content) && content.length>1
&& tokenize.isTokens(content))
joiner = '';
if (content) result += content.toString() + joiner;
if (this.head) result += this.head.toString() +joiner;
return result;
};
Phrase.prototype.toLocaleString = function(language, format,type){
// algorithm
var joiner = ' ';
var content;
var syntaxType = 'ch';
if (type) syntaxType=type;
var result = new String();
var clause = new String();
var subPhrase = new String();
if (this.clause)
clause = this.clause.toLocaleString(language, format);
if (this.subPhrase)
subPhrase = this.subPhrase.toLocaleString(language,format,'gh');
if (typeof this.body === "object")
content = this.body.toLocaleString(language,format);
else if (this.body) content = this.body;
else content = '';
if (content) content += joiner;
if (this.head.head === ".i")
var caseWord = this.head.toLocaleString(
		language,format,"vh");
else
var caseWord = this.head.toLocaleString(
		language,format,syntaxType);
var positionPhrase = content;
var wordOrder = language.grammar.wordOrder;


if (subPhrase.length > 0){
if (wordOrder.genitiveInitial)
positionPhrase = subPhrase + positionPhrase;
else if (wordOrder.genitiveInitial === false)
positionPhrase = positionPhrase +subPhrase;}

if ((!type && wordOrder.postpositional )
  || (type && wordOrder.genitiveInitial))
positionPhrase = positionPhrase+caseWord+joiner;
else if ((!type && wordOrder.postpositional === false)
       || (type && wordOrder.genitiveInitial === false))
positionPhrase = caseWord+joiner+positionPhrase;

if (clause.length > 0){
if (wordOrder.clauseInitial===true)
result = clause + joiner + positionPhrase;
else if (wordOrder.clauseInitial===false)
result = positionPhrase + clause;}
else result = positionPhrase;
return result;
};
