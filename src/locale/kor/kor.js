var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var korFile = require("./kor.txt.json");
var sov = require("../../locale/sov/sov");
var mwak = new Language();

module.exports = Korean;
function Korean(srcBase){
//var korFile = io.fileRead(srcBase+"/locale/kor/kor.txt.json");
var korText = new Text(mwak,korFile);
var korDict = new Dictionary(mwak,korText);
var korWordOrder = sov.wordOrder();
var conjugation = {
reversible:[
[" su me "," I "],
],
irreversible:[
[" 우아한$",". "],
]
}
var korGrammar = new Grammar(korWordOrder,korDict,conjugation);
var kor = new Language(korGrammar,korDict);
return kor;
}

Korean.prototype.code = function(){console.log("blah"); return "kor"};
exports.code = function(){console.log("blah"); return "kor"};
