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

//using defined_meaning_id's, 
var popularityCutOff = 20;
var definition_id_array =
JSON.parse(io.fileRead("definitionsSorted.json")).sortedDefinitionIds;
var definition_id_arrayLength = definition_id_array.length;

//and language_id's and iso639_3 name,

var languageCodeObj = {};
omegaWiki.query("select language_id,iso639_3 from language;", 
    function (error, results) {
  if (error) {throw error;}
  results.forEach(function (row) {
    languageCodeObj[row.language_id] = row.iso639_3.toString();
  });
  eventEmitter.emit("languagesLoaded");
});



//populate an object of translations.
//{"definition_id":{"iso639_3 name": [[uw_expression.spelling, ambiguity], ...],
//   ... }, ... }
//
////get all expressions and associated language_id's for a defined_meaning_id:
//

var iindex = 0;
var ddefinition_id = 0;
var popularity = 0;
var spelling = "";
var definitionDictionary = {};
var processed = {};
var langCode = "";
eventEmitter.on("languagesLoaded", function() {
  console.log("languagesLoaded");
  io.fileWrite("omegaWikiLangCodes.json", JSON.stringify(languageCodeObj));
  console.log("languagesWritten");
  definition_id_array.forEach(function (definition_entry, index) {
    var definition_id = definition_entry[0];
    popularity = definition_entry[1];
    omegaWiki.query(
        "select spelling,language_id,expression_id from uw_expression where expression_id in " +
        "(select expression_id from uw_syntrans where remove_transaction_id is " +
        "NULL and identical_meaning = 1 and defined_meaning_id = " +
        definition_id + " );",
        function (error, results) {
      if (error) { throw error; }
      var ddefinition_id = definition_id;
      var rresults = results;
      rresults.forEach(function (row) {
        langCode = languageCodeObj[row.language_id];
        if (row.language_id === 85) {
          console.log(ddefinition_id + " " + row.spelling.toString());
        }
        if (definitionDictionary[ddefinition_id] === undefined) {
          definitionDictionary[ddefinition_id] = {};
        }
        if (definitionDictionary[ddefinition_id][langCode] === undefined)
          {
          definitionDictionary[ddefinition_id][langCode] = [];
        }
        definitionDictionary[ddefinition_id][langCode].push(
            [row.expression_id, row.spelling.toString()]);
      });
      if (index +1 === definition_id_arrayLength) {
        eventEmitter.emit("EID & LID loaded");
      }
    });
  });
});

//
//// note some languages have multiple expressions with the same meaning
//// may be good to save the expression id's also, to avoid ambigious words 
//// if a language has more than one word, the least ambigious one(s) can be kept
//
//to find ambiguity for each expression

eventEmitter.on("EID & LID loaded", function () {
  console.log("EID & LID loaded");
  io.fileWrite("definitionDictionary.json", 
      JSON.stringify(definitionDictionary));
  definition_id_array.forEach(function (definition_entry, index) {
    var definition_id = definition_entry[0];
    var definition = definitionDictionary[definition_id];
    Object.keys(definition).forEach(function(langCode) {
      var expressionRowArray = definition[langCode];
      expressionRowArray.forEach(function(expressionRow) {
        var expression_id = expressionRow[0];
        omegaWiki.query(
            "select count(*) from uw_syntrans where identical_meaning = 1 and "+
            "remove_transaction_id is NULL and expression_id = " + 
          expression_id + ";", function (error, results) {
          if (error) { throw error; }
          console.log("ambiguity" + JSON.stringify(results[0]));
          if (index +1 === definition_id_arrayLength) {
            eventEmitter.emit("ambiguity loaded");
            eventEmitter.emit("finito");
          }
        });
      });
    });
  });
});
//


eventEmitter.on("finito", function() {
  console.log("done");
  omegaWiki.end();
});



//var definitionsArray = [];
//var ddefinition_id;
//var ddefinition_popularity;
//var definition;
//
//eventEmitter.on("finito", function() {
//  console.log("done");
//  omegaWiki.end();
//});
//
//eventEmitter.on("third", function() {
//  console.log("third");
//  var someObj = {};
//  //someObj.sortedDefinitionIds = definition_id_array;
//  someObj.definitionsArray = definitionsArray;
//  io.fileWrite("definitionsArray.json", JSON.stringify(someObj));
//  console.log("DAL " + definitionsArray.length);
//  eventEmitter.emit("finito");
//});
//
//eventEmitter.on("second", function() {
//  //console.log("second " + definition);
//  //console.log("rresults " + JSON.stringify(rresults));
//  if (ddefinition_popularity >= popularityCutOff && 
//      definition !== 0) {
//    definitionsArray[iindex] = [ddefinition_id, definition,
//                ddefinition_popularity];
//  }
//  if(iindex +1 === definition_id_arrayLength) {
//    eventEmitter.emit("third");
//  }
//});
//
///* for each definition, with over 10 instances,
//  find corresponding english definition and output it  */
//
//function numberArToAscii(numberArray) {
//  if (numberArray === undefined) { return numberArray; }
//  return numberArray.map(function (number) {
//    return String.fromCharCode(number);
//  });
//}
//
//  console.log("first");
//  definition_id_array.forEach(function(definition_entry, index) { 
//    var definition_id = definition_entry[0];
//    var definition_popularity = definition_entry[1];
//    omegaWiki.query(
//        "select text_text from uw_text where text_id in (select text_id from " +
//        "uw_translated_content where language_id = 85 " + 
//        "and remove_transaction_id is NULL and translated_content_id in ( " +
//        "select meaning_text_tcid from uw_defined_meaning where " +
//        "defined_meaning_id = " +  definition_id + "));", 
//        function(error, results) {
//      if (error) { throw error; }
//      iindex = index;
//      ddefinition_id = definition_id;
//      ddefinition_popularity = definition_popularity;
//      if( results && results[0] && results[0].text_text) {
//        definition = results[0].text_text.toString();
//      } else {
//        definition = undefined;
//      }
//      //console.log("results " + definition);
//
//      eventEmitter.emit("second");
//    });
//});
