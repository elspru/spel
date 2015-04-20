var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var hebFile = require("./heb.txt.json");
var vso = require("../../locale/vso/vso");
var mwak = new Language();

module.exports = Hebrew;
function Hebrew(srcBase){
//var hebFile = io.fileRead(srcBase+"/locale/heb/heb.txt");
var hebText = new Text(mwak,hebFile);
var hebDict = new Dictionary(mwak,hebText);
var hebWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
topicInitial: false,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["sla","ku","twa","hi","hu","nya","ta","ha"],
littleEndian: true
};
var conjugation = 
{
reversible:[
[" su me "," I "],
],
irreversible:[
[" سو "," "],
[" أوب "," "],
[" يا$",". "],
]
}
var hebGrammar = new Grammar(hebWordOrder,hebDict,conjugation);
var heb = new Language(hebGrammar,hebDict);
return heb;
}

Hebrew.prototype.code = function(){console.log("blah"); return "heb"};
exports.code = function(){console.log("blah"); return "heb"};
