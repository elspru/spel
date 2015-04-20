var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var nldFile = require("./nld.txt.json");
var mwak = new Language();

module.exports = Dutch;
function Dutch(srcBase){
var nldText = new Text(mwak,nldFile);
var nldDict = new Dictionary(mwak,nldText);
var nldWordOrder = {
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
[" ?su mij "," ik "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" ya$",". "],
]
}
var nldGrammar = new Grammar(nldWordOrder,nldDict,conjugation);
var nld = new Language(nldGrammar,nldDict);
return nld;
}

Dutch.prototype.code = function(){console.log("blah"); return "nld"};
exports.code = function(){console.log("blah"); return "nld"};
