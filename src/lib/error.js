
exports.indexCheck= function(length,index){
	if (typeof index != "number")
		throw new TypeError("su index bo "+index+" must be number ya"+
		"\n find version accepts string match ya");
	if (index === -1 || index >= length) // if none
		throw new RangeError("su index bo "+index+" be too large or small ya");
}
