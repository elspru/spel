
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
	else if (typeof input === "object"
		&& input.be === "Phrase"){
			if (input.clause)
			this.clause = new Clause(
					language,input.clause);
		        if (typeof input.content === "object"
				&& input.content.be === "Type")
			this.content = new Type(
				language, input.content);
			else  this.content = input.content;
			this.caseWord = new Word(language, 
					input.caseWord);
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	// parse last phrase
	var grammar = language.grammar;
	var wordOrder = grammar.wordOrder;
	var lastPhrase;
	if (wordOrder.clauseInitial)
	lastPhrase = parse.lastPhrase(grammar,tokens);
	else lastPhrase = parse.firstPhrase(grammar,tokens);
	// if postpositional last word is case
	// if prepositional first word is case
	var caseWordIndex = null;
	var otherTokens = new Array();
	if (language.grammar.wordOrder.postpositional){
	caseWordIndex = lastPhrase.length-1;
	otherTokens = lastPhrase.slice(0,caseWordIndex);
	}
	else {caseWordIndex = 0;
		otherTokens = lastPhrase.slice(caseWordIndex+1);
	}
	var clause = parse.adjacentClauseIndex(language.grammar,
			otherTokens);
	if (clause){
	this.clause = new Clause(language, 
			otherTokens.slice(clause[0],clause[1]));
	otherTokens.splice(clause[0],
			(clause[1]-clause[0]));
	}
	this.content = new Type(language, otherTokens);
	var caseWord = new Word(language, tokens[caseWordIndex]);
	this.caseWord = caseWord;
	////this.clause = new Sentence();
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
	if (this.caseWord.isSubset(language, match.caseWord)
		&& this.content.isSubset(language,match.content))
		return true;
	return false;
};
Phrase.prototype.isSuperset= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.caseWord.isSuperset(language,match.caseWord)
		&& this.content.isSuperset(language,match.content))
		return true;
	return false;
};
Phrase.prototype.isLike= function(language,input){
	var match = phraseInputToMatch(language,input);
	if (this.caseWord.isLike(language,match.caseWord)
		&& this.content.isLike(language,match.content))
		return true;
	return false;
};
Phrase.prototype.copy = function(){
 	return new Phrase(language, JSON.parse(JSON.stringify(this)));
}
Phrase.prototype.valueGet = function(){
	// returns content
	// or if is quote, then contents of quote
	return this.content.valueGet();
}
Phrase.prototype.toString = function(format){
	var joiner = ' ';
	var content,result;
	var result = new String();
	if (this.clause)
		result+= this.clause.toString() + joiner;
	if (typeof this.content === "object")
		content = this.content.toString();
	else content = this.content;
	if (Array.isArray(content) 
		&& content.length>1
		&& tokenize.isTokens(content))
		joiner = '';
	if (content)
	result += content.toString() + joiner;
	if (this.caseWord)
	result += this.caseWord.toString() +joiner;
	return result;
};
Phrase.prototype.toLocaleString = function(language, format){
	var joiner = ' ';
	var content;
	var result = new String();
	var clause = new String();
	if (this.clause)
	clause = this.clause.toLocaleString(language, format);
	if (typeof this.content === "object")
		content = this.content.toLocaleString(language);
	else content = this.content;
	if (content) content += joiner;
	var caseWord = this.caseWord.toLocaleString(language);
	var position = new String();
	var wordOrder = language.grammar.wordOrder;
	if (wordOrder.postpositional)
	       positionPhrase = content+caseWord+joiner;
	else positionPhrase = caseWord+joiner+content
	if (wordOrder.clauseInitial===true)
		result = clause + joiner + positionPhrase;
	else result = positionPhrase + clause;
	return result;
};
