var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var porFile = require("./por.txt.json");
var svo = require("../../locale/svo/svo");
var mwak = new Language();

module.exports = Portuguese;
function Portuguese(srcBase){
//var porFile = io.fileRead(srcBase+"/locale/por/por.txt");
var porText = new Text(mwak,porFile);
var porDict = new Dictionary(mwak,porText);
var porWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
[" ?su me "," eU "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
//[" ser "," "],
[" ya$",". "],
]
}
var porGrammar = new Grammar(porWordOrder,porDict,conjugation);
var por = new Language(porGrammar,porDict);
return por;
}

Portuguese.prototype.code = function(){console.log("blah"); return "por"};
exports.code = function(){console.log("blah"); return "por"};
