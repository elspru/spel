var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var rusFile = require("./rus.txt.json");
var mwak = new Language();

module.exports = Russian;
function Russian(srcBase){
var rusText = new Text(mwak,rusFile);
var rusDict = new Dictionary(mwak,rusText);
var rusWordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa",".u",".i","ta",".a"],
};
var conjugation = {
reversible:[
[" ?а мне "," я "],
],
irreversible:[
[" да$",". "],
]
}
var rusGrammar = new Grammar(rusWordOrder,rusDict,conjugation);
var rus = new Language(rusGrammar,rusDict);
return rus;
}

Russian.prototype.code = function(){console.log("blah"); return "rus"};
exports.code = function(){console.log("blah"); return "rus"};
