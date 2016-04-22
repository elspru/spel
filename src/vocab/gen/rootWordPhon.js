#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for generate new word for concept ya
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
///
"use strict";
//  su pre-sort de
//  su list of english words to make into root words be input ya
//  and su frequency list of english words be input ya
//  su be sort ob first list to correspond to second list ya
//  su each word in sequence root word generate ya
//
//  su basic root word finding algorithm de
//  su english concept word be input argument ya
//  su word definitions be modified ya
//  su source language translation via trans
//      ob Chinese (Sino-Tibetan) 1030 and
//      ob English (IE, West Germanic) 840 and
//      ob Spanish (IE, Romance) 490 and
//      ob Hindi  (IE, Indo-Aryan) 380 and
//      ob Arabic (Afro-Asiatic) 490 and
//      ob Indonesian (Austronesian) and
//      ob Russian (IE, Slavic) and
//      ob Swahili (Niger-Congo) and
//      ob Swedish (IE, North Germanic) and
//      ob Turkish (Turkic) and
//      ob Finnish (Uralic) and
//      ob Farsi (IE, Indo-Iranian) and
//      ob Tamil (Dravidian) and
//      ob Georgian (Kartvelian) and
//      ob Welsh (IE, Celtic) and
//      ob Greek (IE, Hellenic) ya
//  su translations be stored in dataset ya
//  su phoneme translation via espeak ya
//  su phoneme translations be stored in dataset ya
//  su phoneme equivalncy function by language weight be output
//      ob phoneme frequency and
//      ob starting consonants and
//      ob middle consonants and
//      ob ending consonants and
//      ob dominant vowel ya
//  su list of possible words be generated ya
//  su list of available words be found from word definitions ya
//  su possible and available words be intersected ya
//  su top word be used for definition ya


var io = require("../../lib/io"),
    hof = require("../../lib/hof"),
    es6 = require("es6-shim"),
    allTransLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
        "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
        "fi", "el", "ka", "cy", "pl", "sr", "lt", "es"],
    allPhonLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
        "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
        "fi", "el", "ka", "cy", "pl", "sr", "lt", "zhy", "es"],
    EuroWeights = {"hi": 0, "zh": 0, "en": 840, "sw": 0,
        "ar": 0, "es":  490, "id": 0, "tr": 0, "ru": 325,
        "fr":  220, "ta": 0, "fa": 0, "pt": 200, "de": 145,
        "zhy": 0, "vi": 0, "it": 64, "pl": 57, "sr": 32,
        "fi": 28, "sv": 21, "ka": 5, "el": 13, "lt": 5, "cy": 2
        },
    WorldWeights = {"hi": 1500, "zh": 1300, "en": 840, "sw": 600,
        "ar": 490, "es":  490, "id": 486, "tr": 377, "ru": 325,
        "fr":  220, "ta": 210, "fa": 200, "pt": 200, "de": 145,
        "zhy": 70, "vi": 70, "it": 64, "pl": 57, "sr": 32,
        "fi": 28, "sv": 21, "ka": 5, "el": 13, "lt": 5, "cy": 2
        },
    langWeights = WorldWeights,
    gramList = {},
    rootList = {},
    consonantList = "mkypwnstlhf.crbgdzjvqx18",
    finalConsonantList = "ptkfscqmnxbdgzjv",
    secondConsonantList = "fscyrwlxzjv",
    vowelList = "iaueo6",
    toneList = "7_",
    PhonEntry = function () {
        this.en = "";
    },
    RootPhonEntry = function () {
        this.consonants = {};
        this.vowels = {};
        this.initialConsonants = {};
        this.middleConsonants = {};
        this.finalConsonants = {};
        this.tone = {};
    };
