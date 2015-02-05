var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var hunFile = require("./hun.txt.json");
var urj = require("../../locale/urj/urj");
var mwak = new Language();

module.exports = Hungarian;
function Hungarian(srcBase){
var hunText = new Text(mwak,hunFile);
var hunDict = new Dictionary(mwak,hunText);
var hunWordOrder = urj.wordOrder();
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
var hunGrammar = new Grammar(hunWordOrder,hunDict,conjugation);
var hun = new Language(hunGrammar,hunDict);
return hun;
}

Hungarian.prototype.code = function(){console.log("blah"); return "hun"};
exports.code = function(){console.log("blah"); return "hun"};
