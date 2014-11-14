////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for input output functions files ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict";
var fs = require('fs');
/// IO
exports.fileRead = function(filename){
	function readFileCallback(err,data){
		if (err){
			throw err;
		}
		return data;
	}
	return fs.readFileSync(filename,"utf8",readFileCallback);
}
exports.fileWrite = function(filename,data){
	return fs.writeFileSync(filename,data);
}
