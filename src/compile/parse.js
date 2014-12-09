"use strict"
var hof = require("../lib/hof");
var tokenize = require("./tokenize");
var Grammar = require("../lang/grammar");
var Quote = require("../type/quote");
var Type = require("../type/type");
var grammar = new Grammar();
/// tokens be parse ya
//exports = new Object;
exports.wordMatch = wordMatch;
function wordMatch(wordArray,word){
	if (wordArray.indexOf(word)!==-1)
		return true;
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
exports.firstSingleWordQuote = firstSingleWordQuoteParse.curry(grammar);
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
/// be parse bo surrounding quote de
exports.surroundingQuote = surroundingQuoteParse.curry(grammar);
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
	var Index = tokens.rfind(
			wordMatch.curry(grammar.phraseWords));
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
exports.firstSentenceWordIndex = firstSentenceWordIndexParse.curry(grammar);
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
exports.firstPhrase = firstPhraseParse;
function firstPhraseParse(grammar,tokens){
var phraseHeadIdx = firstCaseIndexParse(grammar,tokens);
if (phraseHeadIdx === null) phraseError(grammar, tokens);
var otherSlice;
var wordOrder = grammar.wordOrder;

if (wordOrder.postpositional=== false)
otherSlice = tokens.slice(phraseHeadIdx);

if (wordOrder.clauseInitial === false){
// if case before clause then slice before it ya
var nextSlice = otherSlice.slice(1);
var nextCaseI = firstCaseIndexParse(grammar,nextSlice);
var nextClauseI = firstClauseWordIndexParse(grammar,nextSlice);
if (nextCaseI !== -1)
if (nextClauseI === -1|| nextCaseI < nextClauseI) 
 otherSlice = otherSlice.slice(0,nextCaseI+1); 
// if nextClause available, set it's end as phrase end ya
else if (nextClauseI !== -1){
var clauseIdxs = adjacentClauseIndexParse(grammar,nextSlice);
otherSlice = otherSlice.slice(0,clauseIdxs[1]+1);
return otherSlice;
}
} 
else { otherSlice = tokens.slice(0,phraseHeadIdx+1); }

var resultI = lastPhraseIndexParse(grammar,otherSlice);
var result;
// if clause final, include start
if (wordOrder.clauseInitial=== false)
result = tokens.slice(phraseHeadIdx,resultI[1]+phraseHeadIdx);
else result = tokens.slice(resultI[0],resultI[1]);
return result;
}/* function's end */

/// su last phrase be parse ya
exports.lastPhrase = lastPhraseParse;
function lastPhraseParse(grammar,tokens){
	var indexes = lastPhraseIndexParse(grammar,tokens);
	return tokens.slice(indexes[0],indexes[1]);
}
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
//			previous sentence ender
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
	if (clauseInitial)
	var phraseWordIndex = lastCaseIndexP(tokens);
	else
	var phraseWordIndex = firstCaseIndexParse(grammar,tokens);
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
	var previousCase = lastCaseIndexP(previousSlice);
//			previous sentence ender
	var previousSentenceEnder = lastSentenceWordIndexParse
		(grammar,previousSlice);
//		be make su available one ob start ya
//		else 0 be start ya
	start = Math.max(previousCase,previousSentenceEnder,-1);
	start += 1;
	//if (previousCase <= previousSentenceEnder)
	//	start = previousSentenceEnder+1;
	//else if(previousCase === -1 && 
	//		previousSentenceEnder === -1)
	//	start = 0;
	//else start = previousCase+1;
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
exports.firstSentence = firstSentenceParse.curry(grammar);
function firstSentenceParse(grammar,tokens){
	var sentenceEnder = tokens.find(wordMatch.curry(grammar.sentenceWords));
	if (sentenceEnder === null) sentenceError(tokens);
	// if followed by space include it
	if (tokenize.isSpace(tokens[sentenceEnder+1]))
		sentenceEnder=sentenceEnder+1;
	return tokens.slice(0,sentenceEnder+1);
}
exports.lastSentence = lastSentenceParse.curry(grammar);
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
// extracts quotes from word tokens, turning then into strings,
// splices them back in, and returns result.
function quotesExtract(language, tokens){
	// stencil all single word quotes;
	// return result
	var singleQuotes = grammar.quotes.singleWord;
	var quoteExtractedTokens = new Array();
	var i = tokens.length-1, 
	    thisToken, quote;
	// if type final
	// go backwards through tokens
	if (language.grammar.wordOrder.typeFinal){
	for (i; i >= 0; i--){
		thisToken = tokens[i];
		if (i===0) quoteExtractedTokens.unshift(thisToken);
		else if (wordMatch(singleQuotes,thisToken)){
			quote = new Type(language,[tokens[i-1],thisToken])
			quoteExtractedTokens.unshift(quote);
			i--;
		}
		else quoteExtractedTokens.unshift(thisToken);
	}}
	// else go forwards
	else { // type initial
	for (i=0; i < tokens.length; i++){
		thisToken = tokens[i];
		if (i===tokens.length-1) 
			quoteExtractedTokens.push(thisToken);
		else if (wordMatch(singleQuotes,thisToken)){
			quote = new Type(language,
					[thisToken,tokens[i+1]])
			quoteExtractedTokens.push(quote);
			i++;
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
