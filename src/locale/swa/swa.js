var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var svo = require("../../locale/svo/svo");
var swaFile = require("./swa.txt.json");
var mwak = new Language();

module.exports = Swahili;
function Swahili(srcBase){
var swaText = new Text(mwak,swaFile);
var swaDict = new Dictionary(mwak,swaText);
var swaWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
[" ?su moi "," je "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" yo$",". "],
]
}
var swaGrammar = new Grammar(swaWordOrder,swaDict,conjugation);
var swa = new Language(swaGrammar,swaDict);
return swa;
}

Swahili.prototype.code = function(){console.log("blah"); return "swa"};
exports.code = function(){console.log("blah"); return "swa"};
