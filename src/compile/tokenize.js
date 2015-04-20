"use strict"
var hof = require("../lib/hof");
//module.exports = exports;
/// su tokenizer de
//var exports = new Object;
/// su stringToGlyphs be convert bo string to utf8 array ya
exports.stringToGlyphs= stringToGlyphs;
function stringToGlyphs(/*string*/string){
	return string.split('');
};
/// su glyphsToTokens bo glyphs utf8-array to word and space tokens de
/// be start of algorithm ya
/// be stencil bo glyphs with previous glyph 
///	by boundary detect to boundaries ya
/// be filter out bo empty value from boundaries ya
/// be stencil bo boundaries with previous boundary 
///	by slice glyphs to tokens ya
/// be optional filter out bo space tokens ya
/// be end of algorithm ya
///
function boundaryDetect(length,/*2 glyph array*/twoGlyphs,index){
	/// be algorithm bo quo te 
	///	get type of first and second glyph
	var previousGlyph =  twoGlyphs[0];
	var currentGlyph =  twoGlyphs[1];
	/// 	if type is boundary return index
	if (index+1===length) return index;
	if (previousGlyph==null) return index;
	///	if type is different return index
	if (/\s/.test(previousGlyph)!==/\s/.test(currentGlyph))
		return index;
	///	else return null ya
	return null;
}
exports.glyphsToTokens= glyphsToTokens;
function glyphsToTokens(/*glyph array*/glyphs){
//return tokens;
var glyphs = stringToGlyphs(string);
///	by boundary detect to boundaries ya
var boundaries = new Array();
//glyphs.stencil([-1,0],boundaryDetect.curry(glyphs.length));
var glyphsLength = glyphs.length;
var index;
for (index=0;index<=glyphsLength;index++){
	/// 	if type is boundary return index
	if (index===0||index===glyphsLength) boundaries.push(index);
	///	if type is different return index
	else if (/\s/.test(glyphs[index-1])!==/\s/.test(glyphs[index]))
		boundaries.push(index);
}
var tokens = new Array();
var boundariesLength = boundaries.length;
var startBoundary, endBoundary;
for (index=1;index<boundariesLength;index++){
	// return null if token is space
	startBoundary = boundaries[index-1];
	endBoundary = boundaries[index];
	tokens.push(
		glyphs.slice(startBoundary,endBoundary)
		.join(''));
	
}
return tokens;
};


exports.glyphsToWords = glyphsToWords;
function glyphsToWords(/*array*/glyphs){
var tokens = glyphsToTokens(glyphs);
/// be filter bo word tokens ya
var words = tokens.filter(isWord);
return words;
}
exports.stringToTokens = stringToTokens;
function stringToTokens(/*string*/string){
var glyphs = stringToGlyphs(string);
//var tokens = 
return glyphsToTokens(glyphs);
//return tokens;
}
exports.stringToWords = stringToWords;
function stringToWords(/*string*/string){
var glyphs = stringToGlyphs(string);
//var tokens = glyphsToTokens(glyphs);
///// be filter bo word tokens ya
////var words = 
//return tokens.filter(isWord);
//return words;
/// be stencil bo glyphs with previous glyph 
///	by boundary detect to boundaries ya
//
var boundaries = new Array();
//glyphs.stencil([-1,0],boundaryDetect.curry(glyphs.length));
var glyphsLength = glyphs.length;
var index;
for (index=0;index<=glyphsLength;index++){
	/// 	if type is boundary return index
	if (index===0||index===glyphsLength) boundaries.push(index);
	///	if type is different return index
	else if (/\s/.test(glyphs[index-1])!==/\s/.test(glyphs[index]))
		boundaries.push(index);
}
/// be stencil bo boundaries with previous boundary 
///	by glyphs slice to tokens ya
//var words = boundaries.stencil([-1,0],glyphsSlice);
//function glyphsSlice(sliceBounds){
//	if (sliceBounds[0]==null)
//		return null;
//	// return null if token is space
//	if (isSpace(glyphs[sliceBounds[0]])) return null;
//	return glyphs.slice(sliceBounds[0],sliceBounds[1]).join('');
//}
var words = new Array();
var boundariesLength = boundaries.length;
var startBoundary, endBoundary;
for (index=1;index<boundariesLength;index++){
	// return null if token is space
	startBoundary = boundaries[index-1];
	endBoundary = boundaries[index];
	if (!isSpace(glyphs[startBoundary])){
		words.push(
			glyphs.slice(startBoundary,endBoundary)
			.join(''));
	}
}
return  words;
//return tokens;
}

exports.isWord = isWord;
function isWord(string){
	return (/\S/.test(string)
		&& !/\s/.test(string));
}
exports.isSpace = isSpace;
function isSpace(string){
	return (/\s/.test(string)
		&& !/\S/.test(string));
}
exports.isTokens = isTokens;
function isTokens(inArray){
	if (!Array.isArray(inArray))
		return false;
	// if only one element, must be token
	if (inArray.length === 1)
		return true;
	var firstSpace = inArray.find(isSpace);
	var firstWord = inArray.find(isWord);
	if (firstWord !== null && firstSpace !== null)
		return true;
	return false;
}
exports.isWords = isWords;
function isWords(inArray){
	if (!Array.isArray(inArray))
		return false;
	var firstSpace = inArray.find(isSpace);
	var firstWord = inArray.find(isWord);
	if (firstWord !== null && firstSpace === null)
		return true;
	return false;
}

// recognize word based on phoneme class

// su phoneme class be dictionary of glyph with string ya
var phonemeClass = {
	".":["."],
	"H":["h"],
	"V":["i","a","e","o","u","6","I"],
	"C":["p","t","k","f","s","c","y","r","l","w","q",
		"m","n","x","b","d","g","z","j","v","C"],
	"T":["^","_"],
	"n":["n","m","q"], // nasals
	"f":["f","s","c","C","x","h","v","z","j"], // fricatives
	"p":["p","t","k","B","D","G"], // plosives
	"l":["l"], //liquids
	"t":["r"], // trills
	"g":["y","w"] // glides
}

function glyphClassGet(glyph){
if(phonemeClass["V"].indexOf(glyph)!==-1) return "V";
else 
if (phonemeClass["C"].indexOf(glyph)!==-1) return "C";
else 
if (phonemeClass["H"].indexOf(glyph)!==-1) return "H";
else return " ";
};


exports.wordClass = wordGlyphClassGet;
function wordGlyphClassGet(word){
var i;
var result = new String();
for (i=0;i<word.length;i++){
result += glyphClassGet(word[i]);
}
return result;
};


exports.isGrammarWord = isGrammarWord;
var grammarWords = ["CV","CCV"];
function isGrammarWord(word){
var glyphClass = wordGlyphClassGet(word);
if (grammarWords.indexOf(glyphClass) !== -1) return true;
/* else */ return false;
}
