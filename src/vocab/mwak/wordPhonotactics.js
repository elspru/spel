#!/usr/bin/js
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file wordPhonotactics.js for word sonority ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict";

var highOrd = require("../../lib/hof");
/// su hello be public function de
function hello(input){
	"use strict";
/// be return bo quo hello world quo te do
	return "hello world "+ input;
}

/// su phoneme selection be based on http://phoible.org/parameters 
///	WALS consonant-vowel ratio"s and voicing preference ya
var Bit1Alphabet = 	["m","i"];
var Glyph3Alphabet = 	["m","k","i"];
var Bit2Alphabet = 	["m","k","i","y"];
var Glyph5Alphabet = 	["m","k","i","y","p",];
var Glyph7Alphabet = 	["m","k","i","a","y","p","w"];
var Bit3Alphabet = 	["m","k","i","a","y","p","w","n"];
var Glyph12Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l"];
var Bit4Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l","h","f",".","c"];
var Bit4AlphabetM = 	["m","k","i","y","p","w",
    		       	 "n","s","t","l","h","f",".","c"];
var Glyph19Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l","h","f",".","c",
		       	 "e","o","r"];
var Glyph24Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l","h","f",".","c",
		       	 "e","o","r","b","g","d","z","j"];
var Glyph24AlphabetM = 	["m","k","i","y","p","w",
    		       	 "n","s","t","l","h","f",".","c",
		       	 "r","b","g","d","z","j"];
var Glyph31Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l","h","f",".","c",
		       	 "e","o","r","b","g","d","z","j",
			 "v","q","7","_","6","1","x",];
var Bit5Alphabet = 	["m","k","i","a","y","u","p","w",
    		       	 "n","s","t","l","h","f",".","c",
		       	 "e","o","r","b","g","d","z","j",
			 "v","q","9","5","4","1","x","6"];
var alphabet = Bit1Alphabet;
//var alphabet = Glyph3Alphabet;
var alphabet = Bit2Alphabet;
//var alphabet = Glyph5Alphabet;
//var alphabet = Glyph7Alphabet;
//var alphabet = Bit3Alphabet;
//var alphabet = Glyph12Alphabet;
var alphabet = Bit4Alphabet;
var alphabet = Bit4AlphabetM;
//var alphabet = Glyph19Alphabet;
var alphabet = Glyph24Alphabet;
var alphabet = Glyph24AlphabetM;
//var alphabet = Glyph31Alphabet;
//var alphabet = Bit5Alphabet;
var comment = "C16G kya";
var strictPhonotactics = true;
var loosePhonotactics = false;
var noPhonotactics = false;
var initialAffricates = false;
var finalAffricates = false;
var sonorityPlateau = false;
var sonorityInversion = false;
var samePhonemeTwice = false;// same phoneme twice
var uniquePhonemes = false; // each word with unique phonemes
var plosiveNasalInitials = false; // pm, kn, tq, etc
var adjacentGlides = false; // yw wy combinations
var initialSonorityDifference = 0;
var totalSonorityDifference = 0;
var yAfterI = false;
var wAfterU = false;
if (noPhonotactics) noPhonotacticsSet();
if (loosePhonotactics) loosePhonotacticsSet();
if (strictPhonotactics) strictPhonotacticsSet();
function noPhonotacticsSet(){
	initialAffricates = true;
	finalAffricates = true;
	sonorityPlateau = true;
	sonorityInversion = true;
	samePhonemeTwice = true;// same phoneme twice
	uniquePhonemes = false; // each word with unique phonemes
	plosiveNasalInitials = true; // pm, kn, tq, etc
	adjacentGlides = true; // yw wy combinations
	initialSonorityDifference = 0;
	totalSonorityDifference = 0;
	adjacentGlides = true;
    yAfterI = true;
    wAfterU = true;
}
function loosePhonotacticsSet(){
	finalAffricates = true;
	sonorityPlateau = true;
	uniquePhonemes = false; 
	plosiveNasalInitials = true;
 	initialSonorityDifference = 0;
 	totalSonorityDifference = 0;
	sonorityInversion = false;
	samePhonemeTwice = false;// same phoneme twice
	adjacentGlides = false;
    yAfterI = true;
    wAfterU = true;
}
function strictPhonotacticsSet(){
	plosiveNasalInitials = false;
	sonorityPlateau= false;
	finalAffricates= false;
	uniquePhonemes = true; 
	adjacentGlides = false; 
 	initialSonorityDifference = 0x20;
	totalSonorityDifference = 0x20;
	sonorityInversion = false;
	samePhonemeTwice = false;// same phoneme twice
	adjacentGlides = false;
    yAfterI = false;
    wAfterU = false;
}
// su phoneme sonority be dictionary of glyph with unit8 ya
/*Dict<glyph,uint8>*/ alphabet.sonority = {
	"i":0x70,
	"a":0x70,
	"u":0x70,
	"e":0x70,
	"o":0x70,
	"2":0x70,
	"1":0x70,
	"y":0x6C,
	"w":0x6C,
	"r":0x54,
	"l":0x51,
	"m":0x40,
	"n":0x40,
	"q":0x40,
	"h":0x30,
	"x":0x30,
	"6":0x30,
	"f":0x30,
	"v":0x30,
	"c":0x30,
	"C":0x30,
	"j":0x30,
	"s":0x30,
	"z":0x30,
	"p":0x10,
	"b":0x10,
	"t":0x10,
	"d":0x10,
	"k":0x10,
	"g":0x10,
	".":0x10
};
// voicing for which are distinguishing those that are strict

