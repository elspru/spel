var base = "../../";
var Text = require("../../class/text");
var Dictionary = require("../../lang/dictionary");
var Grammar = require("../../lang/grammar");
var Language = require("../../lang/language");
var svo = require("../../locale/svo/svo");
var wrld = require("../../locale/wrld/wrld");
var rusFile = require("./rus.txt.json");
var mwak = new Language();

module.exports = Russian;
function Russian(srcBase){
var rusText = new Text(mwak,rusFile);
var rusDict = new Dictionary(mwak,rusText);
var rusWordOrder = {
	headFinal : false,
	verbFinal : true,
	nounFinal : true,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa","hu","hi","ha"],
};
var conjugation = {
reversible:[
[" ?а мне "," я "],
],
irreversible:[
[" да$",". "],
]
}

conjugation.subjectPhrase = subjectPhraseConjugate;
function 
subjectPhraseConjugate(language,phrase,format,conjLevel){
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var result = body;
// exceptions
if (/^мне$/.test(body)) result= body.replace(/^мне$/,"я");
// default
return result+" ";
}

conjugation.verbPhrase = verbPhraseConjugate;
function verbPhraseConjugate(language,phrase,format,conjLevel){
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
return body+" ";
}


conjugation.objectPhrase = accusativePhraseConjugate;
function 
accusativePhraseConjugate(language,phrase,format,conjLevel){

// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "мня ";
else if (head === "tu") return "тебя ";
else if (head === "si") return "их ";
else
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);

var pos = new String();
var result = new String();


// feminine declension
if (/а $/.test(body)) result= pos+body.replace(/а $/,"у ");
else if (/я $/.test(body)) result= pos+body.replace(/я $/,"ю ");
else if (/ия $/.test(body)) result= pos+body.replace(/ия $/,"ию ");
else result= pos+body;
return result+" ";
}

conjugation.dativePhrase = dativePhraseConjugate;
function 
dativePhraseConjugate(language,phrase,format,conjLevel){

var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

var pos = adposition+" ";
var result = new String();
// feminine declension
if (/а $/.test(body)) result = pos+body.replace(/а $/,"е ");
else if (/я $/.test(body)) result= pos+body.replace(/я $/,"е ");
else if (/ия $/.test(body)) result= pos+body.replace(/ия $/,"ии ");
// neuter declesion
else if (/о $/.test(body)) result= pos+body.replace(/о $/,"у ");
else if (/е $/.test(body)) result= pos+body.replace(/е $/,"ю ");
// masculine declension
else if (/ий $/.test(body)) result= pos+body.replace(/ий $/,"ию ");
else if (/й $/.test(body)) result= pos+body.replace(/й $/,"ю ");
else if (/ь $/.test(body)) result= pos+body.replace(/ь $/,"ю ");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
result= pos+body.replace(/ $/,"у ");
else result= pos+body;
return result+" ";
}

conjugation.phrase = phraseConjugate;
function 
phraseConjugate(language,phrase,format,type,conjLevel){
var joiner = " ";
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

if(phrase.subPhrase){
var subPhrase =
phrase.subPhrase.toLocaleString(language,format,type,conjLevel);
}
if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);

var result = new String();
var pos = adposition+" ";
// feminine declension
if (/а $/.test(body)) result= pos+body.replace(/а $/,"е ");
else if (/я $/.test(body)) result= pos+body.replace(/я $/,"е ");
else if (/ия $/.test(body)) result= pos+body.replace(/ия $/,"ии ");
// neuter declesion
else if (/ие $/.test(body)) result= pos+body.replace(/ие $/,"и ");
else if (/о $/.test(body)) result= pos+body.replace(/о $/,"е ");
else if (/е $/.test(body)) result= pos+body.replace(/е $/,"е ");
// masculine declension
else if (/ий $/.test(body)) result= pos+body.replace(/ий $/,"ии ");
else if (/й $/.test(body)) result= pos+body.replace(/й $/,"е ");
else if (/ь $/.test(body)) result= pos+body.replace(/ь $/,"е ");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
result= pos+body.replace(/ $/,"у ");
else result= pos+body;
result += joiner;
if (subPhrase) {
result += subPhrase+joiner;
}
if (clause) result += clause+joiner;
return result;
}

conjugation.genitivePhrase = genitivePhraseConjugate;
function 
genitivePhraseConjugate(language,phrase,format,conjLevel){
var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

var pos = adposition+" ";
// exceptions
if (/мне $/.test(body)) return pos+body.replace(/е $/,"я ");
// feminine declension
if (/а $/.test(body)) return pos+body.replace(/а $/,"ы ");
else if (/я $/.test(body)) return pos+body.replace(/я $/,"и ");
else if (/ия $/.test(body)) return pos+body.replace(/ия $/,"ии ");
// neuter declesion
else if (/о $/.test(body)) return pos+body.replace(/о $/,"а ");
else if (/е $/.test(body)) return pos+body.replace(/е $/,"я ");
// masculine declension
else if (/ий $/.test(body)) return pos+body.replace(/ий $/,"ия ");
else if (/й $/.test(body)) return pos+body.replace(/й $/,"я ");
else if (/ь $/.test(body)) return pos+body.replace(/ь $/,"я ");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
return pos+body.replace(/ $/,"а ");
return pos+body;
}

conjugation.instrumentalPhrase = instrumentalPhraseConjugate;
function 
instrumentalPhraseConjugate(language,phrase,format,conjLevel){

var body = phrase.body.toLocaleString(language,format,"n",
conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

var pos = adposition+" ";
if (/мне $/.test(body)) return pos+body.replace(/е $/,"ой ");
// feminine declension
if (/а $/.test(body)) return pos+body.replace(/а $/,"ой ");
else if (/я $/.test(body)) return pos+body.replace(/я $/,"ей ");
else if (/ия $/.test(body)) return pos+body.replace(/ия $/,"ией ");
// neuter declesion
else if (/о $/.test(body)) return pos+body.replace(/о $/,"ом ");
else if (/е $/.test(body)) return pos+body.replace(/е $/,"ем ");
// masculine declension
else if (/ий $/.test(body)) return pos+body.replace(/ий $/,"ием ");
else if (/й $/.test(body)) return pos+body.replace(/й $/,"ем ");
else if (/ь $/.test(body)) return pos+body.replace(/ь $/,"ем ");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
return pos+body.replace(/ $/,"ом ");
return pos+body;
}

conjugation.foreignQuote = 
wrld.conjugation.guillemetQuote;

var rusGrammar = new Grammar(rusWordOrder,rusDict,conjugation);
var rus = new Language(rusGrammar,rusDict);
return rus;
}

Russian.prototype.code = function(){console.log("blah"); return "rus"};
exports.code = function(){console.log("blah"); return "rus"};
