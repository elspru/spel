var tokenize = require("../compile/tokenize");
var translate = require("../compile/translate");
var err = require("../lib/error");
//var emitter = require("events").EventEmitter;

// be order final ob tokens in language
// to other tokens and body tokens and head token de 
function finalOrder(language, tokens) {
    "use strict";
    // su head word be last input token
    var transDict = language.dictionary.toMwak,
        headTokenI = tokens.length - 1,
        bodyWords,
        otherTokens,
        headWord = translate.word(transDict, tokens[headTokenI]);
    // yand body is rest of tokens
    if (tokens.length > 1) {
        otherTokens = tokens.slice(0, headTokenI);
        bodyWords = translate.array(transDict, otherTokens);
    }
    return [bodyWords, headWord];
}

// be order initial ob tokens in language
// to other tokens and body tokens and head token de 
function initialOrder(language, tokens) {
    "use strict";
    // su head word be first input token
    var transDict = language.dictionary.toMwak,
        headTokenI = 0,
        bodyWords,
        otherTokens,
        headWord = translate.word(transDict, tokens[headTokenI]);
    // yand body is rest of tokens
    if (tokens.length > 1) {
        otherTokens = tokens.slice(headTokenI + 1);
        otherTokens.reverse();
        bodyWords = translate.array(transDict, otherTokens);
    }
    return [bodyWords, headWord];
}

// be order part of speech ob tokens in language 
// by part of speech
// to tuple of body tokens and head token de
function partOfSpeechOrder(language, tokens, partOfSpeech) {
    "use strict";
    var wordOrder = language.grammar.wordOrder,
        tokenTuple;
    // if su partOfSpeech  ob verb 
    // yand verb initial then be return ob initial order
    if (partOfSpeech === "verb") {
        if (wordOrder.verbFinal === false) {
            tokenTuple = initialOrder(language, tokens);
        } else if (wordOrder.verbFinal === true) {
            tokenTuple = finalOrder(language, tokens);
        }
    // else if su partOfSpeech ob noun 
    // yand noun initial then be return ob initial order 
    } else if (partOfSpeech === "noun") {
        if (wordOrder.nounFinal !== true &&
                wordOrder.headFinal === false) {
            tokenTuple = initialOrder(language, tokens);
        } else if (wordOrder.nounFinal) {
            tokenTuple = finalOrder(language, tokens);
        }
    // else if head initial then be return ob initial order 
    } else if (wordOrder.headFinal === false &&
            wordOrder.nounFinal !== true) {
        tokenTuple = initialOrder(language, tokens);
    // else be return ob final order
    } else {
        tokenTuple = finalOrder(language, tokens);
    }
    return tokenTuple;
}

function Word(language, input, partOfSpeech) {
    "use strict";
    // algorithm de
    //
    // be order final ob tokens in language
    // to tuple of body tokens and head token de 
    // su head word be last word
    // yand body be rest of tokens ya
    //
    // be order initial ob tokens in language
    // to tuple of body tokens and head token de 
    // su head word be first word
    // yand body be rest of tokens ya
    //
    // be order part of speech ob tokens in language 
    // by part of speech
    // to tuple of body tokens and head token de
    // if su partOfSpeech  ob verb 
    // yand verb initial then be initial order
    // else if su partOfSpeech ob noun 
    // yand noun initial then be initial order 
    // else if head initial then initial order 
    // else final order
    //
    // if su partOfSpeech be defined then be partOfSpeech order
    // else if head initial then initial order ya
    // else be final order ya
    //
    // be set ob this
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Word error: language undefined";
    }

    var tokens,
        wordOrder = language.grammar && language.grammar.wordOrder,
        tokenTuple,
        bodyTokens,
        headToken;
    this.be = "Word";
    if (typeof input === "object" && input.be === "Word") {
        this.head = input.head;
        if (input.body) { this.body = input.body; }
        return this;
    }
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (Array.isArray(input)) {
        tokens = input;
    } else {
        throw new TypeError(JSON.stringify(input) +
            " unknown to " + this.be);
    }
    // if su partOfSpeech be defined then be partOfSpeech order
    if (partOfSpeech) {
        tokenTuple = partOfSpeechOrder(language, tokens, partOfSpeech);
    // else if head initial then initial order ya
    } else if (wordOrder.nounFinal !== true &&
            wordOrder.headFinal === false) {
        tokenTuple = initialOrder(language, tokens);
    // else be final order ya
    } else {
        tokenTuple = finalOrder(language, tokens);
    }
    bodyTokens = tokenTuple[0];
    headToken = tokenTuple[1];
    // be set ob this
    if (bodyTokens && bodyTokens.length > 0) {
        this.body = bodyTokens;
    }
    if (headToken && headToken.length > 0) {
        this.head = headToken;
    }
}// end of Word constructor

