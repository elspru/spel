#!/usr/bin/node
var io = require("../lib/io"),
    irc = require('irc'),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    initBitlObj = JSON.parse(io.fileRead(
        "/etc/spel/bitlBots.conf")),
    bot,
    bitlBot;
initObj.name = "sris";
initObj.title = "SPEL Secretary";
initBitlObj.name = "elspru";
initBitlObj.title = "SPEL Secretary";
console.log("connecting");
bot = botb(initObj);
bot.connect();
/* bitllbee start */
bitlBot = botb(initBitlObj);
bot.addListener("registered", function () {
  setTimeout(function() {bitlBot.connect();}, 1000);
});
bitlBot.addListener("registered", function () {
    bitlBot.say("nickserv", "identify " + initBitlObj.password);
    console.log("identified for bitlbee");
    setTimeout(function () {bitlBot.say("nickserv", "yes");}, 8000);
});
/* log channels */
function unique(wordArray) {
    "use strict";
    return wordArray.filter(function (elem, index, array) {
        return array.indexOf(elem, index+1) === -1;
    });
}
function topSixWords(wordArray) {
    "use strict";
    var gramWordsFile = io.fileRead("gramWords.eng.txt"),
        gramWords = gramWordsFile.split("\n"),
        wordFreq = {},
        title = "";
    /* remove grammar words */
    wordArray = wordArray.filter(function (word) {
        if (gramWords.indexOf(word) > -1) {
            return false;
        }
        return true;
    });
    /* identify frequency */
    wordArray.forEach(function (word) {
        if (wordFreq[word] === undefined) {
            wordFreq[word] = 1;
        } else {
            wordFreq[word] += 1;
        }
    });
    /* make wordArray unique */
    wordArray = unique(wordArray);
    /* sort by frequency */
    wordArray = wordArray.sort(function (word, word2) {
        return wordFreq[word2] - wordFreq[word];
    });
    title = wordArray.slice(0, 6).join(" ");
    return title;
}
// post IRC messages to other networks
initObj.channels.forEach(function (input_channel) {
    bot.addListener("message" + input_channel, function (from, message) {
        "use strict";
        var logDir = "logs/",
            logName = input_channel.replace(/#/, ""),
            logFile = logDir + logName + ".log",
            title = "",
            fileContents = io.fileRead(logFile),
            timeStamp = Math.floor((Date.now() / 1000)).
                toString(12).toUpperCase(),
            fileWords = fileContents.split(" "),
            line = "." + timeStamp + ".dose." + from + ".ginyeh: " +
                message;
        if (/^\ *\//.test(line)) {
            return;
        }
        console.log(line);
        if (initObj.admins.indexOf(from) !== -1) {
        if (message.substring(0, initObj.name.length + 1) === initObj.name + ":") {
          var newMessage = message.substring(initObj.name.length + 2);
          var input_channel_language_code = input_channel.split("-")[1] || "pya";
          if (newMessage.length < 140) {
            var language_channel_list = initBitlObj.language[input_channel_language_code];
            if (input_channel_language_code === "pya") {
            initBitlObj.channels.forEach(function (produce_channel) {
              if (produce_channel !== "&bitlbee") {
                  bitlBot.say(produce_channel, /*from + ":" + */ newMessage);
                  console.log("cross posted to " + produce_channel);
              } else {
                  bitlBot.say("nickserv", "yes");
                  console.log("yes");
              }
            });
            } else if (language_channel_list) {
              language_channel_list.forEach(function (produce_channel) {
                bitlBot.say(produce_channel, /*from + ":" + */ newMessage);
                console.log("cross posted to " + produce_channel);
              });
            }
            } else {
              bot.say(input_channel, "message length is " + newMessage.length + 
                      " too long for twitter (140)");
            }
          }
        }
        if (fileWords.length > 720) {
            title = topSixWords(fileWords);
            io.fileWrite(logDir + logName + "-" + timeStamp + 
                ".log", fileContents + line + "\n" + title);
            io.fileWrite(logFile, "");
        } else {
            io.fileWrite(logFile, fileContents + line + "\n");
        }
    });
});
// post replies from other networks to IRC
console.log("setup additional listeners");
initBitlObj.channels.forEach(function (channel) {
  bitlBot.addListener("message" + channel, function (from, message) {
    "use strict";
    if (/@streondj/.test(message)) {
      bot.say("#spel",  channel + " " + from +  " " + message);
    }
  });
});
