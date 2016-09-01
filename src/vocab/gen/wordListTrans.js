#!/usr/bin/node
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
    allTransLangs = [
        "zh", "en", "hi", "sw",     "id","es", "ar","bn",  
        "ru", "ko", "pt", "tr",     "pa", "vi", "de", "fa", 

        "fr", "mr", "ta", "te",     "gu","ur","am", "it",  
        "pl","kn","ml","my",      "ro", "az","nl","hu", 

        "ku","si","ne","el",    "cs", "sv", "ka", "th", 
        "fi", "mn", "jv","uk",  "cy", "sr", "he", "ja", 
 
        "lt", "da", "tl","te",  "ps","su","ha","yo", 
        "uz","sd","mi","ig",    "mg", "km", "so",  "zu", 

        "ny","lo","zu", "xh",    ];

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

function translateWord(word, toLangCode) {
    var exec = require("shelljs").exec,
        //exec = require("child_process").execSync,
        //fromLangCode = "en",
        command = "",
        translation = "",
        warning;
    word = word.replace(/\'/g, "");
    word = word.replace(/\-/g, " ");
    word = word.replace(/_/g, " ");
    word = word.replace(/\W/g, " ");
    word = word.replace(/ /g, "%20");
    console.log(toLangCode + " " + word);
    if (word === "" || /^\ *$/.test(word)) {
        return "";
    }
    command = "./trans.sh " + toLangCode + " '" + word +"'";
    try {
        translation = JSON.parse(exec(command, {timeout: 5000}).output).
                      translatedText.replace(/\n/g,"");
    } catch (e) {
        console.log(e.stack);
        console.log(e);
        console.log("fail for " + command);
    }
    if (translation.toLower &&
            translation.toLower() === word) {
        warning = ("Warning: " + translation +
            " has same definition");
        console.log(warning);
    }
    return translation;
}

function updateTranslationEntry(entry, word) {
    var translation;
    if (entry.en === "") {
        entry.en = word;
    }
    Object.keys(entry).forEach(function (key) {
        if (entry[key] === undefined || /^\s*$/.test(entry[key])) {
            translation = translateWord(word, key);
            console.log(word + " " + translation);
            entry[key] = translation;
        }
    });
    return entry;
}

function main() {
    var megaFileContents = io.fileRead("sortedComboList-mega.txt"),
        megaWordLines = stringToWordLines(megaFileContents),
        megaMainWords = wordOfEachLine(0, megaWordLines),
        coreFileContents = io.fileRead("sortedComboList-mid.txt"),
        coreWordLines = stringToWordLines(coreFileContents),
        coreMainWords = wordOfEachLine(0, coreWordLines),
        transJSON = io.fileRead("genTransX.json"),
        transObjX = JSON.parse(transJSON),
        mainWords = coreMainWords,
        count = 0,
        entry;
    mainWords.forEach(function (word) {
        entry = transObjX["X" + word];
        if (entry === undefined) {
            entry = new Entry();
        }
        // be add ob sub entry for each lang ya
        allTransLangs.forEach(function (langCode) {
            if (entry[langCode] === undefined) {
                entry[langCode] = "";
            }
        });
        transObjX["X" + word] = updateTranslationEntry(entry, word);
        count += 1;
        if (count > 100) {
            io.fileWrite("genTransX.json", 
                JSON.stringify(transObjX));
            io.fileWrite("genTransX.json.2", 
                JSON.stringify(transObjX));
            count = 0;
        }
    });
    allTransLangs.forEach(function (langCode) {
      megaMainWords.forEach(function (word) {
        entry = transObjX["X" + word];
        if (entry === undefined) {
          entry = new Entry();
        }
        if (entry[langCode] === undefined) {
          entry[langCode] = translateWord(word, langCode);
          count += 1;
          if (count > 100) {
              io.fileWrite("genTransX.json", 
                  JSON.stringify(transObjX));
              io.fileWrite("genTransX.json.2", 
                  JSON.stringify(transObjX));
              count = 0;
          }
        }
      });
    });
    console.log("writing genTransX.json");
    io.fileWrite("genTransX.json", JSON.stringify(transObjX));
    io.fileWrite("genTransX.json.bak", JSON.stringify(transObjX));
//    console.log("writing genTrans2.json");
 //   io.fileWrite("genTrans2.json", JSON.stringify(transObj));
}

main();
