var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var araFile = require("./ara.txt.json");
var vso = require("../../locale/vso/vso");
var wrld = require("../../locale/wrld/wrld");
var mwak = new Language();

module.exports = Arabic;
function Arabic(srcBase){
//var araFile = io.fileRead(srcBase+"/locale/ara/ara.txt");
var araText = new Text(mwak,araFile);
var araDict = new Dictionary(mwak,araText);
var araWordOrder = {
headFinal : false,
verbFinal : false,
nounFinal : false,
typeFinal : false,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["sla","ku","twa","hi","hu","nya","ta","ha"],
littleEndian : true
};
var conjugation = {
reversible:[
[" su me "," I "],
],
irreversible:[
[" سو "," "],
[" أوب "," "],
[" يا$",". "],
]
}
conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(body,adposition){
return body;
}

conjugation.foreignQuote = 
wrld.conjugation.citationQuote;

var araGrammar = new Grammar(araWordOrder,araDict,conjugation);
var ara = new Language(araGrammar,araDict);
return ara;
}

Arabic.prototype.code = function(){console.log("blah"); return "ara"};
exports.code = function(){console.log("blah"); return "ara"};
