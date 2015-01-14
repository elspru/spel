"use strict";
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
var Phrase = require("./phrase");
var Junction = require("./junction");
var TopClause = require("./topClause");
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
for (i=0; i< input.phrases.length; i++){
if (input.phrases[i].be === "Phrase")
this.phrases[i]= new Phrase(language, input.phrases[i]);
else if (input.phrases[i].be === "Junction")
this.phrases[i]= new Junction(language, input.phrases[i]);
else if (input.phrases[i].be === "TopClause")
this.phrases[i] = new TopClause(language, input.phrases[i]);
}
if (input.endWords)
this.endWords= new Word(language, input.endWords);
if (input.mood !== undefined)
this.mood = new Word(language, input.mood);
return this;
}
else if (Array.isArray(input)) tokens = input;
else throw new TypeError(input +" is not a valid Phrase input");

// extract quotes
tokens = parse.quotesExtract(language,tokens);
//if (!tokenize.isTokens(tokens))
//	throw new TypeError("su Phrase be need bo tokens ya");
	//this.string = tokens.join("");
	//this.tokens = tokens;

// algorithm de
// 
// be get ob last case word index ya
// be get ob last word or mood word of sentence ya
// if postpositional then ob last words of sentence at end ya
// if prepositional then ob last words of sentence at start ya
// be get ob each phrase or top clause ya
// if clause initial then be get via last ya
// if clause final then be get via first ya
// be set ob many part of this ya

var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
// get last case word index
var lastCaseIndex =parse.lastCaseIndex(grammar,tokens);
var lastTopClauseIndex =
parse.lastTopClauseWordIndex(grammar,tokens);
if (lastTopClauseIndex === -1) lastTopClauseIndex = -1;
var lastAnyCaseI =
Math.max(lastTopClauseIndex,lastCaseIndex);
if (lastCaseIndex === -1) parse.phraseError(grammar,tokens);
lastCaseIndex++;
lastAnyCaseI++;
var lastWord = undefined, 
    otherTokens = undefined, 
    mood = undefined;		
// be get ob last word or mood word of sentence ya
// if postpositional then last words of sentence at end ya
if (wordOrder.postpositional){
var lastWordStart = parse.lastSentenceWordIndex(grammar,tokens);
if (lastWord!==-1){
lastWord = tokens.slice(lastWordStart,lastWordStart+1);
if (lastWordStart > lastAnyCaseI)
mood = tokens.slice(lastAnyCaseI,lastWordStart);
}
otherTokens = tokens.slice(0,lastAnyCaseI);
}
// if prepositional then ob last words of sentence at start ya
else {
var firstCaseIndex =parse.firstCaseIndex(grammar,tokens);
var firstTopClauseIndex =
parse.firstTopClauseWordIndex(grammar,tokens);
if (firstTopClauseIndex === -1) 
firstTopClauseIndex = tokens.length;
var firstAnyCaseI =
Math.min(firstTopClauseIndex,firstCaseIndex);
var lastWordI = 
parse.lastSentenceWordIndex(grammar,tokens);
if (lastWordI !== -1)
lastWord = tokens[lastWordI];
if (firstCaseIndex !== 0) 
mood = tokens.slice(0,firstAnyCaseI);
otherTokens = tokens.slice(firstAnyCaseI,
		tokens.length-firstAnyCaseI);
}

// be get ob each phrase or top clause ya
var previousLength = 0;
var phrases = new Array();
var thePhraseI, thePhrase, phrase, 
theTopClauseI, theClause, topClause;
while (otherTokens.length>0 
&& otherTokens.length != previousLength){
// avoid infinite loops from starter garbage
	previousLength = otherTokens.length;

// if clause initial then get via last phrases ya
if (wordOrder.clauseInitial===true){
thePhraseI= parse.lastJunctionPhraseIndex(grammar, otherTokens);
if (Array.isArray(otherTokens))
theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
thePhrase= otherTokens.slice(thePhraseI[0],thePhraseI[1]);
if (theTopClauseI && theTopClauseI[1]>thePhraseI[1]){
theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
topClause = new TopClause(language, theClause);
phrases.unshift(topClause);
otherTokens.splice(theTopClauseI[0],
theTopClauseI[1]-theTopClauseI[0]);
}
else if (thePhrase.length === 0) break;
else {
phrase =  new Phrase(language, thePhrase);
phrases.unshift(phrase);
otherTokens.splice(thePhraseI[0],
thePhraseI[1]-thePhraseI[0]); }
} // be end of if for clause initial ya

// if clause final then get via first phrases ya
else if (wordOrder.clauseInitial===false){
if (parse.firstCaseIndex(grammar,otherTokens) === -1) break;
thePhraseI = 
parse.firstJunctionPhraseIndex(grammar, otherTokens);
theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
var length = otherTokens.length;
if (thePhraseI[0] === -1) thePhraseI[0]= length;
if (theTopClauseI[0] === -1) theTopClauseI[0]= length;
if (theTopClauseI && theTopClauseI[0]<thePhraseI[0]){
theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
topClause = new TopClause(language, theClause);
phrases.push(topClause);
otherTokens.splice(theTopClauseI[0],
theTopClauseI[1]-theTopClauseI[0]);
}
else if (thePhraseI[0]===length) break;
else {
thePhrase = otherTokens.slice(thePhraseI[0],thePhraseI[1]);
phrase = new Phrase(language, thePhrase);
phrases.push(phrase);
otherTokens.splice(thePhraseI[0],
thePhraseI[1]-thePhraseI[0]); }
} // be end of else if for clause final ya
} // be end of while loop  for phrase or top clause get ya

