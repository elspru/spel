var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var svo = require("../../locale/svo/svo");
var fraFile = require("./fra.txt.json");
var mwak = new Language();

module.exports = French;
function French(srcBase){
var fraText = new Text(mwak,fraFile);
var fraDict = new Dictionary(mwak,fraText);
var fraWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
[" ?su moi "," je "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
//[" être "," "],
[" ya$",". "],
]
}
var fraGrammar = new Grammar(fraWordOrder,fraDict,conjugation);
var fra = new Language(fraGrammar,fraDict);
return fra;
}

French.prototype.code = function(){console.log("blah"); return "fra"};
exports.code = function(){console.log("blah"); return "fra"};
