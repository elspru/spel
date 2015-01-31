
var tokenize = require("../compile/tokenize");
var hof = require("../lib/hof");
var parse = require("../compile/parse");
var Sentence = require ("./sentence");
var err = require("../lib/error");
module.exports = Text;
/// su sentence be object ya
function Text(language, input, conjugationLevel) {
	this.be = "Text";
	var tokens, i;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);
	}
	else if (Array.isArray(input)) tokens = input;
	else if (typeof input === "object"
	    && this.be === "Text"){
		// assume json object
		if (input.title)
		this.title = input.title;
		this.sentences = new Array();
		for (i=0; i< input.sentences.length; i++)
			this.sentences[i]=new Sentence(language,
input.sentences[i],conjugationLevel);
		return this;
	}
	else throw new TypeError(input+" is not a valid Phrase input");
	var title;
	if (title)
	this.title = title;
	//this.string = tokens.join("");
	//this.tokens = tokens;
	// extract quotes
	tokens = parse.quotesExtract(language,tokens);
	var previousTokens = tokens;
	var previousLength = 0;
	var sentences = new Array();
	var sentenceIndex = 0;
	var sentence,
	    firstSentence;
	while (previousTokens.length>0 &&
		previousTokens.length != previousLength){
	// avoid infinite loops from starter garbage
		previousLength = previousTokens.length;
firstSentence = parse.firstSentence( language.grammar,previousTokens);
		if (firstSentence.length === 0)
			break;
		sentence  = new Sentence(language,
firstSentence, conjugationLevel);
		sentences[sentenceIndex] = sentence;
		sentenceIndex++;
		previousTokens = previousTokens.slice(firstSentence.length,
				previousTokens.length);
	}
	//phrases.reverse();
	this.sentences = sentences;
	return this;
}
Text.prototype.copy = function(language){
 	return new Text(language, JSON.parse(JSON.stringify(this)));
}
/// su sentenceGet be get bo sentence by index ya
Text.prototype.sentenceGet = sentenceGet;
function sentenceGet(input){
	if (typeof input === "number")
		return this.byIndexSentenceGet(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindGet(language,input);
	// else
	throw new TypeError("unsupported type:"+input);
}

Text.prototype.byIndexSentenceGet = byIndexSentenceGet;
function byIndexSentenceGet(index){
	err.indexCheck(this.sentences.length,index);
	return this.sentences[index];
}
function sentenceInputToMatch(language, input){
if (input === undefined) 
throw new TypeError("undefined input for "
+" sentenceInputToMatch of Text object");
if (typeof input === "string"|| Array.isArray(input))
return new Sentence(language,input);
else if (input.be === "Sentence")
return input;
else throw new TypeError("unsupported type:"+input
+"for  sentenceInputToMatch of Text object");
}
Text.prototype.indexOf = sentenceFindGet;
Text.prototype.sentenceFindGet = sentenceFindGet;
function sentenceFindGet(language,input){
	var match =
sentenceInputToMatch(language,input);
	// reverse iterate through sentences or rfind
	// if isLike match, then return
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(language,match)});
	if (index === null) index = -1;
	return index; //this.byIndexSentenceGet(index);
}
// select like in SQL returns all matches as array
Text.prototype.select = sentenceFindAllGet;
function sentenceFindAllGet(language,input){
	var match =
sentenceInputToMatch(language,input);
	// filter sentences with
	// if isLike match, then return
	var sentences = this.sentences.filter(
	  function(sentence){
		return sentence.isLike(language,match);
	   });
	var newText = new Text(language, sentences.join("\n"));
	return newText;
}
Text.prototype.sentenceDelete = function(input){
	if (typeof input === "number")
		return this.byIndexSentenceDelete(input);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindDelete(input);
	// else
	throw new TypeError("unsupported type:"+input);
}
Text.prototype.sentenceFindDelete = sentenceFindDelete;
function sentenceFindDelete(language,input){
	var match =
sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(match)});
	return this.byIndexSentenceDelete(index);
}
Text.prototype.byIndexSentenceDelete = byIndexSentenceDelete;
function byIndexSentenceDelete (index){
	err.indexCheck(this.sentences.length,index);
	// remove phrase from array.
	var newText = this;//.copy();
	newText.sentences.splice(index,1);
	return newText;
}
Text.prototype.sentenceUpdate = function(language,input,replacement){
	if (typeof input === "number")
		return this.byIndexSentenceUpdate(language,input,replacement);
	if (typeof input === "string"
		|| Array.isArray(input))
		return this.sentenceFindUpdate(language,input,replacement);
	// else
	throw new TypeError("unsupported type:"+input+" "+replacement);
}
Text.prototype.sentenceFindUpdate = sentenceFindUpdate;
function
sentenceFindUpdate(language,input,replacement){
	var match =
sentenceInputToMatch(language,input);
	var index = this.sentences.rfind(function(sentence){
		return sentence.isLike(language,match)});
	if (index === null){
		throw Error("no match found for "+input+
				"\n in "+this.title);
	}
	return this.byIndexSentenceUpdate(language, index,replacement);
}
Text.prototype.byIndexSentenceUpdate = byIndexSentenceUpdate;
function
byIndexSentenceUpdate(language,index,replacement){
err.indexCheck(this.sentences.length,index);
var sentence =
sentenceInputToMatch(language,replacement);
// remove phrase from array.
var newText = this;//.copy();
newText.sentences.splice(index,1,sentence);
return newText;
}
Text.prototype.toString = function(format){
var result = new String();
var newline = '\n';
var lineLength = 64;
if (format ){
if (format.newline) newline = format.newline;
if (format.lineLength) lineLength = format.lineLength;
}
var sentences = this.sentences;
var sentencesLength = sentences.length;
var i;
for (i=0; i<sentencesLength; i++)
result += sentences[i].toString(format)+newline; 
// format by max line length;
return result;//this.string;
};
Text.prototype.toLocaleString = function(language,format){
var string = new String();
var newline = '\n';
var lineLength = 64;
if (format){
if(format.newline) newline = format.newline;
if(format.glyphsTransform) lineLength = 0;
else if(format.lineLength) lineLength = format.lineLength;
}
var sentences = this.sentences;
var sentencesLength = sentences.length;
var i;
for (i=0; i<sentencesLength; i++){
string += sentences[i].toLocaleString(language, format)+newline;
}
// format for max line length
if (lineLength>0) string = wordWrap(string,lineLength);

return string;
};

function wordWrap( str, width, brk, cut ) {

brk = brk || '\n';
width = width || 64;
width --;
cut = cut || false;

if (!str) { return str; }

var regex = 
'.{1,' +width+ '}(?=\\s|$)' + 
(cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');

return str.match( RegExp(regex, 'g') ).join( brk );
}

Text.prototype.insert = function(language,index,input){
// algorithm
// make sentence object from input
// if index out of bounds throw range error
// splice the sentence into this.sentences

// make sentence object from input
var sentence = sentenceInputToMatch(language, input);
// if index out of bounds throw range error
if (index > this.sentences.length)  RangeError(index 
+ " exceeds number of sentences in this Text object");
// splice the sentence into this.sentences
this.sentences.splice(index,0,sentence);
return this;
}