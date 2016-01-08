#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for extracting dictionary definitions ya
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya
"use strict";

var debug = false;

var err;
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
        console.log("exec: " + command);
        translation = execSync(command);
        console.log("translation: " + translation);
    } catch (e) {
        err = new Error(e);
        console.log("fail for " + command);
        console.log(e.stackTrace);
        console.log(e);
        translateFail = true;
    }
    if (translateFail === true) {
        return false;
    }
    // be replace ob space with dash ya
    //translation.replace('\s','-');
    translation = noSpace(translation);
    console.log(translation);
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
        err,
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
            err = new Error("error at " + sentence);
            console.log(err.stack);
            throw err;
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

try {
    translateUpdate(toFilename, toLangCode);
} catch (e) {
    err = new Error(e);
    console.log(toFilename + " problem");
    console.log(err.stack);
    console.log(e);
}
var Eng = require("../locale/eng/eng");
var eng = new Eng(".");
// spanish
var toFilename = "spa.txt";
var toLangCode = "es";
translateUpdate(toFilename, toLangCode);
// portuguese
var fromFilename = "spa.txt";
var fromLangCode = "es";
var toFilename = "por.txt";
var toLangCode = "pt";
translateUpdate(toFilename, toLangCode,
    fromFilename, fromLangCode);
// french
var toFilename = "fra.txt";
var toLangCode = "fr";
translateUpdate(toFilename, toLangCode);
// mandarin chinese
var toFilename = "zho.txt";
var toLangCode = "zh";
translateUpdate(toFilename, toLangCode);
// russian
var toFilename = "rus.txt";
var toLangCode = "ru";
translateUpdate(toFilename, toLangCode);
// arabic
var toFilename = "ara.txt";
var toLangCode = "ar";
translateUpdate(toFilename, toLangCode);
// indonesian
var toFilename = "ind.txt";
var toLangCode = "id";
translateUpdate(toFilename, toLangCode);
// german
var toFilename = "deu.txt";
var toLangCode = "de";
translateUpdate(toFilename, toLangCode);
// japanese
var fromFilename = "zho.txt";
var fromLangCode = "zh";
var toFilename = "jpn.txt";
var toLangCode = "ja";
translateUpdate(toFilename, toLangCode,
    fromFilename, fromLangCode);
// korean
//var fromFilename = "jpn.txt";
//var fromLangCode = "ja";
var toFilename = "kor.txt";
var toLangCode = "ko";
translateUpdate(toFilename, toLangCode);//,
// farsi
//var toFilename = "fas.txt";
//var toLangCode = "fa";
//translateUpdate(toFilename, toLangCode);
//fromFilename, fromLangCode);
// hindi
var toFilename = "hin.txt";
var toLangCode = "hi";
translateUpdate(toFilename, toLangCode);
//// bengali
//var toFilename = "ben.txt";
//var toLangCode = "bn";
//translateUpdate(toFilename, toLangCode);
//// tamil
//var toFilename = "tam.txt";
//var toLangCode = "ta";
//translateUpdate(toFilename, toLangCode);

//translateUpdate(toFilename, toLangCode);
// italian
var toFilename = "ita.txt";
var toLangCode = "it";
translateUpdate(toFilename, toLangCode);
// thai
var toFilename = "tha.txt";
var toLangCode = "th";
translateUpdate(toFilename, toLangCode);
// dutch
var fromFilename = "deu.txt";
var fromLangCode = "de";
var toFilename = "nld.txt";
var toLangCode = "nl";
translateUpdate(toFilename, toLangCode,
    fromFilename, fromLangCode);
// hebrew
var toFilename = "heb.txt";
var toLangCode = "he";
translateUpdate(toFilename, toLangCode);
// swedish
var fromFilename = "deu.txt";
var fromLangCode = "de";
var toFilename = "swe.txt";
var toLangCode = "sv";
translateUpdate(toFilename, toLangCode,
    fromFilename, fromLangCode);
// swahili
var toFilename = "swa.txt";
var toLangCode = "sw";
translateUpdate(toFilename, toLangCode);
// ukranian
var fromFilename = "rus.txt";
var fromLangCode = "ru";
var toFilename = "ukr.txt";
var toLangCode = "uk";
translateUpdate(toFilename, toLangCode,
    fromFilename, fromLangCode);
// turkish
var toFilename = "tur.txt";
var toLangCode = "tr";
translateUpdate(toFilename, toLangCode);
// hungarian
var toFilename = "hun.txt";
var toLangCode = "hu";
translateUpdate(toFilename, toLangCode);
// finnish
var toFilename = "fin.txt";
var toLangCode = "fi";
translateUpdate(toFilename, toLangCode);
// esperanto
var byService = "reversePlain";
var toFilename = "epo.txt";
var toLangCode = "eo";
var fromLangCode = "esperanto-list.txt";
translateUpdate(toFilename, toLangCode, "eng.txt", fromLangCode, byService);

//function sleep(milliseconds) {
//    var start = new Date().getTime(),
//        i;
//    for (i = 0; i < 1e7; i=i+1) {
//        if ((new Date().getTime() - start) > milliseconds) {
//            break;
//        }
//    }
//}



