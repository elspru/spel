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
dict[pair[0]] = pair[1];
});
// translate word
console.log(dict);
var result = dict[word];
// return result
console.log(result);

