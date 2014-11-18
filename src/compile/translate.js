var emitter = require('events').EventEmitter;
var emi = new emitter;
exports.e = emi;
exports.word = wordTranslate;
function wordTranslate(subDictionary, word){
	var transl = subDictionary[word];	
	if ( transl == undefined){
		transl = word;
		//emi.on("warn",function(err){console.log(err)});
		emi.emit("warn",word+" be lack bo translation ya");
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
