#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
// translates based on a plain text file
// input: filename word-to-translate
//
// file layout:
// analytic-english-word some-space foreign-word new-line
//
// algorithm:
// load arguments
// load file
// transform file into dictionary
// translate word
// return result

"use strict";
// load arguments
var filename = process.argv[2];
var word = process.argv[3];
// load file
var io = require("../lib/io");
var fileContent = io.fileRead(filename);
var fileContent = fileContent.replace(/\,/g,"");
var fileContent = fileContent.replace(/\./g,"");
// transform file into dictionary
var fileLines = fileContent.split("\n");
var hof = require("../lib/hof");
var dictArray = fileLines.map(function(line){
var keyValue = line.split(/\ \ */);
var key = keyValue[0];
var value = keyValue[1];
return [key,value];
});
var dict = new Object();
dictArray.forEach(function(pair){
dict[pair[1]] = pair[0];
});
// translate word
//console.log(dict);
var result = dict[word];
if (result === undefined) result = word;
// return result
console.log(result);

