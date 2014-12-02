
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
			if (input.clauseTerm)
			this.clauseTerm = 
			new Word(language, input.clauseTerm);
			this.sentence = 
			new Sentence(language, input.sentence);
			this.clauseWord = 
			new Word(language, input.clauseWord);
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
		this.clauseTerm=new 
			Word(language, clause[0]);
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
			this.clauseTerm=new 
			Word(language, clause[clauseTermI]);
			otherTokens.pop();
		}
	}
	this.sentence = new Sentence(language, otherTokens);
	this.clauseWord = new Word(language, clauseWord);
	////this.clause = new Sentence();
	return this;
}
Clause.prototype.toString = function(format){
	var joiner = ' ';
	var result = new String();
	var clauseTerm = this.clauseTerm;
	var sentence = this.sentence;
	var clauseWord = this.clauseWord;
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
	var clauseTerm = this.clauseTerm;
	var sentence = this.sentence;
	var clauseWord = this.clauseWord;
	if (language.grammar.wordOrder.clauseInitial){
	if (clauseTerm) result += clauseTerm.toLocaleString(
			language,format);
	if (sentence) result += sentence.toLocaleString(
			language,format);
	if (clauseWord) result += clauseWord.toLocaleString(
			language,format);
	}
	else {
	if (clauseWord) result += clauseWord.toLocaleString(
			language,format)+joiner;
	if (sentence) result += sentence.toLocaleString(
			language,format);
	if (clauseTerm) result += clauseTerm.toLocaleString(
			language,format)+joiner;
	}
	return result;
};
