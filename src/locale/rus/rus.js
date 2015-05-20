var base ="../../";
var parse = require("../../compile/parse");
var translate = require("../../compile/translate");
var Text = require("../../class/text");
var Phrase = require("../../class/phrase");
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
	subjectProminent: true,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["hu","hi","ha"],
};
var conjugation = {
reversible:[
[" ?а мне"," я"],
],
irreversible:[
[" дя$",". "],
[",. ",". "],
]
}


function genderGet(word){
var result = "m";
if (/ъ$/.test(word)) result = "m";
else if (/й$/.test(word)) result = "m";
else if (/ь$/.test(word)) result = "f";
else if (/а$/.test(word)) result = "f";
else if (/я$/.test(word)) result = "f";
else if (/о$/.test(word)) result = "n";
else if (/е$/.test(word)) result = "n";
return result;
}


conjugation.subjectPhrase = subjectPhraseConjugate;
function 
subjectPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "я"+joiner;
else if (head === "tu") return "ты"+joiner;
else if (head === "ti") return "оно́"+joiner;
else if (head === "yi") return "это"+joiner;
else if (head === "pa") return "то"+joiner;
else if (head === "wi") return "мы"+joiner;
else if (head === "yu") return "вы"+joiner;
else if (head === "si") return "они́"+joiner;

var body =
subjectAdjectiveConjugate(language,phrase.body,format,conjLevel);
var result = body;
// default
return result+", ";
}


conjugation.verbAgreement = verbAgreementConjugate;
function verbAgreementConjugate(language,sentence,format,conjLevel){
var phrases = sentence.phrases;

var subjectIndex = phrases.find(function(phrase){
if (
( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hu"))
return true; else return false;
});

var subjectBody = new String();
if (subjectIndex !== null) 
subjectBody = phrases[subjectIndex].body.toString();

var verbIndex = phrases.find(function(phrase){
if ( phrase.head.head === "hi"
|| phrase.head.head === "fa" && phrase.head.body
&& phrase.head.body.head === "hi")
return true; else return false;
});

if (verbIndex === null) var phrase = new Phrase(mwak,"hi");
else var phrase = phrases[verbIndex];

var joiner = " ";
var head = new String();
var body = new String();
if (phrase.body){
if (phrase.body.body)
body = phrase.body.body.toLocaleString(language,format,"v",
conjLevel);
if (phrase.body.head)
head = phrase.body.head.toLocaleString(language,format,"v",
conjLevel);
}
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);
var result = new String();
/* infinitive tense is default */
if (head.length>0 && body.length>0) result = head+joiner+body; 
else if (head.length>0) result = head;
else if (body.length>0) result = body;
else result = adposition;
 
if (body.length > 0)/* normal conjugation */{
body = infinitiveSuffixStrip(body);
var tense = mwak.grammar.tense
var tenseWord = phrase.body 
&& phrase.body.head && phrase.body.head.head;
if (body.length > 0 && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
/* present tense */
if (parse.wordMatch(tense.present,tenseWord)){

if (subjectBody === "mi") result = body+"ю"; 
else if (subjectBody === "tu") result= body+"ишь"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = body+"ит"; 
else if (subjectBody === "wi") result = body+"им" ;
else if (subjectBody === "yu") result= body+"ите";
else if (subjectBody === "gents"
||  subjectBody === "ladies"
||  subjectBody === "si") result = body+"ят"; 
else  result = body+"ит"
}
/* past tense */
else if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = body+"ed"; 
else if (subjectBody === "tu") result= body+"edst"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = body+"ed"; 
else if (subjectBody === "wi") result = body+"ed";
else if (subjectBody === "yu") result= body+"ed"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = body+"ed"; 
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
if (subjectBody === "mi") result = "буду "+body+"ю"; 
else if (subjectBody === "tu") result= "будешь "+body+"ишь"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = "будет "+body+"ит"; 
else if (subjectBody === "wi") result = "будем "+body+"им" ;
else if (subjectBody === "yu") result= "будете "+body+"ите";
else if (subjectBody === "gents"
||  subjectBody === "ladies"
||  subjectBody === "si") result = "будут "+body+"ят"; 
else  result = "будет "+body+"ит"
}
}
}
else if (body.length <= 0 && sentence.nominal)/* nominal */{
var tense = mwak.grammar.tense
var tenseWord = new String();
if (phrase.body && phrase.body.head)
tenseWord = phrase.body.head.head;
if (subjectBody.length > 0 && phrase.body && phrase.body.head && tenseWord
&& parse.wordMatch(tense.all,tenseWord)){
var body = adposition; /* be */
/* past tense */
if (parse.wordMatch(tense.past,tenseWord)){
if (subjectBody === "mi") result = "was"; 
else if (subjectBody === "tu") result= "wast"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = "was"; 
else if (subjectBody === "wi") result= "were"; 
else if (subjectBody === "yu") result= "were"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "were"; 
else result =  "were";
}
/* present tense */
else if (parse.wordMatch(tense.present,tenseWord)){
if (subjectBody === "mi") result = "am"; 
else if (subjectBody === "tu") result= "arst"; 
else if (subjectBody === "kli"
||  subjectBody === "fyi"
||  subjectBody === "ti") result = "is"; 
else if (subjectBody === "wi") result= "are"; 
else if (subjectBody === "yu") result= "are"; 
else if (subjectBody === "ils"
||  subjectBody === "elles"
||  subjectBody === "si") result = "are"; 
else result =  "is";
}
/* future tense */
else if (parse.wordMatch(tense.future,tenseWord)){
body = "will-be"
//if (subjectBody === "mi") result = body; 
//else if (subjectBody === "tu") result = "willst-be"; 
//else if (subjectBody === "kli"
//||  subjectBody === "fyi"
//||  subjectBody === "ti") result = body; 
//else if (subjectBody === "wi") result = body; 
//else if (subjectBody === "yu") result = body; 
//else if (subjectBody === "ils"
//||  subjectBody === "elles"
//||  subjectBody === "si") result = body; 
}
}
}
else result = head+joiner+body;

return result+joiner;
} // end of verbAgreement

