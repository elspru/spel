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

"use strict";
//  su pre-sort de
//  su list of english words to make into root words be input ya
//  and su frequency list of english words be input ya
//  su be sort ob first list by frequency ya
//  su be sort ob first list to correspond to second list ya
//  su each word in sequence root word generate for ya
//
// in word list su first word ob main word ya and
// su following words ob meta words ya

// be load ob word list ya
var io = require("../../lib/io"),
    hof = require("../../lib/hof");

function sortByLength(wordLines) {
    function byLength(wordLine, otherLine) {
        var firstWord = wordLine[0].split(" ")[0],
            otherWord = otherLine[0].split(" ")[0];
        return firstWord.length - otherWord.length;
    }
    wordLines.sort(byLength);
    return wordLines;
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

function compareToWordListIndex(wordList, mainWordLine,
        matchWordLine) {
    function matchIndex(wordList, word) {
        var match = null,
            matchEx,
            index = -1;
        word = word.replace(/\./,"");
        matchEx = new RegExp("^" + word + "$")
        while (match === null) {
            index += 1;
            match = wordList[index].match(matchEx);
            if (index >= wordList.length - 2) {
                match = "blah";
                break;
            }
        }
        return index;
    }
    var mainWordIndex = matchIndex(wordList, mainWordLine[0]),
        matchWordIndex = matchIndex(wordList, matchWordLine[0]),
        maxIndex = wordList.length,
        result = 0;
    if (matchWordIndex === -1) {
        matchWordIndex = maxIndex;
    }
    if (mainWordIndex === -1) {
        mainWordIndex = maxIndex;
    }
    result = mainWordIndex - matchWordIndex;
    return result;
}

function mergeCompounds(wordLines) {
    return wordLines.map(function (wordLine) {
        var firstWord = wordLine[0],
            secondWord = wordLine[1];
        if (secondWord === "G") {
            secondWord = "g";
        }
        if (secondWord !== undefined && 
            secondWord !== "g") {
            wordLine = [firstWord + "-" + secondWord];
        }
        return wordLine;
    });
}

function uniqueLines(wordLines) {
    var matchingWords,
        allFirstWords = wordLines.map(function (wordLine) {
            return wordLine[0];
        }),
        uniqueLines;
    uniqueLines = wordLines.filter(function (wordLine, index) {
        var word = wordLine[0];
        matchingWords = 
                allFirstWords.expand(function (defWord, defIndex) {
            if (word === defWord) {
                return defIndex;
            } else {
                return null;
            }
        });
        if (matchingWords.length >= 1 &&
                matchingWords[0] !== index){
            //console.log(word + " " + matchingWords);
            return false;
        } else {
            return true;
        }
            
    });
    return uniqueLines;
}

function main() {
    var fileContents = io.fileRead("comboWordList.txt"),
        wordLines = stringToWordLines(fileContents),
        freqFileContents = io.fileRead("english-30000.txt"),
        freqWordLines = stringToWordLines(freqFileContents),
        freqWords = wordOfEachLine(1, freqWordLines),
        result = "";
    //console.log("wl " + JSON.stringify(wordLines));
    console.log("merging compounds");
    wordLines = mergeCompounds(wordLines);
    //console.log(JSON.stringify(wordLines)+ " mc");
    console.log("unique lines");
    wordLines = uniqueLines(wordLines);
    //console.log(JSON.stringify(wordLines) + " ul");
    console.log("sorting by length");
    wordLines = sortByLength(wordLines);
    //console.log(JSON.stringify(wordLines) + " sl");
    console.log("sorting by frequency list");
    wordLines.sort(compareToWordListIndex.curry(freqWords));
    //console.log(JSON.stringify(wordLines) + " sorted");
    result = wordLinesToString(wordLines);
    console.log(result);
    console.log("writing result");
    io.fileWrite("sortedComboList.txt", result);
}

main();
