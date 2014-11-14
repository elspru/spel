
var tokenize = require("../compile/tokenize");
//var parse = require("../compile/parse");
module.exports = Quote;
function Quote(input){
	this.be = "Quote";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Quote"){
			this.content = input.content;
			this.quoteWord = input.quoteWord;
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);
	// assume single word quote
	this.content = tokens[0];
	this.quoteWord = tokens[1];
	return this;
}
Quote.prototype.toString = function(){
	return String(this.content+" "+this.quoteWord);
}
Quote.prototype.valueGet = function(){
	return this.content;
}
function quoteInputToMatch(input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Quote(input);
	else if (input.be === "Quote")
		return input;
	else throw new TypeError(input+" not valid match");
}
Quote.prototype.isSuperset = function(input){
	var match = quoteInputToMatch(input);
	// if match is undefined then is subset
	if (match.content !== undefined
	    && !match.content.equals(this.content))
		return false;
	if (match.quoteWord !== undefined
	    && !match.quoteWord.equals(this.quoteWord))
		return false;
	return true;
}
Quote.prototype.isSubset = function(input){
	return this.equals(input);
}
Quote.prototype.isLike = function(input){
	return this.equals(input);
}
Quote.prototype.equals = function(input){
	var match = quoteInputToMatch(input);
	if (match.content === this.content
	   && match.quoteWord === this.quoteWord)
		return true;
	return false;
}
