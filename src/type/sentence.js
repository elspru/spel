
"use strict"
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Phrase = require("./phrase");
var err = require("../lib/error");
module.exports = Sentence;
/// su sentence be object ya
function Sentence(language, input) {
	this.be = "Sentence";
	var tokens, i;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Sentence"){
			this.phrases = new Array();
			for (i=0; i< input.phrases.length; i++)
				this.phrases[i]=new Phrase(language, input.phrases[i]);
			this.endWords = input.endWords;
			return this;
		}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(input+" is not a valid Phrase input");
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	//if (!tokenize.isTokens(tokens))
	//	throw new TypeError("su Phrase be need bo tokens ya");
	//this.string = tokens.join("");
	//this.tokens = tokens;
// su sentence words be everytoken which be after bo last case ya
	var lastCaseIndex = parse.lastCaseIndex(tokens);
	if (lastCaseIndex === -1) parse.phraseError(tokens);
	lastCaseIndex++;
			
	var lastWords = tokens.slice(lastCaseIndex,tokens.length);
	var previousTokens = tokens.slice(0,lastCaseIndex)
	var previousLength = 0;
	var phrases = new Array();
	var lastPhrase, phrase;
	while (previousTokens.length>0 &&
		previousTokens.length != previousLength){
	// avoid infinite loops from starter garbage
		previousLength = previousTokens.length;
		lastPhrase = parse.lastPhrase(previousTokens);
		if (lastPhrase.length === 0)
			break;
		phrase =  new Phrase(language, lastPhrase);
		phrases.push(phrase);
		previousTokens = previousTokens.slice(0,
				previousTokens.length-lastPhrase.length)
	}
	phrases.reverse();
	this.phrases = phrases;
	this.endWords = lastWords;
	return this;
}
exports.sentenceInputToMatch = sentenceInputToMatch;
function sentenceInputToMatch(language, input){
	if (typeof input === "string"||
		Array.isArray(input))
		 return new Sentence(language, input);
	else if (input && input.be === "Sentence")
		return input;
	else throw new TypeError(input+" not valid match for "+"Sentence");
}
Sentence.prototype.isSubset = function(language,input){
	var match = sentenceInputToMatch(language,input);
	if (!this.endWords.isSubset(match.endWords))
		return false;
	// check phrases are a subset
	var thisPhrases = this.phrases;
	var matchPhrases = match.phrases;
	var result = thisPhrases.every(function(thisPhrase){
		if (!matchPhrases.some(function(phrase){
			return thisPhrase.isSubset(language,phrase)}))
			return false;
		return true;
	});
	return result;
}
Sentence.prototype.isSuperset= function(language,input){
	var match = sentenceInputToMatch(language,input);
	if (!this.endWords.isSuperset(match.endWords))
		return false;
	// check phrases are a subset
	var thisPhrases = this.phrases;
	var matchPhrases = match.phrases;
	var result = matchPhrases.every(function(matchPhrase){
		if (!thisPhrases.some(function(phrase){
				//console.log("phrase ")
				//console.log(phrase);
				//console.log("match "+matchPhrase);
				return phrase.isSuperset(language,matchPhrase)
			}))
			return false;
		return true;
	});
	return result;
}
Sentence.prototype.isLike = function(language,input){
	var match = sentenceInputToMatch(language,input);
	if (this.isSuperset(language,match) || this.isSubset(language,match))
		return true;
	return false;
}
Sentence.prototype.indexOf = phraseIndexFind;
Sentence.prototype.phraseIndexFind = phraseIndexFind;
function phraseIndexFind(language,cases){
	var caseWord;
	if (Array.isArray(cases)){
		caseWord = cases;
	}else if (typeof cases === "string"){
		caseWord = tokenize.stringToWords(cases);
	}else throw new TypeError("unsupported type:"+cases);
	var i,
	    phrase,
	    phrases = this.phrases,
	    length = phrases.length;
	for (i=0;i<length;i++){
		phrase = phrases[i];
		if(phrase.caseWord.isLike(language,caseWord))
			return i;
	}
	return -1;
}
/// su phraseGet be get bo phrase by cases ya

