#!/usr/bin/nodejs
// translationUpdate worker
"use strict";

var debug = false;

var hof = require("../lib/hof");
var io = require("../lib/io");
var fs = require("fs");
var tokenize = require('../compile/tokenize');
var Text = require('../class/text');
var Sentence = require('../class/sentence');
var Language = require('../lang/language');
var mwak = new Language();

var Eng = require("../locale/eng/eng");
var eng = new Eng(".");

// first argument is filename
var fromFilename = "eng.txt";
var fromLangCode = "en";
// english
var toFilename = "eng.txt";
var toLangCode = "en";

function noSpace(string) {
    var stringArray = string.split(),
        result;
    result = stringArray.map(function (glyph) {
        if (tokenize.isSpace(glyph)) {
            return '-';
        }
        return glyph;
    });
    return result.join("");
}

function uniqueVerify(filename) {
    // first argument is filename
    //console.log("****** " + filename);
    var fileContents = io.fileRead(filename),
        fileText = new Text(mwak, fileContents),
        definitions = fileText.select(mwak, "ha"),
        sentences = definitions.sentences,
        output =  "";
    // clean up text
    sentences = sentences.map(function (sentence) {
        sentence.phraseDelete(mwak, "kya");
        sentence.phraseDelete(mwak, "nya");
        sentence.phraseDelete(mwak, ".i");
        //sentences[i].phraseDelete(mwak, "hu");
    });
    // check if same definition is found twice
    sentences.forEach(function () {
        if (sentences[0] !== undefined) {
            var phrase = sentences[0].phraseGet(mwak, "ha"),
                sentence = sentences[0].copy(mwak),
                matches = definitions.indexOf(mwak,
                    phrase.toString());
            if (matches !== -1) {
                output += ("duplicate error: \n " +
                sentence.toLocaleString(mwak) + "\n" +
                definitions.sentences[matches].
                toLocaleString(mwak) + "\n");
            }
        }
        sentences.splice(0, 1);
    });
    return output;
}

function translateWord(fromLangCode, toLangCode,
        sentence, subject, newText, i, byService, warnings) {
    var obPhraseBody,
        command,
        translation,
        translateFail,
        warning,
        execSync = require('exec-sync'),
        definition,
        newSentence;
    obPhraseBody = sentence.phraseGet(mwak, "ha").body;
    if (obPhraseBody.type && obPhraseBody.type === "lit") {
        obPhraseBody = obPhraseBody.body;
    }
    definition = String(obPhraseBody);
    try {
        if (byService === "reversePlain") {
            command = "./reversePlainTranslate.js " +
                fromLangCode + " " + definition;
        } else {
            command = "./gtranslate.sh " + byService +
                " " + fromLangCode + " " + toLangCode +
                " " + definition;
        }
        translation = execSync(command);
    } catch (e) {
        console.log("fail for " + command);
        console.log(e.stack);
        console.log(e);
        translateFail = true;
    }
    if (translateFail === true) {
        return false;
    }
    // be replace ob space with dash ya
    //translation.replace('\s','-');
    translation = noSpace(translation);
    console.log(definition + " " + translation);
    if (translation.toLower &&
            translation.toLower() === definition) {
        warning = ("Warning: " + translation +
            " has same definition");
        warnings[warnings.length] = warning;
    }
    newSentence = new Sentence(mwak,
        (subject + " " + translation + " li ha ya"));
    warnings[warnings.length] = (
        newSentence.toLocaleString(eng) +
            "\n" + newSentence.toLocaleString(mwak)
    );
    newText.insert(mwak, i, newSentence);
    return true;
}

function translateUpdate(toFilename, toLangCode,
        fromFilename, fromLangCode, byService) {
    if (fromFilename === undefined) {
        fromFilename = "eng.txt";
    }
    if (fromLangCode === undefined) {
        fromLangCode = "en";
    }
    if (byService === undefined) {
        byService = "google";
    }
    var fileContents = io.fileRead(fromFilename),
        fileText = new Text(mwak, fileContents),
        definitions = fileText.select(mwak, "ha"),
        sentences = definitions.sentences,
        toFileContents = io.fileRead(toFilename),
        toFileText = new Text(mwak, toFileContents),
        newText = toFileText.copy(mwak),
        warnings = [],
        //childProcess = require('child_process'),
        //logFilename,
        //newLogContents,
        date,
        uniqueWarnings,
        warningString;
    console.log("translating " + toFilename);
    sentences.forEach(function (sentence, i) {
        var subject,
            find;
        try {
            subject = String(sentence.phraseGet(mwak, "hu"));
            find = toFileText.indexOf(mwak, subject);
        } catch (e) {
            console.log(e.stack);
            console.log(e);
        }
        if (find === -1) {
            console.log("translating " + sentence);
            translateWord(fromLangCode, toLangCode, sentence,
                subject, newText, i, byService, warnings);
        }
    });
    if (debug) {
        console.log(newText.toLocaleString(mwak));
    } else {
        io.fileWrite(toFilename, newText.toLocaleString(mwak));
        io.fileWrite(toFilename + ".json", JSON.stringify(newText));
    }
    uniqueWarnings = uniqueVerify(toFilename);
    warnings[warnings.length] = uniqueWarnings;
    warningString = "";
    date = new Date();
    warningString = date.toString() + "\n";
    warnings.forEach(function (warning) {
        warningString += warning + "\n";
    });
    console.log(warningString);
    //if (warnings.length > 0 && !debug) {
    //    logFilename = toFilename + ".log";
    //    newLogContents = "";
    //    if (fs.existsSync(logFilename)) {
    //        var logContents = io.fileRead(logFilename);
    //        newLogContents = logContents + warningString; 
    //    } else {
    //        newLogContents = warningString;
    //    }
    //    io.fileWrite(logFilename, newLogContents);
    //}
}

//try {
//    translateUpdate(toFilename, toLangCode);
//} catch (e) {
//    console.log(toFilename + " problem");
//    console.log(e.stack);
//    console.log(e);
//}

//this.onmessage = function(event) {
//// parse message into two arguments
//var message = event.data,
//    tuple = message.split(" "),
//    toFilename = tuple[0],
//    toLangCode = tuple[1];
//    postMessage("status "+ message + " recieved");
//    if (toFilename = "close") {
//        self.close();
//    }
//    postMessage("status "+ toFilename + " starting");
//    translateUpdate(toFilename, toLangCode);
//    postMessage(toFilename + " done");
//};

toFilename = process.argv[2];
toLangCode = process.argv[3];
console.log(toFilename + " starting ");
translateUpdate(toFilename, toLangCode);
console.log(toFilename + " done ");
