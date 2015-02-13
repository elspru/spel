#!/usr/bin/nodejs
"use strict";
var date = new Date();
function hydrogenDate(){
// hydrogen lenth seconds since unix epoch began.
var leapSeconds = 25 // leap seconds  since unix epoch
// BCT is the hypothetical time at center of the sun, good for interplanetary.
var yearsSince1970 = date.getFullYear()-1970
var bctDrift = 490*yearsSince1970  // BCT is about 490 milliseconds faster
var timeInMiliseconds = date.getTime() + leapSeconds*1000 + bctDrift;

// 0.92 seconds = 1 hexadecimal second
var hexadecimalTimeInMiliseconds = timeInMiliseconds/0.92
var hexadecimalTimeInSeconds =  (hexadecimalTimeInMiliseconds/1000).toFixed();
var timeInt = parseInt(hexadecimalTimeInSeconds.toString());
var timeHexString = timeInt.toString(16).toUpperCase();
var timeHexStringReversed = timeHexString.split("").reverse().join("");
var time = timeHexStringReversed
return time;
}

function lilEndianDate(){
var timeInMiliseconds = date.getTime();
var hexadecimalTimeInMiliseconds = timeInMiliseconds
var hexadecimalTimeInSeconds =  (hexadecimalTimeInMiliseconds/1000).toFixed();
var timeInt = parseInt(hexadecimalTimeInSeconds.toString());
var timeHexString = timeInt.toString(16).toUpperCase();
var timeHexStringReversed = timeHexString.split("").reverse().join("");
var time = timeHexStringReversed
return time;
}

function bigEndianDate(){
var timeInMiliseconds = date.getTime();
var hexadecimalTimeInMiliseconds = timeInMiliseconds
var hexadecimalTimeInSeconds =  (hexadecimalTimeInMiliseconds/1000).toFixed();
var timeInt = parseInt(hexadecimalTimeInSeconds.toString());
var timeHexString = timeInt.toString(16).toUpperCase();
var time = timeHexString
return time;
}


//var time = lilEndianDate(); //hydrogenTime();
//var formatedTime = time.substring(0,1)+"seconds: "+time.substring(1,2)+"minutes; "
//		+time.substring(2,3)+"moments: "+time.substring(3,4)+"hours "
//		+time.substring(4,5)+"days/ "+time.substring(5,6)+"months/ "
//		+time.substring(6,7)+"years "+time.substring(7,8)+"decades "
//		+ " since Unix Epoch began";
//console.log(formatedTime);
console.log("ht "+hydrogenDate());
console.log("le "+lilEndianDate());
console.log("be "+bigEndianDate());
