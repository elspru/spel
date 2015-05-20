var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var wrld = require("../../locale/wrld/wrld");
var zhoFile = require("./zho.txt.json");
var mwak = new Language();

module.exports = Chinese;
function Chinese(srcBase){
//var zhoFile = io.fileRead(srcBase+"/locale/zho/zho.txt.json");
var zhoText = new Text(mwak,zhoFile);
var zhoDict = new Dictionary(mwak,zhoText);
var zhoWordOrder = {
headFinal : true,
verbFinal : true,
typeFinal : true,
subjectProminent: true,
postpositional : true,
clauseInitial: true,
topClauseInitial: false,
genitiveInitial: true,
phraseOrder: ["hu","hi","ha"]
};
var conjugation = {
reversible:[
[" be wil "," wil "]
],
irreversible:[
[" 主题 "," "],
[" 对象 "," "],
],
format:{
joiner:'',
phraseJoiner:' ',
clauseJoiner:' '
}
}

conjugation.foreignQuote = 
wrld.conjugation.citationQuote;

conjugation.subjectPhrase = subjectPhraseConjugate;
function subjectPhraseConjugate(language,phrase,format,conjLevel){
// exceptions
var joiner = " ";
// main
var newPhrase = phrase.copy();
delete newPhrase.head;
var body =
newPhrase.toLocaleString(language,format,undefined,conjLevel);
var result = new String();
result = body;
return result;
}

conjugation.objectPhrase = objectPhraseConjugate;
function objectPhraseConjugate(language,phrase,format,conjLevel){
// exceptions
var joiner = " ";
// main
var newPhrase = phrase.copy();
delete newPhrase.head;
var body =
newPhrase.toLocaleString(language,format,undefined,conjLevel);
var result = new String();
result = body;
return result+joiner;
}

conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(language,phrase,format,conjLevel){
// exceptions
var joiner = " ";
// main
var newPhrase = phrase.copy();
delete newPhrase.head;
var body =
newPhrase.toLocaleString(language,format,undefined,conjLevel);
var result = new String();
result = body;
return result+joiner;
}

var zhoGrammar = new Grammar(zhoWordOrder,zhoDict,conjugation);
var zho = new Language(zhoGrammar,zhoDict);
return zho;
}

Chinese.prototype.code = function(){console.log("blah"); return "zho"};
exports.code = function(){console.log("blah"); return "zho"};
