
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Sentence = require ("./sentence");
var err = require("../lib/error");
module.exports = Text;
/// su sentence be object ya
function Text(language, input,title) {
	this.be = "Text";
	var tokens, i;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);
	}
	else if (Array.isArray(input)) tokens = input;
	else if (typeof input === "object"
	    && this.be === "Text"){
		// assume json object
		this.title = input.title;
		this.sentences = new Array();
		for (i=0; i< input.sentences.length; i++)
			this.sentences[i]=new Sentence(language, input.sentences[i]);
		return this;
	}
	else throw new TypeError(input+" is not a valid Phrase input");
	this.title = title;
	//this.string = tokens.join("");
	//this.tokens = tokens;
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	var previousTokens = tokens;
	var previousLength = 0;
	var sentences = new Array();
	var sentenceIndex = 0;
	var sentence,
	    firstSentence;
	while (previousTokens.length>0 &&
		previousTokens.length != previousLength){
	// avoid infinite loops from starter garbage
		previousLength = previousTokens.length;
		firstSentence = parse.firstSentence(previousTokens);
		if (firstSentence.length === 0)
			break;
		sentence  = new Sentence(language, firstSentence);
		sentences[sentenceIndex] = sentence;
		sentenceIndex++;
		previousTokens = previousTokens.slice(firstSentence.length,
				previousTokens.length);
	}
	//phrases.reverse();
	this.sentences = sentences;
	return this;
}
Text.prototype.copy = function(){
 	return new Text(language, JSON.parse(JSON.stringify(this)));
}
/// su sentenceGet be get bo sentence by index ya
Text.prototype.sentenceGet = sentenceGet;
function sentenceGet(input){
	if (typeof input === "number")
		return this.byIndexSentenceGet(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindGet(input);
	// else
	throw new TypeError("unsupported type:"+input);
}

Text.prototype.byIndexSentenceGet = byIndexSentenceGet;
function byIndexSentenceGet(index){
	err.indexCheck(this.sentences.length,index);
	return this.sentences[index];
}
function sentenceInputToMatch(language, input){
	if (input === undefined)
		throw new TypeError("undefined input");
	if (typeof input === "string"||
		Array.isArray(input))
		 return new Sentence(language,input);
	else if (input.be === "Sentence")
		return input;
	else throw new TypeError("unsupported type:"+input);
}
Text.prototype.indexOf = sentenceFindGet;
Text.prototype.sentenceFindGet = sentenceFindGet;
function sentenceFindGet(language,input){
	var match = sentenceInputToMatch(language,input);
	// reverse iterate through sentences or rfind
	// if isLike match, then return
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(match)});
	return this.byIndexSentenceGet(index);
}
// select like in SQL returns all matches as array
Text.prototype.select = sentenceFindAllGet;
function sentenceFindAllGet(language,input){
	var match = sentenceInputToMatch(language,input);
	// filter sentences with
	// if isLike match, then return
	var sentences = this.sentences.filter(function(sentence){
		return sentence.isLike(match)});
	var newText = new Text(language, sentences.join("\n"));
	return newText;
}
Text.prototype.sentenceDelete = function(input){
	if (typeof input === "number")
		return this.byIndexSentenceDelete(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindDelete(input);
	// else
	throw new TypeError("unsupported type:"+input);
}
Text.prototype.sentenceFindDelete = sentenceFindDelete;
function sentenceFindDelete(language,input){
	var match = sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(match)});
	return this.byIndexSentenceDelete(index);
}
Text.prototype.byIndexSentenceDelete = byIndexSentenceDelete;
function byIndexSentenceDelete (index){
	err.indexCheck(this.sentences.length,index);
	// remove phrase from array.
	var newText = this;//.copy();
	newText.sentences.splice(index,1);
	return newText;
}
Text.prototype.sentenceUpdate = function(input,replacement){
	if (typeof input === "number")
		return this.byIndexSentenceUpdate(input,replacement);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindUpdate(input,replacement);
	// else
	throw new TypeError("unsupported type:"+input+" "+replacement);
}
Text.prototype.sentenceFindUpdate = sentenceFindUpdate;
function sentenceFindUpdate(language,input,replacement){
	var match = sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(match)});
	if (index === null){
		throw Error("no match found for "+input+
				"\n in "+this.title);
	}
	return this.byIndexSentenceUpdate(index,replacement);
}
Text.prototype.byIndexSentenceUpdate = byIndexSentenceUpdate;
function byIndexSentenceUpdate(language,index,replacement){
	err.indexCheck(this.sentences.length,index);
	var sentence = sentenceInputToMatch(language,replacement);
	// remove phrase from array.
	var newText = this;//.copy();
	newText.sentences.splice(index,1,sentence);
	return newText;
}
Text.prototype.toString = function(){
	var string = new String();
	var sentences = this.sentences;
	var sentencesLength = sentences.length;
	var i;
	for (i=0; i<sentencesLength; i++){
		string += sentences[i].toString();}
	return string;//this.string;
};
Text.prototype.toLocaleString = function(language){
	var string = new String();
	var sentences = this.sentences;
	var sentencesLength = sentences.length;
	var i;
	for (i=0; i<sentencesLength; i++){
		string += sentences[i].toLocaleString(language);}
	return string;//this.string;
};