// be set ob many part of this ya
this.phrases = phrases;
if (mood && mood.length>0)
this.mood = new Word(language,mood);
if (lastWord && lastWord.length>0)
this.endWords = new Word(language,lastWord);
return this;
}// su sentence be end of constructor function ya



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
if (this.isSuperset(language,match) 
|| this.isSubset(language,match)) return true;
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
var i, phrase,
    phrases = this.phrases,
    length = phrases.length;
for (i=0;i<length;i++){
phrase = phrases[i];
if(phrase.be === "Junction"
&& phrase.body[0].head.isLike(language,caseWord)
||phrase.head.isLike(language,caseWord)) return i; }
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
function phraseFindDelete(language,cases){
	var index = this.indexOf(language,cases);
	if (index === -1) /// if none
		return this;/// return itself
	return this.byIndexPhraseDelete(index);
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
function phraseDelete(language, input){
	if (typeof input === "number")
		return this.byIndexPhraseDelete(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.phraseFindDelete(language, input);
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
return new Sentence(language, 
JSON.parse(JSON.stringify(this)));
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
// be set ob joiner and ender from format ya
// be set ob empty string for translation result ya
// be clone ob this sentence to working sentence ya
//
// if prepositional then translate mood and append to result
//
// be start of loop for each phrase in language phrase order de
// be get ob phrase from working sentence ya 
// if found then
// be may add ob clause term to phrase translation ya
// if su prevTopClause boolean be set and su this be phrase
//	then be prepend ob clauseTerm to result ya
// if be top clause then be set ob prevTopClause boolean ya
// else if be phrase then be unset ob prevTopClause boolean ya
// be append ob it to result ya and
// be delete ob phrase from sentence ya
// be end of loop ya
//
// be loop for each phrase in working sentence de
// if head initial
// be append ob phrase translation to result ya
// if head final
// be prepend
//
// if postpositional then translate mood and append to result
//
// be translate ob end words ya 
// be append to result ya
// be append ob ender ya
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
var topClauseTerm = 
new Word(language, grammar.topClauseTerminator[0]);
var mood = this.mood;
var prevTopClause = false;
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
// be may add ob clause term to phrase translation ya
var phrase = phrases[phraseIndex];
var phraseTrans = 
clauseTermMaybeAdd(language,format,phrase,result.length,
sentence.phrases);
if (wordOrder.postpositional === false){
// if su prevTopClause boolean be set and su this be phrase
//	then be prepend ob clauseTerm to result ya
if (prevTopClause && phrase.be === "Phrase")
phraseTrans = 
topClauseTerm.toLocaleString(language, format, "jh")
+ joiner + phraseTrans;
// if be top clause then be set ob prevTopClause boolean ya
if (phrase.be === "TopClause")
prevTopClause = true;
// else if  be phrase then be unset ob prevTopClause boolean ya
else if (phrase.be === "Phrase")
prevTopClause = false;}
// be append ob it to result ya and
result +=  phraseTrans;
// be delete ob phrase from sentence ya
sentence.byIndexPhraseDelete(phraseIndex);
}
// be end of loop ya
}
//
// be loop for each phrase in working sentence de
	var phrasesLength = phrases.length;
	for (i=0; i<phrasesLength; i++){
// if head initial
// be append bo phrase translation to result ya
if (grammar.wordOrder.headFinal === false)
	result += phrases[i].toLocaleString(language,format);
// if head final
// be prepend
else if (grammar.wordOrder.headFinal)
result = phrases[i].toLocaleString(language,format) + result;
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
resultLength, phrases){
// if clauseInitial and phrase has clause and result non zero
// then prepend clauseTerm translation ya
// if clauseFinal and phrase has clause 
//	and phrases length is non zero
// then append clauseTerm translation ya

var phrasesLength = phrases.length;
var phraseTrans =
phrase.toLocaleString(language,format);
var clause = phrase.clause;
var grammar = language.grammar;
var clauseInitial = grammar.wordOrder.clauseInitial;
var joiner = " ";

// if clauseInitial and phrase has clause and result non zero
if (clauseInitial && clause && resultLength>0){
// then prepend clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return clauseTerm.toLocaleString(language,format,"lh")
+joiner+phraseTrans;}

// if clauseFinal and phrase has clause 
// 	and phrases length is non zero
else if ( clauseInitial===false && phrasesLength > 1
&& (clause && !clause.tail )){
// then append clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return phraseTrans+
clauseTerm.toLocaleString(language,format,"lh")+joiner;}
return phraseTrans; }

function simpleClauseTermMaybeAdd(format, phrase, resultLength){
// if phrase has clause and result non zero
// then prepend clauseTerm translation ya

var phraseTrans = phrase.toString(format);
// if phrase has clause and result non zero
var clause = phrase.clause;
if (clause && !clause.clauseTerm && resultLength > 0){
var joiner = " ";
// then prepend clauseTerm translation ya
var clauseTerm = "tai"/* mwak clauseTerminator */ ;
return clauseTerm+joiner+phraseTrans;}
return phraseTrans; }
