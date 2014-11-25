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
exports.lastSentenceWordIndex = lastSentenceWordIndexParse.curry(grammar);
function lastSentenceWordIndexParse(grammar,tokens){
	var Index = tokens.rfind(wordMatch.curry(grammar.sentenceWords));
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
	var phraseEnder = tokens.find(wordMatch.curry(grammar.phraseWords));
	if (phraseEnder === null) phraseError(grammar, tokens);
	var previousSlice = tokens.slice(0,phraseEnder+1);
	return lastPhraseParse(grammar,previousSlice);
}

/// su last phrase be parse ya
exports.lastPhrase = lastPhraseParse;
function lastPhraseParse(grammar,tokens){
// algorithm:
// 	be find ob last case index ya
//	if postpositional
//		get previous slice, previous case, 
//			previous sentence ender
//		make available one start, else 0 is start
//	if prepositional
//		get sentence ender
//		if available make end, else length is end
//
//
	var lastCaseIndexP = lastCaseIndexParse.curry(grammar);
	var phraseWordIndex = lastCaseIndexP(tokens);
	if (phraseWordIndex === -1) phraseError(grammar, tokens);
	var start, end;
//	if postpositional
	if (grammar.wordOrder.postpositional){
//		get previous slice, previous case, 
	end = phraseWordIndex+1;
	var previousSlice = tokens.slice(0,phraseWordIndex);
	var previousCase = lastCaseIndexP(previousSlice);
//			previous sentence ender
	var previousSentenceEnder = lastSentenceWordIndexParse
		(grammar,previousSlice);
//		make available one start, else 0 is start
	if (previousCase <= previousSentenceEnder)
		start = previousSentenceEnder+1;
	else if(previousCase === -1 && 
			previousSentenceEnder === -1)
		start = 0;
	else start = previousCase+1;
	}
//	if prepositional
	else {
		start = phraseWordIndex;
//		get sentence ender
	var sentenceEnderIndex = lastSentenceWordIndexParse(
			grammar,tokens);
//		if available make end, else length is end
	if (sentenceEnderIndex !== -1)
		end = sentenceEnderIndex;
	else end = tokens.length;
	}
	return tokens.slice(start,end);
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