function arrayUnique(a) {
    return a.reduce(function (p, c) {
        if (p.indexOf(c) < 0) {
            p.push(c);
        }
        return p;
    }, []);
}
function addTypeOfGlyphToObj(glyphList, obj, weight, glyph) {
    if (obj && glyphList.indexOf(glyph) > -1) {
        if (obj[glyph] === undefined) {
            obj[glyph] = 0;
        }
        obj[glyph] += weight;
    }
}

function addGlyphs(obj, glyphWord, weight) {
    var length = glyphWord.length,
        glyphAr = glyphWord.split(""),
        segmentLength = Math.ceil(length / 3),
        initialStart = 0,
        middleStart = Math.floor(length / 3),
        finalStart = length - (segmentLength + 1),
        initialSegment = arrayUnique(glyphAr.
                slice(initialStart, segmentLength)),
        middleSegment = arrayUnique(glyphAr.slice(middleStart,
            (segmentLength + middleStart))),
        finalSegment = arrayUnique(glyphAr.slice(finalStart,
            length));
    /* consonants */
    glyphAr = arrayUnique(glyphAr);
    glyphAr.forEach(function (glyph) {
        addTypeOfGlyphToObj(consonantList, obj.consonants,
                weight, glyph);
    });
    /* vowels*/
    glyphAr.forEach(function (glyph) {
        addTypeOfGlyphToObj(vowelList, obj.vowels,
                weight, glyph);
        addTypeOfGlyphToObj(toneList, obj.tone,
                weight, glyph);
    });
    initialSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(consonantList,
                obj.initialConsonants, weight, glyph);
    });
    middleSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(secondConsonantList,
                obj.middleConsonants, weight, glyph);
    });
    finalSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(finalConsonantList,
                obj.finalConsonants, weight, glyph);
    });
}

function stringToWordLines(string) {
    function lineToWords(line) {
        return line.split(" ");
    }
    var lines = string.split("\n"),
        wordLines = lines.map(lineToWords);
    return wordLines;
}

function wordLinesToString(wordLines) {
    function joinWords(lineArray) {
        return lineArray.join(" ");
    }
    var lines = wordLines.map(joinWords),
        string = lines.join("\n");
    return string;
}

function wordOfEachLine(wordIndex, wordLines) {
    return wordLines.map(function (line) {
        return line[wordIndex];
    });
}

