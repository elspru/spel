#!/usr/bin/nodejs
var io = require("../lib/io"),
    irc = require('irc'),
    botb = require("./ircBotBase"),
    initObj = {
        name: "sris",
        title: "SPEL Secretary",
        channels: ["#spel", "#spel-en", "#spel-fr"],
        voices : ["sris", "tsec", "cric", "plin"],
        admins : ["elspru", "hzak"]
    },
    bot = botb(initObj);
bot.connect();
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
function main() {
    var fileContents = io.fileRead("lorumIpsum.txt"),
        wordArray = fileContents.split(" ");
    console.log("testing");
    console.log(topSixWords(wordArray));
}

initObj.channels.forEach(function (channel) {
    bot.addListener("message" + channel, function (from, message) {
        "use strict";
        var logDir = "logs/",
            logName = channel.replace(/#/, ""),
            logFile = logDir + logName + ".log",
            title = "",
            fileContents = io.fileRead(logFile),
            timeStamp = Math.floor((Date.now() / 1000)).
                toString(12).toUpperCase(),
            fileWords = fileContents.split(" "),
            line = "." + timeStamp + ".mu." + from + ".nwo " +
                message;
        console.log(line);
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
console.log("setup additional listeners");
