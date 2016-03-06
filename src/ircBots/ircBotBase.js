var irc = require('irc'),
    initObj = {
        name : "hzak",
        title : "SPEL President",
        admins : ["elspru", "sris", "tsec", "hzak"]
    };
function initBot(obj) {
    "use strict";
    var server = obj.server,
        nick = obj.name,
        //admins = obj.admins,
        options =
            {
                userName: nick,
                realName: obj.title,
                port: 6667,
                localAddress: null,
                debug: false,
                showErrors: false,
                autoRejoin: false,
                autoConnect: false,
                channels: obj.channels,
                secure: false,
                selfSigned: false,
                certExpired: false,
                floodProtection: false,
                floodProtectionDelay: 5000,
                sasl: false,
                stripColors: false,
                channelPrefixes: "&#",
                messageSplit: 512,
                encoding: 'UTF-8',
                millisecondsOfSilenceBeforePingSent: 60000,
                millisecondsOfSilenceBeforePingTimeout: 30000
            },
        bot = new irc.Client(server, nick, options);
    bot.addListener('pm', function (from, message) {
        console.log(from + ' => ME: ' + message);
    });
    bot.addListener('error', function (message) {
        console.log('error: ', message);
    });
    bot.addListener('close', function (message) {
        console.log('error: ', message);
        bot.disconnect();
    });
    bot.addListener("registered", function () {
        bot.say("nickserv", "identify " + obj.password);
        console.log("identified");
    });
    bot.addListener('raw', function(message) { 
        //console.log(message) 
        if (message.command !== "PONG") {
            console.log(message.args[1]) 
        }
    });
    console.log("setup listeners");
    return bot;
}
module.exports = initBot;
//initBot(initObj);
