var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var cmnFile = require("./cmn.txt.json");
var mwak = new Language();

module.exports = Mandarin;
function Mandarin(srcBase){
//var cmnFile = io.fileRead(srcBase+"/locale/cmn/cmn.txt.json");
var cmnText = new Text(mwak,cmnFile);
var cmnDict = new Dictionary(mwak,cmnText);
var cmnWordOrder = {
headFinal : true,
verbFinal : true,
typeFinal : true,
postpositional : true,
clauseInitial: true,
genitiveInitial: true,
phraseOrder: ["sla","ku","twa","hu","hi","nya","ta","ha"]
};
var conjugation = {
reversible:[
[" be wil "," wil "]
],
irreversible:[
[" 主题 "," "],
[" 对象 "," "],
[" 雅$","。 "],
]
}
var cmnGrammar = new Grammar(cmnWordOrder,cmnDict,conjugation);
var cmn = new Language(cmnGrammar,cmnDict);
return cmn;
}

Mandarin.prototype.code = function(){console.log("blah"); return "cmn"};
exports.code = function(){console.log("blah"); return "cmn"};
