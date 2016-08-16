#!/usr/bin/node
// harvest definitions from omega wiki
var events = require('events');
var eventEmitter = new events.EventEmitter();
var io = require("../../lib/io");

var mysql      = require('mysql'),
  omegaWiki = mysql.createPool({
  connectionLimit: 8,
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

var languageCodeObj = JSON.stringify(io.fileRead("omegaWikiLangCodes.json"));


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
var definitionDictionary = JSON.parse(io.fileRead("definitionDictionary.json"));
var final_length = 49495;

//
//// note some languages have multiple expressions with the same meaning
//// may be good to save the expression id's also, to avoid ambigious words 
//// if a language has more than one word, the least ambigious one(s) can be kept
//
//to find ambiguity for each expression

omegaWiki.getConnection(function(err, connection) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

var newDD = {};
eventEmitter.on("ambiguity load", function() {
  io.fileWrite("definitionAmbiguityDictionary.json",
      JSON.stringify(newDD));
  console.log("wrote definition dictionary");
});
var ambiguity = "";
var definition_id;
//var llangCode;
//eventEmitter.on("ambiguity set", function() {
//  if (definitionDictionary[definition_id]) {
//  definitionDictionary[definition_id][llangCode][index3b][2] = ambiguity;
//  console.log(definitionDictionary[definition_id][llangCode][index3b]);
//  }
//});
definition_id_array.forEach(function (definition_entry, index) {
  definition_id = definition_entry[0];
  var defid1 = definition_id;
  var definition = definitionDictionary[definition_id];
  if (definition) {
  Object.keys(definition).forEach(function(langCode, index2) {
    var defid2 = defid1;
    var langCode2 = langCode;
    var expressionRowArray = definition[langCode];
    expressionRowArray.forEach(function(expressionRow, index3) {
      var defid3 = defid2;
      var langCode3 = langCode2;
      var expression_id = expressionRow[0];
      //console.log(expression_id);
      
      if (expression_id) {
      connection.query(
          "select count(*) from uw_syntrans where identical_meaning = 1 and "+
          "remove_transaction_id is NULL and expression_id = " + 
          expression_id + ";", function (error, results) {
        var iindex = index;
        var index3b = index3;
        if (error) { throw error; }
        ambiguity = results[0]["count(*)"];
  //      eventEmitter.emit("ambiguity set");
        //console.log("ambiguity2 " + JSON.stringify(expressionRow));
        console.log("ii " + index + " i2 " + index2 +  " i3 " + index3);
  if (definitionDictionary[defid3]) {
    definitionDictionary[defid3][langCode3][index3b][2] = ambiguity;
    console.log(definitionDictionary[defid3][langCode3][index3b]);
    if (newDD[defid3] === undefined) {
      newDD[defid3] = definitionDictionary[defid3];
    } else if (newDD[defid3][langCode3] === undefined) {
      newDD[defid3][langCode3] = definitionDictionary[defid3][langCode3];
    } else if (newDD[defid3][langCode3][index3b] === undefined) {
      newDD[defid3][langCode3][index3b] = 
        definitionDictionary[defid3][langCode3][index3b];
    }
  }
        if (iindex % 100  === 0 && index2 === 0 && index3 === 0) {
          console.log("index " + index);
          eventEmitter.emit("ambiguity load");
        }
        if (iindex +1 === final_length) {
          eventEmitter.emit("finito");
        }
      });
        }
    });
  });
  }
});
});
//


eventEmitter.on("finito", function() {
  io.fileWrite("definitionAmbiguityDictionary.json.bak",
      JSON.stringify(definitionDictionary));
  console.log("done");
  omegaWiki.end();
});
