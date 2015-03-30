"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
var Phrase = require("./phrase");
var Clause = require("./clause");
module.exports = Junction;
function Junction(language, input,partOfSpeech){

this.be = "Junction";
var tokens;
if (typeof input === "string"){
tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === "Junction"){
var i;
if (input.body.length > 0) this.body = new Array();
if (input.clas) this.clas = input.clas;
var Clas = Type;
if (input.clas && input.clas === "Phrase") Clas = Phrase;
for (i=0;i<input.body.length;i++)
this.body[i]=new Clas(language, input.body[i],partOfSpeech);
this.head = new Word(language, input.head);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);

// junction constructor algorithm de
// assumes head word be junction class ya
// if clause initial then be get from end ya
// be get ob junction word ya
// be set ob head as the junction ya
// be get ob last word yand be identify class ya
// su junction retrieve ob class from tokens with junction de 
// be set ob other tokens from after junction word til head ya
// su class retrieve ob class from tokens de 
// be get ob an object of the class from other tokens ya
// be add ob the object to body array ya
// su class retrieve be end ya
// be set ob other tokens from before junction word ya
// be parse ob the class from other tokens ya
// if head word be not matching to last word
// then throw error that this word and last word not matching
// else if tail word be matching junction
// then be junction retrieve ya
// else  be class retrieve ya
// su clause initial conditional be end ya
// 
// if clause final then be get from start ya
// be get ob junction word ya
// be set ob head as the junction ya
// be get ob first word yand be identify class ya
// su junction retrieve ob class from tokens with junction de 
// be set ob other tokens from before junction word til head ya
// su class retrieve ob class from tokens de 
// be get ob an object of the class from other tokens ya
// be add ob the object to body array ya
// su class retrieve be end ya
// be set ob other tokens from after junction word ya
// be parse ob the class from other tokens ya
// if head word be not matching to last word
// then throw error that this word and last word not matching
// else if tail word be matching junction
// then be junction retrieve ya
// else  be class retrieve ya
// su clause final conditional be end ya

// set output do


this.be = "Junction";
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var postpositional = wordOrder.postpositional;
var clauseInitial = wordOrder.clauseInitial;
var head, body = new Array();
var bodyI = 0;

// assumes head word be junction class ya
// if clause initial then be get from end ya
if (clauseInitial){
// be get ob junction word ya
var junctionWordI = parse.lastJunctionWordIndex(grammar,tokens);
// be set ob head as the junction ya
head = tokens[junctionWordI];
// be get ob last word yand be identify class ya
var headWordI = tokens.length-1
var lastWord = tokens[headWordI];
var clas, otherTokens;
if (parse.wordMatch(grammar.phraseWords,lastWord))
clas = "Phrase";
else 
clas = "Type";
// su junction retrieve ob class from tokens 
// with junction and head word de 
body = 
lastJunctionRetrieve(language, junctionWordI,
headWordI,tokens,body,head,clas,partOfSpeech);
body.reverse();
}// su clause initial conditional be end ya

// if clause final then be get from end ya
if (clauseInitial === false){
// be get ob junction word ya
var junctionWordI = parse.firstJunctionWordIndex(grammar,tokens);
// be set ob head as the junction ya
head = tokens[junctionWordI];
// be get ob last word yand be identify class ya
var headWordI = 0;
var firstWord = tokens[headWordI];
var clas, otherTokens;
if (parse.wordMatch(grammar.phraseWords,firstWord))
clas = "Phrase";
else 
clas = "Type";
// su junction retrieve ob class from tokens 
// with junction and head word de 
body = 
firstJunctionRetrieve(language,
junctionWordI,headWordI,tokens,body,head, clas,partOfSpeech);
}// su clause final conditional be end ya

// set output do
if (clas) this.clas = clas;
if (body) this.body = body;
if (head) this.head = new Word(language,head);
return this;
}// end of Junction Constructor ya

/* start of junction constructor helper functions */
// su class retrieve ob class from tokens de 
function classRetrieve(language, otherTokens,clas,body,
partOfSpeech){

// be get ob an object of the class from other tokens ya
var object;
if (clas === "Phrase")
object = new Phrase(language,otherTokens);
else 
object = new Type(language,otherTokens, partOfSpeech);
// be add ob the object to body array ya
body[body.length]=object;
return body;
}// su class retrieve be end ya

