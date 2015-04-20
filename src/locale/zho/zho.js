var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var wrld = require("../../locale/wrld/wrld");
var zhoFile = require("./zho.txt.json");
var mwak = new Language();

module.exports = Chinese;
function Chinese(srcBase){
//var zhoFile = io.fileRead(srcBase+"/locale/zho/zho.txt.json");
var zhoText = new Text(mwak,zhoFile);
var zhoDict = new Dictionary(mwak,zhoText);
var zhoWordOrder = {
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
]
}

conjugation.foreignQuote = 
wrld.conjugation.citationQuote;

var zhoGrammar = new Grammar(zhoWordOrder,zhoDict,conjugation);
var zho = new Language(zhoGrammar,zhoDict);
return zho;
}

Chinese.prototype.code = function(){console.log("blah"); return "zho"};
exports.code = function(){console.log("blah"); return "zho"};
