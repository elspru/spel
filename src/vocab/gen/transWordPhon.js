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
    allPhonLangs = [
        "zh", "es", "en", "hi",   "ar", "bn", "ru", "pa",
        "de", "id", "te", "ta",   "vi", "ko", "fr", "ur", 
        "tr", "zhy", "gu", "fa",  "pl", "ml", "sw", "am",
        "az", "ne", "hu", "cs",   "ka"
        ],
    PhonEntry = function () {
        this.en = "";
        //allPhonLangs.forEach(function (code) {
        //    this[code] = "";
        //});
    };

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
   // var shelljs = require("shelljs/global"),
    var exec = require("shelljs").exec,
        fromLangCode = "en",
        command = "",
        translation = "",
        warning;
    command = "../gtranslate.sh " + fromLangCode + " " +
        toLangCode + " " + word;
    try {
        console.log("command " + command);
        translation = exec(command, {timeout: 5000}).output;
    } catch (e) {
        console.log("fail for " + command);
        console.log(e.stack);
        console.log(e);
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
        if (entry[key] === "") {
            translation = translateWord(word, key);
            //console.log(translation);
            entry[key] = translation;
        }
    });
    return entry;
}

function phonateWord(word, inLangCode) {
    //var shelljs = require("shelljs/global"),
    var exec = require("shelljs").exec,
        command = "",
        translation = "",
        warning;
    if (word === "undefined") {
        word = "";
    }
    if (inLangCode === "en") {
        inLangCode = "en-us";
    }
    if (word === undefined) { return;}
    word = word && word.replace(/\"/g,"");
    word = word && word.replace(/\n/g,"");
    console.log("word " + word);
    command = 'echo \"' + word.toString() + '\" | espeak-ng --stdin --ipa -q ' +
        ' -v ' + inLangCode;
    try {
        translation = exec(command, {timeout: 5000});
        translation = translation && translation.output;
    } catch (e) {
        console.log("fail for " + command);
        console.log(e.stack);
        console.log(e);
    }
    if (translation && translation.toLower &&
            translation.toLower() === word) {
        warning = ("Warning: " + translation +
            " has same definition");
        console.log(warning);
    }
    if (translation === null) { translation = ""; 
        console.log("translation was null");}
    return translation;
}

function arabicToIPA(word) {
    var wordArray = word.split();
    word = wordArray.reverse().join("");
  //  var execSync = require("exec-sync"),
  //      command = "",
  //      translation = "",
  //      warning;
  //  command = "echo '" + word + "' | fribidi ";
  //  try {
  //      translation = execSync(command);
  //  } catch (e) {
  //      console.log("fail for " + command);
  //      console.log(e.stack);
  //      console.log(e);
  //  }
  //  word = translation;
  //  console.log(translation);
    word = word.replace(String.fromCharCode(0x64b),"n");
    word = word.replace(String.fromCharCode(0x64f),"u");
    word = word.replace("ا","a");
    word = word.replace("ﺍ","a");
    word = word.replace("ﺍ","a");
    word = word.replace("ﺇ","a");
    word = word.replace("ﺃ","a");
    word = word.replace("ﻜ","k");
    word = word.replace("ﻰ","ji");
    word = word.replace("ﺼ","ts");
    word = word.replace("ف","f");
    word = word.replace("ﺼ","sˤ");
    word = word.replace("ﺎ","a");
    word = word.replace("ﻟ","l");
    word = word.replace("ﻤ","m");
    word = word.replace("ﻟ","l");
    word = word.replace("ﻠ","l");
    word = word.replace("ﺭ","r");
    word = word.replace("ﻛ","k");
    word = word.replace("ﻴ","ji");
    word = word.replace("ﺴ","ʃ");
    word = word.replace("ﺵ","ʃ");
    word = word.replace("ﻐ","f");
    word = word.replace("ﻳ","ja");
    word = word.replace("ﻓ","f");
    word = word.replace("ﻲ","ji");
    word = word.replace("ﻳ","ji");
    word = word.replace("ﺣ","ħ");
    word = word.replace("ﺯ","z");
    word = word.replace("ﺤ","ħ");
    word = word.replace("ﻼ","lo");
    word = word.replace("ﻺ","lo");
    word = word.replace("ﻷ", "lo");
    word = word.replace("ﻨ","n");
    word = word.replace("ﻙ","k");
    word = word.replace("ﺺ","ts");
    word = word.replace("ﺱ","s");
    word = word.replace("ﺟ","ʒ");
    word = word.replace("ﻟ","l");
    word = word.replace("ﺔ","t");
    word = word.replace("ﺬ", "d");
    word = word.replace("ﺚ", "t");
    word = word.replace("ﺒ", "b");
    word = word.replace("و", "w");
    word = word.replace("ﺰ", "z");
    word = word.replace("ل", "l");
    word = word.replace("ا", "a");
    word = word.replace("ة", "t");
    word = word.replace("ﺥ", "x");
    word = word.replace("ي", "aj");
    word = word.replace("ى", "aj");
    word = word.replace("ﺶ", "s");
    word = word.replace("ﺷ", "s");
    word = word.replace("ﺷ", "s");
    word = word.replace("ت", "t");
    word = word.replace("ن", "n");
    word = word.replace("ﺗ", "t");
    word = word.replace("س", "s");
    word = word.replace("ؤ", "ʔ");
    word = word.replace("ﺃ", "ʔ");
    word = word.replace("ﻜ", "k");
    word = word.replace("ط", "tˤ");
    word = word.replace("ﻋ","ʒ");
    word = word.replace("ب","b");
    word = word.replace("ت","t");
    word = word.replace("ث","t");
    word = word.replace("ﻄ","tˤ");
    word = word.replace("ﻃ","tˤ");
    word = word.replace("ث","θ");
    word = word.replace("ﺜ","θ");
    word = word.replace("ﺩ","d");
    word = word.replace("ﻖ","q");
    word = word.replace("ﻗ","q");
    word = word.replace("ﻷ","la");
    word = word.replace("ج","ʒ");
    word = word.replace("ﺞ","dʒ");
    word = word.replace("ﺟ","dʒ");
    word = word.replace("ﺠ","dʒ");
    word = word.replace("ﻲ","j");
    word = word.replace("ﻠ","l");
    word = word.replace("ﺠ","ʒ");
    word = word.replace("ح","ħ");
    word = word.replace("ﺤ","ħ");
    word = word.replace("ﺣ","ħ");
    word = word.replace("ﻞ","l");
    word = word.replace("ﻄ","t");
    word = word.replace("ﺌ","ji");
    word = word.replace("ﺹ","s");
    word = word.replace("ﻧ","n");
    word = word.replace("ﺡ","ħ");
    word = word.replace("خ","x");
    word = word.replace("د","d");
    word = word.replace("ذ","ð");
    word = word.replace("ﺫ","ð");
    word = word.replace("ر","r");
    word = word.replace("ﺭ","r");
    word = word.replace("ز","z");
    word = word.replace("س","s");
    word = word.replace("ش","ʃ");
    word = word.replace("ﺸ","ʃ");
    word = word.replace("ﺅ","w");
    word = word.replace("ﻛ","k");
    word = word.replace("ﺮ","r");
    word = word.replace("ﺦ","x");
    word = word.replace("ﺨ","x");
    word = word.replace("ﻊ","ʕ");
    word = word.replace("ﻴ","ji");
    word = word.replace("ﻞ","l");
    word = word.replace("ﺛ","θ");
    word = word.replace("ﺚ","θ");
    word = word.replace("ﺙ","θ");
    word = word.replace("ﺛ","θ");
    word = word.replace("ﻓ","f");
    word = word.replace("ﻁ","t");
    word = word.replace("ﻹ","la");
    word = word.replace("ﻇ","ðˤ");
    word = word.replace("ﻈ","ðˤ");
    word = word.replace("ﻆ","ðˤ");
    word = word.replace("ﻀ","ð");
    word = word.replace("ﻮ","w");
    word = word.replace("ﺪ","d");
    word = word.replace("ﺫ","ð");
    word = word.replace("ﻲ","ji");
    word = word.replace("ﺢ","x");
    word = word.replace("ﻯ","a");
    word = word.replace("ﺎ","a:");
    word = word.replace("ﺿ","d");
    word = word.replace("ﺳ","s");
    word = word.replace("ﻱ","ji");
    word = word.replace("ﻂ","tˤ");
    word = word.replace("ﻃ","tˤ");
    word = word.replace("ح","h");
    word = word.replace("ﺯ","z");
    word = word.replace("ﻣ","m");
    word = word.replace("ﺆ","ʔ");
    word = word.replace("ﺈ","aʔ");
    word = word.replace("ﻵ","la");
    word = word.replace("ﻀ","d");
    word = word.replace("ﺖ","t");
    word = word.replace("ﻪ","h");
    word = word.replace("ﺾ","d");
    word = word.replace("ع","ʕ");
    word = word.replace("ع","ʕ");
    word = word.replace("م","ʕ");
    word = word.replace("ﻔ","f");
    word = word.replace("ﺨ","x");
    word = word.replace("ﺗ","t");
    word = word.replace("ﻝ","l");
    word = word.replace("ج","dʒ");
    word = word.replace("ﻱ","j");
    word = word.replace("ق","g");
    word = word.replace("ق","g");
    word = word.replace("ﺧ","x");
    word = word.replace("ﺜ","");
    word = word.replace("ﻥ","n");
    word = word.replace("ﻻ","lo");
    word = word.replace("ﺎ","a");
    word = word.replace("ﺻ","ts");
    word = word.replace("ﺑ","ts");
    word = word.replace("ﺩ","d");
    word = word.replace("غ","ɣ");
    word = word.replace("ﺽ","dˤ");
    word = word.replace("ﺽ","zˤ");
    word = word.replace("ﺦ","x");
    word = word.replace("ﺲ","ʃ");
    word = word.replace("ﻔ","f");
    word = word.replace("ﻋ","ɣ");
    word = word.replace("ﻎ","ɣ");
    word = word.replace("ﻍ","ɣ");
    word = word.replace("ﻐ","ɣ");
    word = word.replace("ﺉ","ji");
    word = word.replace("ﻠ","l");
    word = word.replace("ﺏ","b");
    word = word.replace("ﻏ","ɣ");
    word = word.replace("ﻫ","n");
    word = word.replace("ف","f");
    word = word.replace("ﻪ","h");
    word = word.replace("ق","q");
    word = word.replace("ﻘ","q");
    word = word.replace("ك","k");
    word = word.replace("ك", "k");
    word = word.replace("ﺴ", "ʃ");
    word = word.replace("ل","l");
    word = word.replace("ﻝ","l");
    word = word.replace("م","m");
    word = word.replace("ﻢ","m");
    word = word.replace("ﻣ","m");
    word = word.replace("ن","n");
    word = word.replace("ﻦ","n");
    word = word.replace("ﺑ","b");
    word = word.replace("ه","h");
    word = word.replace("و","w");
    word = word.replace("ي","j");
    word = word.replace("ﻩ","h");
    word = word.replace("ﻬ","h");
    word = word.replace("ﺪ","d");
    word = word.replace("ة","ta");
    word = word.replace("ﺓ","ta");
    word = word.replace("ﺓ","ta");
    word = word.replace("ﺔ","q");
    word = word.replace("ﻘ","q");
    word = word.replace("ﻗ","q");
    word = word.replace("ﺔ","q");
    word = word.replace("ﺮ","r");
    word = word.replace("ﺮ","r");
    word = word.replace("أ","ʔ");
    word = word.replace("ﺋ","ʔ");
    word = word.replace("ﺂ","ʔa:");
    word = word.replace("ﺸ","ʃ");
    word = word.replace("ﺍ","a");
    word = word.replace("ﺘ","t");
    word = word.replace("ﻴ","ji");
    word = word.replace("ﻮ","w");
    word = word.replace("ﻭ","w");
    word = word.replace("ﺬ","ð");
    word = word.replace("ﻚ","k");
    word = word.replace("ﻧ","n");
    word = word.replace("ﺗ","t");
    word = word.replace("ﻭ","w");
    word = word.replace("ﺍ","ʔ");
    word = word.replace("ﻌ","ʔ");
    word = word.replace("ﻕ","q");
    word = word.replace("ﺋ","n");
    word = word.replace("ﺒ","b");
    word = word.replace("ﺐ","b");
    word = word.replace("ﻣ","m");
    word = word.replace("ﺘ","t");
    word = word.replace("ﻤ","m");
    word = word.replace("ء","ʔ");
    word = word.replace("ﻼ","la");
    word = word.replace("ئ","ʔ");
    word = word.replace("ﻉ","ʔ");
    word = word.replace("ﺕ","t");
    word = word.replace("ﻥ","n");
    word = word.replace("ﻦ","n");
    word = word.replace("ﻨ","n");
    word = word.replace("ﻡ","m");
    word = word.replace("ﺐ","b");
    word = word.replace("ب","b");
    word = word.replace("د","d");
    word = word.replace("ص","sˤ");
    word = word.replace("ﺻ","sˤ");
    word = word.replace("ض","dˤ");
    word = word.replace("ط","tˤ");
    word = word.replace("ظ","zˤ");
    word = word.replace("ﺧ","x");
    word = word.replace("ر","r");
    word = word.replace("ﺳ","s");
    word = word.replace("ﻑ","f");
    word = word.replace("ﺷ","ʃ");
    word = word.replace("ﻒ","f");
    word = word.replace("ﺝ","g");
    word = word.replace("ﺰ","z");
    word = word.replace("إ","aʔ");
    word = word.replace("ﻌ","ʔ");
    word = word.replace("آ","ʔaː");
    word = word.replace("ﺁ","ʔaː");
    word = word.replace("ﺄ","ʔaː");
    word = word.replace("ﺎ","ʔaː");
    word = word.replace("ﺊ","ji");
    //console.log("word " +word);
    return word;
}
function thaiToIPA(word) {
    word = word.replace(/บ/g, "b"); 	 
    word = word.replace(/ฎ/g, "d"); 	
    word = word.replace(/ด/g, "d");   
    word = word.replace(/ฝ/g, "f");	
    word = word.replace(/ฟ/g, "f");  
    word = word.replace(/ห/g, "h"); 	
    word = word.replace(/ฮ/g, "h");    
    word = word.replace(/ญ/g, "j"); 	
    word = word.replace(/ย/g, "j");    
    word = word.replace(/ก/g, "k"); 	
    word = word.replace(/ข/g, "x"); 	
    word = word.replace(/ฃ/g, "x");   
    word = word.replace(/ค/g, "x");   
    word = word.replace(/ฅ/g, "x");   
    word = word.replace(/ฆ/g, "x");   
    word = word.replace(/ล/g, "l"); 	
    word = word.replace(/ฬ/g, "l");   
    word = word.replace(/ม/g, "m"); 	
    word = word.replace(/ณ/g, "n"); 	
    word = word.replace(/น/g, "n");   
    word = word.replace(/ง/g, "ŋ"); 	
    word = word.replace(/—/g, "ɲ"); 	  
    word = word.replace(/ป/g, "p"); 	
    word = word.replace(/ผ/g, "pʰ");
    word = word.replace(/พ/g, "pʰ");  
    word = word.replace(/ภ/g, "pʰ");    
    word = word.replace(/ร/g, "r"); 	
    word = word.replace(/ซ/g, "s"); 	
    word = word.replace(/ศ/g, "s");    
    word = word.replace(/ษ/g, "s");    
    word = word.replace(/ส/g, "s");    
    word = word.replace(/ฏ/g, "t"); 	
    word = word.replace(/ต/g, "t");    
    word = word.replace(/ฐ/g, "tʰ");
    word = word.replace(/ฑ/g, "tʰ");
    word = word.replace(/ฒ/g, "tʰ");
    word = word.replace(/ถ/g, "tʰ");
    word = word.replace(/ท/g, "tʰ");
    word = word.replace(/ห/g, "tʰ");
    word = word.replace(/ธ/g, "tʰ");
    word = word.replace(/จ/g, "tɕ"); 
    word = word.replace(/ฉ/g, "tɕʰ");
    word = word.replace(/ช/g, "tɕʰ");
    word = word.replace(/ฌ/g, "tɕʰ"); 
    word = word.replace(/ว/g, "w"); 	
    word = word.replace(/อ/g, "ʔ"); 	
    word = word.replace(/ะ/g, "ʔ");   
    word = word.replace("อย", "j"); 
    word = word.replace("หม", "m");     
    word = word.replace("หล", "l");     
    word = word.replace("หน", "n");     
    word = word.replace("หย", "j");     
    word = word.replace("หง", "ŋ");     
    word = word.replace("หร", "r");     
//        ◌ั◌ 	
//e 	เ◌ะ, 
//        เ◌็◌ 
//ɛ 	แ◌ะ, 
//        แ◌็◌ 
//i 	◌ิ, 
//        ◌ิ◌ 
//o 	โ◌ะ, 
//ɔ 	เ◌าะ, 
//a 	◌ะ, 
//        ◌็อ◌ 
//u 	◌ุ, ◌ุ◌ 
//ɯ 	◌ึ, ◌ึ◌ 
//ɤ 	เ◌อะ 	
//aː 	◌า, ◌า◌ 
    word = word.replace(/า/g,"a:");
//eː 	เ◌, เ◌◌ 
//ɛː 	แ◌, แ◌◌ 
//iː 	◌ี, ◌ี◌ 	◌ີ
//oː 	โ◌, โ◌◌
//ɔː 	◌อ, ◌อ◌ 
//uː 	◌ู, ◌ู, 
//ɯː 	◌ือ, ◌ื◌
//ɤː 	เ◌อ, เ◌ิ◌
//iəʔ 	เ◌ียะ 
//iə 	เ◌ีย, เ◌ีย◌ 
//uəʔ 	◌ัวะ 
//uə 	◌ัว, ◌ว◌ 
    word = word.replace(/ว/g,"uə");
//ɯəʔ 	เ◌ือะ 
//ɯə 	เ◌ือ, เ◌ือ◌ 
    return word;
} 

function zhyTones(word) {
    word = word.replace(/1/g,"˥˧");
    word = word.replace(/2/g,"˧˥");
    word = word.replace(/3/g,"˧");
    word = word.replace(/4/g,"˨˩");
    word = word.replace(/5/g,"˩˧");
    word = word.replace(/6/g,"˨");
    word = word.replace(/7/g,"˥");
    word = word.replace(/8/g,"˧");
    word = word.replace(/9/g,"˨");
    return word;
}
function zhTones(word) {
    word = word.replace(/1/g,"˥");
    word = word.replace(/2/g,"˧˥");
    word = word.replace(/3/g,"˩˦");
    word = word.replace(/4/g,"˥˩");
    word = word.replace(/5/g,"");
    return word;
}
function viTones(word) {
    word = word.replace(/1/g,"˧");
    word = word.replace(/2/g,"˨˩");
    word = word.replace(/3/g,"˧˥");
    word = word.replace(/4/g,"˧˩");
    word = word.replace(/5/g,"˧˥ˀ");
    word = word.replace(/6/g,"˧˨ˀ");
    return word;
}

function updatePhonemicEntry(phonEntry, transEntry) {
    var translation,
        word;
    Object.keys(phonEntry).forEach(function (key) {
        if (phonEntry[key] === "") {
            if (key === "zhy") {
                word = transEntry.zh;
            } else {
                word = transEntry[key];
            }
            if (key === "th") {
                word = transEntry[key];
                if (word !== undefined) { 
                    translation = thaiToIPA(word);
                    console.log("th " + translation);
                    phonEntry[key] = translation;
                }
            } else if (key === "ar") {
                translation = arabicToIPA(word);
            } else if (key === "zhy") {
                translation = phonateWord(word, key);
                translation = zhyTones(translation);
            } else if (key === "zh") {
                translation = phonateWord(word, key);
                translation = zhTones(translation);
            } else if (key === "vi") {
                translation = phonateWord(word, key);
                translation = viTones(translation);
            } else {
                translation = phonateWord(word, key);
            }
            //console.log("word " +word);
            if (translation !== undefined) {
                console.log(key + " " +translation);
            }
            phonEntry[key] = translation;
        }
    });
    return phonEntry;
}

function main() {
    var //fileContents = io.fileRead("sortedComboList.txt"),
        fileContents = io.fileRead("comboUniqList-mid.txt"),
        wordLines = stringToWordLines(fileContents),
        mainWords = wordOfEachLine(0, wordLines),
        transJSON = io.fileRead("genTransX.json"),
        transObjX = JSON.parse(transJSON),
        phonJSON = io.fileRead("genPhonX.json"),
        phonObjX = JSON.parse(phonJSON),
        count = 0,
        transEntry,
        phonEntry;
    // mainWords.map(getTranslations.curry(transObjX));
    mainWords.forEach(function (word) {
        transEntry = transObjX["X" + word];
        phonEntry = phonObjX["X" + word];
        console.log("word " + word);
        if (phonEntry === undefined) {
            phonEntry = new PhonEntry();
        }
        // be add ob sub entry for each lang ya
        allPhonLangs.forEach(function (langCode) {
            if (phonEntry[langCode] === undefined) {
                phonEntry[langCode] = "";
            }
        });
        if (transEntry === undefined) {
            console.log(word + " undefined ");
        } else {
            phonObjX["X" + word] = updatePhonemicEntry(phonEntry, 
                transEntry);
        count += 1;
        if (count > 100) {
            io.fileWrite("genPhonX.json", JSON.stringify(phonObjX));
            io.fileWrite("genPhonX.json.2", JSON.stringify(phonObjX));
            count = 0;
        }
        }
    });
    io.fileWrite("genPhonX.json", JSON.stringify(phonObjX));
}

main();
