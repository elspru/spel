"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
//var Sentence = require("./sentence");
module.exports = TopClause;
var className = "TopClause";
function TopClause(language, input){
var Sentence = require("./sentence");
this.be = className;
var tokens;
if (typeof input === "string"){
	tokens = tokenize.stringToWords(input);}
else if (typeof input === "object" && input.be === className){
if (input.tail)
this.tail = new Word(language, input.tail);
this.body = new Sentence(language, input.body);
this.head = new Word(language, input.head);
return this; }
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(JSON.stringify(input)
		+" not valid for "+this.be);
// extract quotes
tokens = parse.quotesExtract(language,tokens);
var grammar = language.grammar;

// be algorithm de
// be get ob clause word ya
//
// if clause initial
// then be get ob clause word from end 
// then be set ob other tokens ya
// if su clauseTerminator be exist then be set ob it
// and be remove from otherTokens
//
// if clause final
// then be get ob clause word from start
// then be set ob other tokens ya
// if su clauseTerminator be exist then be set ob it
// and be remove from otherTokens
//
// be set this parts

// be get ob clause word ya
var clauseInitial = grammar.wordOrder.clauseInitial;
var clauseWord, otherTokens, clauseWordI, newSlice;
var clause;
// if clause initial 
if (clauseInitial){
// then be get ob clause word from end 
// then be set ob other tokens ya
clauseWordI = parse.lastTopClauseWordIndex(grammar, tokens);
var nextSlice = tokens.slice(0,clauseWordI+1);
clause = parse.topClause(grammar,nextSlice);
clauseWord = clause[clauseWordI];
otherTokens = clause.slice(0,clauseWordI);
// if clauseTerminator exists set it
// and remove from otherTokens
//if (parse.wordMatch(grammar.clauseTerminator, clause[0])){
//this.tail=new Word(language, clause[0]);
//otherTokens.shift();
//}
}// end of clause initial conditional ya

// if clause final
else {
// then be get ob clause word from start
// then be set ob other tokens ya
clauseWordI = parse.firstTopClauseWordIndex(grammar, tokens);
nextSlice = tokens.slice(clauseWordI);
clause = parse.topClause(grammar,nextSlice);
var clauseTermI = clause.length-1;
clauseWord = clause[0];
otherTokens = clause.slice(clauseWordI+1);
// if clauseTerminator exists set it
// and remove from otherTokens
//if (parse.wordMatch(grammar.clauseTerminator,
//			clause[clauseTermI])){
//	this.tail=new 
//	Word(language, clause[clauseTermI]);
//	otherTokens.pop();
//}
}
// set this parts
this.body = new Sentence(language, otherTokens);
this.head = new Word(language, clauseWord);
return this;
}
TopClause.prototype.toString = function(format){
var joiner = ' ';
var result = new String();
var clauseTerm = this.tail;
var sentence = this.body;
var clauseWord = this.head;
if (clauseTerm) result += clauseTerm.toString(format)+joiner;
if (sentence) result += sentence.toString(format);
if (clauseWord) 
result += clauseWord.toString(format) + joiner ;
return result;
};
TopClause.prototype.toLocaleString = 
function(language,format,type,conjugationLevel){
	var joiner = ' ';
	var result = new String();
	var clauseTerm = this.tail;
	var sentence = this.body;
	var clauseWord = this.head;
	if (language.grammar.wordOrder.clauseInitial){
	if (clauseTerm) result += clauseTerm.toLocaleString(
		language,format,"jh",conjugationLevel)+joiner;
	if (sentence) result += sentence.toLocaleString(
			language,format,type,conjugationLevel);
	if (clauseWord) result += clauseWord.toLocaleString(
		language,format,"jh",conjugationLevel) + joiner ;
	}
	else {
	if (clauseWord) result += clauseWord.toLocaleString(
		language,format,"jh",conjugationLevel)+joiner;
	if (sentence) result += sentence.toLocaleString(
		language,format,type,conjugationLevel);
	if (clauseTerm) result += clauseTerm.toLocaleString(
		language,format,"jh",conjugationLevel)+joiner;
	}
	return result;
};
TopClause.prototype.isLike= function(language,input){
	var match = topClauseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
TopClause.prototype.isSubset= function(language,input){
var match = topClauseInputToMatch(language,input);
if (this.head.isSubset(language, match.head)
	&& this.body.isSubset(language,match.body))
		return true;
return false;
};
TopClause.prototype.isSuperset= function(language,input){
try{
var match = topClauseInputToMatch(language,input);
}catch(e){ return false;}
var result = true;
if (match.body && !this.body || match.head && ! this.head)
result =false;
else if (this.head && match.head
&& !this.head.isSuperset(language,match.head))
result = false;
else if (this.body && match.body
&& !this.body.isSuperset(language,match.body))
result = false;
return result;
};

function topClauseInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new TopClause(language, input);
	else if (typeof input === "object"
		&& input.be === className)
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+className);
}
