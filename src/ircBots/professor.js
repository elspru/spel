#!/usr/bin/node
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    uniqueObj = JSON.parse(io.fileRead("unique-core.json")),
    langObj = JSON.parse(io.fileRead("langWords-core.json")),
    thesaurus = uniqueObj.thesaurus,
    mainWordsAr = Object.keys(thesaurus),
    rootList = langObj.rootList,
    gramList = langObj.gramList,
    bot;
initObj.name = "pfos";
initObj.title = "SPEL Professor";
console.log("connecting");
bot = botb(initObj);
bot.connect();
/* translational duties */
function randomWord() {
  var word =  mainWordsAr[Math.random() * mainWordsAr.length | 0];
  return rootList[word][0] + " " +  word.substring(1);
}
initObj.channels.forEach(function (channel) {
  bot.addListener('message' + channel, function (from, message) {
      "use strict";
      if (message.substring(0, initObj.name.length + 1) === initObj.name + ":") {
        var newMessage = message.substring(initObj.name.length + 2);
        if (newMessage === "word") {
          var word = randomWord(); 
          console.log("random word " + JSON.stringify(word));
          bot.say(channel, word);
        } else {
          bot.say(channel, from + ": " + newMessage);
        }
      }
  });
});
console.log("additional listeners setup");
