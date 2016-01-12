exports.word = wordTranslate;
function wordTranslate(subDictionary, word){
	if (subDictionary == undefined)
		return word; 
	var transl = subDictionary[word];	
	if ( transl == undefined){
		transl = word;
		//emi.on("warn",function(err){console.log(err)});
		//emi.emit("warn",word+" be lack bo translation ya");
		//console.error(word+" be lack bo translation ya");
		//throw new Error(word
		//	+" be lack bo translation ya"
		//	+" be check bo dictionary do");

	}
	return transl;

}
exports.array = arrayTranslate;
function arrayTranslate(subDictionary, array){
var result = new Array(),
    i;
for(i = 0; i<array.length; i++)
	result[i] = wordTranslate(subDictionary,array[i]);
return result;
}
exports.toJavascript =
	toJavascriptTranslate;
function toJavascriptTranslate(/*Text*/ textObject){
// algorithm: 
// assume is text object
//
// iterate through sentences
// turn phrases into an object

var sentences = textObject.sentences;
// iterate through sentences
var i;
for (i=0;i<sentences.length;i++){
// turn phrases into an object
var sentence = sentences[i];
var phrases = sentence.phrases;
var j;
for (j=0;j<phrases.length;j++){
phrases.head;
}
}
}
exports.conjugate = conjugate;
function conjugate(language,string,conjugationLevel){
    // search and replace based on grammar.conjugation
    var conjugation = language.grammar.conjugation;
    var stringBuffer = string.split("");
    if (conjugationLevel > 0){// conjugate
    var i;
    var reversible = conjugation.reversible;
    for (i=0;i<reversible.length;i++){
    var fromTo=reversible[i];
    var match=RegExp(fromTo[0],'g')
    var string = string.replace(match,fromTo[1]);
    }
    if (conjugationLevel > 1){// naturalize
    var irreversible = conjugation.irreversible;
    for (i=0;i<irreversible.length;i++){
    var fromTo=irreversible[i];
    var match = RegExp(fromTo[0],'g');
    var string =string.replace(match,fromTo[1]);
    } } }
    return string;
}
exports.disjugate = disjugate;
function disjugate(language,string,conjugationLevel){
// search and replace based on grammar.conjugation
}
