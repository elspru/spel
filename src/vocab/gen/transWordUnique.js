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
    Entry = function () {
    //      ob Chinese (Sino-Tibetan) 1030 and
        this.zh = "";
    //      ob English (IE, West Germanic) 840 and
        this.en = "";
    //      ob Spanish (IE, Romance) 490 and
        this.es = "";
    //      ob Hindi  (IE, Indo-Aryan) 380 and
        this.hi = "";
    //      ob Arabic (Afro-Asiatic) 490 and
        this.ar = "";
    //      ob Indonesian (Austronesian) and
        this.id = "";
    //      ob Russian (IE, Slavic) and
        this.ru = "";
    //      ob Swahili (Niger-Congo) and
        this.sw = "";
    //      ob Swedish (IE, North Germanic) and
        this.sv = "";
    //      ob Turkish (Turkic) and
        this.tr = "";
    //      ob Finnish (Uralic) and
        this.fi = "";
    //      ob Farsi (IE, Indo-Iranian) and
        this.fa = "";
    //      ob Tamil (Dravidian) and
        this.ta = "";
    //      ob Georgian (Kartvelian) and
        this.ka = "";
    //      ob Welsh (IE, Celtic) and
        this.cy = "";
    //      ob Greek (IE, Hellenic) ya
        this.el = "";
    },
    allTransLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
        "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
        "fi", "el", "ka", "cy", "pl", "sr", "lt"],
    allPhonLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
        "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
        "fi", "el", "ka", "cy", "pl", "sr", "lt", "zhy", "es",
        "th"],
    PhonEntry = function () {
        this.en = "";
        //allPhonLangs.forEach(function (code) {
        //    this[code] = "";
        //});
    };

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

function returnIfUnique(transEntry, allDefinObj, index,
        mainWords, thesaurus, blacklist) {
    var word,
        values,
        matchingDefs,
        maxDefs = 1,
        newTransEntry = {},
        foundDuplicateDefs = 0,
        result,
        foundBlanks = 0,
        transDefs,
        enDef = transEntry["en"].toLowerCase(),
        directBorrows = 0,
        thesaurusEntry = [],
        thesaurusWord = "";
    allTransLangs.forEach(function (key) {
        values = allDefinObj[key];
        word = transEntry[key];
        if (word === "") {
            //console.log(key + " " + word + " blank");
            foundBlanks += 1;
            thesaurusEntry.push(word + ": (blank in) ")
            thesaurusEntry.push(key);
        }
        matchingDefs = 
                values.expand(function (defWord, defIndex) {
            if (word === defWord) {
                // get word from main words
                thesaurusWord = mainWords[defIndex];
                // add to thesaurus
                if (thesaurusEntry.indexOf(thesaurusWord) < 0 &&
                        thesaurusWord &&
                        thesaurusWord.toLowerCase() !== enDef) {
                    thesaurusEntry.push(key + ":");
                    thesaurusEntry.push(thesaurusWord);
                } 
                return defIndex;
            } else {
                return null;
            }
        });
        if (word.toLowerCase() === enDef && key !== "en") {
            //console.log(key + " direct borrowed " + word);
            directBorrows += 1;
        }
        if (matchingDefs.length <= 0 ||
                matchingDefs[0] === index) {
        } else {
            //console.log(key + " " + word + " " +
            //    matchingDefs + " " + index);
            /* check if preceding words are implemented */
            matchingDefs.forEach(function (defIndex) {
                var defWord = mainWords[defIndex];
                if (thesaurus[defWord] !== undefined) {
                    foundDuplicateDefs += 1;
                }
            });
        }
    });
    if (foundBlanks > 0) {
        result = "BLANK"; 
        blacklist[enDef] = thesaurusEntry;
        //console.log(enDef + " blank");
        //console.log(thesaurusEntry);
    } else if (foundDuplicateDefs === 0) {
        result = transEntry;
        thesaurus[enDef] = thesaurusEntry;
        //if (thesaurusEntry.length > 0) {
        //    console.log(thesaurusEntry);
        //}
    } else {
        blacklist[enDef] = thesaurusEntry;
        //console.log(enDef + " blackListed");
        //console.log(thesaurusEntry);
        result = null;
    }
    return result;
}

