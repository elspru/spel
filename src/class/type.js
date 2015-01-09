var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
module.exports = Type;
function Type(language,input){
	this.be = "Type";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Type"){
	if (input.body !== undefined && input.type !== "lit")
	this.body = new Word(language, input.body);
	if (input.body !== undefined && input.type === "lit")
	this.body = new Word(language, input.body);
	if (input.head !== undefined)
	this.head = new Word(language, input.head);
	return this;
	}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);

// algorithm de
// if contains junction word return Junction 
// if type final then head word is last word
// else it is first word
// if head word is typeword then set it

var tokensLength = tokens.length;
if (tokensLength === 0) // if no tokens, return them.
	return tokens;
var firstToken = tokens[0];
if (typeof firstToken === "object") // such as Quote
	return firstToken;
// if contains junction word return Junction 
if (tokens.rfind(parse.wordMatch.curry(
language.grammar.junctions))){
console.log(tokens);
var Junction = require("./junction");
return new Junction(language,tokens);
}
var headWord = new String();
var otherTokens = new Array();
// if type final then head word is last word
if (language.grammar.wordOrder.typeFinal){
var index = tokensLength-1;
headWord = tokens[index];
otherTokens = tokens.slice(0,index); }
// else it is first word
else {	headWord = tokens[0];
otherTokens = tokens.slice(1); }

// if head word is typeword then set it
var grammar = language.grammar;
if (language && parse.wordMatch(grammar.typeWords, headWord)){
// if typeword is literal set type to literal
if (parse.wordMatch(grammar.quotes.literal, headWord)){
this.type = "lit";
this.body = new Word(language, otherTokens);
this.head = new Word(language, headWord); }
else {
this.body = new Word(language, otherTokens);
this.head = new Word(language, headWord); }}
// else return all tokens as word
else this.body = new Word(language, tokens);
return this;
}// end of Type constructor

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
	//// if match is undefined then is subset
	if (match.body !== undefined
	    && !match.body.isSuperset(language, this.body)){
		return false;}
	if (match.head !== undefined
	    && !match.head.isSuperset(language, this.head)){
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
	if (match.body === this.body
	   && match.head === this.head)
		return true;
	return false;
}
Type.prototype.toString = function(){
	if (this.head === undefined) return this.body.toString();
	return String(this.body.toString()+" "+this.head.toString());
}
Type.prototype.valueGet = function(){
	return this.body.toString();
}
Type.prototype.toLocaleString = function(language, format){
	var result = 
		this.body.toLocaleString(language, format);
	if (this.head === undefined) 
		return result;
	// else check type order, append if true, prepend if
	// false.
	var joiner = " ";
	var typeTransl = 
	this.head.toLocaleString(language, format, "th");
	if (language.grammar.wordOrder.typeFinal)
	  result += joiner + typeTransl ;
	else result = typeTransl + joiner + result;
	return result;
	
}
