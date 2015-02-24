var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var finFile = require("./fin.txt.json");
var urj = require("../../locale/urj/urj");
var mwak = new Language();

module.exports = Finnish;
function Finnish(srcBase){
var finText = new Text(mwak,finFile);
var finDict = new Dictionary(mwak,finText);
var finWordOrder = urj.wordOrder();
var conjugation = {
reversible:[
[" ?ezt su "," ez "],
[" ?nekem su "," én "],
[" ?téged su "," te "],
],
irreversible:[
[" su "," "],
[" ob "," "],
[" ya$",". "],
]
}
var finGrammar = new Grammar(finWordOrder,finDict,conjugation);
var fin = new Language(finGrammar,finDict);
return fin;
}

Finnish.prototype.code = function(){console.log("blah"); return "fin"};
exports.code = function(){console.log("blah"); return "fin"};
