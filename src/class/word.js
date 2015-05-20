var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
//var emitter = require("events").EventEmitter;
module.exports = Word;

function Word(language,input,partOfSpeech){

var tokens;
this.be = "Word";
if (typeof input === "string")
tokens = tokenize.stringToWords(input);
else if (typeof input === "object" && input.be === "Word"){
this.head = input.head;
if (input.body) this.body = input.body;
return this;
}
else if (Array.isArray(input)) tokens = input; 
else throw new TypeError(JSON.stringify(input)
+" unknown to "+this.be);


// algorithm de
//
// be order final ob tokens in language
// to tuple of body tokens and head token de 
// su head word be last word
// yand body be rest of tokens ya
//
// be order initial ob tokens in language
// to tuple of body tokens and head token de 
// su head word be first word
// yand body be rest of tokens ya
//
// be order part of speech ob tokens in language 
// by part of speech
// to tuple of body tokens and head token de
// if su partOfSpeech  ob verb 
// yand verb initial then be initial order
// else if su partOfSpeech ob noun 
// yand noun initial then be initial order 
// else if head initial then initial order 
// else final order
//
// if su partOfSpeech be defined then be partOfSpeech order
// else if head initial then initial order ya
// else be final order ya
//
// be set ob this

var wordOrder = language.grammar.wordOrder;
var tokenTuple;
// if su partOfSpeech be defined then be partOfSpeech order

if (partOfSpeech) 
tokenTuple = partOfSpeechOrder(language,tokens,partOfSpeech);
// else if head initial then initial order ya
else if (wordOrder.nounFinal !== true
&& wordOrder.headFinal == false)
tokenTuple = initialOrder(language,tokens);
// else be final order ya
else tokenTuple = finalOrder(language,tokens);

var bodyTokens = tokenTuple[0];
var headToken = tokenTuple[1];

// be set ob this
if (bodyTokens && bodyTokens.length >0)
this.body = bodyTokens;
if (headToken && headToken.length >0)
this.head = headToken;

}// end of Word constructor

// be order final ob tokens in language
// to other tokens and body tokens and head token de 
function finalOrder(language,tokens){
// su head word be last input token
var transDict = language.dictionary.toMwak;
var headTokenI = tokens.length-1;
headWord = translate.word(transDict, tokens[headTokenI]);
// yand body is rest of tokens
var bodyWords;
if (tokens.length >1){
var otherTokens = tokens.slice(0,headTokenI);
bodyWords = translate.array(transDict,otherTokens); 
}
return [bodyWords,headWord];
}


// be order initial ob tokens in language
// to other tokens and body tokens and head token de 
function initialOrder(language,tokens){
// su head word be first input token
var transDict = language.dictionary.toMwak;
var headTokenI = 0;
headWord = translate.word(transDict, tokens[headTokenI]);
// yand body is rest of tokens
var bodyWords;
if (tokens.length >1){
var otherTokens = tokens.slice(headTokenI+1);
otherTokens.reverse();
bodyWords = translate.array(transDict,otherTokens); 
}
return [bodyWords,headWord];
}


// be order part of speech ob tokens in language 
// by part of speech
// to tuple of body tokens and head token de
function partOfSpeechOrder(language,tokens,partOfSpeech){
var wordOrder = language.grammar.wordOrder;
var tokenTuple;
// if su partOfSpeech  ob verb 
// yand verb initial then be return ob initial order
if (partOfSpeech === "verb"){
if (wordOrder.verbFinal === false)
tokenTuple = initialOrder(language,tokens);
else if (wordOrder.verbFinal === true)
tokenTuple = finalOrder(language,tokens);}
// else if su partOfSpeech ob noun 
// yand noun initial then be return ob initial order 
else if (partOfSpeech === "noun"){
if ( wordOrder.nounFinal !== true &&
 wordOrder.headFinal === false)
tokenTuple = initialOrder(language,tokens);
else if (wordOrder.nounFinal)
tokenTuple = finalOrder(language,tokens);}
// else if head initial then be return ob initial order 
else if (wordOrder.headFinal === false 
&& wordOrder.nounFinal !== true)
tokenTuple = initialOrder(language,tokens);
// else be return ob final order
else tokenTuple = finalOrder(language,tokens);
return tokenTuple;
}

