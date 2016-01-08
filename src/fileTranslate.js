#!/usr/bin/nodejs
////////////////////////////////////////////////////////////////
//          0x10            0x20            0x30            0x40
//3456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0
//      10        20        30        40        50        60  64
//34567890123456789012345678901234567890123456789012345678901234
////////////////////////////////////////////////////////////////
/// be file sh for nodejs console ya 
/// su speakable programming for every language be title ya
/// su la AGPL-3 be license ya
/// be end of head ya

"use strict";
var io = require("./lib/io");
var tokenize = require("./compile/tokenize");
var parse = require("./compile/parse");
var Phrase = require("./class/phrase");
var Sentence = require("./class/sentence");
var Type = require("./class/type");
var Text = require("./class/text");
var Dictionary = require("./lang/dictionary");
var Grammar = require("./lang/grammar");
var Language = require("./lang/language");
var Word = require("./class/word");
var Clause = require("./class/clause");
var Junction = require("./class/junction");
var mwak = new Language();



function fromLangFileTranslate(filename, langs) {
    var lang,
        fileContents,
        text,
        Lang,
        filenameParts = filename.split('.'),
        filenameLangCodeI = filenameParts.length - 2,
        code = filenameParts[filenameLangCodeI],
        langPairI = langs.find(function (pair) {
            var result = false;
            if (pair[0] === code) {
                result = true;
            }
            return result;
        });
    if (langPairI === null) {
        throw new Error(code + " be not known ob language code ya ");
    }
    lang = langs[langPairI][1];
    if (!lang) {
        Lang = require("./locale/" + code + "/" + code);
        lang = new Lang();
        console.log(code + " language loaded");
    }
    fileContents = io.fileRead(filename);
    console.log(fileContents);
    text = new Text(lang, fileContents);
    return text;
}

function toLangFileTranslate(filename, text, conjugationLevel,
    langs) {
    var filenameParts = filename.split('.'),
        filenameLangCodeI = filenameParts.length - 2,
        format = {},
        newFilenameParts,
        newFilename,
        newText,
        Lang,
        code,
        lang;
    langs.forEach(function (tuple) {
        code = tuple[0];
        lang = tuple[1];
        if (!lang) {
            Lang = require("./locale/" + code + "/" + code);
            lang = new Lang();
            tuple[1] = lang;
            console.log(code + " language loaded");
        }
        newFilenameParts = filenameParts.slice(0);
        newFilenameParts[filenameLangCodeI] = code;
        newFilenameParts.splice(1, 0, "t");
        newFilename = newFilenameParts.join(".");
        console.log("---------");
        console.log("writing " + newFilename);
        newText = text.toLocaleString(lang, format,
            "t", conjugationLevel);
        console.log(newText);
        io.fileWrite(newFilename, newText);
        console.log(code + " file written");
    });
}


//var allLangs = [["eng"], ["zho"], ["spa"], ["hin"], ["ara"],
//    ["por"],["rus"],
//    ["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"], ["tur"],
//    ["swa"], ["ukr"], ["nld"], ["hun"], ["swe"], ["mwak",mwak]
//    ];

var langs = [["eng"], ["javs"], ["mwak"]];
//var langs = allLangs;

var conjugationLevel = 7;
var filename = process.argv[2];
console.log(filename);

var text = fromLangFileTranslate(filename, langs);
toLangFileTranslate(filename, text, conjugationLevel, langs);


