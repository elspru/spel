
var tokenize = require("../compile/tokenize");
var hof = require("../lib/hof");
var parse = require("../compile/parse");
var Sentence = require ("./sentence");
var Word = require ("./word");
var err = require("../lib/error");
module.exports = Text;
/// su sentence be object ya
function Text(language, input, conjLevel) {
    if (language === undefined) {
        throw "Text error: language undefined";
    }

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
	this.title = new Word(language, input.title);
	this.sentences = new Array();
	for (i=0; i< input.sentences.length; i++)
		this.sentences[i]=new Sentence(language,
input.sentences[i],conjLevel);
	return this;
}
else throw new TypeError(input+" is not a valid Phrase input");
// algorithm de
// be extract quotes from tokens ya
// be get ob all sentences from tokens into sentences array ya
//
// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
//
// be get ob subordinate texts and splice then in ya
//


// be extract quotes from tokens ya
tokens = parse.quotesExtract(language,tokens);

// be get ob all sentences from tokens into sentences array ya
var otherTokens = tokens;
var previousLength = 0;
var sentences = new Array();
var sentenceIndex = 0;
var sentence, firstSentence;
var grammar = language.grammar;
while (otherTokens.length>0 
&& otherTokens.length != previousLength){
// avoid infinite loops from starter garbage
previousLength = otherTokens.length;
firstSentence = parse.firstSentence(grammar,otherTokens);
if (firstSentence.length === 0) break;
sentence  = 
new Sentence(language, firstSentence, conjLevel);
sentences[sentenceIndex] = sentence;
sentenceIndex++;
otherTokens = otherTokens
.slice(firstSentence.length,otherTokens.length);
}

// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
var title = titleExtract(language,sentences);
if (title) this.title = title;

// be get ob subordinate texts and splice them in
sentences = subordinateTextSplice(language,sentences);

this.sentences = sentences;
return this;
}

function titleExtract(language, sentences){
var title = undefined;
// if su first sentence be have ob startWord in verb
// yand ob subject then  be set ob title from subject ya
var startWord = language.grammar.startWord;
var firstSentence = sentences[0];
var Language = require ("../lang/language");
var mwak = new Language();
var firstVerbPhrase = firstSentence.phraseGet(mwak,"hi");
var firstSubjectPhrase = firstSentence.phraseGet(mwak,"hu");
if (firstVerbPhrase 
&& firstVerbPhrase.body.head === startWord 
&& firstSubjectPhrase) title = firstSubjectPhrase.body.body;
return title;
}

// subordinate text Splice
function subordinateTextSplice(language, sentences /*array*/){
// algorithm de
// skip initial title sentence
// find subordinate text indexes from sentences
// if not found then return sentences ya
// slice out subordinte sentences
// find title if applicable
// be subordinateTextSplice on subordinte sentences ya
// create text object using result
// splice in subordinate text
// repeat till end of sentences
// return 

// algorithm de
// skip initial title sentence
var startIndex = 1;
while(true){
// find subordinate text indexes from sentences
var subTextSentencesI = subordinateTextIndexExtract(language
,sentences,startIndex);
// if not found then return sentences ya
if (! subTextSentencesI ) return sentences;
startIndex = subTextSentencesI[1] + 1;
// slice out subordinte sentences
var subTextSentences = sentences.slice(
subTextSentencesI[0],subTextSentencesI[1]);
// find title if applicable
var title = titleExtract(language,subTextSentences);
// be subordinateTextSplice on subordinte sentences ya
var subTextSentences= subordinateTextSplice(language,
subTextSentences);
// create text object using result
var subTextObject = new Object();
subTextObject.be = "Text";
if (title) subTextObject.title = title;
subTextObject.sentences = subTextSentences;
var subText = new Text(language,subTextObject);
// splice in subordinate text
sentences.splice(subTextSentencesI[0],subTextSentences.length,
subText);
// repeat till end of sentences
} // end of while loop
}

// subordinate texts extract
function
subordinateTextIndexExtract(language,sentences,startIndex){
// algorithm de 
// be find ob sentence with start word in head of verb phrase ya
// if not found then return undefined ya
// be set ob found sentence index as start ya
// be get ob verb phrase and subject phrase from sentence ya
// be find ob end sentence tha with same ob subject phrase 
// and ob end version of verb phrase ya
// if no end sentence found, assume is end of sentences
// be set ob end index ya
// be return start and end ya


var sentences = sentences.slice(startIndex);
// be find ob sentence with start word in head of verb phrase ya
var Language = require ("../lang/language");
var mwak = new Language();
var startSentenceI = 
rawSentenceFindGet(mwak,"tip hi",sentences);
// if not found then return undefined ya
if (startSentenceI === -1) return undefined;
// be set ob found sentence index as start ya
var start = startSentenceI;
// be get ob verb phrase and subject phrase from sentence ya
var startSentence = sentences[startSentenceI];
var verbPhrase = startSentence.phraseGet(mwak,"hi");
var subjectPhrase = startSentence.phraseGet(mwak,"hu");
if (subjectPhrase === undefined) subjectPhrase = new String();
// be find ob end sentence tha with same ob subject phrase 
// and ob end version of verb phrase ya
var endVerbPhrase = verbPhrase.copy(mwak);
endVerbPhrase.body.head = "kit";
var searchString = subjectPhrase.toString()
+" "+endVerbPhrase.toString();
endSentenceI = rawSentenceFindGet(mwak,searchString,sentences);
// if no end sentence found, assume is end of sentences
if (endSentenceI === -1) endSentenceI = sentences.length -1;
// be set ob end index ya
var end = endSentenceI +1;
// be return start and end ya
return [start+startIndex,end+startIndex];
}


// copy or clone text
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
return rawSentenceFindGet(language,input,this.sentences);
}

function rawSentenceFindGet(language,input,sentences){
var match =
sentenceInputToMatch(language,input);
// reverse iterate through sentences or rfind
// if isLike match, then return
var index = sentences.rfind(function(sentence){
return sentence.isLike(language,match)
});
if (index === null) index = -1;
return index; 
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
Text.prototype.toLocaleString =
function(language,format,type,conjLevel){
var result = new String();
var newline = '\n';
var lineLength = 64;
var conj = new Object()
if (conjLevel >= 4) conj = language.grammar.conjugation;

if (format){
if(format.newline !== undefined) newline = format.newline;
if(format.glyphsTransform) lineLength = 0;
else if(format.lineLength) lineLength = format.lineLength;
}
var sentences = this.sentences;
var sentencesLength = sentences.length;
var i;
for (i=0; i<sentencesLength; i++){
var theSentence = sentences[i];
if (conj.text && (theSentence.be === "Text"))
result+= conj.text(language,theSentence,format,type,conjLevel);
else result+= theSentence.toLocaleString(language, format, type,
conjLevel)+newline;
}
// format for max line length
//result = "\t"+result; /* indent text */
if (lineLength>0) result = wordWrap(result,lineLength);

if(conjLevel >= 8){
if (conj.header) result = conj.header + result;
if (conj.footer) result = result + conj.footer;
}

return result;
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

var strA=str.match(RegExp(regex, 'g'))
/* remove leading spaces */
strA = strA.map(function(str){return str.replace(/^ /,"")});
return strA.join( brk );
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


