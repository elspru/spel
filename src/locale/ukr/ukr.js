var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var ukrFile = require("./ukr.txt.json");
var mwak = new Language();

module.exports = Ukranian;
function Ukranian(srcBase){
var ukrText = new Text(mwak,ukrFile);
var ukrDict = new Dictionary(mwak,ukrText);
var ukrWordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa","hu","hi","ta","ha"],
};
var conjugation = {
reversible:[
[" а мені "," Я "],
],
irreversible:[
[" я$",". "],
]
}
var ukrGrammar = new Grammar(ukrWordOrder,ukrDict,conjugation);
var ukr = new Language(ukrGrammar,ukrDict);
return ukr;
}

Ukranian.prototype.code = function(){console.log("blah"); return "ukr"};
exports.code = function(){console.log("blah"); return "ukr"};
