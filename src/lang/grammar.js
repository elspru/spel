
var translate = require("../compile/translate");
module.exports = Grammar;
/// be load bo grammar de
function Grammar(wordOrder,dictionary){
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
this.wordOrder.typeFinal= wordOrder.typeFinal;
this.wordOrder.postpositional= wordOrder.postpositional;
this.wordOrder.genitiveInitial= wordOrder.genitiveInitial;
this.wordOrder.clauseInitial= wordOrder.clauseInitial;
this.wordOrder.phraseOrder= wordOrder.phraseOrder;
if (wordOrder.intransitiveWord)
this.wordOrder.intransitiveWord = wordOrder.intransitiveWord;
}
}

var mwakGrammar = {
be: "Grammar",
junctions:["ki","wa"],
typeWords: ["yi","ksa","nyu","na"],
phraseWords: [".i","ta",".a",".u","kya","nya","sla"],
agentWord: "hu",
subjectWord: ".u",
objectWord: ".a",
verbWord: ".i",
subPhraseWords: ["pi"],
topClauseWords: ["ku","twa","kwi","pwa"],
topClauseTerminator: ["twa"],
clauseWords: ["ti"],
clauseTerminator: ["tya"],
sentenceWords: ["ya","pa"],
quotes: {
singleWord: ["yi"],
multiWord: [],
literal: ["yi"]
},
wordOrder: {
headFinal: true,
verbFinal: true,
typeFinal: true,
postpositional: true,
clauseInitial: true,
genitiveInitial: true,
phraseOrder: ["sla","ku","twa","kwi","pwa",".u","ta",
".a","nya",".i"],
intransitiveWord: ".u"
}
} // end of mwak grammar object ya

//wordPriority:{
//"ya":0x9,
//"ku":0x8,
//"kwi":0x7,
//"tai":0x6,
//"ti":0x5
//}
//wordPriorityArray:{
//0x9:["ya","pa"],
//0x8:["ku"],
//0x7:["kwi","pwa"],
//0x6:["tai"],
//0x5:["ti"],
//0x4:[".i",".u",".a","ta"],
//0x3:["pi"],
//0x2:["yi"]
//}
