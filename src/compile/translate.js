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
