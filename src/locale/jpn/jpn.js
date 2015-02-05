var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var jpnFile = require("./jpn.txt.json");
var sov = require("../../locale/sov/sov");
var mwak = new Language();

module.exports = Japanese;
function Japanese(srcBase){
var jpnText = new Text(mwak,jpnFile);
var jpnDict = new Dictionary(mwak,jpnText);
var jpnWordOrder = sov.wordOrder();
var conjugation = {
reversible:[
[" su me "," I "],
],
irreversible:[
[" 雅$","。 "],
]
}
var jpnGrammar = new Grammar(jpnWordOrder,jpnDict,conjugation);
var jpn = new Language(jpnGrammar,jpnDict);
return jpn;
}

Japanese.prototype.code = function(){console.log("blah"); return "jpn"};
exports.code = function(){console.log("blah"); return "jpn"};
