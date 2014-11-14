
module.exports = Grammar;
/// be load bo grammar de
function Grammar(dictionary,wordOrder){
	if (!dictionary&&!wordOrder){
		return Object.create(mwakGrammar);
	}
}
var mwakGrammar = {
	be: "Grammar",
	phraseWords: [".i",".a",".u","kai"],
	sentenceWords: ["ya","do"],
	quotes: {
		singleWord: ["yi"],
		multiWord: [["te","ted"]]
	},
	typeWords: ["yi","te","ted"],
	wordOrder: {
		verbFinal: true,
		postpositional: true,
		phraseOrder: [".u","ta",".a","ki",".i"]
	}
}
