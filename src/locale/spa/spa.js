var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var spaFile = require("./spa.txt.json");
var svo = require("../../locale/svo/svo");
var wrld = require("../../locale/wrld/wrld");
var mwak = new Language();

module.exports = Spanish;
function Spanish(srcBase){
//var spaFile = io.fileRead(srcBase+"/locale/spa/spa.txt.json");
var spaText = new Text(mwak,spaFile);
var spaDict = new Dictionary(mwak,spaText);
var spaWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
[" ?su me "," soy "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
//[" ser "," "],
[" sí$",". "],
]
}
conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(body,adposition){
return body;
}

conjugation.foreignQuote = 
wrld.conjugation.guillemetQuote;

var spaGrammar = new Grammar(spaWordOrder,spaDict,conjugation);
var spa = new Language(spaGrammar,spaDict);
return spa;
}

Spanish.prototype.code = function(){console.log("blah"); return "spa"};
exports.code = function(){console.log("blah"); return "spa"};
