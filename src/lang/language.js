var Grammar = require("./grammar");
var Dictionary = require("./dictionary");
module.exports = Language;
function Language(grammar,dictionary){
	this.be = "Language";
	if (!grammar) this.grammar = new Grammar();
	else this.grammar = grammar;
	if (!dictionary) this.dictionary = new Dictionary();
	else this.dictionary = dictionary;
	return this;
}