Word.prototype.copy = function(){
return new Word(language, JSON.parse(JSON.stringify(this)));
}
function wordInputToMatch(language,input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Word(language, input);
	else if (typeof input === "object"
		&& input.be === "Word")
		return input;
	else if (input === undefined) return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Word");
}
Word.prototype.isSuperset = function(language,input){
	var match = wordInputToMatch(language,input);
	if (match === undefined) return true;
	if (match !== undefined
	   && this.head !== match.head)
		return false;
	if (match.body !== undefined
	   && !this.body.isSuperset(match.body))
		return false;
	return true;
}
Word.prototype.isSubset = function(language,input){
}
Word.prototype.isLike = function(language,input){
	return this.isSuperset(language,input);
}

Word.prototype.toString = function(){ 
	var string = new String();
	if (this.body !== undefined)
		string = this.body.join(" ")+" ";
	if (this.head !== undefined)
	string += this.head;
	return string;
};
Word.prototype.toLocaleString = 
function(language,format,type,conjLevel){
var translation = new String();
var joiner = " ";
if (format && format.joiner) joiner = format.joiner;
var wordOrder = language.grammar.wordOrder;
var verbFinal = wordOrder.verbFinal;
var dict = language.dictionary.fromMwak;

// algorithm de
// be add ob body to output ya
// according to type if initial then reverse body words ya
// be translate ob body words yand be add to translation ya
// syntax formating and color-grapheme synesthesia
// conjugation based on type


// conjugation based on type
var conj = new Object();
if (conjLevel >= 3) conj = language.grammar.conjugation;
if (type){
if (conj.verb &&  type==="v")
return conj.verb(language,this,format,conjLevel);
else if (conj.noun && type ==="n") 
return conj.noun(language,this,format,conjLevel);
else if (conj.mood && type ==="mh") 
return conj.mood(language,this,format,conjLevel);
else if (conj.sentenceHead && type ==="sh") 
return conj.sentenceHead(language,this,format,conjLevel);
else if (conj.phraseHead && type ==="ch") 
return conj.phraseHead(language,this,format,conjLevel);
else if (conj.verbHead && type ==="vh") 
return conj.verbHead(language,this,format,conjLevel);
else if (conj.clauseHead && type ==="lh") 
return conj.verbHead(language,this,format,conjLevel);
else if (conj.junctionHead && type ==="jh") 
return conj.verbHead(language,this,format,conjLevel);
}
if (conj.word)
return conj.word(language,this,format,conjLevel);



// be add ob body to output
var bodyWords = new Array();
if (this.body !== undefined) bodyWords = this.body;
var bodyWords = bodyWords.concat(this.head);
// according to type if initial then reverse body words ya
if (bodyWords.length > 1){
var i, translArray, translWord, adword;
if (type){
if (type==="v" && wordOrder.verbFinal === false)
bodyWords.reverse();
else if (type==="n" && wordOrder.nounFinal === false)
bodyWords.reverse();
else if (type.search(/h/) >= 0 && wordOrder.typeFinal === false)
bodyWords.reverse();
}
else if (wordOrder.nounFinal === false)
bodyWords.reverse();
}


// be translate ob body words yand be add to translation ya
translArray = translate.array(dict,bodyWords);
for (i = 0; i < translArray.length; i++){
translWord = translArray[i];
translation+= translWord;
if (i <translArray.length-1)
translation+= joiner;
}


// syntax formating and color-grapheme synesthesia
if (format){
if (type && format.typeGlyphsTransform)
translation = format.typeGlyphsTransform(translation,type);
else if (format.glyphsTransform)
translation = format.glyphsTransform(translation);
}


if (format && format.ipa && conj && conj.ipa) 
translation = conj.ipa(translation);
return translation;
}
