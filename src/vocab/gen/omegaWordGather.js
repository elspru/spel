#!/usr/bin/node
// harvest words from omega wiki

// algorithm:
//   make object of defined meaning id's
//   each with two counters, 
//   one to count all instances of the defined meaning
//   another to count all instances of it with idential meaning flag set
//   then can sort words based on number of identical meanings added to number of
//   total meanings. 

var events = require('events');
var eventEmitter = new events.EventEmitter();
var io = require("../../lib/io");

var mysql      = require('mysql'),
  omegaWiki = mysql.createPool({
  connectionLimit: 10,
  host     : 'localhost',
  user     : 'spel',
  password : 'pyac',
  database : 'omegawiki'
});

omegaWiki.getConnection(function(err, connection) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

var defined_meaning_list = {};


eventEmitter.on("third", function() {
  console.log("third ");
  var sortedKeys = 
    (Object.keys(defined_meaning_list).sort(
        function(a,b){
      return defined_meaning_list[a] - defined_meaning_list[b];
    }));
  var sortedArray = sortedKeys.map(function(key) {
      return [key, defined_meaning_list[key]];
    });
  sortedArray.reverse();
  var someObj = {};
  someObj.sortedDefinitionIds = sortedArray;
  io.fileWrite("definitionsSorted.json", JSON.stringify(someObj));


  //console.log(JSON.stringify(defined_meaning_list));
  console.log("done");
});

// more detailed algorithm:
//   list of defined_meaning_id and translated_content_id via
//   select defined_meaning_id,meaning_test_tcid from uw_defined_meaning
//     where remove_transaction_id is NULL;
connection.query("SELECT defined_meaning_id " +
                "FROM uw_defined_meaning WHERE remove_transaction_id is NULL;", 
                function(error, results) {
    if (error) { throw error; }
    //console.log("field " + JSON.stringify(field));
    results.forEach(function(obj) {
      defined_meaning_list[obj.defined_meaning_id] = [0, 0];
    });
    //
//    console.log(JSON.stringify(defined_meaning_list));
    // for each defined_meaning_id
    
    eventEmitter.emit("first");
});

var keysLength;
var rresults;
var kkey;
var iindex;
eventEmitter.on("second", function() {
  //console.log("rresults " + JSON.stringify(rresults));
  defined_meaning_list[kkey] = rresults[0]["count(*)"];
    if(iindex +1 === keysLength) {
      eventEmitter.emit("third");
    }
});
    
eventEmitter.on("first", function() {
    keysLength = Object.keys(defined_meaning_list).length;
    Object.keys(defined_meaning_list).forEach(function(key, index) {
    // count total number of entries with
    //   select count(*) from uw_syntrans where defined_meaning_id = id and
    //     remove_transaction_id is NULL;
  //      console.log(key);
  
      connection.query(
       "select count(*) from uw_syntrans where defined_meaning_id = " + 
          key + " and identical_meaning = 1 and remove_transaction_id is NULL;", 
          function(error, results) {
        if (error) { throw error; }
        //console.log(key + " " + JSON.stringify( results[0]["count(*)"]));
        rresults = results;
        kkey = key;
        iindex = index;
        eventEmitter.emit("second");
      });
    
    // count total number of identical entries with
    //   select count(*) from uw_syntrans where defined_meaning_id = id and
    //     remove_transaction_id is NULL and identical_meaning = 1;
    //  console.log("i " + index + " l " + keysLength); 
    });
});
  console.log('connected as id ' + connection.threadId);
  connection.release();
});