alphabet.voicing = {
	"al":[".","h","i","a","e","o","u","y",
		"r","l","w","m","n","1","2","q","4","5"],
	"un":["p","t","k","f","s","c","x"],
	"vo":["b","d","g","v","z","j","6"]
}
alphabet.voicing.getType = function(glyph){
	var voicing = alphabet.voicing;
	if(voicing["al"].indexOf(glyph)!==-1)
		return "al";
	if(voicing["un"].indexOf(glyph)!==-1)
		return "un";
	if(voicing["vo"].indexOf(glyph)!==-1)
		return "vo";
	 /*else*/ return null;
};
alphabet.voicing.checkType = function(glyph,type){
	if(alphabet.voicing[type].indexOf(glyph)!==-1){
		return true;
	} /*else*/ return false;
};

// su phoneme class be dictionary of glyph with string ya
alphabet.phonemeClass = {
	".":["."],
	"H":["h"],
	"V":["i","a","e","o","u","2","1"],
	"C":["p","t","k","f","s","c","y","r","l","w","q",
		"m","n","x","b","d","g","z","j","v","6"],
	"T":["4","5"],
	"n":["n","m","q"], // nasals
	"f":["f","s","c","x","h","v","z","j","6"], // fricatives
	"p":["p","t","k","b","d","g"], // plosives
	"l":["l"], //liquids
	"t":["r"], // trills
	"g":["y","w"] // glides
}
alphabet.phonemeClass.getType = function(glyph){
	var phonCla = alphabet.phonemeClass;
	if(phonCla["V"].indexOf(glyph)!==-1)
		return "V";
	if(phonCla["C"].indexOf(glyph)!==-1)
		return "C";
	if(phonCla["H"].indexOf(glyph)!==-1)
		return "H";
	if(phonCla["T"].indexOf(glyph)!==-1)
		return "T";
	if(phonCla["."].indexOf(glyph)!==-1)
		return ".";
	 /*else*/ return null;
};
alphabet.phonemeClass.checkType = function(type,glyph){
	if(alphabet.phonemeClass[type].indexOf(glyph)!==-1){
		return true;
	} /*else*/ return false;
};

