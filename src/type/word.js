var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
var emitter = require("events").EventEmitter;
module.exports = Word;
var emi = new emitter();
//this.e = emi;
//translate.e.on("warn",function(err){
//	emi.emit("warn",err);});
//translate.e.on("error",function(err){
//	emi.emit("error",err);});
/// su word be object ya
function Word(language,input){
	var tokens;
	this.be = "Word";
	if (typeof input === "string")
		tokens = tokenize.stringToWords(input);
	else if (typeof input === "object"
		&& input.be === "Word"){
			this.lemma = input.lemma;
			if (input.adwords)
			this.adwords = input.adwords;
			return this;
		}
	else if (Array.isArray(input)) tokens = input; 
	else throw new TypeError(JSON.stringify(input)+" unknown to "+this.be);
	var tokensLength = tokens.length;
	var lastTokenIndex = tokensLength-1;
	if (tokensLength > 1){
		this.adwords = tokens.slice(0,lastTokenIndex);
	}
	this.lemma = tokens[lastTokenIndex];
	return this;
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
	   && this.lemma !== match.lemma)
		return false;
	if (match.adwords !== undefined
	   && !this.adwords.isSuperset(match.adwords))
		return false;
	//console.log(match.lemma+" "+this.lemma);
	return true;
}
Word.prototype.isSubset = function(language,input){
}
Word.prototype.isLike = function(language,input){
	return this.isSuperset(language,input);
}

Word.prototype.toString = function(){ 
	var string = new String();
	if (this.adwords !== undefined)
		string = this.adwords.join(" ")+" ";
	string += this.lemma;
	return string;
};
Word.prototype.toLocaleString = function(language){
	var translation = new String();
	var dict = language.dictionary.fromMwak;
	if (this.adwords !== undefined){
	var i, transl;
	for (i=0;i<this.adwords.length;i++){
		console.log(this.adwords[i]);
		transl = translate.word(dict,this.adwords[i]);
		translation+= transl+" ";
	}
	}
	transl = translate.word(dict,this.lemma);
	translation += transl;
	return translation;
}
