
var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var epoFile = require("./epo.txt.json");
var svo = require("../../locale/svo/svo");
var mwak = new Language();

module.exports = Esperanto;
function Esperanto(srcBase){
//var epoFile = io.fileRead(srcBase+"/locale/epo/epo.txt.json");
var epoText = new Text(mwak,epoFile);
var epoDict = new Dictionary(mwak,epoText);
var epoWordOrder = svo.wordOrder();
var conjugation = {
reversible:[
[" ?su me "," soy "],
],
irreversible:[
[" ?su "," "],
[" ?ob "," "],
//[" ser "," "],
[" sí$",". "],
]
}
var epoGrammar = new Grammar(epoWordOrder,epoDict,conjugation);
var epo = new Language(epoGrammar,epoDict);
return epo;
}

Esperanto.prototype.code = function(){console.log("blah"); return "epo"};
exports.code = function(){console.log("blah"); return "epo"};