function 
lastJunctionRetrieve(language,
junctionWI,headWordI,tokens,body,head,clas,partOfSpeech)
{
var lastWord = tokens[tokens.length-1];
// be set ob other tokens 
// from after junction word til last word ya
var otherTokens = tokens.slice(junctionWI+1,headWordI+1);
// su class retrieve ob class from tokens de 
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
// be set ob other tokens from before junction word ya
otherTokens = tokens.slice(0,junctionWI);
// be parse ob the class from other tokens ya
var classIndexes;
var grammar = language.grammar;
if (clas === "Phrase")
classIndexes = parse.lastPhraseIndex(grammar,otherTokens);
else if (clas === "Type")
classIndexes = parse.lastTypeIndex(grammar,otherTokens);
// if head word be not matching to last word
headWordI = classIndexes[1]-1;
var tailWordI = classIndexes[0];
var headWord = otherTokens[headWordI];
var tailWord = otherTokens[tailWordI];
if (headWord !== lastWord && clas !== "Type")
// then throw error that this word and last word not matching
throw Error(headWord + " and " + lastWord + " be not match ya");
// else if tail word be matching junction
else if (tailWord === head)
// then be junction retrieve ya
body = 
lastJunctionRetrieve(language,
tailWordI, headWordI, otherTokens, body, head,clas, partOfSpeech);
// else  be class retrieve ya
else{
otherTokens = otherTokens.slice(tailWordI,headWordI+1);
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
}
return body;
}// su junction retrieve be end ya


function 
firstJunctionRetrieve(language,
junctionWI,headWordI,tokens,body,head,clas,partOfSpeech
){
// be set ob other tokens 
// from first word til before junction word ya
var otherTokens = tokens.slice(headWordI,junctionWI);
// su class retrieve ob class from tokens de 
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
// be set ob other tokens from after junction word ya
otherTokens = tokens.slice(junctionWI+1);
// be parse ob the class from other tokens ya
var classIndexes;
var grammar = language.grammar;
if (clas === "Phrase")
classIndexes = parse.firstPhraseIndex(grammar,otherTokens);
else if (clas === "Type"){
classIndexes = parse.firstTypeIndex(grammar,otherTokens);
}
// if head word be not matching to last word
headWordI = classIndexes[0];
var tailWordI = classIndexes[1]-1;
var headWord = otherTokens[headWordI];
var tailWord = otherTokens[tailWordI];
var firstWord = tokens[0];
if (headWord !== firstWord && clas !== "Type")
// then throw error that this word and last word not matching
throw Error(headWord + " and " + firstWord + " be not match ya");
// else if tail word be matching junction
else if (tailWord === head)
// then be junction retrieve ya
body = 
firstJunctionRetrieve(language, tailWordI, headWordI, 
otherTokens, body, head,clas, partOfSpeech);
// else  be class retrieve ya
else{
otherTokens = otherTokens.slice(headWordI,tailWordI+1);
body = classRetrieve(language,
otherTokens,clas,body,partOfSpeech);
}
return body;
}// su junction retrieve be end ya

/* end of helper functions */


function junctionInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Junction(language, input,
partOfSpeech);
	else if (typeof input === "object"
		&& input.be === "Junction")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"Junction");
}
Junction.prototype.isSubset= function(language,input){
var match = junctionInputToMatch(language,input);
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
Junction.prototype.isSuperset= function(language,input){
var match = junctionInputToMatch(language,input);
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
Junction.prototype.isLike= function(language,input){
	var match = junctionInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Junction.prototype.copy = function(){
 	return new Junction(language, JSON.parse(JSON.stringify(this)));
}
Junction.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	return this.body.valueGet();
}
Junction.prototype.toString = function(format){
var joiner = ' ';
var result = new String();
// algorithm de
// for each ob element of body til second last element de
// be add ob it to result with head and joiner ya
// be add ob last element with joiner ya
var i;
var body = this.body;
var headS = new String();
if (this.head) headS = this.head.toString(format);
var clas = this.clas;
// for each ob element of body de
for (i=0;i<body.length-1;i++)
// be add ob it to result with head and joiner ya
if (clas === "Phrase")
result += body[i].toString(format) + headS + joiner;
else
result += body[i].toString(format) + joiner + headS + joiner;
// be add ob last element with joiner ya
result += body[i].toString(format);
return result;
};
Junction.prototype.toLocaleString = 
function(language, format,type, conjugationLevel){
var joiner = ' ';
var result = new String();
// algorithm de
// for each ob element of body til second last element de
// be add ob it to result with head and joiner ya
// be add ob last element with joiner ya
var i;
var body = this.body;
var headS = new String();
if (this.head) 
headS = this.head.toLocaleString(language,format,"jh", 
conjugationLevel);
// for each ob element of body de
var clas = this.clas;
for (i=0;i<body.length-1;i++)
// be add ob it to result with head and joiner ya
if (clas === "Phrase")
result += body[i].toLocaleString(language,format,type,
conjugationLevel)
+headS+joiner;
else
result += body[i].toLocaleString(language,format,type,
conjugationLevel) 
+ joiner + headS + joiner;
// be add ob last element with joiner ya
result += body[i].toLocaleString(language,format,type,
conjugationLevel) ;
return result;
}

