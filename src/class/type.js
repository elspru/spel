var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Word = require("./word");
var err = require("../lib/error");
module.exports = Type;
function Type(language,input,partOfSpeech){
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Type error: language undefined";
    }
	this.be = "Type";
	var tokens;
	if (typeof input === "string"){
		tokens = tokenize.stringToWords(input);}
	else if (typeof input === "object"
		&& input.be === "Type"){
	if (input.limb){
var SubType = require("./subType");
	this.limb = new SubType(language,input.limb);}
	if (input.type){
	this.type = input.type;
if( input.type === "mwq"){
	this.tail = new Word(language,input.tail);
	this.body = input.body;
	this.name = new Word(language,input.name);
	this.head = new Word(language,input.head);
	} 
else if (input.type === "nam"){
	this.type = input.type;
	this.body = input.body;
	this.head = new Word(language,input.head);
} else{
	this.type = input.type;
	this.body = new Word(language,input.body);
	this.head = new Word(language,input.head);
}
}
	else{
	if (input.type !== undefined)
	this.type = input.type;
	if (input.body !== undefined )
	this.body = new Word(language, input.body);
	if (input.head !== undefined)
	this.head = new Word(language, input.head);
	}
	return this;
	}
	else if (Array.isArray(input)) tokens = input;
	else throw new TypeError(JSON.stringify(input)
			+" not valid for "+this.be);

// algorithm de
// if type final then head word is last word
// else it is first word
// if head word is typeword then set it
// set multi word quote
// set number literal
// set single word quote
// else if has subType extract as limb, make rest body
// else make all of it body
// if contains junction word return Junction 

var tokensLength = tokens.length;
var juncTokens = tokens.slice(0);
if (tokensLength === 0) // if no tokens, return them.
	return tokens;
var firstToken = tokens[0];
if (typeof firstToken === "object") // such as Quote
	return firstToken;
var headWord = new String();
var otherTokens = new Array();
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
// if type final then head word is last word
if (wordOrder.typeFinal === true){
var index = tokensLength-1;
headWord = tokens[index];
otherTokens = tokens.slice(0,index); 
juncTokens.splice(index-1,2); // remove used tokens
}
// else it is first word
else if (wordOrder.typeFinal === false) {
headWord = tokens[0];
otherTokens = tokens.slice(1); 
juncTokens.splice(0,1); // remove used tokens
}
else throw Error(wordOrder+" typeFinal order not defined");

// if contains junction word return Junction 
if (! parse.wordMatch(grammar.quotes.multiWordHead, headWord)
&& juncTokens.length >0 && (juncTokens.rfind(
parse.wordMatch.curry(language.grammar.junctions))!==null
)){
var Junction = require("./junction");
return new Junction(language,tokens, partOfSpeech);
}
var dict = language.dictionary.toMwak
var translate = require("../compile/translate");
var transTokens = translate.array(dict,tokens);
var headI = parse.typeHeadIndex(grammar,transTokens);
var bodyWords = tokens.slice(headI[0],headI[1]);
var headWords = tokens.slice(headI[2],headI[3]);


