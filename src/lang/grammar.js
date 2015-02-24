
var translate = require("../compile/translate");
module.exports = Grammar;
/// be load bo grammar de
function Grammar(wordOrder,dictionary,conjugation){
if (!dictionary&&!wordOrder){
return mwakGrammar;
}
this.be = "Dictionary";
if (dictionary){
var dict = dictionary.fromMwak;
this.junctions=translate.array(dict, mwakGrammar.junctions);
this.typeWords=translate.array(dict, mwakGrammar.typeWords);
this.phraseWords=translate.array(dict, mwakGrammar.phraseWords);
this.subjectWord=mwakGrammar.subjectWord;
this.objectWord=mwakGrammar.objectWord;
this.verbWord=mwakGrammar.verbWord;
this.topicWord=translate.word(dict, mwakGrammar.topicWord);
this.subPhraseWords=translate.array(dict,
		mwakGrammar.subPhraseWords);
this.topClauseWords=translate.array(dict,
		mwakGrammar.topClauseWords);
this.topClauseTerminator=translate.array(dict,
		mwakGrammar.topClauseTerminator);
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
this.quotes.literal=translate.array(dict, 
		mwakGrammar.quotes.literal);
}
this.wordOrder = new Object();
if (wordOrder){
this.wordOrder.headFinal= wordOrder.headFinal;
this.wordOrder.verbFinal= wordOrder.verbFinal;
this.wordOrder.nounFinal= wordOrder.nounFinal;
this.wordOrder.typeFinal= wordOrder.typeFinal;
this.wordOrder.topicInitial = wordOrder.topicInitial;
this.wordOrder.subjectProminent = wordOrder.subjectProminent;
this.wordOrder.postpositional= wordOrder.postpositional;
this.wordOrder.genitiveInitial= wordOrder.genitiveInitial;
this.wordOrder.clauseInitial= wordOrder.clauseInitial;
this.wordOrder.phraseOrder= wordOrder.phraseOrder;
if (wordOrder.intransitiveWord)
this.wordOrder.intransitiveWord = wordOrder.intransitiveWord;
}
if(conjugation)
this.conjugation = conjugation;
return this;
}

var mwakGrammar = {
be: "Grammar",
junctions:["ki","wa"],
typeWords: ["li","sa","nyu","na","ka","pa","yi","ni"],
phraseWords: [".i","ta",".a",".u","kya","nya",
"fa","sla","plu","mwa","psu"],
topicWord: "fa",
agentWord: "hu",
subjectWord: ".u",
objectWord: ".a",
verbWord: ".i",
subPhraseWords: ["pi"],
topClauseWords: ["ku","twa","kwi","pwa"],
topClauseTerminator: ["twa"],
clauseWords: ["ti"],
clauseTerminator: ["tya"],
sentenceWords: ["ya","ci"],
quotes: {
singleWord: ["li"],
multiWord: [],
literal: ["li"]
},
wordOrder: {
headFinal: true,
verbFinal: true,
nounFinal: true,
typeFinal: true,
topicInitial: true,
subjectProminent: false,
postpositional: true,
clauseInitial: true,
genitiveInitial: true,
phraseOrder: ["sla","ku","twa","kwi","pwa",".u","ta",
".a","nya",".i"],
intransitiveWord: ".u"
}
} // end of mwak grammar object ya

