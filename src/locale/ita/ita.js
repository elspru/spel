var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var itaFile = require("./ita.txt.json");
var mwak = new Language();

module.exports = Italian;
function Italian(srcBase){
//var itaFile = io.fileRead(srcBase+"/locale/ita/ita.txt");
var itaText = new Text(mwak,itaFile);
var itaDict = new Dictionary(mwak,itaText);
var itaWordOrder = {
	headFinal : false,
	verbFinal : false,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa",".u",".i","ta",".a"],
};
var conjugation = {
reversible:[
[" su me "," io "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" ya$",". "],
]
}
var itaGrammar = new Grammar(itaWordOrder,itaDict,conjugation);
var ita = new Language(itaGrammar,itaDict);
return ita;
}

Italian.prototype.code = function(){console.log("blah"); return "ita"};
exports.code = function(){console.log("blah"); return "ita"};
