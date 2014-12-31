
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
//var Sentence = require("./sentence");
module.exports = Clause;
var className = "Clause";
// Clause{
// "be":"Clause",
// "clauseTerm":Word,
// "sentence":Sentence,
// "clauseWord":Word}
//
function Clause(language, input){
var Sentence = require("./sentence");
	this.be = className;
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === className){
			//if (input.tail)
			//this.tail = 
			//new Word(language, input.tail);
			this.body = 
			new Sentence(language, input.body);
			this.head = 
			new Word(language, input.head);
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	// parse last phrase
	var grammar = language.grammar;
	var clauseInitial = grammar.wordOrder.clauseInitial;
	var clauseWord, otherTokens, clauseWordI;
	var clause;
	// if clause initial 
	if (clauseInitial){
	clauseWordI = tokens.length-1;
	otherTokens = tokens.slice(0,clauseWordI+1);
	clause = parse.adjacentClause(grammar,otherTokens);
	clauseWord = clause[clauseWordI];
	otherTokens = clause.slice(0,clauseWordI);
	// if clauseTerminator exists set it
	// and remove from otherTokens
	if (parse.wordMatch(grammar.clauseTerminator,
				clause[0])){
		//this.tail=new 
		//	Word(language, clause[0]);
		otherTokens.shift();
	}
	}
	// if clause final
	else {
		clauseWordI = 0;
		clause = parse.adjacentClause(grammar,tokens,
				clauseWordI);
		clauseTermI = clause.length-1;
		clauseWord = clause[0];
		otherTokens = clause.slice(clauseWordI+1);
		// if clauseTerminator exists set it
		// and remove from otherTokens
		if (parse.wordMatch(grammar.clauseTerminator,
					clause[clauseTermI])){
			//this.tail=new 
			//Word(language, clause[clauseTermI]);
			otherTokens.pop();
		}
	}
	this.body = new Sentence(language, otherTokens);
	this.head = new Word(language, clauseWord);
	////this.clause = new Sentence();
	return this;
}
Clause.prototype.toString = function(format){
	var joiner = ' ';
	var result = new String();
	var clauseTerm = undefined;//this.tail;
	var sentence = this.body;
	var clauseWord = this.head;
	if (clauseTerm) 
		result += clauseTerm.toString(format)+joiner;
	if (sentence) 
		result += sentence.toString(format);
	if (clauseWord) result += clauseWord.toString(format);
	return result;
};
Clause.prototype.toLocaleString = function(language,format){
	var joiner = ' ';
	var result = new String();
	var clauseTerm = undefined; //this.tail;
	var sentence = this.body;
	var clauseWord = this.head;
	if (language.grammar.wordOrder.clauseInitial){
	if (clauseTerm) result += clauseTerm.toLocaleString(
			language,format,"lh")+joiner;
	if (sentence) result += sentence.toLocaleString(
			language,format);
	if (clauseWord) result += clauseWord.toLocaleString(
			language,format,"lh");
	}
	else {
	if (clauseWord) result += clauseWord.toLocaleString(
			language,format,"lh")+joiner;
	if (sentence) result += sentence.toLocaleString(
			language,format);
	if (clauseTerm) result += clauseTerm.toLocaleString(
			language,format,"lh")+joiner;
	}
	return result;
};
Clause.prototype.isLike= function(language,input){
	var match = clauseInputToMatch(language,input);
	if (this.head.isLike(language,match.head)
		&& this.body.isLike(language,match.body))
		return true;
	return false;
};
Clause.prototype.isSubset= function(language,input){
	var match = clauseInputToMatch(language,input);
	if (this.head.isSubset(language, match.head)
		&& this.body.isSubset(language,match.body))
		return true;
	return false;
};
Clause.prototype.isSuperset= function(language,input){
var match = clauseInputToMatch(language,input);
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
function clauseInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Clause(language, input);
	else if (typeof input === "object"
		&& input.be === className)
		return input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid match for "+className);
}