function makeAllDefinObj(transObj, mainWords) {
    var definObj = {},
        transEntry = {};
    allTransLangs.forEach(function (langCode) {
        definObj[langCode] = [];
    });
    mainWords.forEach(function (word) {
        transEntry = transObj[word];
        if (transEntry !== undefined) {
            allTransLangs.forEach(function (langCode) {
                definObj[langCode].push(transEntry[langCode]);
            });
        } else {
            // keep same number of entries for thesaurus
            allTransLangs.forEach(function (langCode) {
                definObj[langCode].push(null);
            });
        }
    });
    return definObj;
}

function formatThesaurus(thesaurus, mainWords) {
    var result = "";
    mainWords.forEach(function (word) { 
        var entry = thesaurus[word];
        if (thesaurus[word]) {
            result += word + ": ";
            if (Array.isArray(entry)) {
                result += entry.join(", ");
            }
            result += "\n";
        }
    });
    return result;
}

function formatSuggestList(thesaurus, blacklist, mainWords) {
    "use strict";
    function approvedWords(word) {
        if (thesaurus[word] !== undefined) {
            return true;
        }
        return false;
    }
    var result = "";
    mainWords.forEach(function (word) { 
        var bentry = blacklist[word];
        if (thesaurus[word]) {
        } else if (blacklist[word]) {
            result += word + ": ";
            if (Array.isArray(bentry)) {
                result += bentry.filter(approvedWords).join(", ");
            }
            result += "\n";
        }
    });
    return result;
}

function main() {
    var fileContents = io.fileRead("sortedComboList.txt"),
    //var fileContents = io.fileRead("testyList.txt"),
        blackFileContents = io.fileRead("sortBlacklist.txt"),
        blackLines = stringToWordLines(blackFileContents),
        blacklist = wordOfEachLine(0, blackLines),
        wordLines = stringToWordLines(fileContents),
        wordLines = removeBlacklisted(wordLines, blacklist),
        mainWords = wordOfEachLine(0, wordLines),
        transJSON = io.fileRead("genTrans2.json"),
        transObj = JSON.parse(transJSON),
        transEntry,
        uniqObj = {},
        uniqEntry,
        uniqText,
        thesaurus = {},
        blacklist = {},
        allDefObj = makeAllDefinObj(transObj, mainWords);
    mainWords.forEach(function (word, index) {
        uniqEntry = undefined;
        transEntry = transObj[word];
        // be add ob sub entry for each lang ya
        if (transEntry === undefined) {
            console.log(word + " undefined ");
        } else {
            uniqEntry = 
                returnIfUnique(transEntry, allDefObj, index, 
                    mainWords, thesaurus, blacklist); 
        }
        if (uniqEntry === "BLANK") {
            console.log(word + " blank ");
            mainWords[mainWords.indexOf(word)] = null;
            allDefObj = makeAllDefinObj(transObj, mainWords);
        } else if (uniqEntry !== null) {
             console.log(word + " is unique");
            uniqObj[word] = uniqEntry;
        } else {
        }
    });
    io.fileWrite("genTransUniq.json", JSON.stringify(uniqObj));
    uniqText = Object.keys(uniqObj).map(function (word) {
        function findIfGram(word, wordLines) {
            var returnLine, i;
            for (i = 0; i < wordLines.length; i++) {
                var line = wordLines[i],
                    lineWord = line[0];
                if (lineWord === word &&
                        line[1] === "g") {
                    returnLine = " "+ line.slice(1).join(" ");
                    return returnLine;
                }
            }
            return "";
        }
        var gram = findIfGram(word, wordLines);
        return word + gram;
    }).join("\n");
    io.fileWrite("comboUniqList.txt", uniqText);
    io.fileWrite("thesaurus.txt", formatThesaurus(thesaurus,
            mainWords));
    io.fileWrite("blacklist.txt", formatThesaurus(blacklist,
            mainWords));
    io.fileWrite("suggestList.txt", formatSuggestList(thesaurus, 
        blacklist, mainWords));
}

main();