Word.prototype.copy = function (language) {
    "use strict";
    return new Word(language, JSON.parse(JSON.stringify(this)));
};
function wordInputToMatch(language, input) {
    "use strict";
    var result = {};
    if (typeof input === "string" ||
            Array.isArray(input)) {
        result = new Word(language, input);
    } else if (typeof input === "object" &&
            input.be === "Word") {
        result = input;
    } else if (input === undefined) {
        result = input;
    } else {
        throw new TypeError(JSON.stringify(input) +
            " not valid match for " + "Word");
    }
    return result;
}
Word.prototype.isSuperset = function (language, input) {
    "use strict";
    var match = wordInputToMatch(language, input);
    if (match === undefined) {
        return true;
    }
    if (match !== undefined &&
            this.head !== match.head) {
        return false;
    }
    if (match.body !== undefined &&
            !this.body.isSuperset(match.body)) {
        return false;
    }
    return true;
};
Word.prototype.isLike = function (language, input) {
    "use strict";
    return this.isSuperset(language, input);
};

Word.prototype.toString = function () {
    "use strict";
    var string = "";
    if (this.body !== undefined) {
        string = this.body.join(" ") + " ";
    }
    if (this.head !== undefined) {
        string += this.head;
    }
    return string;
};
Word.prototype.toLocaleString = function (language, format, type, conjLevel) {
    "use strict";
    var translation = "",
        joiner = " ",
        wordOrder = language.grammar.wordOrder,
        dict = language.dictionary.fromMwak,
        conj = {},
        bodyWords = [],
        translArray;
    if (format && format.joiner) {
        joiner = format.joiner;
    }
    // algorithm de
    // be add ob body to output ya
    // according to type if initial then reverse body words ya
    // be translate ob body words yand be add to translation ya
    // syntax formating and color-grapheme synesthesia
    // conjugation based on type
    //
    // conjugation based on type
    if (conjLevel >= 3) {
        conj = language.grammar.conjugation;
    }
    if (type) {
        if (conj.verb &&  type === "v") {
            return conj.verb(language, this, format, conjLevel);
        }
        if (conj.noun && type === "n") {
            return conj.noun(language, this, format, conjLevel);
        }
        if (conj.mood && type === "mh") {
            return conj.mood(language, this, format, conjLevel);
        }
        if (conj.sentenceHead && type === "sh") {
            return conj.sentenceHead(language, this, format, conjLevel);
        }
        if (conj.phraseHead && type === "ch") {
            return conj.phraseHead(language, this, format, conjLevel);
        }
        if (conj.verbHead && type === "vh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
        if (conj.clauseHead && type === "lh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
        if (conj.junctionHead && type === "jh") {
            return conj.verbHead(language, this, format, conjLevel);
        }
    }
    if (conj.word) {
        return conj.word(language, this, format, conjLevel);
    }
    // be add ob body to output
    if (this.body !== undefined) {
        bodyWords = this.body;
    }
    bodyWords = bodyWords.concat(this.head);
    // according to type if initial then reverse body words ya
    if (bodyWords.length > 1) {
        if (type) {
            if (type === "v" && wordOrder.verbFinal === false) {
                bodyWords.reverse();
            } else if (type === "n" &&
                    wordOrder.nounFinal === false) {
                bodyWords.reverse();
            } else if (type.search(/h/) >= 0 &&
                    wordOrder.typeFinal === false) {
                bodyWords.reverse();
            }
        } else if (wordOrder.nounFinal === false) {
            bodyWords.reverse();
        }
    }
    // be translate ob body words yand be add to translation ya
    translArray = translate.array(dict, bodyWords);
    translation = translArray.reduce(function (previousWord,
        currentWord) {
        var result;
        result = previousWord;
        if (previousWord !== "") {
            result += joiner + currentWord;
        } else { result += currentWord; }
        return result;
    }, "");
    //for (i = 0; i < translArray.length; i++) {
    //    translWord = translArray[i];
    //    translation+= translWord;
    //    if (i <translArray.length-1) {
    //        translation+= joiner;
    //    }
    //}
    // syntax formating and color-grapheme synesthesia
    if (format) {
        if (type && format.typeGlyphsTransform) {
            translation = format.typeGlyphsTransform(translation, type);
        } else if (format.glyphsTransform) {
            translation = format.glyphsTransform(translation);
        }
    }
    if (format && format.ipa && conj && conj.ipa) {
        translation = conj.ipa(translation);
    }
    return translation;
};
Word.prototype.isSubset = function (language, input) {
    "use strict";
    var match = wordInputToMatch(language, input),
        result = false;
    if (this.body === undefined) {
        result = true;
    } else if (this.body.isSubset(match.body) &&
            this.head.isSubset(match.body)) {
        result = true;
    }
    return result;
};

module.exports = Word;
