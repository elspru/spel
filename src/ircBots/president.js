#!/usr/bin/nodejs
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    transDictFile = io.fileRead("transDict.json"),
    bot;
initObj.name = "ryip";
initObj.title = "SPEL President";
console.log("connecting");
bot = botb(initObj);
bot.connect();
/* translational duties */
initObj.channels.forEach(function (inchannel) {
bot.addListener('message' + channel, function (from, message) {
    "use strict";
    initObj.channels.forEach(function(outchannel) {
        if (inchannel === outchannel) {
            return false;
        }
        if (message === "hello") {
            bot.say("#spel-fr", from + ";  bonjour");
        }
    }
    console.log("message sent");
});
}
console.log("additional listeners setup");
