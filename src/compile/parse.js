"use strict"
var hof = require("../lib/hof");
var tokenize = require("./tokenize");
var Grammar = require("../lang/grammar");
var Quote = require("../class/quote");
var Type = require("../class/type");
var grammar = new Grammar();
/// tokens be parse ya
//exports = new Object;
exports.wordMatch = wordMatch;
function wordMatch(wordArray,word){
if (wordArray.indexOf(word)!==-1) return true;
return false;
}
/// be parse bo next word ya
exports.firstWordIndex = firstWordIndexParse;
/// returns next word, skipping whitespace tokens
function firstWordIndexParse(tokens){
	return tokens.find(tokenize.isWord);
}
exports.lastWordIndex = lastWordIndexParse;
/// returns next word, skipping whitespace tokens
function lastWordIndexParse(tokens){
	return tokens.rfind(tokenize.isWord);
}

/// be parse bo quote  ya
/// be parse bo single word quote de
exports.firstSingleWordQuote = firstSingleWordQuoteParse;
function firstSingleWordQuoteParse(grammar,tokens){
var singleQuoteIndex=tokens.find(
		wordMatch.curry(grammar.quotes.singleWord));
// if not found return null.
if (singleQuoteIndex === null)
	return null;
// if found get previous word.
if (singleQuoteIndex!==-1){
	var previousTokens = tokens.slice(0,singleQuoteIndex);
	var quotedWordIndex = lastWordIndexParse(previousTokens);
	return tokens.slice(quotedWordIndex,singleQuoteIndex+1);
}
// else return null
return null;

}
/// be parse bo multi word quote de
exports.lastMultiWordQuote = lastMultiWordQuoteParse;
function lastMultiWordQuoteParse(grammar,tokens){
var index = lastMultiWordQuoteIndexParse(grammar,tokens);
//if su index ob null then be return ob null ya
if (index === null) return null;
return tokens.slice(index[0],index[1]);
}
exports.lastMultiWordQuoteIndex = lastMultiWordQuoteIndexParse;
function lastMultiWordQuoteIndexParse(grammar,tokens){
// algorithm:
// about from end be find ob quote head ya
// if not found then be return null
// else if found then be set as end yand
// be get ob preceding word as quote name 
// then be search for quote-name preceded by quote tail ya
// if found then be set as  start
// else be set ob start of tokens as start yand
// be give warning ya
// return start and end array

var head = new String();
var tail = new String();
var quotes = grammar.quotes;
if (grammar.wordOrder.typeFinal){
head = quotes.multiWordHead;
tail = quotes.multiWordTail;}
else if (grammar.wordOrder.typeFinal === false){
head = quotes.multiWordTail;
tail = quotes.multiWordHead;}

var start = null;
var end = null;

// about from end be find ob quote head ya
var quoteHeadI = tokens.rfind(wordMatch.curry(head));
// if not found then be return null
if (quoteHeadI === null) return null;
// else if be find then be set as end yand
else end = quoteHeadI+1;
// be get ob preceding word as quote name 
var quoteNameI = quoteHeadI-1;
var quoteName = tokens[quoteNameI];
// then be search for quote-name preceded by quote tail ya
while (true){
var otherTokens = tokens.slice(0,quoteNameI);
var quoteNameI = otherTokens.rfind(wordMatch.curry(quoteName));
// if be find then be set as  start
// else be set ob start of tokens as start yand
// be give warning ya
if (quoteNameI === null) {start = 0; break}
else if (tokens[quoteNameI-1] === tail[0]) {
start = quoteNameI-1; break;}
}
// return start and end array
return [start,end];
}

exports.firstMultiWordQuote = firstMultiWordQuoteParse;
function firstMultiWordQuoteParse(grammar,tokens){
var index = firstMultiWordQuoteIndexParse(grammar,tokens);
//if su index ob null then be return ob null ya
if (index === null) return null;
return tokens.slice(index[0],index[1]);
}
exports.firstMultiWordQuoteIndex = firstMultiWordQuoteIndexParse;
function firstMultiWordQuoteIndexParse(grammar,tokens){
// algorithm:
// about from start be find ob quote head ya
// if not found then be return null
// else if found then be set as start yand
// be get ob following word as quote name 
// then be search for quote-name following by quote tail ya
// if found then be set as  end
// else be set ob end of tokens as end yand
// be give warning ya
// return end and start array

var head = new String();
var tail = new String();
var quotes = grammar.quotes;
if (grammar.wordOrder.typeFinal === false){
head = quotes.multiWordHead;
tail = quotes.multiWordTail;}
else if (grammar.wordOrder.typeFinal){
head = quotes.multiWordTail;
tail = quotes.multiWordHead;}

var start = null;
var end = null;

// about from start be find ob quote head ya
var quoteHeadI = tokens.find(wordMatch.curry(head));
// if not found then be return null
if (quoteHeadI === null) return null;
// else if be find then be set as start yand
else start = quoteHeadI;
// be get ob following word as quote name 
var quoteNameI = quoteHeadI+1;
var quoteName = tokens[quoteNameI];
// then be search for quote-name followed by quote tail ya
var tailQuoteNameI = quoteNameI;
var extraTailI = 0;
var otherTokens = tokens.slice(0);
while (true){
var otherTokens = otherTokens.slice(tailQuoteNameI+1);
var tailQuoteNameI = otherTokens.find(wordMatch.curry(quoteName));
// if be find then be set as  end
// else be set ob end of tokens as end yand
// be give warning ya
if (tailQuoteNameI === null) {end = 0; break}
else if (otherTokens[tailQuoteNameI+1] === tail[0]) {
end = quoteNameI+extraTailI+tailQuoteNameI+3; break;}
extraTailI += tailQuoteNameI+1;
}
// return end and start array
return [start,end];
}

