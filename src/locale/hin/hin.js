var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var sov = require("../../locale/sov/sov");
var hinFile = require("./hin.txt.json");
var mwak = new Language();

module.exports = Hindi;
function Hindi(srcBase){
var hinText = new Text(mwak,hinFile);
var hinDict = new Dictionary(mwak,hinText);
var hinWordOrder = sov.wordOrder();
var conjugation = {
reversible:[
[" su me "," I "],
],
irreversible:[
[" सु "," "],
[" ओबी "," "],
[" तो$",".। "],
]
}
var hinGrammar = new Grammar(hinWordOrder,hinDict,conjugation);
var hin = new Language(hinGrammar,hinDict);
return hin;
}

Hindi.prototype.code = function(){console.log("blah"); return "hin"};
exports.code = function(){console.log("blah"); return "hin"};