// su syllable weight be array of string ya
var /*array<String>*/ syllableWeight = [
	[".","V"],
	["H","V"],
	["H","V","T","H"],
	["C","V"],
	["C","V","T","H"],
	["C","C","V","H"],
	["C","C","V","T"],
   	["C","V","C","H"],
   	["C","V","T","C"],
	["C","C","V","C"],
	["C","C","V","T","C","H"],
/*	["C","V","C","C"],
	["C","V","T","C","C","H"] */
];

// su words generate be generate bo word array for syllable with
function alphabetCheck(type,glyph){
	return alphabet.phonemeClass.checkType(type,glyph);};
// alphabet ya
function /*array<String>*/ wordsGenerate(
		/*String*/ alphabet, /*String*/ syllable){
	"use strict";
	// 
	
	function alphabetFilter(alphabet,type){
		return alphabet.filter(alphabetCheck.curry(type));
	};
	var alphabetConsonants = alphabetFilter(alphabet,"C");
	var alphabetVowels = alphabetFilter(alphabet,"V");
	var alphabetPauses = alphabetFilter(alphabet,".");
	var alphabetTones = alphabetFilter(alphabet,"T");
	var alphabetHyphens = alphabetFilter(alphabet,"H");
	//console.log(alphabetConsonants);
	//console.log(alphabetVowels);
	//console.log(alphabetPauses);
/// be create bo word for each element with glyph appended ya
	var result = new Array("");
	function appendNext(glyphs, elem, index, elemString){
		// expand glyphs by prepending elem
		// can check that it is compatible type
		// i.e. if glyph pripriority of last of elem is
		// higher or vowel then can append.
		// if following a vowel then reverse.
		var previousGlyph = ""; 
		if (elem.length>0) 
			previousGlyph = elem[elem.length-1];
		//if (alphabetVowels.indexOf(previousElement)!==-1){
		//	&& alphabet.previous
		//	&& alphabet.phonemePhonotactics(previousElement) >=
		//	&& alphabet.
		var sonority = alphabet.sonority;
		var vowels = alphabetVowels;
		var conson = alphabetConsonants;
		function glyphTypes(glyphs){
			var glyphsArray = glyphs.split("");
			return glyphsArray.expand(alphabet.
					phonemeClass.getType);
		};
		var hasVowel = false;
		var elemStringTypes; 
		if (elemString.length>=1){
			elemStringTypes= glyphTypes(elem);
		if (elemStringTypes.indexOf("V")!==-1){
			hasVowel = true;
		}
		}
		function appendGlyph(glyph){
		// if previous same then none;
			if (!samePhonemeTwice 
			     && previousGlyph === glyph)
				return null;
		// if previous vowel then return proper
		//	if (alphabetCheck("V",previousGlyph))
		//		return elem+glyph;
		// if hyphen return proper
			if (alphabetCheck("H",glyph))
				return elem+glyph;
		// if this or previous tone return proper
	//		if (alphabetCheck("T",glyph)|| 
	//		    alphabetCheck("T",previousGlyph))
	//			return elem+glyph;
		// no glides together
			if (!adjacentGlides
			    && alphabetCheck("g",glyph)
			    && alphabetCheck("g",previousGlyph))
				return null;
		// no "pm" initials
		//	if (previousGlyph==="p" && glyph === "m")
		//		return null;
		// no plosive-nasal initials
			
			if (!plosiveNasalInitials && !hasVowel &&
			    alphabetCheck("p",previousGlyph)&&
			    alphabetCheck("n",glyph))
				return null;
			if (!yAfterI && hasVowel &&
			    previousGlyph == 'i' &&
			    glyph == 'y' )
				return null;
			if (!wAfterU && hasVowel &&
			    previousGlyph == 'u' &&
			    glyph == 'w' )
				return null;
		// no plosive-nasal finals
		//	if (hasVowel &&
		//	    alphabetCheck("n",previousGlyph)&&
		//	    alphabetCheck("p",glyph))
		//		return null;
			var previousLevel = sonority[previousGlyph];
			var thisLevel = sonority[glyph];
			//if (previousGlyph == "")
			//	previousLevel = 0xFF;

		 //if sonority plateau then none
			if (!sonorityPlateau 
				&& thisLevel === previousLevel
				&& !alphabetCheck("V",glyph))
				return null;

		// if elem contains this glyph then none
		if (uniquePhonemes && elem.indexOf(glyph)!==-1)
				return null;
		// if sonority difference less than some amount
		//		then return none
			if (!hasVowel 
			   && initialSonorityDifference > 0
			   && !alphabetCheck("V",glyph)
			   //&& !alphabetCheck("V",previousGlyph)
			   && Math.abs(thisLevel-previousLevel)
			   <initialSonorityDifference)
				return null;
			if (totalSonorityDifference > 0
			   && !alphabetCheck("V",glyph)
			   && !alphabetCheck("V",previousGlyph)
			   && Math.abs(thisLevel-previousLevel)
			   <totalSonorityDifference)
				return null;

		// if previous higher before vowel then none;
			if (!sonorityInversion
			   && !hasVowel && previousLevel > thisLevel)
				return null;
		// if previous lower after vowel then none;
			if (!sonorityInversion
			   && hasVowel && previousLevel < thisLevel){
		// unless final affricates
				if (!finalAffricates)
					return null;
		// then allow affricates
				if (!alphabetCheck("p",previousGlyph)
				  || !alphabetCheck("f",glyph))
					return null;
			}
		// if previous with different voice then none;
			var alvoice = alphabet.voicing;
			var thisVoice =	alvoice.getType(glyph);
			var previousVoice;
		// if previous is none set to all voice
			if (previousGlyph==="")
				previousVoice="al";
			else previousVoice=alvoice.getType(previousGlyph);

		// if neither is all voice and have different
		// voices then return null ya
			if (thisVoice !== "al" && previousVoice!=="al" &&
					previousVoice !== thisVoice)
				return null;
		// else return elem with glyph;
			return elem+glyph
		};
		return glyphs.expand(appendGlyph);
	}
	var i;
	for (i=0;i<syllable.length;i++){
	//for (i in syllable){
	if (syllable[i]=="C"){
		result = result.expand(appendNext.curry(alphabetConsonants));
	}else if(syllable[i]=="V"){
		result = result.expand(appendNext.curry(alphabetVowels));
	}else if(syllable[i]=="."){
		result = result.expand(appendNext.curry(alphabetPauses));
	}else if(syllable[i]=="H"){
		result = result.expand(appendNext.curry(alphabetHyphens));
	}else if(syllable[i]=="T"){
		result = result.expand(appendNext.curry(alphabetTones));
	}
	}
	return result;
};

