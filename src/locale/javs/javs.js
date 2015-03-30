var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var javsFile = require("./javs.txt.json");
var mwak = new Language();

module.exports = Javascript;
function Javascript(srcBase){
//var io = require("../../lib/io");
//var javsFile = io.fileRead(srcBase+"/locale/javs/javs.txt");
var javsText = new Text(mwak,javsFile);
var javsDict = new Dictionary(mwak,javsText);
var javsWordOrder = {
	headFinal : false,
	verbFinal : false,
	nounFinal : true,
	typeFinal : false,
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa",".u",".i",".a"],
};
var conjugation = {
reversible:[
["asdfasdf","kjkjk"],
],
irreversible:[
[" ya$","; "],
[" ya ","; "]
]
}
//conjugation.noun = nounConjugate;
//function nounConjugate(nounString) {
//return '"'+nounString+'"';}


conjugation.verb = verbConjugate;
function verbConjugate(verbString) {
return verbString.replace(/ /,"_")+"(";}

conjugation.phrase = phraseConjugate;
function phraseConjugate(body,adposition){
if (adposition)
return '"'+adposition+'":"'+body.replace(/ $/,'')+'"';
else return body;
}

conjugation.header = 
 '#!/usr/bin/nodejs \n'
+'/*translated by SPEL.*/\n'
+'var ls = require("./libspel");\n'
+'Object.keys(ls).forEach(function(k){global[k]=ls[k]});\n'
+'"use strict";\n'


conjugation.subjectPhrase = subjectPhraseConjugate;
function subjectPhraseConjugate(body,adposition){
return body.replace(/ $/,'')+".";
}
conjugation.objectPhrase = objectPhraseConjugate;
function objectPhraseConjugate(body,adposition){
return body.replace(/ $/,'');
}


conjugation.mood = moodConjugate;
function moodConjugate(moodString) {
return '/*'+moodString+'*/';}


conjugation.sentenceHead = sentenceHeadConjugate;
function sentenceHeadConjugate(sentenceHeadString) {
return ');';}

//conjugation.phraseHead = nounConjugate;

conjugation.verbHead = verbHeadConjugate;
function verbHeadConjugate(string) {
return '';}


conjugation.phraseJoiner = ',';

conjugation.foreignQuote = foreignQuoteConjugation;
function foreignQuoteConjugation(language,
foreignQuoteObject,format){
return '/*'+ foreignQuoteObject.name.toLocaleString(language)
+'*/ '+ '"'+foreignQuoteObject.body.join(" ")+'"';
}

var javsGrammar = new Grammar(javsWordOrder,javsDict,conjugation);
var javs = new Language(javsGrammar,javsDict);
return javs;
}

Javascript.prototype.code = function(){console.log("blah"); return "javs"};
exports.code = function(){console.log("blah"); return "javs"};
