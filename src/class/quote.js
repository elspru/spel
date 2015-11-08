var tokenize = require("../compile/tokenize");
//var parse = require("../compile/parse");
function Quote(input) {
    "use strict";
    this.be = "Quote";
    var tokens;
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (Array.isArray(input)) { tokens = input;
        } else if (typeof input === "object" &&
                input.be === "Quote") {
        tokens[0] = input.content;
        tokens[1] = input.quoteWord;
    } else { throw new TypeError(JSON.stringify(input) +
            " not valid for " + this.be); }
    // assume single word quote
    this.content = tokens[0];
    this.quoteWord = tokens[1];
    return this;
}
function quoteInputToMatch(input) {
    "use strict";
    var result = Object.create(null);
    if (typeof input === "string" ||
            Array.isArray(input)) {
        result = new Quote(input);
    } else if (input.be === "Quote") {
        result = input;
    } else { throw new TypeError(input + " not valid match"); }
    return result;
}
module.exports = Quote;
Quote.prototype.isSuperset = function (input) {
    "use strict";
    var match = quoteInputToMatch(input);
    // if match is undefined then is subset
    if (match.content !== undefined &&
            !match.content.equals(this.content)) {
        return false;
    }
    if (match.quoteWord !== undefined &&
            !match.quoteWord.equals(this.quoteWord)) {
        return false;
    }
    return true;
};
Quote.prototype.isSubset = function (input) {
    "use strict";
    return this.equals(input);
};
Quote.prototype.isLike = function (input) {
    "use strict";
    return this.equals(input);
};
Quote.prototype.equals = function (input) {
    "use strict";
    var match = quoteInputToMatch(input);
    if (match.content === this.content &&
            match.quoteWord === this.quoteWord) {
        return true;
    }
    return false;
};
Quote.prototype.valueGet = function () {
    "use strict";
    return this.content;
};
Quote.prototype.toString = function () {
    "use strict";
    return String(this.content + " " + this.quoteWord);
};
