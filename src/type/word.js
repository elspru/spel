var tokenize = require("../compile/tokenize");
module.exports = Word;
/// su word be object ya
function Word(language,input){
	var tokens;
	this.be = "Word";
	if (typeof input === "string")
		tokens = tokenize.stringToWords(input);
	else if (typeof input === "object"
		&& input.be === "Word"){
			this.lemma = input.lemma;
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
 	return new Word(JSON.parse(JSON.stringify(this)));
}
function wordInputToMatch(input){
	if (typeof input === "string"
		|| Array.isArray(input))
		return new Word(input);
	else if (typeof input === "object"
		&& input.be === "Word")
		return input;
	else if (input === undefined) return input;
	else throw new TypeError(JSON.stringify(input)
			+ " not valid match for "+"Word");
}
Word.prototype.isSuperset = function(input){
	var match = wordInputToMatch(input);
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
Word.prototype.isSubset = function(input){
}
Word.prototype.isLike = function(input){
	return this.isSuperset(input);
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
	if (this.adwords !== undefined){
	var i, transl;
	for (i=0;i<this.adwords.length;i++){
		transl = language.dictionary.mwakFrom[this.adwords[i]];
		if (transl === undefined) transl = this.adwords[i] ;
		translation+= transl+" ";
	}
	}
	transl = language.dictionary.mwakFrom[this.lemma];
	if (transl === undefined) transl = this.lemma;
	translation += transl;
	return translation;
}
