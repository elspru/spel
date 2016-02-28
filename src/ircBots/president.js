#!/usr/bin/nodejs
var io = require("../lib/io"),
    irc = require('irc'),
    hof = require("../lib/hof"),
    botb = require("./ircBotBase"),
    initObj = JSON.parse(io.fileRead("/etc/spel/bots.conf")),
    bot;
initObj.name = "ryip";
initObj.title = "SPEL President";
console.log("connecting");
bot = botb(initObj);
bot.connect();
/* administrative duties */
bot.addListener("join", function (channel, jnick, message) {
    "use strict";
    console.log(jnick + " joined");
    if (jnick === initObj.name) {
        console.log("joined " + channel + " " +
            JSON.stringify(message));
        bot.say("chanserv", "op " + channel);
    }
});
function privUser(channel, jnick) {
    "use strict";
    if (initObj.admins.indexOf(jnick) > -1) {
        console.log("an admin");
        bot.send("MODE", channel, "+o", jnick);
    } else if (initObj.voices.indexOf(jnick) > -1) {
        console.log("a voice");
        bot.send("MODE", channel, "+v", jnick);
    }
}
bot.addListener("+mode", function (channel, by, mode, argument) {
    "use strict";
    if (argument === initObj.name && mode === "o") {
        console.log("received op from " + by);
        bot.addListener("join" + channel, privUser);
    }
});
bot.addListener("part", function (channel, who,
        reason) {
    "use strict";
    console.log('%s has left %s: %s', who, channel, reason);
    bot.removeListener("join" + channel, privUser);
});
bot.addListener('kick', function (channel, who, by, reason) {
    "use strict";
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
    bot.removeListener("join" + channel, privUser);
});
/* translational duties */
bot.addListener('message#spel-en', function (from, message) {
    "use strict";
    console.log(from + ' => #spel: ' + message);
    if (message === "hello") {
        bot.say("#spel-fr", from + ";  bonjour");
    }
    console.log("message sent");
});
bot.addListener('message#spel-fr', function (from, message) {
    "use strict";
    console.log(from + ' => #spel: ' + message);
});
bot.addListener('raw', function(message) { 
    console.log('> ', message.args[1]) 
});
console.log("additional listeners setup");
