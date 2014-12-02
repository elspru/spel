var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
var emitter = require("events").EventEmitter;
module.exports = Word;
//var emi = new emitter();
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
	var transDict = language.dictionary.toMwak;
	if (tokensLength > 1){
		var words = tokens.slice(0,lastTokenIndex)
		this.adwords = translate.array(transDict,words);
		//this.adwords =(		adwords);
	}
	if (tokensLength >0)
	this.lemma = translate.word(transDict,
			tokens[lastTokenIndex]);
	if (!this.lemma && !this.adwords) return undefined;
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
	if (this.lemma !== undefined)
	string += this.lemma;
	return string;
};
Word.prototype.toLocaleString = function(language,format){
	var translation = new String();
	var joiner = " ";
	var verbFinal = language.grammar.wordOrder.verbFinal;
	var dict = language.dictionary.fromMwak;
	if (this.adwords !== undefined){
	var i, transl, adword;
	for (i=0;i<this.adwords.length;i++){
		adword = this.adwords[i];
		if (false && typeof adword === "object")
			adword.toLocaleString(language,format);
		else transl = translate.word(dict,adword);
		if (verbFinal) translation+= transl+joiner;
		else translation = joiner+transl+translation;
	}
	}
	var lemma = this.lemma;
	var transLemma;
	if (lemma === undefined) lemma = "";
	if (false && typeof lemma === "object")
		transl = lemma.toLocaleString(language,format);
	else transLemma = translate.word(dict,lemma);
	if (verbFinal) translation += transLemma;
	else translation = transLemma + translation;
	return translation;
}