function infinitiveSuffixStrip(body){
var stem = body.toString();
stem = stem.replace(/ться$/,"");
stem = stem.replace(/тись$/,"");
stem = stem.replace(/чься$/,"");
stem = stem.replace(/ти$/,"");
stem = stem.replace(/ть$/,"");
return stem;
}

//conjugation.verbPhrase = verbPhraseConjugate;
//function verbPhraseConjugate(language,phrase,format,conjLevel){
//var body = phrase.body.toLocaleString(language,format,"n",
//conjLevel);
//return body+" ";
//}


conjugation.objectPhrase = accusativePhraseConjugate;
function 
accusativePhraseConjugate(language,phrase,format,conjLevel){

var joiner = " ";
// exceptions
var head = phrase && phrase.body && phrase.body.head 
&& phrase.body.head.head;
if (head === "mi") return "меня́"+joiner;
else if (head === "tu") return "тебя́"+joiner;
else if (head === "ti") return "э́то"+joiner;
else if (head === "pa") return "то"+joiner;
else if (head === "wi") return "нас"+joiner;
else if (head === "yu") return "вас"+joiner;
else if (head === "si") return "их"+joiner;

var body =
objectAdjectiveConjugate(language,phrase.body,format,conjLevel);
body = infinitiveSuffixStrip(body);

var pos = new String();
var result = new String();

var number = mwak.grammar.number;
var Type = phrase.body;

// pluralize
var number = mwak.grammar.number;
var Type = phrase.body;
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
var lastGlyph=body[body.length-1];
if ("а"===lastGlyph)
result = pos+body.replace(/.$/,"ы");
else if ("о"===lastGlyph)
result = pos+body.replace(/.$/,"а");
else if ("е"===lastGlyph)
result = pos+body.replace(/.$/,"я");
else if (["я","й"].indexOf(lastGlyph)!==-1)
result = pos+body.replace(/.$/,"и");
else result = pos+body+"ы";
}
// feminine declension
else if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
result = pos+body+"и "; 
}
else if (/а$/.test(body)) result= pos+body.replace(/а$/,"у");
else if (/я$/.test(body)) result= pos+body.replace(/я$/,"ю");
else if (/ия$/.test(body)) result= pos+body.replace(/ия$/,"ию");
else result= pos+body;
return result+", ";
}

var vowels =["а","я","и","о","е","й"]

function isVowel(glyph){
if (vowels.indexOf(glyph)!== -1) return true;
else false;
}

conjugation.dativePhrase = dativePhraseConjugate;
function 
dativePhraseConjugate(language,phrase,format,conjLevel){

var body =
dativeAdjectiveConjugate(language,phrase.body,format,conjLevel);
var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

var pos = adposition+" ";
var result = new String();

// pluralize
var number = mwak.grammar.number;
var Type = phrase.body;
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
var lastGlyph=body[body.length-1];
if (["й","ь"].indexOf(lastGlyph)!==-1)
result = pos+body.replace(/.$/,"ям");
else if (isVowel(lastGlyph))
result = pos+body+ "м "; 
else result = pos+body+"ам";
}
// feminine declension
else if (/а$/.test(body)) result = pos+body.replace(/а$/,"е");
else if (/я$/.test(body)) result= pos+body.replace (/я$/,"е");
else if (/ия$/.test(body)) result= pos+body.replace(/ия$/,"ии");
// neuter declesion
else if (/о$/.test(body)) result= pos+body.replace (/о$/,"у");
else if (/е$/.test(body)) result= pos+body.replace( /е$/,"ю");
// masculine declension
else if (/ий$/.test(body)) result= pos+body.replace(/ий$/,"ию");
else if (/й$/.test(body)) result= pos+body.replace(/й$/,"ю");
else if (/ь$/.test(body)) result= pos+body.replace(/ь$/,"ю");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
result= pos+body.replace(/$/,"у");
else result= pos+body;

