var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
module.exports = Type;
function Type(language,input,partOfSpeech){
	this.be = "Type";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Type"){
	if (input.type){
	this.type = input.type;
if( input.type === "mwq"){
	this.tail = new Word(language,input.tail);
	this.body = input.body;
	this.name = new Word(language,input.name);
	this.head = new Word(language,input.head);
	} 
else if (input.type === "nam"){
	this.type = input.type;
	this.body = input.body;
	this.head = new Word(language,input.head);
} else{
	this.type = input.type;
	this.body = new Word(language,input.body);
	this.head = new Word(language,input.head);
}
}
	else{
	if (input.type !== undefined)
	this.type = input.type;
	if (input.body !== undefined )
	this.body = new Word(language, input.body);
	if (input.head !== undefined)
	this.head = new Word(language, input.head);
	}
	return this;
	}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);

// algorithm de
// if type final then head word is last word
// else it is first word
// if head word is typeword then set it
// set multi word quote
// set number literal
// set single word quote
// else make all of it body
// if contains junction word return Junction 

var tokensLength = tokens.length;
var juncTokens = tokens.slice(0);
if (tokensLength === 0) // if no tokens, return them.
	return tokens;
var firstToken = tokens[0];
if (typeof firstToken === "object") // such as Quote
	return firstToken;
var headWord = new String();
var otherTokens = new Array();
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
// if type final then head word is last word
if (wordOrder.typeFinal){
var index = tokensLength-1;
headWord = tokens[index];
otherTokens = tokens.slice(0,index); 
juncTokens.splice(index-1,2); // remove used tokens
}
// else it is first word
else if (wordOrder.typeFinal === false) 
{	headWord = tokens[0];
otherTokens = tokens.slice(1); 
juncTokens.splice(0,2); // remove used tokens
}
else throw Error(wordOrder+" typeFinal order not defined");
// if contains junction word return Junction 
if ( juncTokens && juncTokens.rfind(
parse.wordMatch.curry(language.grammar.junctions))
){
var Junction = require("./junction");
return new Junction(language,tokens, partOfSpeech);
}

// if head word is typeword then set it
var grammar = language.grammar;
if (language && parse.wordMatch(grammar.typeWords, headWord)){
// set multi word quote
if (parse.wordMatch(grammar.quotes.multiWordHead, headWord)){
// head is first two words, tail is last two, body is rest
var len = tokens.length;
this.type = "mwq"; // multi word quote type
if (grammar.wordOrder.typeFinal){
this.tail = new Word(language,tokens.slice(0,1));
this.body = tokens.slice(2,len-2);
this.name = new Word(language,tokens.slice(1,2));
this.head = new Word(language,tokens.slice(len-1,len));
}
else if (grammar.wordOrder.typeFinal === false){
this.tail = new Word(language,tokens.slice(len-1,len));
this.body = tokens.slice(2,len-2);
this.name = new Word(language,tokens.slice(1,2));
this.head = new Word(language,tokens.slice(0,1));
}
}
// set number literal
else if (grammar.quotes.number === headWord){
// if big endian then reverse order of numbers
this.type = "nam";
var numberTokens = new String();
if (grammar.wordOrder.littleEndian !== true)
numberTokens = tokensAndGlyphsReverse(otherTokens);
else numberTokens = otherTokens;
this.body = numberTokens;
this.head = new Word(language, headWord); 
}
// set single word quote
else {
// if typeword is literal set type to literal
if (parse.wordMatch(grammar.quotes.literal, headWord)) 
this.type = "lit";
if (otherTokens.length >0)
this.body = new Word(language, otherTokens, partOfSpeech);
this.head = new Word(language, headWord); }
// else return all tokens as word
}
else{ this.body = new Word(language, tokens, partOfSpeech);
}
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
var result = new String();
var joiner = " ";
if (this.type === "mwq"){
if (this.tail) result += this.tail.toString()+joiner;
if (this.name) result += this.name.toString()+joiner;
if (this.body) result += this.body.join(joiner);
if (this.name) result += joiner+this.name.toString();
if (this.head) result += joiner+this.head.toString();
}
else{
if (this.body) result += this.body.toString();
if (this.head && this.body) result += joiner;
if (this.head) result += this.head.toString();
}
return result;
}
Type.prototype.valueGet = function(){
	return this.body.toString();
}
Type.prototype.toLocaleString = 
function(language, format, type, conjugationLevel){
var result = new String();
var joiner = new String();
var conj = new Object();
if (conjugationLevel >= 3) conj = language.grammar.conjugation;
if (this.body) joiner = " "; 
var wordOrder = language.grammar.wordOrder;
if (this.type === "nam" ){
if (wordOrder.littleEndian !== true)
body = tokensAndGlyphsReverse(this.body).join(joiner);
else body = (this.body).join(joiner);
result += body;
}
else if (this.body && this.type !== "mwq")
result += this.body.toLocaleString(language, format, type,
conjugationLevel);
if (this.head === undefined) return result;
// else check type order, append if true, prepend if
// false.
var typeTransl = 
this.head.toLocaleString(language, format, "th",
conjugationLevel);

if (this.type === "mwq"){
if (conj.foreignQuote) {
result += conj.foreignQuote(language,this,format);}
else{
var tail = new String();
var name = new String();
var body = new String();
if (this.tail) tail =
this.tail.toLocaleString(language,format,"th", conjugationLevel);
if (this.name) name =
this.name.toLocaleString(language,format,"th", conjugationLevel);
if (this.body) body = this.body.join(joiner);

if (language.grammar.wordOrder.typeFinal){
result =
tail+joiner+name+joiner+body+joiner+name+joiner+typeTransl;
}
else if (language.grammar.wordOrder.typeFinal === false){
 result = 
typeTransl+joiner+name+joiner+body+joiner+name+joiner+tail;
}
}
}
else{
if (language.grammar.wordOrder.typeFinal)
result += joiner + typeTransl ;
else if (language.grammar.wordOrder.typeFinal === false)
 result = typeTransl + joiner + result;
}
return result;
}

function tokensAndGlyphsReverse(tokens){
var outTokens = tokens.slice(0);
outTokens.reverse();
outTokens = outTokens.map(function(token){
return token.split("").reverse().join("");
});
return outTokens;

}
