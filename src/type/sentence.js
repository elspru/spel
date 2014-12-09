"use strict"
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
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
		this.phrases[i]=
		new Phrase(language, input.phrases[i]);
	if (input.endWords)
	this.endWords= new Word(language, input.endWords);
	if (input.mood !== undefined)
	this.mood = new Word(language, input.mood);
	return this;
	}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(input
			+" is not a valid Phrase input");
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	//if (!tokenize.isTokens(tokens))
	//	throw new TypeError("su Phrase be need bo tokens ya");
	//this.string = tokens.join("");
	//this.tokens = tokens;
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var lastCaseIndex = parse.lastCaseIndex(grammar, tokens);
if (lastCaseIndex === -1) parse.phraseError(grammar,tokens);
lastCaseIndex++;
var lastWord = undefined, 
    otherTokens = undefined, 
    mood = undefined;		
// if postpositional, last words of sentence are at end
if (wordOrder.postpositional){
var lastWordStart = parse.lastSentenceWordIndex(grammar,tokens);
if (lastWord!==-1){
lastWord = tokens.slice(lastWordStart,lastWordStart+1);
if (lastWordStart > lastCaseIndex)
mood = tokens.slice(lastCaseIndex,lastWordStart);
}
otherTokens = tokens.slice(0,lastCaseIndex);
}
// if prepositional, last words of sentence are at start
else {
var firstCaseIndex =parse.firstCaseIndex(grammar,tokens);
var lastWordI = 
parse.lastSentenceWordIndex(grammar,tokens);
if (lastWordI !== -1)
lastWord = tokens[lastWordI];
if (firstCaseIndex !== 0) 
mood = tokens.slice(0,firstCaseIndex);
otherTokens = tokens.slice(firstCaseIndex,
		tokens.length-firstCaseIndex);
}

