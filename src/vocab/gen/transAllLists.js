#!/usr/bin/nodejs

var io = require("../../lib/io"),
    allTransLangs = [
        "en", "hi", "zh", "sw",   "ar", "es", "id", "tr", 
        "ru", "fr", "ta", "fa",   "pt", "de", "vi", "it",  

        "jv", "pl", "sr", "fi",   "sv", "el", "ka", "cy", 
        "bn", "pa", "he", "ja",   "te", "ko", "mr", "lt",

        "hu", "nl", "da", "tl",   "th", "te", "ur", "gu", 
        "kn", "ml", "ps", "jv",   "su", "ha", "my", "uk",
        
        "yo", "am", "ro", "uz",   "sd", "mi", "ig", "mg",
        "si", "ne", "km", "so",   "zu", "ny", "ku", "mn",

        "lo", "zu", "xh", "az",   "cs"];

function formatWordList(wordArray) {
        return wordArray.reduce(function(result, wordLine) {
            result += wordLine[0] + ": " + wordLine[1] + "\n";
            return result;
        }, "");
}
function formatMWordList(wordArray) {
        return wordArray.reduce(function(result, wordLine) {
            result += wordLine[0] + ": " +
                wordLine[1].join(", ") + "\n";
            return result;
        }, "");
}

function updateWord(transWord, transLang) {
    transWord = transWord.replace(/\n/,"");
    transWord = transWord.replace(/\s/g,"");
    if (transLang === "zh" || transLang === "hi") {
        transWord = transWord.replace(/ /,"");
        transWord = transWord.replace(/ /,"");
    } else {
        transWord = transWord.replace(/ /,"-");
        transWord = transWord.replace(/ /,"-");
    }
    return transWord;
}

function main() {
    var rootWordFile = io.fileRead("langWords.json"),
        uniqueFile = io.fileRead("unique.json"),
        transFile = io.fileRead("genTransX.json"),
        rootObj = JSON.parse(rootWordFile),
        uniqueObj = JSON.parse(uniqueFile),
        transObj = JSON.parse(transFile),
        mainWords = rootObj.mainWords,
        allWords = uniqueObj.mainWords,
        outPath = "allLangs/",
        allLists = {};
    allTransLangs.forEach(function(transLang) {
         allLists[transLang] = {};
    });
    /* gen word lists */
    
    allTransLangs.forEach(function (transLang) {
        allLists[transLang].rootList = 
            mainWords.reduce(function (result, enWord) {
                /* root words */
                var word =  rootObj.rootList["X" + enWord],
                    entry = [],
                    transWord;
                if (word) {
                    word = word[0];
                    //if (word.length === 3) {
                    //    word = "h" + word;
                    //}
                    transWord = transObj["X" +
                        enWord][transLang];
                    transWord = updateWord(transWord, transLang);
                    entry.push(transWord);
                    entry.push(word);
                    result.push(entry);
                }
                return result;
            }, []);
        console.log("writing rootList for " + transLang);
        io.fileWrite(outPath + transLang + "-" +
                transObj.Xroot[transLang] + "_" +
                transObj.Xlist[transLang] + ".txt",
            formatWordList(allLists[transLang].rootList));
        allLists[transLang].gramList = 
            mainWords.reduce(function (result, enWord) {
                /* gram words */ 
                var word =  rootObj.gramList["X" + enWord],
                    transWord = "",
                    entry = [];
                if (word) {
                    word = word[0];
                    //if (word.length === 3) {
                    //    word = word + "h";
                    //}
                    transWord = transObj["X" +
                        enWord][transLang];
                    transWord = updateWord(transWord, transLang);
                    entry.push(transWord);
                    entry.push(word);
                    result.push(entry);
                }
                return result;
            }, []);
        console.log("writing gramList for " + transLang);
        io.fileWrite(outPath + transLang + "-" +
                transObj.Xgrammar[transLang] + "_" +
                transObj.Xlist[transLang] + ".txt",
            formatWordList(allLists[transLang].gramList));
    });
    allTransLangs.forEach(function (transLang) {
    function approvedWords(word) {
        if (/:$/.test(word)) {
            return false;
        }
        if (mainWords.indexOf(word) > -1) {
            return true;
        }
        return false;
    }
    /* gen suggest lists */
        allLists[transLang].suggest =
            allWords.reduce(function (result, enWord) {
                var bentry =  uniqueObj.blacklist[enWord],
                    entry = [],
                    transWord = "";
                Function.prototype(entry, transWord);
                if (bentry) {
                    entry.push(updateWord(transObj["X" +
                        enWord][transLang], transLang));
                    bentry = bentry.filter(approvedWords);
                    entry.push(bentry.map(function(enDef) {
                       return updateWord(transObj["X" +
                            enDef][transLang], transLang);
                    }));
                    result.push(entry);
                } 
                return result;
            }, []);
        console.log("writing suggestList for " + transLang);
        io.fileWrite(outPath + transLang + "-" +
                transObj.Xsuggest[transLang] + "_" +
                transObj.Xlist[transLang] + ".txt",
            formatMWordList(allLists[transLang].suggest));
    /* gen thesauruses/dictionary */
        allLists[transLang].thesaurus =
            mainWords.reduce(function (result, enWord) {
                var transArray = [],
                    entry = [];
                entry.push(updateWord(transObj["X" +
                    enWord][transLang]));
                transArray = uniqueObj.thesaurus[enWord];
                transArray = transArray.filter(function (enDef) {
                    if (/:$/.test(enDef)) {
                        return false;
                    }
                    return true;
                });
                transArray = transArray.map(function (enDef) {
                    return updateWord(transObj["X" +
                        enDef][transLang]);
                });
                entry.push(transArray);
                result.push(entry);
                return result;
            }, []);
        console.log("writing thesaurus for " + transLang);
        io.fileWrite(outPath + transLang + "-" +
                transObj.Xdictionary[transLang] + ".txt",
            formatMWordList(allLists[transLang].thesaurus));
    });
    io.fileWrite("allLists.json", JSON.stringify(allLists));
}
main();
