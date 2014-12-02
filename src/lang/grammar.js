
var translate = require("../compile/translate");
module.exports = Grammar;
/// be load bo grammar de
function Grammar(wordOrder,dictionary){
if (!dictionary&&!wordOrder){
return Object.create(mwakGrammar);}
this.be = "Dictionary";
if (dictionary){
var dict = dictionary.fromMwak;
this.typeWords=translate.array(dict,
		mwakGrammar.typeWords);
this.phraseWords=translate.array(dict,
		mwakGrammar.phraseWords);
this.clauseWords=translate.array(dict,
		mwakGrammar.clauseWords);
this.clauseTerminator=translate.array(dict,
		mwakGrammar.clauseTerminator);
this.sentenceWords=translate.array(dict,
		mwakGrammar.sentenceWords);
this.quotes = new Object();
this.quotes.singleWord=translate.array(dict, 
		mwakGrammar.quotes.singleWord);
this.quotes.multiWord=translate.array(dict, 
		mwakGrammar.quotes.multiWord);

}
this.wordOrder = new Object();
if (wordOrder){
this.wordOrder.verbFinal= wordOrder.verbFinal;
this.wordOrder.postpositional= wordOrder.postpositional;
this.wordOrder.clauseInitial= wordOrder.clauseInitial;
this.wordOrder.phraseOrder= wordOrder.phraseOrder;
}
}

var mwakGrammar = {
	be: "Grammar",
	typeWords: ["yi"],
	phraseWords: [".i","ta",".a",".u","pi","kai","nia"],
	clauseWords: ["ti"],
	clauseTerminator: ["tai"],
	sentenceWords: ["ya","pa"],
	quotes: {
		singleWord: ["yi"],
		multiWord: []
	},
	wordOrder: {
		headFinal: true,
		verbFinal: true,
		typeFinal: true,
		postpositional: true,
		clauseInitial: true,
		phraseOrder: [".u","ta",".a",".i"]
	}
}