// su main be function ya
function main(alphabet,syllableWeight){
	var single = true; // if  single word per line
	"use strict";
	// generate all words based on syllable weight
	var allWords = syllableWeight.expand(wordsGenerate.curry(alphabet));
	loosePhonotacticsSet();
	var looseWords = syllableWeight.expand(wordsGenerate.curry(alphabet));
	var userWords = allWords.expand(function(word){
		if (looseWords.indexOf(word)!==-1)
			return null;
		return word;
	});
	if (userWords.length>0) allWords=userWords;
	// print 12 words per row
	var wordsPerRow = 12;
	if (single) wordsPerRow = 1;
	var allWordsLength = allWords.length;
	var fullRowsAmount = parseInt(allWordsLength /wordsPerRow);
	if (!single) fullRowsAmount++; 
	var remainingAmount = allWordsLength % wordsPerRow;
	var out;
	var i;
	for (i=0; i<fullRowsAmount;i++){
		out = allWords.slice(i*wordsPerRow,(i+1)*wordsPerRow);
		out = out.join(" ");
		// quote grammar words
		if (alphabetCheck("V",out[out.length-1])
|| alphabetCheck("T",out[out.length-1])) out = out + " li";
		// if single make into nominative
		if (single ) out = out + " hu "+comment+" ya";
		console.log(out);
	}
}
main(alphabet,syllableWeight);
