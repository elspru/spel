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
exports.lastCaseIndex = lastCaseIndexParse.curry(grammar);
function lastCaseIndexParse(grammar,tokens){
	var Index =tokens.rfind(wordMatch.curry(grammar.phraseWords));
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
function phraseError(tokens){
		throw new Error("su quo te "+tokens.join(" ")+" quo ted"
			+" be lack ob valid phrase ender"
			+" like one of ar wu "
			+grammar.phraseWords.join(" wu ")
			+" ya");
}
/// su first phrase be parse ya
exports.firstPhrase = firstPhraseParse.curry(grammar);
function firstPhraseParse(grammar,tokens){
	var phraseEnder = tokens.find(wordMatch.curry(grammar.phraseWords));
	if (phraseEnder === null) phraseError(tokens);
	var previousSlice = tokens.slice(0,phraseEnder+1);
	return lastPhraseParse(grammar,previousSlice);
}

/// su last phrase be parse ya
exports.lastPhrase = lastPhraseParse.curry(grammar);
function lastPhraseParse(grammar,tokens){
	var lastCaseIndexP = lastCaseIndexParse.curry(grammar);
	if (lastCaseIndexP === -1) phraseError();
	var phraseEnder = lastCaseIndexP(tokens);
	var end = phraseEnder+1;
	var previousSlice = tokens.slice(0,phraseEnder);
	var previousCase = lastCaseIndexParse(grammar,previousSlice);
	var previousSentenceEnder = lastSentenceWordIndexParse
		(grammar,previousSlice);
	var start;
	if (previousCase <= previousSentenceEnder)
		start = previousSentenceEnder+1;
	else if(previousCase === -1 && 
			previousSentenceEnder === -1)
		start = 0;
	else start = previousCase+1;
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
	// go backwards through tokens
	for (i; i >= 0; i--){
		thisToken = tokens[i];
		if (i===0) quoteExtractedTokens.unshift(thisToken);
		else if (wordMatch(singleQuotes,thisToken)){
			quote = new Type(language,[tokens[i-1],thisToken])
			quoteExtractedTokens.unshift(quote);
			i--;
		}
		else quoteExtractedTokens.unshift(thisToken);
	}
	return quoteExtractedTokens;
	//return tokens.expand(function(token,index,tokenArray){
	//	var prevToken=tokenArray[index-1];
	//	var thisToken=token;//tokenArray[index];
	//	var nextToken=tokenArray[index+1];
	//	var nextNextToken=tokenArray[index+2];
	//	// yi yi yi yi edge case not supported ya
	//	var prevTokenQuoteBool  = wordMatch(singleQuotes,prevToken);
	//	var thisTokenQuoteBool  = wordMatch(singleQuotes,thisToken);
	//	var nextTokenQuoteBool  = wordMatch(singleQuotes,nextToken);
	//	if ( prevTokenQuoteBool
	//		&& thisTokenQuoteBool
	//		&& nextTokenQuoteBool)
	//		throw Error("too many single word quote "
	//			+ "words in a row ya\n"+thisToken
	//			+nextToken+" "+nextNextToken+'\n'
	//			+"use multi word quote instead please ya");
	//	// be use bo multi word quote instead do
	//	//// if previous quote and this quote
	//	////  then return quote
	//	//if (wordMatch(singleQuotes,prevToken)
	//	//	&& wordMatch(singleQuotes,thisToken))
	//	//	return String(prevToken+" "+thisToken);

	//	// if followed by quote word that isn't quoted
	//	//  then skip
	//	if (nextTokenQuoteBool)
//	//		&& !wordMatch(singleQuotes,nextNextToken))
	//		return null;
	//	// if is quote then return quote;
	//	if (thisTokenQuoteBool)
	//		return String(prevToken+" "+thisToken);
	//	// else return this token
	//	return thisToken;
	//});
	
}
