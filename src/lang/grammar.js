
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
this.verbWord= translate.word(dict, mwakGrammar.verbWord);
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
this.quotes.quoteHeads=translate.array(dict, 
		mwakGrammar.quotes.quoteHeads);
this.quotes.singleWord=translate.array(dict, 
		mwakGrammar.quotes.singleWord);
this.quotes.number=translate.word(dict, 
		mwakGrammar.quotes.number);
this.quotes.multiWordHead=translate.array(dict, 
		mwakGrammar.quotes.multiWordHead);
this.quotes.multiWordTail=translate.array(dict, 
		mwakGrammar.quotes.multiWordTail);
this.quotes.literal=translate.array(dict, 
		mwakGrammar.quotes.literal);
this.quotes.startWord=translate.word(dict,
	mwakGrammar.quotes.startWord);
this.quotes.endWord=translate.word(dict,
	mwakGrammar.quotes.endWord);
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
this.wordOrder.littleEndian = wordOrder.littleEndian;
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
typeWords: ["li","sa","nyu","na","pa","yi","ni","tsi"],
phraseWords: [".i","ta",".a",".u","kya","nya","ni","ka",
"fa","sla","plu","mwa","psu"],
topicWord: "fa",
agentWord: "hu",
subjectWord: ".u",
objectWord: ".a",
verbWord: ".i",
subPhraseWords: ["pi"],
topClauseWords: ["ku","twa","swi","pwa","kla"],
topClauseTerminator: ["twa"],
clauseWords: ["kwa"],
clauseTerminator: ["klu"],
sentenceWords: ["ya","ci"],
quotes: {
quoteHeads: ["li","tsi"],
singleWord: ["li"],
number: "na",
literal: ["li","tsi"],
multiWordHead: ["tsi"],
multiWordTail: ["ksa"],
startWord: "tip",
endWord: "kit"
},
wordOrder: {
headFinal: true,
verbFinal: true,
nounFinal: true,
typeFinal: true,
topicInitial: true,
subjectProminent: true,
postpositional: true,
clauseInitial: true,
genitiveInitial: true,
littleEndian: false,
phraseOrder: ["sla","ku","twa","swi","pwa",".u","ta",
".a","nya",".i"],
intransitiveWord: ".u"
},
conjugation:{
reversible:[],
irreversible:[]
}

} // end of mwak grammar object ya

