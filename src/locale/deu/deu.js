var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var deuFile = require("./deu.txt.json");
var mwak = new Language();

module.exports = German;
function German(srcBase){
//var deuFile = io.fileRead(srcBase+"/locale/deu/deu.txt");
var deuText = new Text(mwak,deuFile);
var deuDict = new Dictionary(mwak,deuText);
var deuWordOrder = {
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
[" ?su mir "," ich "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" ya$",". "],
]
}
var deuGrammar = new Grammar(deuWordOrder,deuDict,conjugation);
var deu = new Language(deuGrammar,deuDict);
return deu;
}

German.prototype.code = function(){console.log("blah"); return "deu"};
exports.code = function(){console.log("blah"); return "deu"};
