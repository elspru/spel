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
    word = word.replace(/ا/g,"a");
    word = word.replace(/ﺍ/g,"a");
    word = word.replace(/ﺍ/g,"a");
    word = word.replace(/ﺇ/g,"a");
    word = word.replace(/ﺃ/g,"a");
    word = word.replace(/ﻜ/g,"k");
    word = word.replace(/ﻰ/g,"ji");
    word = word.replace(/ﺼ/g,"ts");
    word = word.replace(/ف/g,"f");
    word = word.replace(/ﺼ/g,"sˤ");
    word = word.replace(/ﺎ/g,"a");
    word = word.replace(/ﻟ/g,"l");
    word = word.replace(/ﻤ/g,"m");
    word = word.replace(/ﻟ/g,"l");
    word = word.replace(/ﻠ/g,"l");
    word = word.replace(/ﺭ/g,"r");
    word = word.replace(/ﻛ/g,"k");
    word = word.replace(/ﻴ/g,"ji");
    word = word.replace(/ﺴ/g,"ʃ");
    word = word.replace(/ﺵ/g,"ʃ");
    word = word.replace(/ﻐ/g,"f");
    word = word.replace(/ﻳ/g,"ja");
    word = word.replace(/ﻓ/g,"f");
    word = word.replace(/ﻲ/g,"ji");
    word = word.replace(/ﻳ/g,"ji");
    word = word.replace(/ﺣ/g,"ħ");
    word = word.replace(/ﺯ/g,"z");
    word = word.replace(/ﺤ/g,"ħ");
    word = word.replace(/ﻼ/g,"lo");
    word = word.replace(/ﻸ/g,"la");
    word = word.replace(/ﻺ/g,"lo");
    word = word.replace(/ﻷ/g, "lo");
    word = word.replace(/ﻨ/g,"n");
    word = word.replace(/ﻙ/g,"k");
    word = word.replace(/ﺺ/g,"ts");
    word = word.replace(/ﺱ/g,"s");
    word = word.replace(/ﺟ/g,"ʒ");
    word = word.replace(/ﻟ/g,"l");
    word = word.replace(/ﺔ/g,"t");
    word = word.replace(/ﺬ/g, "d");
    word = word.replace(/ﺚ/g, "t");
    word = word.replace(/ﺒ/g, "b");
    word = word.replace(/و/g, "w");
    word = word.replace(/ﺰ/g, "z");
    word = word.replace(/ل/g, "l");
    word = word.replace(/ا/g, "a");
    word = word.replace(/ة/g, "t");
    word = word.replace(/ﺥ/g, "x");
    word = word.replace(/ي/g, "aj");
    word = word.replace(/ى/g, "aj");
    word = word.replace(/ﺶ/g, "s");
    word = word.replace(/ﺷ/g, "s");
    word = word.replace(/ﺷ/g, "s");
    word = word.replace(/ت/g, "t");
    word = word.replace(/ن/g, "n");
    word = word.replace(/ﺗ/g, "t");
    word = word.replace(/س/g, "s");
    word = word.replace(/ؤ/g, "ʔ");
    word = word.replace(/ﺃ/g, "ʔ");
    word = word.replace(/ﻜ/g, "k");
    word = word.replace(/ط/g, "tˤ");
    word = word.replace(/ﻋ/g,"ʒ");
    word = word.replace(/ب/g,"b");
    word = word.replace(/ت/g,"t");
    word = word.replace(/ث/g,"t");
    word = word.replace(/ﻄ/g,"tˤ");
    word = word.replace(/ﻃ/g,"tˤ");
    word = word.replace(/ث/g,"θ");
    word = word.replace(/ﺜ/g,"θ");
    word = word.replace(/ﺩ/g,"d");
    word = word.replace(/ﻖ/g,"q");
    word = word.replace(/ﻗ/g,"q");
    word = word.replace(/ﻷ/g,"la");
    word = word.replace(/ج/g,"ʒ");
    word = word.replace(/ﺞ/g,"dʒ");
    word = word.replace(/ﺟ/g,"dʒ");
    word = word.replace(/ﺠ/g,"dʒ");
    word = word.replace(/ﻲ/g,"j");
    word = word.replace(/ﻠ/g,"l");
    word = word.replace(/ﺠ/g,"ʒ");
    word = word.replace(/ح/g,"ħ");
    word = word.replace(/ﺤ/g,"ħ");
    word = word.replace(/ﺣ/g,"ħ");
    word = word.replace(/ﻞ/g,"l");
    word = word.replace(/ﻄ/g,"t");
    word = word.replace(/ﺌ/g,"ji");
    word = word.replace(/ﺹ/g,"s");
    word = word.replace(/ﻧ/g,"n");
    word = word.replace(/ﺡ/g,"ħ");
    word = word.replace(/خ/g,"x");
    word = word.replace(/د/g,"d");
    word = word.replace(/ذ/g,"ð");
    word = word.replace(/ﺫ/g,"ð");
    word = word.replace(/ر/g,"r");
    word = word.replace(/ﺭ/g,"r");
    word = word.replace(/ز/g,"z");
    word = word.replace(/س/g,"s");
    word = word.replace(/ش/g,"ʃ");
    word = word.replace(/ﺸ/g,"ʃ");
    word = word.replace(/ﺅ/g,"w");
    word = word.replace(/ﻛ/g,"k");
    word = word.replace(/ﺮ/g,"r");
    word = word.replace(/ﺦ/g,"x");
    word = word.replace(/ﺨ/g,"x");
    word = word.replace(/ﻊ/g,"ʕ");
    word = word.replace(/ﻴ/g,"ji");
    word = word.replace(/ﻞ/g,"l");
    word = word.replace(/ﺛ/g,"θ");
    word = word.replace(/ﺚ/g,"θ");
    word = word.replace(/ﺙ/g,"θ");
    word = word.replace(/ﺛ/g,"θ");
    word = word.replace(/ﻓ/g,"f");
    word = word.replace(/ﻁ/g,"t");
    word = word.replace(/ﻹ/g,"la");
    word = word.replace(/ﻇ/g,"ðˤ");
    word = word.replace(/ﻈ/g,"ðˤ");
    word = word.replace(/ﻆ/g,"ðˤ");
    word = word.replace(/ﻀ/g,"ð");
    word = word.replace(/ﻮ/g,"w");
    word = word.replace(/ﺪ/g,"d");
    word = word.replace(/ﺫ/g,"ð");
    word = word.replace(/ﻲ/g,"ji");
    word = word.replace(/ﺢ/g,"x");
    word = word.replace(/ﻯ/g,"a");
    word = word.replace(/ﺎ/g,"a:");
    word = word.replace(/ﺿ/g,"d");
    word = word.replace(/ﺳ/g,"s");
    word = word.replace(/ﻱ/g,"ji");
    word = word.replace(/ﻂ/g,"tˤ");
    word = word.replace(/ﻃ/g,"tˤ");
    word = word.replace(/ح/g,"h");
    word = word.replace(/ﺯ/g,"z");
    word = word.replace(/ﻣ/g,"m");
    word = word.replace(/ﺆ/g,"ʔ");
    word = word.replace(/ﺈ/g,"aʔ");
    word = word.replace(/ﻵ/g,"la");
    word = word.replace(/ﻀ/g,"d");
    word = word.replace(/ﺖ/g,"t");
    word = word.replace(/ﻪ/g,"h");
    word = word.replace(/ﺾ/g,"d");
    word = word.replace(/ع/g,"ʕ");
    word = word.replace(/ع/g,"ʕ");
    word = word.replace(/م/g,"ʕ");
    word = word.replace(/ﻔ/g,"f");
    word = word.replace(/ﺨ/g,"x");
    word = word.replace(/ﺗ/g,"t");
    word = word.replace(/ﻝ/g,"l");
    word = word.replace(/ج/g,"dʒ");
    word = word.replace(/ﻱ/g,"j");
    word = word.replace(/ق/g,"g");
    word = word.replace(/ق/g,"g");
    word = word.replace(/ﺧ/g,"x");
    word = word.replace(/ﺜ/g,"");
    word = word.replace(/ﻥ/g,"n");
    word = word.replace(/ﻻ/g,"lo");
    word = word.replace(/ﺎ/g,"a");
    word = word.replace(/ﺻ/g,"ts");
    word = word.replace(/ﺑ/g,"ts");
    word = word.replace(/ﺩ/g,"d");
    word = word.replace(/غ/g,"ɣ");
    word = word.replace(/ﺽ/g,"dˤ");
    word = word.replace(/ﺽ/g,"zˤ");
    word = word.replace(/ﺦ/g,"x");
    word = word.replace(/ﺲ/g,"ʃ");
    word = word.replace(/ﻔ/g,"f");
    word = word.replace(/ﻋ/g,"ɣ");
    word = word.replace(/ﻎ/g,"ɣ");
    word = word.replace(/ﻍ/g,"ɣ");
    word = word.replace(/ﻐ/g,"ɣ");
    word = word.replace(/ﺉ/g,"ji");
    word = word.replace(/ﻠ/g,"l");
    word = word.replace(/ﺏ/g,"b");
    word = word.replace(/ﻏ/g,"ɣ");
    word = word.replace(/ﻫ/g,"n");
    word = word.replace(/ف/g,"f");
    word = word.replace(/ﻪ/g,"h");
    word = word.replace(/ق/g,"q");
    word = word.replace(/ﻘ/g,"q");
    word = word.replace(/ك/g,"k");
    word = word.replace(/ك/g, "k");
    word = word.replace(/ﺴ/g, "ʃ");
    word = word.replace(/ل/g,"l");
    word = word.replace(/ﻝ/g,"l");
    word = word.replace(/م/g,"m");
    word = word.replace(/ﻢ/g,"m");
    word = word.replace(/ﻣ/g,"m");
    word = word.replace(/ن/g,"n");
    word = word.replace(/ﻦ/g,"n");
    word = word.replace(/ﺑ/g,"b");
    word = word.replace(/ه/g,"h");
    word = word.replace(/و/g,"w");
    word = word.replace(/ي/g,"j");
    word = word.replace(/ﻩ/g,"h");
    word = word.replace(/ﻬ/g,"h");
    word = word.replace(/ﺪ/g,"d");
    word = word.replace(/ة/g,"ta");
    word = word.replace(/ﺓ/g,"ta");
    word = word.replace(/ﺓ/g,"ta");
    word = word.replace(/ﺔ/g,"q");
    word = word.replace(/ﻘ/g,"q");
    word = word.replace(/ﻗ/g,"q");
    word = word.replace(/ﺔ/g,"q");
    word = word.replace(/ﺮ/g,"r");
    word = word.replace(/ﺮ/g,"r");
    word = word.replace(/أ/g,"ʔ");
    word = word.replace(/ﺋ/g,"ʔ");
    word = word.replace(/ﺂ/g,"ʔa:");
    word = word.replace(/ﺸ/g,"ʃ");
    word = word.replace(/ﺍ/g,"a");
    word = word.replace(/ﺘ/g,"t");
    word = word.replace(/ﻴ/g,"ji");
    word = word.replace(/ﻮ/g,"w");
    word = word.replace(/ﻭ/g,"w");
    word = word.replace(/ﺬ/g,"ð");
    word = word.replace(/ﻚ/g,"k");
    word = word.replace(/ﻧ/g,"n");
    word = word.replace(/ﺗ/g,"t");
    word = word.replace(/ﻭ/g,"w");
    word = word.replace(/ﺍ/g,"ʔ");
    word = word.replace(/ﻌ/g,"ʔ");
    word = word.replace(/ﻕ/g,"q");
    word = word.replace(/ﺋ/g,"n");
    word = word.replace(/ﺒ/g,"b");
    word = word.replace(/ﺐ/g,"b");
    word = word.replace(/ﻣ/g,"m");
    word = word.replace(/ﺘ/g,"t");
    word = word.replace(/ﻤ/g,"m");
    word = word.replace(/ء/g,"ʔ");
    word = word.replace(/ﻼ/g,"la");
    word = word.replace(/ئ/g,"ʔ");
    word = word.replace(/ﻉ/g,"ʔ");
    word = word.replace(/ﺕ/g,"t");
    word = word.replace(/ﻥ/g,"n");
    word = word.replace(/ﻦ/g,"n");
    word = word.replace(/ﻨ/g,"n");
    word = word.replace(/ﻡ/g,"m");
    word = word.replace(/ﺐ/g,"b");
    word = word.replace(/ب/g,"b");
    word = word.replace(/د/g,"d");
    word = word.replace(/ص/g,"sˤ");
    word = word.replace(/ﺻ/g,"sˤ");
    word = word.replace(/ض/g,"dˤ");
    word = word.replace(/ط/g,"tˤ");
    word = word.replace(/ظ/g,"zˤ");
    word = word.replace(/ﺧ/g,"x");
    word = word.replace(/ر/g,"r");
    word = word.replace(/ﺳ/g,"s");
    word = word.replace(/ﻑ/g,"f");
    word = word.replace(/ﺷ/g,"ʃ");
    word = word.replace(/ﻒ/g,"f");
    word = word.replace(/ﺝ/g,"g");
    word = word.replace(/ﺰ/g,"z");
    word = word.replace(/إ/g,"aʔ");
    word = word.replace(/ﻌ/g,"ʔ");
    word = word.replace(/آ/g,"ʔaː");
    word = word.replace(/ﺁ/g,"ʔaː");
    word = word.replace(/ﺄ/g,"ʔaː");
    word = word.replace(/ﺎ/g,"ʔaː");
    word = word.replace(/ﺊ/g,"ji");
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
    if (word === undefined) {return word;}
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
        if (phonEntry[key] === "" || /^\s$/.test(phonEntry[key])) {
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
        /*
        if (key === "ar") {
            word = transEntry[key];
            translation = arabicToIPA(word);
            phonEntry[key] = translation;
            if (translation !== undefined) {
                console.log(key + " " +translation);
            }
        }
        */
    });
    return phonEntry;
}

function main() {
    var //fileContents = io.fileRead("sortedComboList.txt"),
        fileContents = io.fileRead("comboUniqList-mega.txt"),
        wordLines = stringToWordLines(fileContents),
        mainWords = wordOfEachLine(0, wordLines),
        transJSON = io.fileRead("genTransX.json.bak"),
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
