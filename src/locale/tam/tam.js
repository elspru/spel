var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var mwak = new Language();

module.exports = English;
function English(srcBase){
var engFile = io.fileRead(srcBase+"/locale/eng/eng.txt");
var engText = new Text(mwak,engFile);
var engDict = new Dictionary(mwak,engText);
var engWordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa","hu","hi","ta","ha"],
};
var conjugation = {
reversible:[
[" be past eat "," ate "],
[" be past meet "," met "],
[" su me "," I "],
[" su you "," ye "],
[" su thee "," thou "],
[" su him "," he "],
[" su her "," she "],
[" su them "," they "],
[" su em "," ey "],
[" su us "," we "],
[" I be past "," I was "],
[" I be now "," I am "],
[" she be past "," she was "],
[" she be now "," she is "],
[" he be past "," he was "],
[" he be now "," he is "],
[" thou be past "," thou was "],
[" thee be now "," thou is "],
[" ey be past "," ey was "],
[" ey be now "," ey is "],
[" ye be past "," ye were "],
[" ye be now "," ye are "],
[" we be past "," we were "],
[" we be now "," we are "],
[" they be past "," they were "],
[" be wil "," wil "]
],
irreversible:[
[" su "," "],
[" ob "," "],
[" ya$",". "],
[" tha "," that "]
]
}
var engGrammar = new Grammar(engWordOrder,engDict,conjugation);
var eng = new Language(engGrammar,engDict);
return eng;
}

English.prototype.code = function(){console.log("blah"); return "eng"};
exports.code = function(){console.log("blah"); return "eng"};
