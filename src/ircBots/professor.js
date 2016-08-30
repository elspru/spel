#!/usr/bin/node
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    uniqueObj = JSON.parse(io.fileRead("unique-mega.json")),
    langObj = JSON.parse(io.fileRead("langWords-mega.json")),
    thesaurus = uniqueObj.thesaurus,
    blacklist = uniqueObj.blacklist,
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
function repairWord(word) {
  function approvedWords(word) {
      if (thesaurus["X" + word] !== undefined) {
          return true;
      }
      return false;
  }
  var newWord = /^_/.test(word) ? word.substring(1) : word;
  var result = "";
  if (mainWordsAr.indexOf("X" + newWord) !== -1) {
    result = word;
  } else if (blacklist["X" + newWord]) {
    var bentry = blacklist["X" + newWord];
    if (Array.isArray(bentry)) {
        result += bentry.filter(approvedWords).join(", ");
    }
    result =  '<<' + result + '>>';
  }
  return result;
}
function translateWord(word) {
  var pyashWord = "";
  if (/^_/.test(word)) {
    //console.log("w " + word.substring(1) + " r " + rootList["X" +
    //            word.substring(1)][0]);
    pyashWord = rootList["X" + word.substring(1)][0];
  } else if (gramList["X" + word]) {
    console.log("gram word " + word);
    pyashWord = gramList["X" + word][0];
  } else {
    console.log("root word " + word);
    pyashWord = rootList["X" + word][0];
  }
  return pyashWord;
}
function randomWord() {
  var word =  mainWordsAr[Math.random() * mainWordsAr.length | 0];
  return rootList[word][0] + " " +  word.substring(1);
}
initObj.channels.forEach(function (channel) {
  bot.addListener('message' + channel, function (from, message) {
      "use strict";
      if (message.substring(0, initObj.name.length + 1) === initObj.name + ":") {
        var newMessage = message.substring(initObj.name.length + 2);
        var newMessageAr = newMessage.split(" ");
        if (newMessage === "tlat") {
          var word = randomWord(); 
          console.log("random word " + JSON.stringify(word));
          bot.say(channel, word);
        } else if (newMessageAr[newMessageAr.length-1] === "kfintu") {
          bot.say(channel, thesaurus["X" + newMessageAr[0]]);
        } else {
          var repaired = (newMessage.split(" ").map(repairWord)).join(" ");
          bot.say(channel, from + ": " + repaired);
          if (!/<</.test(repaired)) {
            var translated = repaired.split(" ").map(translateWord).join(" ");
            bot.say(channel, from + ": " + translated);
          }
        }
      }
  });
});
console.log("additional listeners setup");
