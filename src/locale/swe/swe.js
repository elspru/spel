var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var sweFile = require("./swe.txt.json");
var mwak = new Language();

module.exports = Swedish;
function Swedish(srcBase){
var sweText = new Text(mwak,sweFile);
var sweDict = new Dictionary(mwak,sweText);
var sweWordOrder = {
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
[" ?su mig "," jag "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" ya$",". "],
]
}
var sweGrammar = new Grammar(sweWordOrder,sweDict,conjugation);
var swe = new Language(sweGrammar,sweDict);
return swe;
}

Swedish.prototype.code = function(){console.log("blah"); return "swe"};
exports.code = function(){console.log("blah"); return "swe"};
