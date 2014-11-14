////////////////////////////////////////////////////////////////
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file wordPhonotactics.js for higher order functions ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya

"use strict";
/// curry
Object.prototype.curry = function(args){
	return this.bind(null,args);
}
/// be expand bo array by function de
/// su expand be like bo map ya 
///	but if su function be return bo array 
///	then su expand be concat bo result ya
///	and if su function bo return bo null
///	then expand be skip bo element ya
Array.prototype.expand = function(func){
	if (typeof func != "function")
		throw new TypeError("su expand be need by function ya");
	var length = this.length >>> 0;
	var result = new Array();
	var providedThis = arguments[1];
	var i, val, res;
	for (i = 0; i < length; i ++){
		if (i in this) {
			val = this[i];
			res = func.call(providedThis, val, i, this);
			if (res !== null)
				result = result.concat(res);
		}
	}
	return result;
};
// stencil
/// be stencil bo array with offset array by function de
/// su stencil be like bo expand ya 
///	but with multiple element as input to function 
///		via array from offset array ya
exports.cofc = contigiousOffsetCheck;
function contigiousOffsetCheck(offsets){
	// if offsets are not one after other then false
	var prevOffset = null,
	    length = offsets.length,
	    offset, index;
	for (index=0; index < length; index++){
		offset = offsets[index];
		if (prevOffset !== null){
			prevOffset = prevOffset+1;
		   	if( prevOffset != offset)
				return false;
		}
		prevOffset = Number(offset);
	}	
	// else true
	return true;
}
Array.prototype.stencil = function(/*array*/offsets,func){
	//console.log("stenciling");
	if (typeof func != "function")
		throw new TypeError("su stencil be need by function ya");
	if (!Array.isArray(offsets))
		throw new TypeError("su stencil be need with offset array ya");
	var length = this.length >>> 0;
	var offsetsLength = offsets.length >>> 0;
	var contigiousOffsets = contigiousOffsetCheck(offsets);
	var valFunction = forStencil;
	function forStencil(array,index){ // default slow
			var val = new Array(); // to hold offsets
			var j, offset;
			//console.log("offsets"+offsets);
			//console.log(array);
			//console.log(length);
			for (j=0;j<offsetsLength;j++){
				offset = offsets[j];
				// if it does not exit make null
				if (index+offset<0
				   ||index+offset>length)
					val = val.concat(null);
				else val = val.concat(array[index+offset]);
			}
			//console.log("forSt "+val);
			return val;
	}
	var firstOffset = offsets[0];
	function sliceStencil(array,index){
		if (index+firstOffset<0
		   || index+offsetsLength>array.length){
			return forStencil(array,index);
		   }
		//console.log("sliceSt "+array.slice(index+firstOffset,
		//		   index+offsetsLength));
		return array.slice(index+firstOffset,
				   index+offsetsLength);
	}
	if (contigiousOffsets ){
		//console.log("slice stencil");
		valFunction = sliceStencil;
	}
	//else console.log("for stencil");
	var result = new Array();
	var providedThis = arguments[1];
	var i, res, val, offset;
	for (i = 0; i < length; i++){
		if (i in this) {
			val = valFunction(this,i);
			res = func.call(providedThis, val, i, this);
			if (res !== null)
				result = result.concat(res);
		}
	}
	return result;
};
// map
// reduce
/// su find be based on find from EcmaScript 6 ya
Array.prototype.find = function(func){
	if (typeof func != "function")
		throw new TypeError("su find be need by function ya");
	var length = this.length >>> 0;
	var providedThis = arguments[1];
	var i, j;
	for (i = 0; i < length; i++)
		if (i in this) 
			if (func.call(providedThis, this[i], i, this))
				return i;
	return null;
}
/// su rfind bo reverse find ya
Array.prototype.rfind = function(func){
	if (typeof func != "function")
		throw new TypeError("su find be need by function ya");
	var length = this.length >>> 0;
	var providedThis = arguments[1];
	var i, j;
	for (i = length-1; i >= 0; i--)
		if (i in this) 
			if (func.call(providedThis, this[i], i, this))
				return i;
	return null;
}
//
//// attach the .equals method to Array's prototype to call it on any array
//Array.prototype.equals = function (array) {
//// if the other array is a falsy value, return
//	if (!array)
//		return false;
//// compare lengths - can save a lot of time
//	if (this.length != array.length)
//		return false;
//	for (var i = 0, l=this.length; i < l; i++) {
//// Check if we have nested arrays
//		if (this[i] instanceof Array && array[i] instanceof Array) {
//// recurse into the nested arrays
//			if (!this[i].equals(array[i]))
//			return false;
//		}
//		else if (this[i] != array[i]) {
//// Warning - two different object instances will never be equal: {x:20} != {x:20}
//			return false;
//		}
//	}
//	return true;
//}

Object.prototype.equals = function(match){
	if (JSON.stringify(this)==(JSON.stringify(match)))
		return true;
	return false;
}
Array.prototype.isSubset = function(match){
	var i;
	var length = this.length;
	if (this.length===0)
		return true;//su empty set be always bo subset ya
	for (i=0;i<length;i++)
		if(match.indexOf(this[i])===-1)
			return false;
	return true;
}
Array.prototype.isSuperset = function(match){
	var i;
	var length = match.length;
	if (match.length===0)
		return true;//su empty set be always bo subset ya
	for (i=0;i<length;i++)
		if(this.indexOf(match[i])===-1)
			return false;
	return true;
}
Array.prototype.isLike = function(match){
	if (this.isSubset(match)
		||this.isSuperset(match))
		return true;
	return false;
}
//Object.prototype.copy = function(){
//	return JSON.parse(JSON.stringify(this));
//}