var previousLength = 0;
var phrases = new Array();
var lastPhrase, phrase;
// if clause initial get via last phrases
// if clause final get via first phrases
while (otherTokens.length>0 
&& otherTokens.length != previousLength){
// avoid infinite loops from starter garbage
	previousLength = otherTokens.length;
if (wordOrder.clauseInitial===true){
	lastPhrase = parse.lastPhrase(grammar,
			otherTokens);
	if (lastPhrase.length === 0) break;
	phrase =  new Phrase(language, lastPhrase);
	phrases.unshift(phrase);
	otherTokens = otherTokens.slice(0,
	otherTokens.length-lastPhrase.length);
}else if (wordOrder.clauseInitial===false){
	if (parse.firstCaseIndex(grammar,otherTokens) 
			=== -1)
	       	break;
	lastPhrase = parse.firstPhrase(grammar,
			otherTokens);
	phrase = new Phrase(language, lastPhrase);
	phrases.push(phrase);
	otherTokens = otherTokens.slice(
			lastPhrase.length);
}
}
this.phrases = phrases;
if (mood && mood.length>0)
this.mood = new Word(language,mood);
if (lastWord && lastWord.length>0)
this.endWords = new Word(language,lastWord);
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
	if (this.endWords &&
		!this.endWords.isSubset(match.endWords))
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
	if (this.endWords && 
		!this.endWords.isSuperset(match.endWords))
		return false;
	// check phrases are a subset
	var thisPhrases = this.phrases;
	var matchPhrases = match.phrases;
	var result = matchPhrases.every(function(matchPhrase){
	 if (!thisPhrases.some(function(phrase){
	  return phrase.isSuperset(language,matchPhrase)
	 })) return false;
	 else return true;
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
		return this;/// return itself
	return this.phraseDel(index);
}
Sentence.prototype.byIndexPhraseDelete = byIndexPhraseDelete;
function byIndexPhraseDelete(index){
	err.indexCheck(this.phrases.length,index);
	// remove phrase from array.
	var sentence = this;
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
	var sentence = this;
	sentence.phrases.splice(index,1,phrase);
	return sentence;
}
Sentence.prototype.copy = function(language){
 	return new Sentence(language, JSON.parse(JSON.stringify(this)));
}
Sentence.prototype.toString = function(format){
	var joiner = ' ';
	var mood = this.mood;
	var endWords = this.endWords;
	var ender = '';
	//if (tokenize.isTokens(endWords)){
	//	joiner = "";
	//	ender = '\n'
	//}
	var result = new String();
	var phrases = this.phrases;
	var phrasesLength = phrases.length;
	var i;
	for (i=0; i<phrasesLength; i++)
		
result += simpleClauseTermMaybeAdd(format,phrases[i],i);
	if (mood)
	result += mood.toString()+joiner;
	if (endWords)
	result += endWords.toString();
	result += ender;
	return result;
};


Sentence.prototype.toLocaleString = function(language,format){
// be convert bo sentence to language with format de
// algorithm:
// be set bo joiner and ender from format ya
// be set bo empty string for translation result ya
// be clone bo this sentence to working sentence ya
//
// if prepositional then translate mood and append to result
//
// be start of loop for each phrase in language phrase order de
// be get bo phrase from working sentence ya 
// if found then
// be may add bo clause term to phrase translation ya
// be append bo it to result ya and
// be delete bo phrase from sentence ya
// be end of loop ya
//
// be loop for each phrase in working sentence de
// be append bo phrase translation to result ya
//
// if postpositional then translate mood and append to result
//
// be translate bo end words ya 
// be append to result ya
// be append bo ender ya
// return result ya
//


// be set bo joiner and ender from format ya
	var joiner = ' ';
	var ender = '';
// be set bo empty string for translation result ya
	var result = new String();
// be clone bo this sentence to working sentence ya
	var sentence = this.copy(language);
	var grammar = language.grammar;
	var wordOrder = grammar.wordOrder;
	var mood = this.mood;
//
// if prepositional then translate mood and append to result
if (mood && wordOrder.postpositional === false)
result+=mood.toLocaleString(language,format,"mh")+joiner;
// be start of loop for each phrase in language phrase order de
var orderPhrases = wordOrder.phraseOrder;
var orderPhrasesLength = orderPhrases.length;
var phrases = sentence.phrases;
var i;
var phraseIndex = -1;
for (i=0; i<orderPhrasesLength; i++){
// be get bo phrase from working sentence ya 
phraseIndex = sentence.indexOf(language,orderPhrases[i]);
// if found then
if (phraseIndex !== -1){
// be may add bo clause term to phrase translation ya
var phrase = phrases[phraseIndex];
var phraseTrans = 
clauseTermMaybeAdd(language,format,phrase,result.length,
sentence.length);
// be append bo it to result ya and
result +=  phraseTrans;
// be delete bo phrase from sentence ya
sentence.phraseDelete(phraseIndex);
}
// be end of loop ya
}
//
// be loop for each phrase in working sentence de
	var phrasesLength = phrases.length;
	for (i=0; i<phrasesLength; i++){
// be append bo phrase translation to result ya
	result += phrases[i].toLocaleString(language,format);
	}
// 
// if postpositional then translate mood and append to result
if (mood && wordOrder.postpositional === true)
result+=mood.toLocaleString(language,format,"mh") +joiner;
// be translate bo end words ya 
	if (this.endWords){
	var endWords = this.endWords.
	toLocaleString(language,format,"sh");
// be append to result ya
	result += endWords;
	}
// be append bo ender ya
	result += ender;
// return result ya
	return result;
};

function clauseTermMaybeAdd(language, format, phrase,
resultLength, sentenceLength){
// if clauseInitial and phrase has clause and result non zero
// then prepend clauseTerm translation ya
// if clauseFinal and phrase has clause and sentence non zero
// then append clauseTerm translation ya

var phraseTrans =
phrase.toLocaleString(language,format);
if (phrase.clause){
var grammar = language.grammar;
var clauseInitial = grammar.wordOrder.clauseInitial;
var joiner = " ";
// if clauseInitial and phrase has clause and result non zero
if (clauseInitial && resultLength > 0){
// then prepend clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return clauseTerm.toLocaleString(language,format,"lh")
+joiner+phraseTrans;}
// if clauseFinal and phrase has clause and sentence non zero
else if (clauseInitial===false && sentenceLength > 0){
// then append clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return phraseTrans+joiner
+clauseTerm.toLocaleString(language,format,"lh");}
} return phraseTrans; }

function simpleClauseTermMaybeAdd(format, phrase, resultLength){
// if phrase has clause and result non zero
// then prepend clauseTerm translation ya

var phraseTrans = phrase.toString(format);
// if phrase has clause and result non zero
if (phrase.clause && resultLength > 0){
var joiner = " ";
// then prepend clauseTerm translation ya
var clauseTerm = "tai"/* mwak clauseTerminator */ ;
return clauseTerm+joiner+phraseTrans;}
return phraseTrans; }
