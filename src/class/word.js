var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
//var emitter = require("events").EventEmitter;
module.exports = Word;
function Word(language,input){
var tokens;
this.be = "Word";
if (typeof input === "string")
tokens = tokenize.stringToWords(input);
else if (typeof input === "object" && input.be === "Word"){
this.head = input.head;
if (input.body) this.body = input.body;
return this;
}
else if (Array.isArray(input)) tokens = input; 
else throw new TypeError(JSON.stringify(input)
+" unknown to "+this.be);

// algorithm de
// if verb final then head word is last word
// yand body is rest of tokens
// else if verb initial then head word is first word
// yand body is rest of tokens reversed

var tokensLength = tokens.length;
var lastTokenIndex = tokensLength-1;
var transDict = language.dictionary.toMwak;
var verbFinal = language.grammar.wordOrder.verbFinal;
var headWord, bodyWords, otherTokens;
// if verb final then head word is last word
if (verbFinal === true && tokensLength > 0){
headWord = translate.word(transDict, tokens[lastTokenIndex]);
// yand body is rest of tokens
if (tokensLength >1){
otherTokens = tokens.slice(0,lastTokenIndex);
bodyWords = translate.array(transDict,otherTokens); }}
// else if verb initial then head word is first word
else if (verbFinal === false && tokensLength > 0){
headWord = translate.word(transDict, tokens[0]);
// yand body is rest of tokens reversed
if (tokensLength >1){
otherTokens = tokens.slice(1);
otherTokens.reverse();
bodyWords = translate.array(transDict,otherTokens); }}

// be set ob this
if (bodyWords && bodyWords.length >0)
this.body = bodyWords;
if (headWord && headWord.length >0)
this.head = headWord;
}// end of Word constructor

Word.prototype.copy = function(){
return new Word(language, JSON.parse(JSON.stringify(this)));
}
function wordInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Word(language, input);
	else if (typeof input === "object"
		&& input.be === "Word")
		return input;
	else if (input === undefined) return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Word");
}
Word.prototype.isSuperset = function(language,input){
	var match = wordInputToMatch(language,input);
	if (match === undefined) return true;
	if (match !== undefined
	   && this.head !== match.head)
		return false;
	if (match.body !== undefined
	   && !this.body.isSuperset(match.body))
		return false;
	return true;
}
Word.prototype.isSubset = function(language,input){
}
Word.prototype.isLike = function(language,input){
	return this.isSuperset(language,input);
}

Word.prototype.toString = function(){ 
	var string = new String();
	if (this.body !== undefined)
		string = this.body.join(" ")+" ";
	if (this.head !== undefined)
	string += this.head;
	return string;
};
Word.prototype.toLocaleString = function(language,format,type){
var translation = new String();
var joiner = " ";
var verbFinal = language.grammar.wordOrder.verbFinal;
var dict = language.dictionary.fromMwak;

// algorithm de
// be add ob body to output ya
// if verb initial then reverse body words ya
// be translate ob body words yand be add to translation ya
// be add ob head to output
// syntax formating and color-grapheme synesthesia

// be add ob body to output
if (this.body !== undefined){
var i, translArray, translWord, adword;
var bodyWords = this.body;
// if verb initial then reverse body words ya
if (verbFinal === false)
bodyWords.reverse();
// be translate ob body words yand be add to translation ya
translArray = translate.array(dict,bodyWords);
for (i = 0; i < translArray.length; i++){
translWord = translArray[i];
translation+= translWord+joiner;
}}

// be add ob head to output
var head = this.head;
var transLemma;
if (head === undefined) head = "";
if (false && typeof head === "object")
transl = head.toLocaleString(language,format);
else transLemma = translate.word(dict,head);
if (verbFinal) translation += transLemma;
else if (verbFinal === false){
if (translation.length >0)
translation = transLemma + joiner + translation;
else translation = transLemma;}

// syntax formating and color-grapheme synesthesia
if (format){
if (type && format.typeGlyphsTransform)
translation = format.typeGlyphsTransform(translation,type);
else if (format.glyphsTransform)
translation = format.glyphsTransform(translation);
}

return translation;
}
