#!/usr/bin/node
// harvest definitions from omega wiki
var events = require('events');
var eventEmitter = new events.EventEmitter();
var io = require("../../lib/io");

var definitionDictionary = JSON.parse(io.fileRead(
  "definitionAmbiguityDictionary.json"));

var definitionsObj =
JSON.parse(io.fileRead("definitionsArray.json")).definitionsObj;

/*
  for english expressions, 
  add their order frequency number, based on the gutenberg list. 
  otherwise set it's frequency number as above the length of it. 
*/
function stringToWordLines(string) {
    function lineToWords(line) {
        return line.split(" ");
    }
    var lines = string.split("\n"),
        wordLines = lines.map(lineToWords);
    return wordLines;
}
var popularityObj = {};

function wordOfEachLine(wordIndex, wordLines) {
    return wordLines.map(function (line) {
        return line[wordIndex];
    });
}
       var freqFileContents = io.fileRead("english-30000.txt"),
        freqWordLines = stringToWordLines(freqFileContents),
        freqWords = wordOfEachLine(1, freqWordLines);

var definition_id_array =
JSON.parse(io.fileRead("definitionsSorted.json")).sortedDefinitionIds;

var sortedWordArray; 
var sortedDefinitionIds = {};


eventEmitter.on("done", function () {
console.log("finishing");
var sortedKeys = Object.keys(popularityObj).sort(function(a, b) {
  return popularityObj[a][0] - popularityObj[b][0];
});
var  sortedPopOut_list = [];
sortedKeys.forEach(function (definition_id) {
  var definition = definitionsObj[definition_id] &&
                   definitionsObj[definition_id][0];
  if (definition) {
    definition = definition.replace(/\n/g," ");
  }
  sortedPopOut_list.push(definition_id + ": " + 
                         popularityObj[definition_id][1] + ", " + 
                         popularityObj[definition_id][2] + ": " +
                          definition );
});
io.fileWrite("sortedPopOutList.txt", sortedPopOut_list.join("\n"));
io.fileWrite("popularityObj.json", JSON.stringify(popularityObj));
console.log("wrote files");
});

var minimumPopularity = 40;
var fqLength = freqWords.length;
var DDLength = definition_id_array.length; //Object.keys(definitionDictionary).length;
definition_id_array.forEach(function (definition_entry, index1) {
  var definition_id = definition_entry[0];
  var definition = definitionDictionary[definition_id];
  var popularity = definition_entry[1];
  if (popularity > minimumPopularity) {
  if (definition) {
    var expressionRowArray = definition.eng;
    if (!expressionRowArray) { return; }
    expressionRowArray.forEach(function(expressionRow) {
      var word = expressionRow[1];
      var ambiguity = expressionRow[2];
      if (ambiguity === undefined) {
        throw new Error("ambiguity undefined for " + expressionRow);
      }
      console.log(JSON.stringify(expressionRow));
      var index = freqWords.indexOf(word.toLowerCase());
      if (index === -1) {
        index = freqWords.length + index1;
      }
      if (popularityObj[definition_id] === undefined) {
        popularityObj[definition_id] = [index, word, ambiguity]; 
      }
      if (popularityObj[definition_id][2] > ambiguity) {
        popularityObj[definition_id] = [index, word, ambiguity];
      }
      if (index !== -1) {
        expressionRow[3] = index;
        if (popularityObj[definition_id][2] >= ambiguity &&
              popularityObj[definition_id][0] > index) {
          popularityObj[definition_id] = [index, word, ambiguity];
        }
      } else {
        expressionRow[3] = fqLength;
      }
  });
  }
  console.log("popdef " + definition_id +": " + popularityObj[definition_id]);
  console.log("DIAL " + definition_id_array.length + " i1 " + index1);
  }
  if (DDLength - 1 === index1 /*|| popularityObj[definition_id] === undefined */) {
  //finish();
    eventEmitter.emit("done");
  }
});