Sentence.prototype.phraseGet = phraseGet;
function phraseGet(language, input){
	if (typeof input === "number")
		return this.byIndexPhraseGet(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.phraseFindGet(language,input);
	// else
	throw new TypeError(JSON.stringify(input)
			+" not valid match for "+"phraseGet");
}
Sentence.prototype.phraseFindGet = phraseFindGet;
function phraseFindGet(language,cases){
	var index = this.indexOf(language,cases);
	if (index === -1)
		throw new RangeError(cases +" not found in "+this);
	return this.byIndexPhraseGet(index);
}
Sentence.prototype.byIndexPhraseGet = byIndexPhraseGet;
function byIndexPhraseGet(index){
	err.indexCheck(this.phrases.length,index);
	return this.phrases[index];
}
/// 
Sentence.prototype.phraseFindDel = phraseFindDelete;
Sentence.prototype.phraseFindDelete = phraseFindDelete;
function phraseFindDelete(cases){
	var index = this.indexOf(cases);
	if (index === -1) /// if none
		return this.sentence();/// return copy
	return this.phraseDel(index);
}
Sentence.prototype.byIndexPhraseDelete = byIndexPhraseDelete;
function byIndexPhraseDelete(index){
	err.indexCheck(this.phrases.length,index);
	// remove phrase from array.
	var sentence = this.copy();
	sentence.phrases.splice(index,1);
	return sentence;
}
Sentence.prototype.phraseDelete = phraseDelete;
Sentence.prototype.phraseDel = phraseDelete;
function phraseDelete(input){
	if (typeof input === "number")
		return this.byIndexPhraseDelete(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.phraseFindDelete(input);
	// else
	throw new TypeError("unsupported type:"+input);
}
Sentence.prototype.phraseSet = function(input, replacement){
	if (typeof input === "number")
		return this.byIndexPhraseSet(input,replacement);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.phraseFindSet(input,replacement);
	// else
	throw new TypeError("unsupported type:"+input+" "+replacement);
}
Sentence.prototype.phraseFindSet = function(match,replacement){
	var index = this.indexOf(match);
	return this.byIndexPhraseSet(index,replacement);
}
Sentence.prototype.byIndexPhraseSet = function(index,replacement){
	err.indexCheck(this.phrases.length,index);
	var phrase;
	if (typeof replacement === "string"
			|| Array.isArray(replacement))
		phrase = new Phrase(language, replacement);
	else if (replacement.be == "Phrase")
		phrase = replacement;
	else throw new TypeError("unrecognized type");
	// remove phrase from array.
	var sentence = this.copy();
	sentence.phrases.splice(index,1,phrase);
	return sentence;
}
Sentence.prototype.copy = function(){
 	return new Sentence(language, JSON.parse(JSON.stringify(this)));
}
Sentence.prototype.toString = function(){
	var joiner = '';
	var ender = '';
	var endWords = this.endWords;
	if (tokenize.isWords(endWords)){
		joiner = " ";
		ender = '\n'
	}
	var string = new String();
	var phrases = this.phrases;
	var phrasesLength = phrases.length;
	var i;
	for (i=0; i<phrasesLength; i++)
		string += phrases[i].toString();
	string = string.concat(endWords.join(joiner),ender);
	return string;
};
Sentence.prototype.toLocaleString = function(language){
	var joiner = ' ';
	var ender = '\n';
	var endWords = this.endWords;
	//if (tokenize.isWords(endWords)){
	//	joiner = " ";
	//	ender = '\n'
	//}
	var string = new String();
	var phrases = this.phrases;
	var phrasesLength = phrases.length;
	var i;
	for (i=0; i<phrasesLength; i++)
		string += phrases[i].toLocaleString(language);
	//console.log(endWords);
	if (endWords !== undefined)
	string = string.concat(endWords.join(joiner));
	string += ender;
	return string;
};