if (phrase.clause)
var clause = phrase.clause.toLocaleString(language,format,
"n",conjLevel);
if (clause) result += " "+clause;

return result+", ";
}

var isPronoun = wrld.conjugation.isPronoun;

conjugation.phrase = phraseConjugate;
function 
phraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
//var body = phrase.body.toLocaleString(language,format,"n",
//conjLevel);
var type = "n";


var body =
phraseAdjectiveConjugate(language,phrase.body,format,conjLevel);
body = infinitiveSuffixStrip(body);

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

result= pos+body;
if (phrase.body.body){
// feminine declension
if (/а$/.test(body)) result= pos+body.replace(/а$/,"е");
else if (/я$/.test(body)) result= pos+body.replace(/я$/,"е");
else if (/ия$/.test(body)) result= pos+body.replace(/ия$/,"ии");
// neuter declesion
else if (/ие$/.test(body)) result= pos+body.replace(/ие$/,"и");
else if (/о$/.test(body)) result= pos+body.replace(/о$/,"е");
else if (/е$/.test(body)) result= pos+body.replace(/е$/,"е");
// masculine declension
else if (/ий$/.test(body)) result= pos+body.replace(/ий$/,"ии");
else if (/й$/.test(body)) result= pos+body.replace(/й$/,"е");
else if (/ь$/.test(body)) result= pos+body.replace(/ь$/,"е");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
result= pos+body.replace(/$/,"у");
}
result += joiner;
if (subPhrase) {
result += subPhrase+joiner;
}
if (clause) result += clause+","+joiner;
return result;
}


function phraseAdjectiveConjugate(language,type,format,conjLevel){
var result = new String();
var joiner = " ";
var dict = language.dictionary.fromMwak;
var adjectives = type && type.body && type.body.body;
var noun = type && type.body 
&& type.body.head ;
if (noun) noun = translate.word(dict,noun);
var markers = type && type.head 
&& type.head.toLocaleString(language);
if (markers)
result += markers + joiner;
if (adjectives){
var i;
var gender = genderGet(noun);
var affix = " ";
if (gender === "m") affix="ом ";
else if (gender === "f") affix="ой ";
else if (gender === "n") affix="ом ";

for (i=0;i<adjectives.length;i++){
var word = translate.word(dict,adjectives[i]);
// strip ender
word = stripAffix(word);
// add affix
result += word+affix;
}}
if (noun)
result += noun;
return result;
}


function dativeAdjectiveConjugate(language,type,format,conjLevel){
var result = new String();
var joiner = " ";
var dict = language.dictionary.fromMwak;
var adjectives = type.body.body;
var noun = type && type.body 
&& type.body.head ;
if (noun) noun = translate.word(dict,noun);
var markers = type.head;
if (markers)
result += markers.toLocaleString(language,format,"th",conjLevel) + joiner;
if (adjectives){
var i;
var gender = genderGet(noun);
var affix = " ";

// pluralize
var number = mwak.grammar.number;
var Type = type;
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
affix = "ым "; 
}
else if (gender === "m") affix="ому ";
else if (gender === "f") affix="ой ";
else if (gender === "n") affix="ому ";
for (i=0;i<adjectives.length;i++){
var word = translate.word(dict,adjectives[i]);
// strip ender
word = stripAffix(word);
// add affix
result += word+affix;
}}
if (noun) result += noun;

return result;
} // end adjective conjugate


function subjectAdjectiveConjugate(language,type,format,conjLevel){
var result = new String();
var joiner = " ";
var dict = language.dictionary.fromMwak;
var adjectives = type.body && type.body.body;
var noun = type && type.body 
&& type.body.head ;
if (noun) noun = translate.word(dict,noun);
var markers = type.head;
if (markers)
result += markers + joiner;
if (adjectives){
var i;
var gender = genderGet(noun);
var affix = " ";
if (gender === "m") affix="ый ";
else if (gender === "f") affix="ая ";
else if (gender === "n") affix="ое ";
for (i=0;i<adjectives.length;i++){
var word = translate.word(dict,adjectives[i]);
// strip ender
word = stripAffix(word);
// add affix
result += word+affix;
}}
if (noun) result += noun;
return result;
} // end adjective conjugate


