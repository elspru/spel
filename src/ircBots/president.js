#!/usr/bin/node
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    dictionary = JSON.parse(io.fileRead("dictionary.json")),
    bot;
initObj.name = "pcen";
initObj.title = "SPEL President";
console.log("connecting");
bot = botb(initObj);
bot.connect();
/* translational duties */

function translateWord(dictionary, word) {
  var translation = dictionary["X" + word];
  console.log("w " + word + " t " + translation);
  if (translation === undefined) { translation = word; }
  return translation;
}
initObj.channels.forEach(function (inchannel) {
  bot.addListener('message' + inchannel, function (from, message) {
      "use strict";
      console.log("m " + message);
        if (message.substring(0, initObj.name.length + 1) === initObj.name + ":") {
        var newMessage = message.substring(initObj.name.length + 2);
        var pyash_text_array = [];
  //      console.log("nw " + newMessage);
        var input_channel_language_code = inchannel.split("-")[1] || "pya";
        console.log("iclc " + input_channel_language_code);
        if (input_channel_language_code !== "pya") {
          pyash_text_array = newMessage.split(" ").map(translateWord.curry(
                  dictionary[input_channel_language_code].pyash_dativeCase));
 //         console.log("PTA " + pyash_text_array);
          console.log(from + " " + newMessage);
        } else {
          pyash_text_array = newMessage.split(" ");
        }
        initObj.channels.forEach(function(outchannel) {
            //if (inchannel === outchannel) {
            //    return false;
            //}
            var produce_channel_language_code = outchannel.split("-")[1] || "pya";
            console.log("pclc " + produce_channel_language_code);
            if (produce_channel_language_code !== "pya") {
              bot.say(outchannel, 
                pyash_text_array.map(translateWord.curry(
                  dictionary[produce_channel_language_code].
                  pyash_ablativeCase)).join(" ")); 
            } else {
              bot.say(outchannel, pyash_text_array.join(" "));
            }
        });
        console.log("message sent");
    }
  });
 
});
console.log("additional listeners setup");
