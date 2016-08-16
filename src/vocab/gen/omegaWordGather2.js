#!/usr/bin/node
// harvest definitions from omega wiki
var events = require('events');
var eventEmitter = new events.EventEmitter();
var io = require("../../lib/io");

var mysql      = require('mysql'),
  omegaWiki = mysql.createConnection({
  host     : 'localhost',
  user     : 'spel',
  password : 'pyac',
  database : 'omegawiki'
});

var sortedArray =
JSON.parse(io.fileRead("definitionsSorted.json")).sortedDefinitionIds;
var sortedArrayLength = sortedArray.length;


var popularityCutOff = 1;
var iindex = 0;
var definitionsArray = [];
var definitionsObj = {};
var ddefinition_id;
var ddefinition_popularity;
var definition;

eventEmitter.on("finito", function() {
  console.log("done");
  omegaWiki.end();
});

eventEmitter.on("third", function() {
  console.log("third");
  var someObj = {};
  //someObj.sortedDefinitionIds = sortedArray;
  someObj.definitionsArray = definitionsArray;
  someObj.definitionsObj = definitionsObj;
  io.fileWrite("definitionsArray.json", JSON.stringify(someObj));
  console.log("DAL " + definitionsArray.length);
  eventEmitter.emit("finito");
});

eventEmitter.on("second", function() {
  //console.log("second " + definition);
  //console.log("rresults " + JSON.stringify(rresults));
  if (ddefinition_popularity >= popularityCutOff && 
      definition !== 0) {
    definitionsArray[iindex] = [ddefinition_id, definition,
                ddefinition_popularity];
    definitionsObj[ddefinition_id] =  [definition, ddefinition_popularity];
  }
  if(iindex +1 === sortedArrayLength) {
    eventEmitter.emit("third");
  }
});

/* for each definition, with over 10 instances,
  find corresponding english definition and output it  */

function numberArToAscii(numberArray) {
  if (numberArray === undefined) { return numberArray; }
  return numberArray.map(function (number) {
    return String.fromCharCode(number);
  });
}

  console.log("first");
  sortedArray.forEach(function(definition_entry, index) { 
    var definition_id = definition_entry[0];
    var definition_popularity = definition_entry[1];
    omegaWiki.query(
        "select text_text from uw_text where text_id in (select text_id from " +
        "uw_translated_content where language_id = 85 " + 
        "and remove_transaction_id is NULL and translated_content_id in ( " +
        "select meaning_text_tcid from uw_defined_meaning where " +
        "defined_meaning_id = " +  definition_id + "));", 
        function(error, results) {
      if (error) { throw error; }
      iindex = index;
      ddefinition_id = definition_id;
      ddefinition_popularity = definition_popularity;
      if( results && results[0] && results[0].text_text) {
        definition = results[0].text_text.toString();
      } else {
        definition = undefined;
      }
      //console.log("results " + definition);

      eventEmitter.emit("second");
    });
});
