
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Quote = require("./quote");
var Type = require("./type");
var Word = require("./word");
module.exports = Phrase;
function Phrase(language, input){
	this.be = "Phrase";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Phrase"){
		        if (typeof input.content === "object"
				&& input.content.be === "Type")
				this.content = new Type(language, input.content);
			//else if (typeof input.content === "object"
			//	&& input.content.be === "Quote")
			//	this.content = new Quote(input.content);
			else  this.content = input.content;
			this.caseWord = new Word(language, input.caseWord);
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	//if (!tokenize.isTokens(tokens))
	//	throw new TypeError("su Phrase be need bo tokens ya");
	//this.string = tokens.join("");
	//this.tokens = tokens;
	//this.words = tokens.filter(isWord);
	//if (tokenize.isWords(phrase)){
	//this.string = input.join("");
	//this.tokens = input.;
	//this.words = input.filter(isWord);
	//}
	var lastWordIndex = parse.lastWordIndex(tokens);
	//var lastWord = tokens[lastWordIndex];//
	var lastWord = new Word(language, tokens[lastWordIndex]);
	var previousTokens = tokens.slice(0,lastWordIndex)
	this.content = new Type(language, previousTokens);//previousTokens;
	this.caseWord = lastWord;
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
Phrase.prototype.toString = function(){
	var joiner = ' ';
	var content;
	if (typeof this.content === "object")
		content = this.content.toString();
	else content = this.content;
	if (Array.isArray(content) 
		&& content.length>1
		&& tokenize.isTokens(content))
		joiner = '';
	var string = content.toString()
		.concat(joiner,this.caseWord.toString(),joiner);
	return string;
};
Phrase.prototype.toLocaleString = function(language){
	var joiner = ' ';
	var content;
	if (typeof this.content === "object")
		content = this.content.toLocaleString(language);
	else content = this.content;
	//if (Array.isArray(content) 
	//	&& content.length>1
	//	&& tokenize.isTokens(content))
	//	joiner = '';
	//var contentString = content.toString();
	var string = content .concat(joiner,
			this.caseWord.toLocaleString(language),joiner);
	return string;
};
