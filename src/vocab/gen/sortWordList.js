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
        return wordLine[0].length - otherLine[0].length;
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
            matchEx = new RegExp("^" + word),
            index = -1;
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

function main() {
    var fileContents = io.fileRead("combinedList.txt"),
        wordLines = stringToWordLines(fileContents),
        freqFileContents = io.fileRead("english-30000.txt"),
        freqWordLines = stringToWordLines(freqFileContents),
        freqWords = wordOfEachLine(1, freqWordLines),
        result = "";
    wordLines = sortByLength(wordLines);
    wordLines.sort(compareToWordListIndex.curry(freqWords));
    result = wordLinesToString(wordLines);
    console.log(result);
    io.fileWrite("sortedComboList.txt", result);
}

main();
