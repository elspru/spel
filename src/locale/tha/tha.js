var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var thaFile = require("./tha.txt.json");
var svo = require("../../locale/svo/svo");
var mwak = new Language();

module.exports = Thai;
function Thai(srcBase){
//var thaFile = io.fileRead(srcBase+"/locale/tha/tha.txt.json");
var thaText = new Text(mwak,thaFile);
var thaDict = new Dictionary(mwak,thaText);
var thaWordOrder = svo.wordOrder();
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
var thaGrammar = new Grammar(thaWordOrder,thaDict,conjugation);
var tha = new Language(thaGrammar,thaDict);
return tha;
}

Thai.prototype.code = function(){console.log("blah"); return "tha"};
exports.code = function(){console.log("blah"); return "tha"};
