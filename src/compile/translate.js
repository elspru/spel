var emitter = require('events').EventEmitter;
var emi = new emitter;
exports.e = emi;
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