// if head word is typeword then set it
var grammar = language.grammar;
if (language && parse.wordMatch(grammar.typeWords, headWord)){
// set multi word quote
if (parse.wordMatch(grammar.quotes.multiWordHead, headWord)){
// head is first two words, tail is last two, body is rest
var quoteI = parse.lastMultiWordQuoteIndex(grammar,tokens);
var prevT = tokens[quoteI[0]-1];
if (juncTokens && 
parse.wordMatch(language.grammar.junctions,prevT)) {
var Junction = require("./junction");
return new Junction(language,tokens, partOfSpeech);
}
var quoteT = tokens.slice(quoteI[0],quoteI[1]);
var len = quoteT.length;
this.type = "mwq"; // multi word quote type
if (grammar.wordOrder.typeFinal){
this.tail = new Word(language,quoteT.slice(0,1));
this.body = quoteT.slice(2,len-2);
this.name = new Word(language,quoteT.slice(1,2));
this.head = new Word(language,quoteT.slice(len-1,len));
}
else if (grammar.wordOrder.typeFinal === false){
this.tail = new Word(language,quoteT.slice(len-1,len));
this.body = quoteT.slice(2,len-2);
this.name = new Word(language,quoteT.slice(1,2));
this.head = new Word(language,quoteT.slice(0,1));
}
}
// set number literal
else if (parse.wordMatch(grammar.quotes.numeral, headWord)){
// if big endian then reverse order of numbers
this.type = "nam";
var numberTokens = new String();
if (grammar.wordOrder.littleEndian !== true)
numberTokens = tokensAndGlyphsReverse(otherTokens);
else numberTokens = otherTokens;
this.body = numberTokens;
this.head = new Word(language, headWord); 
}
// set single word quote
else {
// if typeword is literal set type to literal
if (parse.wordMatch(grammar.quotes.literal, headWord)) 
this.type = "lit";
if (otherTokens.length >0)
this.body = new Word(language, otherTokens, partOfSpeech);
this.head = new Word(language, headWord); }
// else return all tokens as word
}

// else if has subType extract as limb, make rest body
else if (bodyWords.indexOf(grammar.subTypeWords[0])>-1){
var subTypeI = bodyWords.indexOf(grammar.subTypeWords[0]);
if (wordOrder.typeFinal===true){
var subTypeTokens = bodyWords.slice(0,subTypeI+1);
var otherTokens =  bodyWords.slice(subTypeI+1); }
else if (wordOrder.typeFinal === false){
var subTypeTokens = bodyWords.slice(subTypeI);
var otherTokens =  bodyWords.slice(0,subTypeI); }
var SubType = require("./subType");
this.limb = new SubType(language,subTypeTokens,partOfSpeech);
if ( headWords.length > 0){ if (bodyWords.length >0){
this.body = new Word(language,otherTokens,partOfSpeech);
this.head = new Word(language,headWords);
}else{ this.head = new Word(language,headWords); }}
else{ this.body = new Word(language,otherTokens,partOfSpeech); }
}
else if ( headWords.length > 0){
if (bodyWords.length >0){
this.body = new Word(language,bodyWords,partOfSpeech);
this.head = new Word(language,headWords);
}else{
this.head = new Word(language,headWords);
}
}

// else make all of it body
else{ this.body = new Word(language, tokens, partOfSpeech);
}
return this;


}// end of Type constructor

//function limbIndexGet(language,tokens){
//var translate = require("../compile/translate");
//var dict = language.dictionary.fromMwak;
//var mwakTokens = translate.array(dict,otherTokens);
//var limbI = parse.limbIndex(grammar,mwakTokens);
//return limbI;
//}
//if (limbI !== null){
//var bodyTokens = mwakTokens.slice(limbI[0],limbI[1]);
//var limbTokens = mwakTokens.slice(limbI[2],limbI[3]);
//this.limb = new Word(language,limbTokens,partOfSpeech);
//this.body = new Type(language,bodyTokens,partOfSpeech);
//}