function objectAdjectiveConjugate(language,type,format,conjLevel){
var result = new String();
var joiner = " ";
var dict = language.dictionary.fromMwak;
var adjectives = type.body && type.body.body;
var noun = type && type.body 
&& type.body.head ;
if (noun) noun = translate.word(dict,noun);
var markers = translate.word(dict,type.head);
if (markers)
result += markers + joiner;
if (adjectives){
var i;
var gender = genderGet(noun);
var affix = " ";


// pluralize
var number = mwak.grammar.number;
var Type = type;
if (Type.head && Type.head.head
&& parse.wordMatch(number.all,Type.head.head)){
affix = "ые "; 
}
else if (gender === "m") affix="ый ";
else if (gender === "f") affix="ую ";
else if (gender === "n") affix="ое ";
for (i=0;i<adjectives.length;i++){
var word = translate.word(dict,adjectives[i]);
// strip ender
word = stripAffix(word);
// add affix
result += word+affix;
}}
if (noun) result += noun;
return result;
} // end adjective conjugate


function instrumentalAdjectiveConjugate(language,type,format,conjLevel){
var result = new String();
var joiner = " ";
var dict = language.dictionary.fromMwak;
var adjectives = type.body.body;
var noun = type && type.body 
&& type.body.head ;
if (noun) noun = translate.word(dict,noun);
var markers = type.head;
if (markers)
result += markers + joiner;
if (adjectives){
var i;
var gender = genderGet(noun);
var affix = " ";
if (gender === "m") affix="ым ";
else if (gender === "f") affix="ой ";
else if (gender === "n") affix="ым ";
for (i=0;i<adjectives.length;i++){
var word = translate.word(dict,adjectives[i]);
// strip ender
word = stripAffix(word);
// add affix
result += word+affix;
}}
if (noun) result += noun;
return result;
} // end adjective conjugate

function stripAffix(word){
word=word.replace(/ий$/,"");
word=word.replace(/ый$/,"");
word=word.replace(/ый$/,"");
word=word.replace(/о́й$/,"");
word=word.replace(/яя$/,"");
word=word.replace(/и$/,"");
return word;
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
if (/мне$/.test(body)) return pos+body.replace(/е$/,"я");
// feminine declension
if (/а$/.test(body)) return pos+body.replace(/а$/,"ы");
else if (/я$/.test(body)) return pos+body.replace(/я$/,"и");
else if (/ия$/.test(body)) return pos+body.replace(/ия$/,"ии");
// neuter declesion
else if (/о$/.test(body)) return pos+body.replace(/о$/,"а");
else if (/е$/.test(body)) return pos+body.replace(/е$/,"я");
// masculine declension
else if (/ий$/.test(body)) return pos+body.replace(/ий$/,"ия");
else if (/й$/.test(body)) return pos+body.replace(/й$/,"я");
else if (/ь$/.test(body)) return pos+body.replace(/ь$/,"я");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F)
return pos+body.replace(/$/,"а");
return pos+body;
}

conjugation.instrumentalPhrase = instrumentalPhraseConjugate;
function 
instrumentalPhraseConjugate(language,phrase,format,conjLevel){
var joiner = " ";
var body =
instrumentalAdjectiveConjugate(language,phrase.body,format,conjLevel);
body = infinitiveSuffixStrip(body);

var adposition = phrase.head.toLocaleString(language,format,
"ch",conjLevel);

var pos = adposition+" ";
if (/мне$/.test(body)) return pos+body.replace(/е$/,"ой");
// feminine declension
if (/а$/.test(body)) result= pos+body.replace(/а$/,"ой");
else if (/я$/.test(body)) result= pos+body.replace(/я$/,"ей");
else if (/ия$/.test(body)) result= pos+body.replace(/ия$/,"ией");
// neuter declesion
else if (/о$/.test(body)) result= pos+body.replace(/о$/,"ом");
else if (/е$/.test(body)) result= pos+body.replace(/е$/,"ем");
// masculine declension
else if (/ий$/.test(body)) result= pos+body.replace(/ий$/,"ием");
else if (/й$/.test(body)) result= pos+body.replace(/й$/,"ем");
else if (/ь$/.test(body)) result= pos+body.replace(/ь$/,"ем");
//else if (/и$/.test(body)) result= pos+body.replace(/и$/,"ями");
else if (body.charCodeAt(body.length-2)>=0x0400
&& body.charCodeAt(body.length-2)<=0x052F){
body = stripAffix(body);
result= pos+body+"ом";
}
else result= pos+body;

return result+joiner;
}

conjugation.foreignQuote = 
wrld.conjugation.guillemetQuote;

var rusGrammar = new Grammar(rusWordOrder,rusDict,conjugation);
var rus = new Language(rusGrammar,rusDict);
return rus;
}

Russian.prototype.code = function(){console.log("blah"); return "rus"};
exports.code = function(){console.log("blah"); return "rus"};
