
/// translator
/// be load bo dictionary from file ya
/// be translate bo word ya

var Text = require("../type/text");

module.exports = Dictionary;
function Dictionary(language, input){
	this.be = "Dictionary";
// make from mwak and to mwak objects
// algorithm:
//	make Text from input
	var text;
	if (typeof input === "string")
		text = new Text(language, input);
	else if (typeof input === "object"
		&& input.be === "Text")
		text = new Text(language, input);
	else if (typeof input === "object"
		&& input.be === "Dictionary"){
			this.fromMwak = input.fromMwak;
			this.toMwak = input.toMwak;
			return this;
		}
	//else if (Array.isArray(input)) toke
// if no input then blank dictionary ya
	else if (input === undefined){
		this.toMwak = new Object();
		this.fromMwak = new Object();
		return this;
	}
	else throw new TypeError(input+" unknown to "+this.be);
//	fromMwak is object mapping su contents to bo contents
	this.fromMwak = dictMake(language,text,[".u",".a"]);
//	toMwak is object mapping bo contents to su contents
	this.toMwak = dictMake(language,text,[".a",".u"]);
	return this;
}
Dictionary.prototype.copy = function(){
 	return new Dictionary(language, JSON.parse(JSON.stringify(this)));
}
function dictMake(language,text,cases){
// for each sentence ya 
// be get bo cases ya 
// be map bo key to value ya
// be return bo map ya
	// only select sentence with both cases
	var keyCase = cases[0];
	var valueCase = cases[1];
	var sentences = text.select(language,cases).sentences;
	var slength = sentences.length;
	var i, sentence, phrases,
	    j, plength, phrase, initial;
	var mapObject = new Object();
	for (i = 0; i < slength; i++){
		sentence = sentences[i];
		key = sentence.phraseGet(language,keyCase).valueGet();
		value = sentence.phraseGet(language,valueCase).valueGet();
		mapObject[key]=value;
	}
	return mapObject;
}
//Word.prototype.toString = function(){};
