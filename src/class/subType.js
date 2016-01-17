"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Clause = require("./clause");
module.exports = SubType;
function SubType(language, input, conjLevel,partOfSpeech ){
this.be = "SubType";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "SubType"){
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
// if clauseInitial then get subType from end ya else
// if clauseFinal then get subType from begining ya
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
var theSubType;

// be get ob phrase do
// if clauseInitial get phrase from end
if (wordOrder.clauseInitial)
theSubType = parse.lastSubType(grammar,tokens);
// if clauseFinal get phrase from begining
else theSubType = parse.firstSubType(grammar,tokens);

// be get ob case word do
var caseWordI = null;
var caseWordsN = 1;
var tailIndex = null;
var otherTokens = new Array();
// if postpositional then last word is head case 
// yand first word is tail ya else

if (postpositional){
caseWordI = theSubType.length-1;
// unless last word is topic, then possibly second last word is
// included, if it is also a phrase word.
if (theSubType[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.subTypeWords,theSubType[caseWordI-1])){
caseWordI--;
caseWordsN++;}
tailIndex = 0;
otherTokens = theSubType.slice(0,caseWordI);
}
// if prepositional then first word is head case 
// and last word is tail ya
else if (postpositional === false){
caseWordI = 0;
if (theSubType[caseWordI]===grammar.topicWord
&& parse.wordMatch(grammar.subTypeWords,theSubType[caseWordI+1])){
caseWordsN++;}
tailIndex = theSubType.length-1;
otherTokens = theSubType.slice(caseWordI+caseWordsN);
}

console.log("T "+tokens+" TCWI "+tokens[caseWordI]);
var caseWord = new Word(language,tokens[caseWordI]);
console.log("CW "+caseWord);

// set output ya


if (otherTokens && otherTokens.length >0){
this.body = new Type(language,otherTokens,partOfSpeech);
}
this.head = caseWord;

return this;
}

function phraseInputToMatch(language,input,conjLevel){
	if (typeof input === "string"
		|| Array.isArray(input))
	return new SubType(language, input, conjLevel);
	else if (typeof input === "object"
		&& input.be === "SubType")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"SubType");
}
SubType.prototype.isSubset= function(language,input){
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
SubType.prototype.isSuperset= function(language,input){
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
SubType.prototype.isLike= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
SubType.prototype.copy = function(language,conjLevel){
return new SubType(language,
JSON.parse(JSON.stringify(this)),conjLevel);
}
SubType.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	//console.log(this.body);
	return this.body.valueGet();
}
SubType.prototype.toString = function(format){
var joiner = ' ';
var content,result;
var result = new String();
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
SubType.prototype.toLocaleString = 
function(language, format,type,conjLevel){
// algorithm


var conj = new Object();
if (conjLevel >= 3){
 conj = language.grammar.conjugation;

if (this.head && this.head.head){
if( conj.verbSubType && this.head.head === "hi"){
return conj.verbSubType(language,this,format,conjLevel);
}
else if( conj.subjectSubType && this.head.head === "hu"){
return conj.subjectSubType(language,this,format,conjLevel);
}
else if( conj.objectSubType && this.head.head === "ha"){
return conj.objectSubType(language,this,format,conjLevel);
}
else if( conj.dativeSubType && this.head.head === "ta"){
return conj.dativeSubType(language,this,format,conjLevel);
}
else if( conj.instrumentalSubType && 
(this.head.head === "wu" || this.head.head === "mwa")){
return conj.instrumentalSubType(language,this,format,conjLevel);
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
var subSubType = new String();
if (this.clause)
clause = this.clause.toLocaleString(language, format, undefined,
conjLevel);
if (this.subSubType)
subSubType =
this.subSubType.toLocaleString(language,format,'gh',conjLevel);
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
if (content) content += joiner;
var caseWord = new String();
if (this.head && this.head.head === "hi")
caseWord = this.head.toLocaleString( language,format,"vh",
conjLevel);
else if (this.head ) 
caseWord = this.head.toLocaleString( language,format
,"ch", conjLevel);
var positionSubType = content;
var wordOrder = language.grammar.wordOrder;


if (subSubType.length > 0){
if (wordOrder.genitiveInitial)
positionSubType = subSubType + positionSubType;
else if (wordOrder.genitiveInitial === false)
positionSubType = positionSubType +subSubType;}

if ((!type && wordOrder.postpositional )
  || (type && wordOrder.genitiveInitial))
positionSubType = positionSubType+caseWord+phraseJoiner;
else if ((!type && wordOrder.postpositional === false)
       || (type && wordOrder.genitiveInitial === false))
positionSubType = caseWord+joiner+positionSubType;

if (clause.length > 0){
if (wordOrder.clauseInitial===true)
result = clause + clauseJoiner + positionSubType;
else if (wordOrder.clauseInitial===false)
result = positionSubType + clause;}
else result = positionSubType;
return(result);
};