var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
//var Quote = require("./quote");
//var parse = require("../compile/parse");
module.exports = Type;
function Type(language,input){
	this.be = "Type";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Type"){
			if (input.content !== undefined)
			this.content = new Word(language, input.content);
			if (input.typeWord !== undefined)
			this.typeWord = new Word(language, input.typeWord);
			return this;
	}
	//} else if (typeof input === "object"
	//	&& input.be === "Quote")
	//		return new Quote(input);
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);

	var tokensLength = tokens.length;
	if (tokensLength === 0) // if no tokens, return them.
		return tokens;
	var firstToken = tokens[0];
	if (typeof firstToken === "object") // such as Quote
		return firstToken;
	var lastWord = tokens[tokensLength-1];
	// if last word is typeword then set it
	if (language 
	   && parse.wordMatch(language.grammar.typeWords,lastWord)){
		this.content = new Word(language, tokens.slice(0,tokensLength-1));
		this.typeWord = new Word(language, lastWord);
	}
	// else return all tokens as word
	else this.content = new Word(language, tokens);
	//else this.typeWord = undefined;
	return this;
}
function typeInputToMatch(language, input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Type(language, input);
	else if (input.be === "Type")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Type");
}
Type.prototype.isSuperset = function(language, input){
	var match = typeInputToMatch(language, input);
	//console.log("this ")
	//console.log(this.content);
	//console.log(this.typeWord);
	//console.log("match ");
	//console.log(match.content);
	//console.log(match.typeWord);
	//// if match is undefined then is subset
	if (match.content !== undefined
	    && !match.content.isSuperset(language, this.content)){
	//	    console.log("content false");
		return false;}
	if (match.typeWord !== undefined
	    && !match.typeWord.isSuperset(language, this.typeWord)){
	//	console.log("typeword false");
		return false;}
	return true;
}
Type.prototype.isSubset = function(language, input){
	return this.equals(language, input);
}
Type.prototype.isLike = function(language, input){
	return this.equals(language, input);
}
Type.equals = function(language, input){
	var match = typeInputToMatch(language, input);
	if (match.content === this.content
	   && match.typeWord === this.typeWord)
		return true;
	return false;
}
Type.prototype.toString = function(){
	if (this.typeWord === undefined) return this.content.toString();
	return String(this.content.toString()+" "+this.typeWord.toString());
}
Type.prototype.valueGet = function(){
	return this.content.toString();
}
Type.prototype.toLocaleString = function(language){
	if (this.typeWord === undefined) 
		return this.content.toLocaleString(language);
	return String(this.content.toLocaleString(language)+" "
		+this.typeWord.toLocaleString(language));
}
