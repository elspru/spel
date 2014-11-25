
var translate = require("../compile/translate");
module.exports = Grammar;
/// be load bo grammar de
function Grammar(wordOrder,dictionary){
if (!dictionary&&!wordOrder){
return Object.create(mwakGrammar);}
this.be = "Dictionary";
if (dictionary){
var dict = dictionary.fromMwak;
this.phraseWords=translate.array(dict,
		mwakGrammar.phraseWords);
this.sentenceWords=translate.array(dict,
		mwakGrammar.sentenceWords);
this.typeWords=translate.array(dict,
		mwakGrammar.typeWords);
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
this.wordOrder.phraseOrder= wordOrder.phraseOrder;
}
}

var mwakGrammar = {
	be: "Grammar",
	phraseWords: [".i",".a",".u","pi","kai","nia"],
	sentenceWords: ["ya","pa"],
	typeWords: ["yi"],
	quotes: {
		singleWord: ["yi"],
		multiWord: []
	},
	wordOrder: {
		headFinal: true,
		verbFinal: true,
		typeFinal: true,
		postpositional: true,
		phraseOrder: [".u","ta",".a","ki",".i"]
	}
}