function ipaTo16Glyph(word) {
/*
var Bit4Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c"];
// c = /ʃ/
// y = /j/
// . = /ʔ/
//  note su glyph . ob only used for grammar ya
// h = /h/
//  note su glyph h ob only used for grammar ya
*/
    var matchReplaceArray = [
    /* punctuation */
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"], ["e", "i"],
        ["ɛ", "a"], ["ɜ", "a"], ["æ", "a"], ["ɑ̃", "a"],
        ["ã", "a"], ["ʌ", "a"], ["ɑ", "a"], ["ɐ̃", "a"],
        ["ɐ", "a"],
        ["o", "u"], ["ɵ", "u"], ["ɔ", "u"], ["ʉ", "u"],
        ["ø", "u"], ["œ̃", "u"], ["œ", "u"], ["ũ", "u"],
        ["ɯ", "u"], ["õ", "u"],
        ["ə", ""],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
    /** consonants **/
    /* plosives */
        ["b", "p"],
        ["ð", "t"], ["ʈ", "t"], ["ɗ", "t"], ["ɖ", "t"],
        ["t̪", "t"], ["ʈ", "t"], ["d", "t"],
        ["c", "k"], ["ɟ", "k"], ["ʔ", "k"], ["q", "k"],
        ["ɡ", "k"], ["ˀ", "k"],
        /* approximants */
        ["ʊ", "w"],/* w like vowel */
        ["v", "w"], ["β", "f"], ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"],
        ["j", "y"], ["ʲ", "y"], ["ʁ", "y"], ["ɾ", "y"],
        ["ɹ", "y"], ["ɻ", "y"], ["ɚ", "y"], ["r", "y"],
        /* fricatives */
        ["θ", "f"],
        ["z", "s"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʒ", "c"], ["ʂ", "c"],
        ["ʐ", "c"], ["ç", "c"], ["ʝ", "c"], ["ɕ", "c"],
        ["ʑ", "c"], ["ɣ", "c"], ["x", "c"], ["ħ", "c"],
        ["ʰ", "c"], ["h", "c"], ["ʕ", "c"], ["ʕ", "c"],
        ["؟", "c"], ["ˤ", "c"],
        /* nasals */
        ["m̩", "m"],
        ["ŋ", "n"], ["ɳ", "n"], ["ɲ", "n"]
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    return word;
}
function ipaTo24Glyph(word) {
/*
var Glyph24Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c",
                    "e","o","r","b","g","d","z","j"];
// c = /ʃ/
// j = /ʒ/
// y = /j/
// . = /ʔ/
//  note su glyph . ob only used for grammar ya
// h = /h/
//  note su glyph h ob only used for grammar ya
*/
    var matchReplaceArray = [
        /* punctuation */
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"],
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"],
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", ""],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", "k"],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["v", "w"], ["β", "w"], ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"],
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"],/* espeak for ʀ */
        /* fricatives */
        ["θ", "f"],
        ["ʰ", "c"], ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"],
        ["ç", "c"], ["ɕ", "c"], ["x", "c"], ["ħ", "c"],
        ["h", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["ɣ", "j"], ["ʕ", "j"], ["ʕ", "j"], ["؟", "j"],
        ["ˤ", "j"],
        /* nasals */
        ["m̩", "m"],
        ["ŋ", "n"], ["ɳ", "n"], ["ɲ", "n"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    return word;
}

function ipaTo28Glyph(word) {
/*
var Bit5Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c",
                    "e","o","r","b","g","d","z","j",
             "v","q","6","x"];
// c = /ʃ/
// j = /ʒ/
// y = /j/
// q = /ŋ/
// 6 = /ə/
// . = /ʔ/ // glotal stop only used for grammar ya
// h = /h/ // glotal fricative only used for grammar ya
*/
    var matchReplaceArray = [
        /* punctuation */
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"],
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"],
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", "6"],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", "k"],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"],
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"],/* espeak for ʀ */
        /* fricatives */
        ["v", "v"], ["β", "b"],
        ["θ", "f"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"], ["ç", "c"],
        ["ɕ", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["x", "x"], ["ħ", "x"], ["h", "x"], ["ʰ", "x"],
        ["ɣ", "x"], ["ʕ", "x"], ["ʕ", "x"], ["؟", "x"],
        ["ˤ", "x"],
        /* nasals */
        ["m̩", "m"],
        ["ɳ", "n"],
        ["ŋ", "q"], ["ɲ", "q"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    return word;
}

function ipaTo32Glyph(word) {
/*
var Bit5Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c",
                    "e","o","r","b","g","d","z","j",
             "v","q","7","_","6","x","1","8"];
// c = /ʃ/
// j = /ʒ/
// y = /j/
// q = /ŋ/
// 6 = /ə/
// 7 = /˦/ // high tone for rare words
// _ = /˨/ // low tone for rare words
// 1 = /ǀ/ // dental click for temporary words
// 8 = /ǁ/ // lateral click for temporary words
// . = /ʔ/ // glotal stop only used for grammar ya
// h = /h/ // glotal fricative only used for grammar ya
*/
    var matchReplaceArray = [
        /* punctuation */
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"],
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"],
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", "6"],
        /* tones */
        ["˨", "_"], ["˩", "_"],
        ["˥", "7"], ["˦", "7"],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", ""],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"],
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"],/* espeak for ʀ */
        /* fricatives */
        ["v", "v"], ["β", "b"],
        ["θ", "f"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"], ["ç", "c"],
        ["ɕ", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["x", "x"], ["ħ", "x"], ["h", "x"], ["ʰ", ""],
        ["ɣ", "x"], ["ʕ", "x"], ["ʕ", "x"], ["؟", "x"],
        ["ˤ", ""],
        /* nasals */
        ["m̩", "m"],
        ["ɳ", "n"],
        ["ŋ", "q"], ["ɲ", "q"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    return word;
}
function objToArray(obj) {
    var objArray = [];
    if (obj) {
        Object.keys(obj).forEach(function (key) {
            objArray.push([key, obj[key]]);
        });
    }
    return objArray;
}

function sortByWeight(glyphWeightObj) {
    var objArray = [],
        resultArray = [];
    Object.keys(glyphWeightObj).forEach(function (key) {
        objArray.push([key, glyphWeightObj[key]]);
    });
    objArray.sort(function (first, match) {
        return (first[1] - match[1]);
    });
    objArray.reverse();
    objArray.forEach(function (elem) {
        resultArray.push(elem[0]);
    });
    return resultArray;
}
function addWeighted(typeList, startElem) {
    var result = [],
        start = startElem[0],
        weight = startElem[1];
    Object.keys(typeList).forEach(function (key) {
        var end = key,
            endWeight = typeList[key],
            entry = [start + end, endWeight + weight];
        result.push(entry);
    });
    return result;
}
//function addWeight(weightedArray, weight) {
//    return weightedArray.map(function (elem) {
//        elem[1] += weight;
//        return elem;
//    });
//}
function averageWeight(weightedArray) {
    return weightedArray.map(function (elem) {
        var wordLength = elem[0].length,
            weight = elem[1];
        if (wordLength > 0) {
            /*jslint bitwise:true*/
            elem[1] = weight / wordLength | 0;
        }
        return elem;
    });
}
function genGram(rootPhonEntry, gramLength) {
    var rpn = rootPhonEntry,
        vowelsList = rpn.vowels,
        initialList = rpn.initialConsonants,
        secondList = rpn.middleConsonants,
        //finalList = rpn.finalConsonants,
        tonesList = rpn.tone,
        initialListAr = objToArray(initialList),
        wordList = [],
        cvList = initialListAr,
        csvList = initialListAr,
        cvtList,
        csvtList;
    if (gramLength !== 3) {
        cvList = cvList.expand(addWeighted.curry(vowelsList));
        wordList = wordList.concat(cvList);
        if (tonesList && tonesList.length > 0) {
            cvtList = cvList.expand(addWeighted.
                curry(tonesList));
            wordList = wordList.concat(cvtList);
        }
    }
    if (gramLength !== 2) {
        csvList = csvList.expand(addWeighted.curry(secondList));
        csvList = csvList.expand(addWeighted.curry(vowelsList));
        wordList = wordList.concat(csvList);
        if (tonesList && tonesList.length > 0) {
            csvtList = csvList.expand(addWeighted.
                curry(tonesList));
            wordList = wordList.concat(csvtList);
        }
    }
    averageWeight(wordList);
    wordList = wordList.sort(function (first, match) {
        return parseInt(match[1], 10) - parseInt(first[1], 10);
    });
    return wordList;
}
function genRoot(rootPhonEntry) {
    var rpn = rootPhonEntry,
        vowelsList = rpn.vowels,
        initialList = rpn.initialConsonants,
        secondList = rpn.middleConsonants,
        finalList = rpn.finalConsonants,
        tonesList = rpn.tone,
        initialListAr = objToArray(initialList),
        wordList = [],
        cvfList = initialListAr,
        csvfList = initialListAr,
        cvtfList,
        csvtfList;
    cvfList = cvfList.expand(addWeighted.curry(vowelsList));
    csvfList = csvfList.expand(addWeighted.curry(secondList));
    csvfList = csvfList.expand(addWeighted.curry(vowelsList));
    if (tonesList && tonesList.length > 0) {
        cvtfList = cvfList.expand(addWeighted.curry(tonesList));
        csvtfList = csvfList.expand(addWeighted.curry(tonesList));
        cvtfList = cvtfList.expand(addWeighted.curry(finalList));
        csvtfList = csvtfList.expand(addWeighted.curry(finalList));
        wordList = wordList.concat(cvtfList);
        wordList = wordList.concat(csvtfList);
    }
    cvfList = cvfList.expand(addWeighted.curry(finalList));
    csvfList = csvfList.expand(addWeighted.curry(finalList));
    wordList = wordList.concat(cvfList);
    wordList = wordList.concat(csvfList);
    averageWeight(wordList);
    wordList = wordList.sort(function (first, match) {
        return parseInt(match[1], 10) - parseInt(first[1], 10);
    });
    return wordList;
}

function addWordToList(word, phonEntry, wordArray,
        availList, typeList) {
    /* if  already in list then don't add it */
    var i = 0,
        wordArrayLength = wordArray.length,
        langWordElem,
        langWord,
        weight,
        availIndex;
   //     oldWord;
 //       oldWordIndex;
    for (i = 0; i < wordArrayLength; i += 1) {
        langWordElem = wordArray[i];
        langWord = langWordElem[0];
        weight = langWordElem[1];
        availIndex =  availList.indexOf(langWord);
//        oldWord = typeList["X" + word] && typeList["X" + word][0];
//        oldWordIndex = availList.indexOf(oldWord);
        if (availIndex > -1) {
            if (typeList["X" + word] === undefined) {
                typeList["X" + word] = [langWord, weight];
                   // phonEntry.hi, phonEntry.zh];
                availList[availIndex] = undefined;
                availList.splice(availIndex, 1);
                break;
               // console.log(langWord + " " +
               //     availList.indexOf(langWord));
            }
        }
    }
    if (i >= (wordArrayLength - 1)){
        throw new Error(wordArrayLength + " '" + word 
            + "' undefined " + JSON.stringify(typeList["X" +
            word]));
    }
    console.log(word + " " + typeList["X" + word]);
    return availList;
}
function formatDictionary(thesaurus, mainWords) {
    var result = "";
    mainWords.forEach(function (word) {
        if (thesaurus["X" + word]) {
            result += word + ": ";
            result += thesaurus["X" + word][0] + ", ";
            result += thesaurus["X" + word][1];//+ ", ";
            //result += thesaurus["X" + word][2] + ", ";
            //result += thesaurus["X" + word][3];
            result += "\n";
        }
    });
    return result;
}
function removeBlacklisted(wordLines, blacklist) {
    return wordLines.filter(function (line) {
        var word = line[0];
        if (blacklist.indexOf(word) === -1) {
            return true;
        } else {
            console.log(word + " removed");
            return false;
        }
    });
}

function main() {
    var fileContents = io.fileRead("comboUniqList.txt"),
        blackFileContents = io.fileRead("rootBlacklist.txt"),
        blackLines = stringToWordLines(blackFileContents),
        blacklist = wordOfEachLine(0, blackLines),
        wordLines = stringToWordLines(fileContents),
        wordLines = removeBlacklisted(wordLines, blacklist),
        //Glyph16File = io.fileRead("16GlyphWordList.txt"),
        //G16Lines = stringToWordLines(Glyph16File),
        //G16List = wordOfEachLine(0, G16Lines),
        Glyph24File = io.fileRead("32GlyphWordList.txt"),
        G24Lines = stringToWordLines(Glyph24File),
        G24List = wordOfEachLine(0, G24Lines),
        mainWords = wordOfEachLine(0, wordLines),
        phonJSON = io.fileRead("genPhonX.json"),
        phonObjX = JSON.parse(phonJSON),
        //rootPhonJSON = io.fileRead("langWords.json"),
        rootPhonObjX = JSON.parse(rootPhonJSON),
        //transEntry,
        phonEntry,
        //consonantArray,
        //vowelArray,
        phonWord,
        glyphWord,
        rootPhonEntry,
        G16GramMax = 144,
        G16ShortGramMax = 33,
        G16RootMax = 960,
        G24GramMax = 450,
        G24ShortGramMax = 85,
        G24RootMax = 3520,
        G28ShortGramMax = 120,
        G28GramMax = 666,
        G28RootMax = 5898,
        gramCount = 0,
        outObj = {},
        shortGramCount = 0,
        rootCount = 0,
        someWords = ["liberia", "litre", "brachylogia", "gamma"];
    // mainWords.map(getTranslations.curry(transObj));
    wordLines.forEach(function (line) {
        var word = line[0],
            gram = line[1],
            gramLength = line[2] && parseInt(line[2], 10),
            genedGram;
        phonEntry = phonObjX["X" + word];
        if (phonEntry === undefined) {
            console.log(word + " undefined");
            return false;
        }
        if (gram !== undefined) {
            gramCount += 1;
            if (gramLength && gramLength === 2) {
                shortGramCount += 1;
            }
        } else {
            rootCount += 1;
        }
        rootPhonEntry = rootPhonObjX["X" + word];
        if (rootPhonEntry === undefined) {
            rootPhonEntry = new RootPhonEntry();
        }
        // be add ob sub entry for each lang ya
        allPhonLangs.forEach(function (langCode) {
            phonWord = phonEntry[langCode];
            if (phonWord !==  undefined) {
                /*jslint bitwise:true*/
                if (someWords.indexOf(word) > -1 || (gram && (gramCount > ((G28GramMax / 1.61) |
                        0))) || rootCount > ((G28RootMax / 1.61) |
                        0) || (gram && (shortGramCount >
                        ((G28ShortGramMax / 1.61) | 0)))) {
                    glyphWord = ipaTo32Glyph(phonWord);
                } else if ((gram && (gramCount > ((G24GramMax /
                        1.61) | 0))) || rootCount > ((G24RootMax /
                        1.61) | 0) || (gram && (shortGramCount >
                        ((G24ShortGramMax / 1.61) | 0)))) {
                    glyphWord = ipaTo28Glyph(phonWord);
                } else if ((gram && (gramCount >
                        ((G16GramMax / 1.61) | 0))) || rootCount >
                        ((G16RootMax / 1.61) | 0) || (gram &&
                        (shortGramCount > ((G16ShortGramMax /
                                1.61) | 0)))) {
                    glyphWord = ipaTo24Glyph(phonWord);
                } else {
                    glyphWord = ipaTo16Glyph(phonWord);
                }
            }
            if (langWeights[langCode] === undefined) {
                throw new Error("undefined langWeight for " +
                    langCode);
            }
            addGlyphs(rootPhonEntry, glyphWord,
                langWeights[langCode]);
        });
        if (gram === "g") {
            if (gramLength !== undefined) {
               // console.log(word + " " + gramLength);
            }
            genedGram =  genGram(rootPhonEntry, gramLength);
            if (word === "future-tense") {
                //console.log(gramLength !== 2);
                //console.log(genedGram);
            }
            G24List = addWordToList(word, phonEntry,
                genedGram, G24List, gramList);
        /* if including all gram words as roots */
            G24List = addWordToList(word, phonEntry,
                genRoot(rootPhonEntry), G24List, rootList);
        } else {
            G24List = addWordToList(word, phonEntry,
                genRoot(rootPhonEntry), G24List, rootList);
        }
        rootPhonObjX["X" + word] = rootPhonEntry;
    });
    //console.log(gramList);
    //console.log(rootList);
    //io.fileWrite("rootPhon.json", JSON.stringify(rootPhonObj));
    outObj.mainWords = mainWords;
    outObj.gramList = gramList;
    outObj.rootList = rootList;
    io.fileWrite("gramWords.txt",
            formatDictionary(gramList, mainWords));
    io.fileWrite("rootWords.txt",
            formatDictionary(rootList, mainWords));
    io.fileWrite("langWords.json", JSON.stringify(outObj));
}

main();