function typeInputToMatch(language, input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Type(language, input);
	else if (input.be === "Type")
		return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Type");
}
Type.prototype.isSuperset = function(language, input){
	var match = typeInputToMatch(language, input);
	//// if match is undefined then is subset
	if (match.body !== undefined
	    && !match.body.isSuperset(language, this.body)){
		return false;}
	if (match.head !== undefined
	    && !match.head.isSuperset(language, this.head)){
		return false;}
	return true;
}
Type.prototype.isSubset = function(language, input){
	return this.equals(language, input);
}
Type.prototype.isLike = function(language, input){
	return this.equals(language, input);
}
Type.equals = function(language, input){
	var match = typeInputToMatch(language, input);
	if (match.body === this.body
	   && match.head === this.head)
		return true;
	return false;
}
Type.prototype.toString = function(){
var result = new String();
var joiner = " ";
if (this.limb) result += this.limb.toString()+joiner;
if (this.type === "mwq"){
if (this.tail) result += this.tail.toString()+joiner;
if (this.name) result += this.name.toString()+joiner;
if (this.body) result += this.body.join(joiner);
if (this.name) result += joiner+this.name.toString();
if (this.head) result += joiner+this.head.toString();
}
else{
if (this.body) result += this.body.toString();
if (this.head && this.body) result += joiner;
if (this.head) result += this.head.toString();
}
return result;
}
Type.prototype.valueGet = function(){
var result = new String();
if (this.body) result += this.body.toString();
//if (this.head && this.body) result += " ";
else if (this.head) result += this.head.toString();
return result;
}
Type.prototype.toLocaleString = 
function(language, format, type, conjLevel){
var result = new String();
var joiner = new String();
var conj = new Object();

if (conjLevel >= 3){ conj = language.grammar.conjugation;
if (!this.type){ if (conj.nounType && type === "n"){
return conj.nounType(language,this,format,conjLevel);}
else if (conj.verbType && type === "v"){
return conj.verbType(language,this,format,conjLevel);}
}
}

var subType = new String(); if (this.limb) subType =
this.limb.toLocaleString(language,format,undefined,conjLevel);

if (this.body) joiner = " "; 
var wordOrder = language.grammar.wordOrder;

if (format && format.joiner !== undefined) joiner = format.joiner;
else if (conj && conj.format && conj.format.joiner !== undefined) 
joiner = conj.format.joiner;

// number quote
if (this.type === "nam" ){
if (conj.numeral) 
return conj.numeral(language,this,format,type,conjLevel);
if (wordOrder.littleEndian !== true && this.body !== undefined)
body = tokensAndGlyphsReverse(this.body).join(joiner);
else if (this.body) body = (this.body).join(joiner);
else body = new String();
result += body;
}
// other types
else if (this.body && this.type !== "mwq")
result += this.body.toLocaleString(language, format, type,
conjLevel);

if (this.head === undefined){
if (!subType) return result;
else if (wordOrder.typeFinal) result = subType+joiner+result;
else if (wordOrder.typeFinal=== false) 
result= result+joiner+subType;
return result;
}

// else check type order, append if true, prepend if
// false.
var typeTransl = 
this.head.toLocaleString(language, format, "th",
conjLevel);

if (this.type === "mwq"){
if (conj.foreignQuote) {
result += conj.foreignQuote(language,this,format);}
else{
var tail = new String();
var name = new String();
var body = new String();
if (this.tail) tail =
this.tail.toLocaleString(language,format,"th", conjLevel);
if (this.name) name =
this.name.toLocaleString(language,format,"th", conjLevel);
if (this.body) body = this.body.join(joiner);


if (language.grammar.wordOrder.typeFinal){
if (this.subType) result = subType+joiner;
result+= tail+joiner+name+joiner+body+joiner+name+joiner+typeTransl;
}
else if (language.grammar.wordOrder.typeFinal === false){
 result = 
typeTransl+joiner+name+joiner+body+joiner+name+joiner+tail
+subType+joiner;
}
}
}
else{
if (language.grammar.wordOrder.typeFinal){
if (this.subType) result = subType+ joiner + result;
if (typeTransl) result = result + joiner+ typeTransl ;
}
else if (language.grammar.wordOrder.typeFinal === false)
if (typeTransl) result =  typeTransl + joiner + result;
if (subType) result =  result +joiner +subType;
}

return result;
}

function tokensAndGlyphsReverse(tokens){
var outTokens = tokens.slice(0);
outTokens.reverse();
outTokens = outTokens.map(function(token){
return token.split("").reverse().join("");
});
return outTokens;

}
