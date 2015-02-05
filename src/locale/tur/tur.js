var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var sov = require("../../locale/sov/sov");
var turFile = require("./tur.txt.json");
var mwak = new Language();

module.exports = Turkish;
function Turkish(srcBase){
var turText = new Text(mwak,turFile);
var turDict = new Dictionary(mwak,turText);
var turWordOrder = sov.wordOrder();
var conjugation = {
reversible:[
[" ?su beni "," ben "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
[" ya$",". "],
]
}
var turGrammar = new Grammar(turWordOrder,turDict,conjugation);
var tur = new Language(turGrammar,turDict);
return tur;
}

Turkish.prototype.code = function(){console.log("blah"); return "tur"};
exports.code = function(){console.log("blah"); return "tur"};
