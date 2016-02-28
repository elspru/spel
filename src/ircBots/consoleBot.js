#!/usr/bin/nodejs
var io = require("../lib/io");
function unique(wordArray) {
    "use strict";
    return wordArray.filter(function (elem, index, array) {
        return array.indexOf(elem, index+1) === -1;
    });
}
function topSixWords(wordArray) {
    "use strict";
    var gramWordsFile = io.fileRead("gramWords.eng.txt"),
        gramWords = gramWordsFile.split("\n"),
        wordFreq = {},
        title = "";
    /* remove grammar words */
    wordArray = wordArray.filter(function (word) {
        if (gramWords.indexOf(word) > -1) {
            return false;
        }
        return true;
    });
    /* identify frequency */
    wordArray.forEach(function (word) {
        if (wordFreq[word] === undefined) {
            wordFreq[word] = 1;
        } else {
            wordFreq[word] += 1;
        }
    });
    /* make wordArray unique */
    wordArray = unique(wordArray);
    /* sort by frequency */
    wordArray = wordArray.sort(function (word, word2) {
        return wordFreq[word2] - wordFreq[word];
    });
    title = wordArray.slice(0, 6).join(" ");
    return title;
}
function main() {
    var fileContents = io.fileRead("lorumIpsum.txt"),
        wordArray = fileContents.split(" ");
    console.log("testing");
    console.log(topSixWords(wordArray));
}
main();