/// be parse bo surrounding quote de
exports.surroundingQuote = surroundingQuoteParse;
	/// if word is in quote, return quote
function surroundingQuoteParse(grammar,wordIndex,tokens){
	if (!Array.isArray(tokens))
		throw new TypeError
			("su surroundingQuoteParse be need array of tokens ya");
	/// check if is single word quote
	var restOfTokens = tokens.slice(wordIndex+1,tokens.length);
	var firstWordIndex = firstWordIndexParse(restOfTokens)+wordIndex+1;
	// if no next word, can't be quote so return null
	if(firstWordIndex === NaN)
		return null;
	var nextWord = tokens[firstWordIndex];
	if (grammar.quotes.singleWord.indexOf(nextWord)!==-1)
		return tokens.slice(wordIndex,firstWordIndex+1);
	/// if be not in quote then return null ya
	return null;
	
}
/// be parse bo type de
/// be parse bo phrase de
exports.lastCaseIndex = lastCaseIndexParse;
function lastCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (Index=== null)
	return -1;
return Index;
}
exports.firstCaseIndex = firstCaseIndexParse;
function firstCaseIndexParse(grammar,tokens){
	if (!tokens.length) return -1;
	var Index = tokens.find(
			wordMatch.curry(grammar.phraseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.lastSentenceWordIndex = lastSentenceWordIndexParse;
function lastSentenceWordIndexParse(grammar,tokens){
	var Index = tokens.rfind(wordMatch.curry(
				grammar.sentenceWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.firstSentenceWordIndex = firstSentenceWordIndexParse;
function firstSentenceWordIndexParse(grammar,tokens){
var Index = tokens.find(wordMatch.curry(grammar.sentenceWords));
if (Index=== null)
	return -1;
return Index;
}

exports.phraseError = phraseError;
function phraseError(grammar,tokens){
		throw new Error("su quo te "+tokens.join(" ")+" quo ted"
			+" be lack ob valid phrase ender"
			+" like one of ar wu "
			+grammar.phraseWords.join(" wu ")
			+" ya");
}
/// su first phrase be parse ya
exports. firstPhrase = 
	 firstPhraseParse;
function firstPhraseParse(grammar,tokens){
var startEnd = firstPhraseIndexParse(grammar,tokens);
return tokens.slice(startEnd[0],startEnd[1]);
}
exports. firstPhraseIndex = 
	 firstPhraseIndexParse;
function firstPhraseIndexParse(grammar,tokens){

// algorithm
//
// get first case word
// if prepositional set start as phraseHead
// and other tokens as what comes after
// if case before clause then slice before it ya
// get next case, subClause, topClause
// if nextClause available, set it's end as phrase end 
// unless it is right after, then get the following one ya
// if topClause is next then set it's start as end

// get first case word
var startEnd = new Array();
var phraseHeadIdx = firstAnyCaseIndexParse(grammar,tokens);
if (phraseHeadIdx === null) phraseError(grammar, tokens);
var otherSlice;
var wordOrder = grammar.wordOrder;

// if prepositional set start as phraseHead
// and other tokens as what comes after
if (wordOrder.postpositional=== false){
otherSlice = tokens.slice(phraseHeadIdx);
startEnd[0]=phraseHeadIdx;
}

// if clauseFinal
var offset = 1;
if (wordOrder.clauseInitial === false){ // clauseFinal
// if case before clause then slice before it ya
var nextSlice = otherSlice.slice(offset);
// get next case, subClause, topClause
var nextCaseI = firstCaseIndexParse(grammar,nextSlice);
// unless it is right after, then get the following one ya
if (nextCaseI === 0
&& tokens[phraseHeadIdx] === grammar.topicWord){
offset = 2
var nextSlice = otherSlice.slice(offset);
var nextCaseI = firstCaseIndexParse(grammar,nextSlice);
}
var nextSubClauseI = firstClauseWordIndexParse(grammar,nextSlice);
var nextTopClauseI = 
firstTopClauseWordIndexParse(grammar,nextSlice);
var length = nextSlice.length;
if (nextSubClauseI === -1) nextSubClauseI = length;
if (nextTopClauseI === -1) nextTopClauseI = length;
var nextClauseI = Math.min(nextSubClauseI, nextTopClauseI);
if (nextCaseI !== -1 && nextCaseI < nextClauseI) {
otherSlice = otherSlice.slice(0,nextCaseI+offset); }
// if nextClause available, set it's end as phrase end 
else if (nextSubClauseI !== length && 
nextSubClauseI < nextTopClauseI){
var clauseIdxs = adjacentClauseIndexParse(grammar,nextSlice);
startEnd[1]=clauseIdxs[1]+offset+phraseHeadIdx;
return startEnd; }
// if topClause is next then set it's start as end
else if (nextTopClauseI !== length){
startEnd[1]=nextTopClauseI+offset+phraseHeadIdx;
return startEnd;
} 
}// end of clauseFinal conditional ya
else { otherSlice = tokens.slice(0,phraseHeadIdx+offset); }

var resultI = lastPhraseIndexParse(grammar,otherSlice);
var result;
// if clause final, include start
if (wordOrder.clauseInitial=== false){
//result = tokens.slice(phraseHeadIdx,resultI[1]+phraseHeadIdx);
startEnd[0]=phraseHeadIdx;
startEnd[1]=resultI[1]+phraseHeadIdx;}
//else result = tokens.slice(resultI[0],resultI[1]);
else startEnd = resultI;
//return result;
return startEnd;
}/* firstPhraseIndexParse function's end */

/// su last phrase be parse ya
exports.lastPhrase = lastPhraseParse;
function lastPhraseParse(grammar,tokens){
	var indexes = lastPhraseIndexParse(grammar,tokens);
	return tokens.slice(indexes[0],indexes[1]);
}
exports. lastPhraseIndex =
	 lastPhraseIndexParse;
function lastPhraseIndexParse(grammar,tokens){
// algorithm:
// 	be find ob last case index ya
// 	be get ob adjacent clause indexes ya
//	if postpositional
//		if adjacent clause found and clause final then
//		end at clause's end
//		else end at phrase word
//		if adjacent clause found and clause initial then
//		start at clause's start
//		else
//		be get ob ar previous slice, previous case, 
//			previous sentence ender, prev top clause
//		for previous case if it is adjacent then get one
//		before it
//		be make su available one ob start ya
//		else 0 be start ya
//	if prepositional
//		if adjacent clause found and clause initial then
//		start at clause's start
//		else start at phrase word
//		if adjacent clause found and clause final then
//		end at clause's end
//		else
//		get sentence ender, adjacent clause
//		if available make end, else length is end
//
//
var lastCaseIndexP = lastCaseIndexParse.curry(grammar);
var clauseInitial = grammar.wordOrder.clauseInitial;
// 	be find ob last case index ya
var phraseWordIndex;
if (clauseInitial) 
phraseWordIndex = lastAnyCaseIndexParse(grammar,tokens);
else 
phraseWordIndex = firstAnyCaseIndexParse(grammar,tokens);

if (phraseWordIndex === -1) phraseError(grammar, tokens);
var start, end;
// 	be get ob adjacent clause ya
	var adjacentClauseI = adjacentClauseIndexParse(grammar,
			tokens, phraseWordIndex);
//	if postpositional
	if (grammar.wordOrder.postpositional){
//		if adjacent clause found and clause final then
		if (adjacentClauseI && !clauseInitial)
//		end at clause's end
		end = adjacentClauseI[1];
//		else end at phrase word
		else end = phraseWordIndex+1;
//		if adjacent clause found and clause initial then
		if (adjacentClauseI && clauseInitial)
//		start at clause's start
		start = adjacentClauseI[0];
//		else
		else {
//		end at phrase word
//		get previous slice, previous case, 
	var previousSlice = tokens.slice(0,phraseWordIndex);
	var previousCaseI = lastCaseIndexP(previousSlice);
//		for previous case if it is adjacent then get one
//		before it
if (tokens[phraseWordIndex]===grammar.topicWord 
&& ((phraseWordIndex)-previousCaseI)===1
&& previousCaseI !== -1){
previousSlice = tokens.slice(0,phraseWordIndex-1)
previousCaseI = lastCaseIndexP(previousSlice);
}
//			previous sentence ender, prev top clause
	var previousSentenceEnderI = lastSentenceWordIndexParse
		(grammar,previousSlice);
	var previousTopClauseI = lastTopClauseWordIndexParse
		(grammar,previousSlice);
//		be make su available one ob start ya
//		else 0 be start ya
	start = Math.max(previousCaseI,previousSentenceEnderI,
		previousTopClauseI,-1);
	start += 1;
		}
	}
//	if prepositional
	else {
//		if adjacent clause found and clause initial then
		if (adjacentClauseI && clauseInitial)
//		start at clause's start
		start = adjacentClauseI[0];
//		else start at phrase word
		else start = phraseWordIndex;
//		if adjacent clause found and clause final then
		if (adjacentClauseI!==null && !clauseInitial){
//		end at clause's end
		end = adjacentClauseI[1];
		}
//		else
		else{
//		get sentence ender
	var sentenceEnderIndex = lastSentenceWordIndexParse(
			grammar,tokens);
//		if available make end, else length is end
	if (sentenceEnderIndex !== -1)
		end = sentenceEnderIndex;
	else end = tokens.length;
		}
	}
	return [start,end];
}

// su first specific phrase be parse ya
exports.firstSpecificPhrase = firstSpecificPhraseParse;
function firstSpecificPhraseParse(tokens,phraseWord){
	var firstSpecificCase=tokens.find(wordMatch.curry([phraseWord]));
	var previousSlice = tokens.slice(0,firstSpecificCase+1);
	return lastPhraseParse(grammar,previousSlice);
}
// su last specific phrase be parse ya
exports.lastSpecificPhrase = lastSpecificPhraseParse;
function lastSpecificPhraseParse(tokens,phraseWord){
	var lastSpecificCase=tokens.rfind(wordMatch.curry([phraseWord]));
	var previousSlice = tokens.slice(0,lastSpecificCase+1);
	return lastPhraseParse(grammar,previousSlice);
}
/// be parse bo sentence de
exports.sentenceError = sentenceError;
function sentenceError(tokens){
		throw new Error("su quo te "+tokens.join(" ")+" quo ted"
			+" be lack ob valid sentence ender"
			+" like one of ar wu "
			+grammar.sentenceWords.join(" wu ")
			+" ya");
}
exports.firstSentence = firstSentenceParse;
function firstSentenceParse(grammar,tokens){
	var sentenceEnder = tokens.find(wordMatch.curry(grammar.sentenceWords));
	if (sentenceEnder === null) sentenceError(tokens);
	// if followed by space include it
	if (tokenize.isSpace(tokens[sentenceEnder+1]))
		sentenceEnder=sentenceEnder+1;
	return tokens.slice(0,sentenceEnder+1);
}
exports.lastSentence = lastSentenceParse;
function lastSentenceParse(grammar,tokens){
	var lastSentWordIP = lastSentenceWordIndexParse.curry(grammar);
	var sentenceEnder = tokens.rfind(wordMatch.curry(grammar.sentenceWords));
	if (sentenceEnder === null) sentenceError(tokens);
	var sentenceEnder = lastSentWordIP(tokens);
	if (tokenize.isSpace(tokens[sentenceEnder+1]))
		sentenceEnder=sentenceEnder+1;
	var previousSlice = tokens.slice(0,sentenceEnder);
	var previousSentenceEnder = lastSentWordIP(previousSlice);
	if (previousSentenceEnder===-1)
		previousSentenceEnder=0;
	return tokens.slice(previousSentenceEnder+1,sentenceEnder+1);
}
exports.quotesExtract = quotesExtract;
// extracts quotes from word tokens, turning them into objects,
// splices them back in, and returns result.
function quotesExtract(language, tokens){

// algorithm:
// if type final
// go backwards through tokens
// else go forwards
// return result

var grammar = language.grammar;
var quotes = grammar.quotes;
var quoteHeads = quotes.quoteHeads;
var singleWordHead = quotes.singleWord[0];
var multiWordHead = quotes.multiWordHead[0];
var quoteExtractedTokens = new Array();
var i; 
var thisToken; 
var quote;
// if type final
// go backwards through tokens
if (language.grammar.wordOrder.typeFinal){
for (i = tokens.length-1 ; i >= 0; i--){
thisToken = tokens[i];
if (i===0) quoteExtractedTokens.unshift(thisToken);
else if (wordMatch(quoteHeads,thisToken)){
var quoteTokens = new Array();
if (thisToken === singleWordHead)
quoteTokens = [tokens[i-1],thisToken];
else if (thisToken === multiWordHead){
var otherTokens = tokens.slice(0,i+1);
quoteTokens = lastMultiWordQuoteParse(grammar,otherTokens);
}
quote = new Type(language, quoteTokens)
quoteExtractedTokens.unshift(quote);
i = i-quoteTokens.length+1;
}
else quoteExtractedTokens.unshift(thisToken);
}}
// else go forwards
else if (!language.grammar.wordOrder.typeFinal) { // type initial
for (i=0; i < tokens.length; i++){
thisToken = tokens[i];
if (i===tokens.length-1) quoteExtractedTokens.push(thisToken);
else if (wordMatch(quoteHeads,thisToken)){
var quoteTokens = new Array();
if (thisToken === singleWordHead)
quoteTokens = [thisToken,tokens[i+1]];
else if (thisToken === multiWordHead){
var otherTokens = tokens.slice(i);
quoteTokens = firstMultiWordQuoteParse(grammar,otherTokens);
}
quote = new Type(language, quoteTokens)
quoteExtractedTokens.push(quote);
i = i+quoteTokens.length-1;
}
else quoteExtractedTokens.push(thisToken);
}
}
return quoteExtractedTokens;

}
exports.adjacentClause = adjacentClauseParse;
function adjacentClauseParse(grammar,tokens,caseWordIndex){
	var clauseIndexes = adjacentClauseIndexParse(
			grammar,tokens,caseWordIndex);
	if (clauseIndexes)
	return tokens.slice(clauseIndexes[0],clauseIndexes[1]);
	else return null;
}

exports.adjacentClauseIndex = adjacentClauseIndexParse;
function adjacentClauseIndexParse(grammar,tokens,caseWordIndex){
// algorithm:
// if clause initial then
// get previous clause word
// if none then return null
// else get previous case word, sentence word
// if clause word greater than case word and sentence word then
// set as end ya
// else return null ya
// get previous clause terminator ya
// max of sentence word and clause terminator set to start ya
//
// else if clause final then
// get next clause word
// if none then return null
// else get next case word, sentence word
// if clause word less than case word and sentence word then
// set as start  ya
// else return null ya
// get next clause temrinator
// min of sentence word and clause terminator set to end ya
// end if
// return start, end array
//
var start = 0, 
    end = tokens.length;
var caseWordI,
    sentenceWordI,
    clauseWordI,
    clauseTermI,
    otherTokens;
//
// if clause initial then
if (grammar.wordOrder.clauseInitial){
if (caseWordIndex)
otherTokens = tokens.slice(0,caseWordIndex);
else otherTokens = tokens;
// get previous clause word
clauseWordI = lastClauseWordIndexParse(grammar,otherTokens);
// if none then return null
if (clauseWordI === -1) return null;
// else get previous case word, sentence word
caseWordI = lastCaseIndexParse(grammar,otherTokens);
sentenceWordI = lastSentenceWordIndexParse(grammar,otherTokens);
// if clause word greater than case word and sentence word then
if (clauseWordI > Math.max(caseWordI,sentenceWordI))
// set as end ya 
end = clauseWordI+1;
// else return null ya
else return null;
// get previous clause terminator ya
clauseTermI = lastClauseTerminatorIndexParse(grammar,
		otherTokens);
// max of sentence word and clause terminator set to start ya
start = Math.max(sentenceWordI,clauseTermI,0);
}
//
// else if clause final then
else/* Clause Final*/{
if (caseWordIndex)
otherTokens = tokens.slice(caseWordIndex,tokens.length);
else {otherTokens = tokens;
	caseWordIndex = 0;}
// get next clause word
clauseWordI = firstClauseWordIndexParse(grammar,otherTokens);
// if none then return null
if (clauseWordI === -1) return null;
// else get next case word, sentence word
caseWordI = firstCaseIndexParse(grammar,otherTokens);
sentenceWordI = firstSentenceWordIndexParse(grammar,otherTokens);
// if clause word less than case word and sentence word then
if (clauseWordI < Math.max(caseWordI,sentenceWordI))
// set as start  ya
start = clauseWordI +caseWordIndex;
// else return null ya
else return null;
// get next clause terminator
clauseTermI = firstClauseTerminatorIndexParse(grammar,
		otherTokens);
// min of sentence word and clause terminator set to end ya

if (clauseTermI === -1) clauseTermI=tokens.length-1;
if (sentenceWordI === -1) sentenceWordI=tokens.length;
end = Math.min(sentenceWordI,clauseTermI+1)+caseWordIndex;
// end if
}
// return start end array
return [start,end];
}
exports.lastClauseWordIndex = lastClauseWordIndexParse;
function lastClauseWordIndexParse(grammar,tokens){
	var Index = tokens.rfind(
		wordMatch.curry(grammar.clauseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.firstClauseWordIndex = firstClauseWordIndexParse;
function firstClauseWordIndexParse(grammar,tokens){
	var Index = tokens.find(
		wordMatch.curry(grammar.clauseWords));
	if (Index=== null)
		return -1;
	return Index;
}
exports.lastClauseTerminatorIndex = 
	lastClauseTerminatorIndexParse;
function lastClauseTerminatorIndexParse(grammar,tokens){
	var Index = tokens.rfind(
		wordMatch.curry(grammar.clauseTerminator));
	if (Index=== null)
		return -1;
	return Index;
}
exports.firstClauseTerminatorIndex = 
	firstClauseTerminatorIndexParse;
function firstClauseTerminatorIndexParse(grammar,tokens){
	var Index = tokens.find(
		wordMatch.curry(grammar.clauseTerminator));
	if (Index=== null)
		return -1;
	return Index;
}



exports. lastSubPhraseWordIndex = 
	 lastSubPhraseWordIndexParse;
function lastSubPhraseWordIndexParse(grammar,tokens){
var Index = tokens.rfind(
		wordMatch.curry(grammar.subPhraseWords));
if (Index=== null) return -1;
return Index;
}
exports. firstSubPhraseWordIndex = 
	 firstSubPhraseWordIndexParse;
function firstSubPhraseWordIndexParse(grammar,tokens){
var Index = 
tokens.find(wordMatch.curry(grammar.subPhraseWords));
if (Index=== null) return -1;
return Index;
}
exports. lastAnyCaseIndex = 
	 lastAnyCaseIndexParse;
function lastAnyCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var caseIndex  = 
tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (caseIndex === null)    caseIndex = -1;
var subCaseIndex =
tokens.rfind(wordMatch.curry(grammar.subPhraseWords));
if (subCaseIndex === null) subCaseIndex = -1;
//var topClauseIndex =
//tokens.rfind(wordMatch.curry(grammar.topClauseWords));
//if (topClauseIndex === null) topClauseIndex = -1;
return Math.max(caseIndex,subCaseIndex);//,topClauseIndex)
}
exports. firstAnyCaseIndex = 
	 firstAnyCaseIndexParse;
function firstAnyCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var tokensLength = tokens.length;
var caseIndex = 
tokens.find(wordMatch.curry(grammar.phraseWords));
if (caseIndex=== null)    caseIndex = tokensLength;
var subCaseIndex = 
tokens.find(wordMatch.curry(grammar.subPhraseWords));
if (subCaseIndex=== null) subCaseIndex = tokensLength;
//var topClauseIndex = 
//tokens.find(wordMatch.curry(grammar.topClauseWords));
//if (topClauseIndex=== null) topClauseIndex = tokensLength;
//tokens.find(wordMatch.curry(grammar.phraseWords));
var result = Math.min(caseIndex,subCaseIndex);//,topClauseIndex);
if (result === tokensLength) return -1;
else return result;
}

exports. lastTopClauseWordIndex = 
	 lastTopClauseWordIndexParse;
function lastTopClauseWordIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = 
tokens.rfind(wordMatch.curry(grammar.topClauseWords));
if (Index=== null) return -1;
return Index;
}

exports. firstTopClauseWordIndex = 
	 firstTopClauseWordIndexParse;
function firstTopClauseWordIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var Index = 
tokens.find(wordMatch.curry(grammar.topClauseWords));
if (Index=== null) return -1;
return Index;
}

exports. topClause = 
	 topClauseParse;
function topClauseParse(grammar,tokens){
var  indexes = topClauseIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
} 

exports. topClauseIndex = 
	 topClauseIndexParse;
function topClauseIndexParse(grammar,tokens){
// top clause algorithm de
//
// if clause initial then 
// be get ob last top clause word index ya
// if none then return null ya
// be set as end of top clause ya
// be get ob prev top clause index and sentence word index ya
// be set greatest of top clause word or sentence or 0 
// as start of top clause ya
//
// else if clause final then 
// be get ob first top clause word index ya
// if none then return null ya
// be set as start of top clause ya
// be get ob next top clause index and sentence word index ya
// be set least of top clause word or sentence or length
// as end of top clause ya
// 
// be return start and end as array ya

/* code start*/

var start, end;
var wordOrder = grammar.wordOrder;
var clauseInitial = wordOrder.clauseInitial;
var headWordI, otherTokens, otherHeadWordI, sentenceWordI;

// if clause initial then 
if (clauseInitial){
// be get ob last top clause word index ya
headWordI = lastTopClauseWordIndexParse(grammar,tokens);
// if none then return null ya
if (headWordI === null) return null;
// be set as end of top clause ya
end = headWordI+1;
// be get ob prev top clause index and sentence word index ya
otherTokens = tokens.slice(0,headWordI);
otherHeadWordI=lastTopClauseWordIndexParse(grammar,otherTokens);
sentenceWordI = lastSentenceWordIndexParse(grammar,otherTokens);
// be set greatest of top clause word or sentence or 0 
// as start of top clause ya
start = Math.max(sentenceWordI,otherHeadWordI,-1)+1;
}// be end of clauseInitial ya
//
// else if clause final then 
if (clauseInitial === false){
// be get ob first top clause word index ya
headWordI = firstTopClauseWordIndexParse(grammar,tokens);
// if none then return null ya
if (headWordI === null) return null;
// be set as start of top clause ya
start = headWordI;
// be get ob next top clause index and sentence word index ya
otherTokens = tokens.slice(headWordI+1);
otherHeadWordI=firstTopClauseWordIndexParse(grammar,otherTokens);
sentenceWordI= firstSentenceWordIndexParse(grammar,otherTokens);
// be set least of top clause word or sentence or length
// as end of top clause ya
var length = otherTokens.length;
if (otherHeadWordI === -1) otherHeadWordI = length;
if (sentenceWordI === -1) sentenceWordI = length;
end = headWordI+1+Math.min(otherHeadWordI,sentenceWordI,length);
}// be end of top clause ya
//
// be return start and end as array ya
return [start,end];
}//su top clause index parse be end ya


exports. lastAnyTopCaseIndex = 
	 lastAnyTopCaseIndexParse;
function lastAnyTopCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var caseIndex  = 
tokens.rfind(wordMatch.curry(grammar.phraseWords));
if (caseIndex === null)    caseIndex = -1;
var topClauseIndex =
tokens.rfind(wordMatch.curry(grammar.topClauseWords));
if (topClauseIndex === null) topClauseIndex = -1;
return Math.max(caseIndex,topClauseIndex)
}
exports. firstAnyTopCaseIndex = 
	 firstAnyTopCaseIndexParse;
function firstAnyTopCaseIndexParse(grammar,tokens){
if (!tokens.length) return -1;
var tokensLength = tokens.length;
var caseIndex = 
tokens.find(wordMatch.curry(grammar.phraseWords));
if (caseIndex=== null)    caseIndex = tokensLength;
var topClauseIndex = 
tokens.find(wordMatch.curry(grammar.topClauseWords));
if (topClauseIndex=== null) topClauseIndex = tokensLength;
tokens.find(wordMatch.curry(grammar.phraseWords));
var result = Math.min(caseIndex,topClauseIndex);
if (result === tokensLength) return -1;
else return result;
}

exports. lastJunctionWordIndex = 
	 lastJunctionWordIndexParse;
function lastJunctionWordIndexParse(grammar,tokens){
var Index = tokens.rfind(wordMatch.curry(grammar.junctions));
if (Index=== null) return -1;
return Index;
}
exports. firstJunctionWordIndex = 
	 firstJunctionWordIndexParse;
function firstJunctionWordIndexParse(grammar,tokens){
var Index = tokens.find(wordMatch.curry(grammar.junctions));
if (Index=== null) return -1;
return Index;
}
exports. lastJunction =
	 lastJunctionParse;
function lastJunctionParse(grammar,tokens){
var JI = lastJunctionIndexParse(grammar,tokens);
return tokens.slice(JI[0],JI[1]);
}
exports. lastJunctionIndex =
	 lastJunctionIndexParse;
function lastJunctionIndexParse(grammar,tokens){
// algorithm de
// get last junction word index
// if postpositional
// if directly preceded by phrase then parse previous phrase
// return result

var result = -1;
// get last junction word index
var lastJunctionWI = lastJunctionWordIndexParse(grammar,tokens);
if (lastJunctionWI >= -1){
var postpositional = grammar.wordOrder.postpositional;
// if postpositional
if (postpositional){
// if directly preceded by phrase then parse previous phrase
if (wordMatch(grammar.phraseWords,tokens[lastJunctionWI-1])){
var prevTokens = tokens.slice(0,lastJunctionWI)
result = lastPhraseIndexParse(grammar,prevTokens);
// include junction word
result[1] = result[1]+1;
}
}
}
// return result
return result;
}
exports. firstJunctionIndex =
	 firstJunctionIndexParse;
function firstJunctionIndexParse(grammar,tokens){
// algorithm de
// get next junction word index
// if prepositional
// if directly followed by phrase then parse next phrase
// return result

var result = -1;
// get last junction word index
var lastJunction = lastJunctionWordIndexParse(grammar,tokens);
if (lastJunction >= -1){
var prepositional = grammar.wordOrder.prepositional;
// if prepositional
if (prepositional){
// if directly followed by phrase then parse next phrase
}
}
// return result
return result;
}

exports. lastJunctionPhraseIndex = 
	 lastJunctionPhraseIndexParse;
function lastJunctionPhraseIndexParse(grammar,tokens){
// algorithm de
// be get ob last phrase indexes ya
// if tail word be junction 
// then recurse with previous tokens ya

// be get ob last phrase indexes ya
var lastPhraseI = lastPhraseIndexParse(grammar,tokens);
if (grammar.wordOrder.clauseInitial){
// if tail word be junction 
var tail = tokens[lastPhraseI[0]];
var prevPhraseI = lastPhraseI;
while (wordMatch(grammar.junctions,tail)){
// then recurse with previous tokens ya
var otherTokens = tokens.slice(0,prevPhraseI[0]);
prevPhraseI = lastPhraseIndexParse(grammar,otherTokens);
tail = tokens[prevPhraseI[0]];
}
lastPhraseI[0]=prevPhraseI[0];
}
return lastPhraseI;
}// end of last junction phrase index parse ya

exports. firstJunctionPhraseIndex = 
	 firstJunctionPhraseIndexParse;
function firstJunctionPhraseIndexParse(grammar,tokens){
// algorithm de
// be get ob first phrase indexes ya
// if tail word be junction 
// then recurse with next tokens ya

// be get ob first phrase indexes ya
var firstPhraseI = firstPhraseIndexParse(grammar,tokens);
if (grammar.wordOrder.clauseInitial === false){
// if tail word be junction 
var tail = tokens[firstPhraseI[1]-1];
var nextPhraseI = firstPhraseI;
var otherTokens = tokens;
var phraseEnd = firstPhraseI[1];
while (wordMatch(grammar.junctions,tail)){
// then recurse with next tokens ya
otherTokens = otherTokens.slice(nextPhraseI[1]);
nextPhraseI = firstPhraseIndexParse(grammar,otherTokens);
tail = tokens[nextPhraseI[1]-1];
phraseEnd += nextPhraseI[1];
}
firstPhraseI[1]=phraseEnd;
}
return firstPhraseI;
}// end of first junction phrase index parse ya


exports. lastType = 
	 lastTypeParse;
function lastTypeParse(grammar,tokens){
var indexes = lastTypeIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
}
exports. firstType = 
	 firstTypeParse;
function firstTypeParse(grammar,tokens){
var indexes = firstTypeIndexParse(grammar,tokens);
return tokens.slice(indexes[0],indexes[1]);
}
exports. lastTypeIndex = 
	 lastTypeIndexParse;
function lastTypeIndexParse(grammar,tokens){
// algorithm
// be get ob tokens from last ya
// assume end coincides with last word or length ya
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
// then set word after it as start ya
// return

// be get ob tokens from last ya
// assume end coincides with last word or length ya
var end = tokens.length;
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
var sentenceI 	= lastSentenceWordIndexParse(grammar, tokens);
var topClauseI 	= lastTopClauseWordIndexParse(grammar,tokens);
var caseI 	= lastCaseIndexParse(grammar,tokens);
var subPhraseI 	= lastSubPhraseWordIndexParse(grammar,tokens);
var clauseI	= lastClauseWordIndexParse(grammar,tokens);
var junctionI	= lastJunctionWordIndexParse(grammar,tokens)-1;
var maxI = Math.max(-1, clauseI, subPhraseI, caseI, topClauseI, 
sentenceI, junctionI);
// then set word after it as start ya
var start = maxI+1;
// return
return [start,end];
}
exports. firstTypeIndex = 
	 firstTypeIndexParse;
function firstTypeIndexParse(grammar,tokens){
// algorithm
// be get ob tokens from first ya
// assume start coincides with first word or 0 ya
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word after junction
// then set word before it as end ya
// return

// be get ob tokens from first ya
// assume start coincides with first word or 0 ya
var start = 0;
// if be encounter ob word of sentence or of case 
// or of sub phrase or of clause or of top clause
// or of word before junction
var sentenceI 	= firstSentenceWordIndexParse(grammar, tokens);
var topClauseI 	= firstTopClauseWordIndexParse(grammar,tokens);
var caseI 	= firstCaseIndexParse(grammar,tokens);
var subPhraseI 	= firstSubPhraseWordIndexParse(grammar,tokens);
var clauseI	= firstClauseWordIndexParse(grammar,tokens);
var junctionI	= firstJunctionWordIndexParse(grammar,tokens);
if (junctionI > -1) junctionI++;
// reset -1 to length
var length = tokens.length+1;
if (sentenceI  	<= -1) sentenceI  	= length;
if (topClauseI 	<= -1) topClauseI 	= length;
if (caseI 	<= -1) caseI 		= length;
if (subPhraseI 	<= -1) subPhraseI	= length;
if (clauseI	<= -1) clauseI		= length;
if (junctionI	<= -1) junctionI	= length;
var minI = Math.min(clauseI, subPhraseI, caseI, topClauseI, 
sentenceI, junctionI, length);
// then set word before it as end ya
var end = minI;
// return
return [start,end];
}
