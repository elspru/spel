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
    hof = require("../../lib/hof"),
    es6 = require("es6-shim"),
    allTransLangs = [
        "zh", "en", "hi", "sw",   "id", "es", "ar", "bn", 
        "ru", "ko", "pt", "tr",   "pa", "vi", "de", "fa", 

        "fr", "mr", "ta", "te",   "gu", "ur", "am", "it", 
        "pl", "kn", "ml", "my",   "ro", "az", "nl", "hu", 

        "ku", "si", "ne", "el",   "cs", "sv", "ka"
        ],
    //allTransLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
    //    "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
    //    "fi", "el", "ka", "cy", "pl", "sr", "lt", "es"],
    //allPhonLangs = ["en", "zh", "hi", "sw", "de", "sv", "ar",
    //    "id", "vi", "tr", "ru", "ta", "fa", "fr", "pt", "it",
    //    "fi", "el", "ka", "cy", "pl", "sr", "lt", "zhy", "es"],
    allPhonLangs = [
        "zh", "en", "hi", "sw",   "id", "es", "ar", "bn", 
        "ru", "ko", "pt", "tr",   "pa", "vi", "de", "fa", 

        "fr", "mr", "ta", "te",   "gu", "ur", "am", "it", 
        "pl", "kn", "ml", "my",   "ro", "az", "nl", "hu", 

        "ku", "si", "ne", "el",   "cs", "sv", "ka", "zhy"
        ],
    /* 
      Indo-European 45.72% {
        Indo-Aryan 18.76% {
          Central {
            Hindi   (hi)  4.46%,
            Urdu    (ur)  0.99%,
            Haryanvi  (bgc) 0.21%,
            Awadhi    (awa) 0.33%,
            Chhattisgarhi (hne) 0.19%,
            Dakhini   (dcc) 0.17%
          }
          Eastern {
            Bengali (bn)  3.05%,
            Odia    (or)  0.50%,
            Maithili  (mai) 0.45%,
            Bhojpuri (bho) 0.43%,
            Chittagonian (ctg) 0.24%,
            Assamese    (as)  0.23%,
            Magadhi   (mag) 0.21%,
            Sylheti   (syl) 0.16%,
          }
          North Western {
            Punjabi (pa)  1.44%,
            Saraiki   (skr) 0.26%,
            Sindhi    (sd)  0.39%,
          }
          Western {
            Gujarati (gu)  0.74%,
            Marwari   (mwr) 0.21%,
            Dhundari  (dhd) 0.15%,
          }
          Southern {
            Marathi (mr)  1.1%,
            Sinhalese (si)  0.25%, 
            Konkani (kok) 0.11%,
          }
          Northern {
            Nepali    (ne)  0.25%,
          }
          Indo-Aryan Remainder (IAR) 2.24
        }
        Germanic {
          English (en)  5.52%,
          German  (de)  1.39%,
          Dutch   (nl)  0.32%,
          Swedish (sv)  0.13%
        }
        Italic {
          Spanish   (es)  5.85%
          Portuguese (pt) 3.08%
          French    (fr)  1.12% 
            Haitian Creole (ht) 0.15%
          Italian   (it)  0.9%
          Romanian  (ro)  0.37%
        }
        Iranian {
          Persian (fa)  0.68%,
          Pashto  (ps)  0.58%,
          Kurdish (ku)  0.31%,
          Balochi (bal) 0.11%,
          
        }
        Slavic {
          Russian   (ru)  2.42%
          Polish    (pl)  0.61%
          Ukranian  (uk) 0.46%
          Serbo-Croation (hbs)  0.28%
          Czech     (cs)  0.15%
          Belarussian (be) 0.11%
        }
        Hellenic {
          Greek   (el)  0.18%
        }
        European Remainder  2.24
      }
      Sino-Tibetan 21.12% {
        Mandarin  (zh)  14.1%,
        Wu        (wu)  1.2%,
        Cantonese (zhy) 0.89%,
        Jin       (cjy) 0.72%,
        South Min (nan) 0.71%,
        Xiang     (hsn) 0.58%,
        Myanmar   (my)  0.50%,
        Hakka     (hak) 0.46%,
        Gan       (gan) 0.33%,
        North Min (mnp) 0.16%,
        East Min  (cdo) 0.14%,
        Sino-Tiberan Remainder (STR)  1.33
      }
      Hmong-Mien {
        Hmong   (hmx) 0.13%
      }
      Niger-Congo 6.93% {
        Swahili
        Yoruba    (yo)  0.42%,
        Fula      (ff)  0.37%,
        Igbo      (ig)  0.36%,
        Chewa     (ny)  0.17%,
        Akan      (ak)  0.17%,
        Zulu      (zu)  0.16%,
        Kinyarwanda (rw)  0.15%,
        Kirundi   (rn)  0.13%,
        Shona     (sn)  0.13%,
        Mossi     (mos) 0.11%,
        Xhosa     (xh)  0.11%,
        Niger-Congo Remainder (NCR) 4.65
      }
      Afro-asiatic 6.33% {
        Arabic    (ar)  4.23%,
        Hausa     (ha)  0.52%,
        Amharic   (am)  0.37%,
        Oromo     (om)  0.36%,
        Somali    (so)  0.22%,
        Afro-Asiatic Remainder (AR) 0.63
      }
      Austronesian 4.99% {
        Indonesian  (id)  1.16%,
        Javanese    (jv)  1.25%,
        Sundanese   (su)  0.57%,
        Tagalog     (tl)  0.42%,
        Cebuano     (ceb) 0.32%,
        Malagasy    (mg)  0.28%,
        Madurese    (mad) 0.23%,
        Ilocano     (ilo) 0.14%,
        Hiligaynon  (hil) 0.12%,
        Austronesian Remainder (ANR) 0.5
      }
      Dravidian   3.5% {
        Telugu    (tl) 1.15%,
        Tamil     (ta) 1.06%,
        Kannada   (kn) 0.58%,
        Malaylam  (ml) 0.57%
        Dravidian Remainder (DR) 0.14
      }
      Turkic 2.64% {
        Turkish   (tr)  0.95%,
        Uzbek     (uz)  0.39%,
        Azerbajani (az) 0.34%, 
        Turkmen   (tk)  0.24%, 
        Kazakh    (kk)  0.17%,
        Uyghur    (ug)  0.12%,
        Turkic Remainder (TR) 0.43
      }
      Japonic 1.99% {
        Japanese  (jp)  1.92%
        Japonic Remainder (JR) 0.07
      }
      Austro-Asiatic 1.58% {
        Vietnamese  (vi)  1.14%,
        Khmer       (km)  0.24%
        Austro Asiatic Remainder (AAR) 0.2
      }
      Tai-Kadai 1.24% {
        Thai  (th) 0.86% 
        Zhuang (za) 0.24%
        Tai-Kadai Remainder (TKR) 0.14
      }
      Koreanic 1.19% {
        Korean  1.14%
        Koreanic Remainer (KR)  0.05
      }
      Uralic 0.32% {
        Hungarian   (hu)  0.19
        Uralic Remainder (UR)   0.13
      }
      Kartvelian 0.08% {
        Georgian
      }
      total 97.63%
      
      Native Speakers
      
    */
    NativeWeights = {
      "zh": 14.1 + /*wu*/ 1.2% + /*cjy*/ 0.72 + /*hsn*/ 0.58 + /*hak*/ 0.46 +
            /*gan*/ 0.33 + /*mnp*/ 0.16 +/*cdo*/ 0.14 + /*hmx*/ 0.13 + 
            /*STR*/ 1.33,
      "es": 5.85, 
      "en": 5.52 + /*ER*/ 2.24, 
      "hi": 4.46  + /*awa*/ 0.33 + /*bgc*/ 0.21 + /*hne*/ 0.19 + 
            /*dcc*/  0.17 + /*IAR*/ 2.24,
      "ar": 4.23 + /*ha*/ 0.52 + /*AR*/ 0.63, "pt": 3.08, 
      "bn": 3.05 + /*ctg*/ 0.24 + /*as*/ 0.23 + /*bho*/ 0.43 + /*mai*/ 0.45 +
           /*or*/ 0.5  + /*mag*/ 0.21,
      "ru": 2.42 + /*uk*/ 0.46 + /*be*/ 0.11 + /*hbs*/ 0.28,
      "pa": 1.44 + /*skr*/ 0.26 + /*sd*/ 0.39 , 
      "de": 1.39, 
      "id": 1.16 + /*jv*/ 1.25 + /*th*/ 0.86 + /*su*/ 0.57 + /*tl*/ 0.42 +
            /*ceb*/ 0.32 + /*mg*/ 0.28 + /*mad*/ 0.23 + /*ilo*/ 0.14 + 
            /*hil*/ 0.12 + /*ANR*/ 0.5 + /*TKR*/ 0.14,
      "te": 1.15,
      "ta": 1.06 + /*DR*/ 0.14,
      "vi": 1.14 + /*km*/ 0.24 + /*AAR*/ 0.2,
      "ko": 1.14 + /*jp*/ 1.92 + /*JR*/ 0.07 + /*KR*/ 0.05, 
      "fr": 1.12 + /*ht*/ 0.15, "mr": 1.1 + /*kok*/ 0.11, 
      "ur": 0.99, 
      "tr": 0.95 + /*uz*/ 0.39 + /*tk*/ 0.24 + /*ug*/ 0.12 +/*TR*/ 0.43, 
      "it": 0.9, 
      "zhy": 0.89 + /*nan*/ 0.71, 
      "gu": 0.74 + /*mwr*/ 0.21 + /*dhd*/ 0.15, 
      "fa": 0.68 + /*ps*/ 0.58 + /*bal*/ 0.11, 
      "pl": 0.61, "kn": 0.58, 
      "ml": 0.57, "my": 0.50, 
      "sw": /*yo*/ 0.42 + /*ff*/ 0.37 + /*ny*/ 0.17 + /*ak*/ 0.17 + 
            /*rw*/ 0.15 + /*rn*/ 0.13 + /*sn*/ 0.13 + /*mos*/ 0.11 +
            /*xh*/ 0.11 + /*NCR*/ 4.65,
      "am": 0.37 + /*om*/ 0.36 + /*so*/ 0.22, "ro": 0.37,  
      "az": 0.34, "nl": 0.32, "ku": 0.31,
      "ne": 0.25, "si": 0.25, 
      "hu": 0.19 + /*UR*/ 0.13, "el": 0.18,
      "cs": 0.15, "sv": 0.13, "ka": 0.08
    },
    EuroWeights = {"hi": 0, "zh": 0, "en": 840, "sw": 0,
        "ar": 0, "es":  490, "id": 0, "tr": 0, "ru": 325,
        "fr":  220, "ta": 0, "fa": 0, "pt": 200, "de": 145,
        "zhy": 0, "vi": 0, "it": 64, "pl": 57, "sr": 32,
        "fi": 28, "sv": 21, "ka": 5, "el": 13, "lt": 5, "cy": 2
        },
    WorldWeights = {"en": 2000, "hi": 1500/*indo-aryan*/, "zh": 1300,
        "sw": 850/*niger-congo*/, "ar": 585, "es":  560, "id": 486, 
        "tr": 377, "ru": 325, "fr":  229, "ta": 210, "fa": 200, 
        "pt": 200, "de": 145, "zhy": 70, "vi": 70, "it": 64, 
        "pl": 57, "sr": 32, "fi": 28, "sv": 21, "ka": 5, 
        "el": 13, "lt": 5, "cy": 2
        },
    langWeights = NativeWeights,
    gramList = {},
    rootList = {},
    consonantList = "mkypwnstlhf.crbgdzjvqx18",
    finalConsonantList = "ptkfscqmnxbdgzjv",
    secondConsonantList = "fscyrwlxzjv",
    vowelList = "iaueo6",
    toneList = "7_",
    PhonEntry = function () {
        this.en = "";
    },
    RootPhonEntry = function () {
        this.consonants = {};
        this.vowels = {};
        this.initialConsonants = {};
        this.middleConsonants = {};
        this.finalConsonants = {};
        this.tone = {};
    };
function arrayUnique(a) {
    return a.reduce(function (p, c) {
        if (p.indexOf(c) < 0) {
            p.push(c);
        }
        return p;
    }, []);
}
function addTypeOfGlyphToObj(glyphList, obj, weight, glyph) {
    if (obj && glyphList.indexOf(glyph) > -1) {
        if (obj[glyph] === undefined) {
            obj[glyph] = 0;
        }
        obj[glyph] += weight;
    }
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

function ipaTo16Glyph(word) {
/*
var Bit4Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c"];
// c = /ʃ/
// y = /j/
// . = /ʔ/
//  note su glyph . ob only used for grammar ya
// h = /h/
//  note su glyph h ob only used for grammar ya
*/
  word = word.toLowerCase();
    var Bit4Alphabet =     ["m","k","i","a","y","u","p","w",
                           "n","s","t","l","h","f",".","c"],
        matchReplaceArray = [
  /* arabic overflow */
        ["ي", "aj"], ["ﺶ", "s"], ["ﺷ", "s"], ["ﺷ", "s"],
        ["ت", "t"], ["ؤ", ""], ["ن", "n"], ["ﺗ", "t"], 
        ["س", "s"], ["ط", "tˤ"], ["ﻷ", "lo"], ["ا", "a"], 
        ["ﺔ", "t"], ["ﺃ", "ʔ"],  ["ﺒ", "p"], ["ﺬ", "t"], 

        ["ﺚ", "t"], ["ة", "t"], ["ل", "l"],["ﻟ", "l"],
        ["ﺰ", "s"], ["ﺥ", "k"], ["ﻜ", "k"], ["ﺻ","sˤ"],
        ["ب","b"], ["ﻨ","n"], ["ر","r"], ["ﻦ","n"], 
        ["ى", "aj"],["ﻗ","q"], ["ث","t"], ["ﺤ","ħ"], 

        ["ك", "k"], ["ﺴ", "s"],["ع","ʕ"], ["م","ʕ"], 
        ["ﻔ","f"], ["ﺨ","x"], ["ﻝ","l"], ["ج","dʒ"],
        ["ﻱ","j"], ["ق","g"], ["ﺧ","x"], ["ﺜ",""],
        ["ﻥ","n"], [String.fromCharCode(0x64b),"n"],
        ["ﺎ","a"], ["ﺋ","ʔ"], ["ﺸ","ʃ"], ["ﺍ","a"],
        ["ﻀ","ð"], ["ﻮ","w"], ["ﻃ","tˤ"], ["ح","h"],
        ["ﺯ","z"], ["ﺟ","dʒ"],["ﺠ","dʒ"], ["ﻲ","j"],
        ["ﻠ","l"], ["ﻻ","lo"],["و", "w"], ["ﻤ","m"],
        ["ﻴ","ji"], ["ﻅ","zˤ"],  ["ﺂ","ʔa:"],
        [String.fromCharCode(0x64f),"u"],
        ["ﻸ","lo"], ["ف","f"],   ["ﺼ","sˤ"], ["ﺆ","ʔ"],
        ["ﺈ","aʔ"],  ["ﻺ","lo"],  ["ﺫ","ð"], ["ﻐ","ɣ"],
        ["ﺮ","r"], ["ﻰ","ji"], ["ش","ʃ"],  ["ز","z"],
        ["ص","sˤ"],  ["خ","x"], ["ﻳ","ja"], ["ذ","ð"],
        ["ه","h"],   ["ض","dˤ"], ["ﻸ","la"], 
        ["4",""],  ["ئ","ʔ"], ["د","d"],
    /* punctuation */
        ["\\" + String.fromCharCode(0x5D), ""],
        ["\\" + String.fromCharCode(91), ""],
        [String.fromCharCode(0x200B), ""],
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""],
        ["ˌ", ""], [",", ""], ["\\.", ""], ["\\^", ""], ["-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""], 
        ["\n", ""], [":", ""], [String.fromCharCode(797), ""],
        [String.fromCharCode(0x27), ""], ["[0-9]", ""],
        [String.fromCharCode(778), ""], ["7", ""], ["\\+", ""],
        ["`", ""], [String.fromCharCode(771), ""],
        ["1", ""], [String.fromCharCode(809), ""],
        [String.fromCharCode(1548), ""],
        [String.fromCharCode(0xfeff), ""],
        [String.fromCharCode(0x32a), ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"], ["e", "i"], ["i̪", "i"], ["ʏ", "i"],
        ["E", "i"], ["I", "i"], ["ᵻ", "i"],
        ["ɛ", "a"], ["ɜ", "a"], ["æ", "a"], ["ɑ̃", "a"],
        ["ã", "a"], ["ʌ", "a"], ["ɑ", "a"], ["ɐ̃", "a"],
        ["ɐ", "a"], ["ɒ", "a"], ["A", "a"], 
        ["o", "u"], ["ɵ", "u"], ["ɔ", "u"], ["ʉ", "u"],
        ["ø", "u"], ["œ̃", "u"], ["œ", "u"], ["ũ", "u"],
        ["ɯ", "u"], ["õ", "u"], ["U", "u"],
        ["ə", ""],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
    /** consonants **/
    /* plosives */
        ["b", "p"],
        ["ð", "t"], ["ʈ", "t"], ["ɗ", "t"], ["ɖ", "t"],
        ["t̪", "t"], ["ʈ", "t"], ["d", "t"],
        ["c", "k"], ["ɟ", "k"], ["ʔ", "k"], ["q", "k"],
        ["ɡ", "k"], ["ˀ", "k"], ["g", "k"],
        /* approximants */
        ["ɥ", "yw"],
        ["ʊ", "w"], /* w like vowel */ 
        ["v", "w"], ["β", "f"], ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"], ["L", "l"], 
        ["j", "y"], ["ʲ", "y"], ["ʁ", "y"], ["ɾ", "y"],
        ["ɹ", "y"], ["ɻ", "y"], ["ɚ", "y"], ["r", "y"],
        ["R", "y"],
        /* fricatives */
        ["θ", "f"],
        ["z", "s"], ["S", "s"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʒ", "c"], ["ʂ", "c"],
        ["ʐ", "c"], ["ç", "c"], ["ʝ", "c"], ["ɕ", "c"],
        ["ʑ", "c"], ["ɣ", "c"], ["x", "c"], ["ħ", "c"],
        ["ʰ", "c"], ["h", "c"], ["ʕ", "c"], ["ʕ", "c"],
        ["؟", "c"], ["ˤ", "c"], ["χ", "c"], 
        /* nasals */
        ["m̩", "m"],
        ["ŋ", "n"], ["ɳ", "n"], ["ɲ", "n"]
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    word.split("").forEach(function (glyph) {
      if(Bit4Alphabet.indexOf(glyph) < 0) {
        console.log("glyph `" + glyph + "' #" + 
                    glyph.charCodeAt(0).toString(16));
        throw new Error("16glyph word not fully converted " + word);
      }
    });
    return word;
}

function finalConsonantConvert(glyphAr) {
  var matchReplaceArray = [
    ["q","n"], 
    ["b","p"], ["d", "t"], ["g", "k"],
    ["v","f"], ["z", "s"], ["j", "c"]
  ];
  matchReplaceArray.forEach(function (tuple) {
    var match = tuple[0],
        replace = tuple[1];
    glyphAr = glyphAr.map(function (glyph){
      if (glyph === match) {
        return replace;
      } 
      return glyph;
    });
  });
  return glyphAr;
}

function addGlyphs(obj, glyphWord, weight) {
    var length = glyphWord.length,
        glyphAr = glyphWord.split(""),
        segmentLength = Math.ceil(length / 3),
        initialStart = 0,
        middleStart = Math.floor(length / 3),
        finalStart = length - (segmentLength + 1),
        initialSegment = arrayUnique(glyphAr.
                slice(initialStart, segmentLength)),
        middleSegment = arrayUnique(glyphAr.slice(middleStart,
            (segmentLength + middleStart))),
        finalSegment = arrayUnique(finalConsonantConvert(
                  glyphAr.slice(finalStart, length)));
            //arrayUnique(ipaTo16Glyph(glyphAr
            //.slice(finalStart, length).join("")).split(""));
    /* consonants */
    glyphAr = arrayUnique(glyphAr);
    glyphAr.forEach(function (glyph) {
        addTypeOfGlyphToObj(consonantList, obj.consonants,
                weight, glyph);
    });
    /* vowels*/
    glyphAr.forEach(function (glyph) {
        addTypeOfGlyphToObj(vowelList, obj.vowels,
                weight, glyph);
        addTypeOfGlyphToObj(toneList, obj.tone,
                weight, glyph);
    });
    initialSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(consonantList,
                obj.initialConsonants, weight, glyph);
    });
    middleSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(secondConsonantList,
                obj.middleConsonants, weight, glyph);
    });
    finalSegment.forEach(function (glyph) {
        addTypeOfGlyphToObj(finalConsonantList,
                obj.finalConsonants, weight, glyph);
    });
}
function ipaTo24Glyph(word) {
/*
var Glyph24Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c",
                    "e","o","r","b","g","d","z","j"];
// c = /ʃ/
// j = /ʒ/
// y = /j/
// . = /ʔ/
//  note su glyph . ob only used for grammar ya
// h = /h/
//  note su glyph h ob only used for grammar ya
*/
  word = word.toLowerCase();
    var Glyph24Alphabet =     ["m","k","i","a","y","u","p","w",
                        "n","s","t","l","h","f",".","c",
                    "e","o","r","b","g","d","z","j"],
        matchReplaceArray = [
  /* arabic overflow */
        ["ي", "aj"], ["ﺶ", "s"], ["ﺷ", "s"], ["ﺷ", "s"],
        ["ت", "t"], ["ؤ", ""], ["ن", "n"], ["ﺗ", "t"], 
        ["س", "s"], ["ط", "tˤ"], ["ﻷ", "lo"], ["ا", "a"], 
        ["ﺔ", "t"], ["ﺃ", "ʔ"],  ["ﺒ", "p"], ["ﺬ", "t"], 

        ["ﺚ", "t"], ["ة", "t"], ["ل", "l"],["ﻟ", "l"],
        ["ﺰ", "s"], ["ﺥ", "k"], ["ﻜ", "k"], ["ﺻ","sˤ"],
        ["ب","b"], ["ﻨ","n"], ["ر","r"], ["ﻦ","n"], 
        ["ى", "aj"],["ﻗ","q"], ["ث","t"], ["ﺤ","ħ"], 

        ["ك", "k"], ["ﺴ", "s"],["ع","ʕ"], ["م","ʕ"], 
        ["ﻔ","f"], ["ﺨ","x"], ["ﻝ","l"], ["ج","dʒ"],
        ["ﻱ","j"], ["ق","g"], ["ﺧ","x"], ["ﺜ",""],
        ["ﻥ","n"], [String.fromCharCode(0x64b),"n"],
        ["ﺎ","a"], ["ﺋ","ʔ"], ["ﺸ","ʃ"], ["ﺍ","a"],
        ["ﻀ","ð"], ["ﻮ","w"], ["ﻃ","tˤ"], ["ح","h"],
        ["ﺯ","z"], ["ﺟ","dʒ"],["ﺠ","dʒ"], ["ﻲ","j"],
        ["ﻠ","l"], ["ﻻ","lo"],["و", "w"], ["ﻤ","m"],
        ["ﻴ","ji"],  ["ﻅ","zˤ"],  ["ﺂ","ʔa:"],
        [String.fromCharCode(0x64f),"u"],
        ["ﻸ","lo"],  ["ف","f"], ["ﺼ","sˤ"],  ["ﺆ","ʔ"],
        ["ﺈ","aʔ"], ["ﻺ","lo"],  ["ﺫ","ð"], ["ﻐ","ɣ"],
        ["ﺮ","r"], ["ﻰ","ji"],  ["ش","ʃ"], ["ز","z"],
        ["ص","sˤ"], ["خ","x"],  ["ﻳ","ja"],  ["ذ","ð"],
 
        ["ه","h"],  ["ض","dˤ"],
        ["4",""],  ["ئ","ʔ"],  ["ﻸ","la"],
        /* punctuation */
        ["\\" + String.fromCharCode(0x5D), ""],
        ["\\" + String.fromCharCode(91), ""],
        [String.fromCharCode(0x200B), ""],
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""], [",", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        ["\n", ""], [":", ""], [String.fromCharCode(797), ""],
        [String.fromCharCode(0x27), ""],  ["[0-9]", ""],
        [String.fromCharCode(778), ""], ["7", ""], ["\\+", ""],
        ["`", ""], [String.fromCharCode(771), ""],
        ["1", ""], [String.fromCharCode(809), ""],
        [String.fromCharCode(1548), ""],
        [String.fromCharCode(0xfeff), ""],
        [String.fromCharCode(0x32a), ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"], ["ᵻ", "i"], ["I", "i"], ["ʏ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"], ["E", "e"], 
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"], ["A", "a"], ["ɒ", "o"], 
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"], ["O", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", ""], ["U", "u"],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", "k"],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["ɥ", "yw"],
        ["v", "w"], ["β", "w"], ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"], ["L", "l"], 
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"], /* espeak for ʀ */ ["R", "r"], 
        /* fricatives */
        ["S", "s"],
        ["θ", "f"],
        ["ʰ", "c"], ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"],
        ["ç", "c"], ["ɕ", "c"], ["x", "c"], ["ħ", "c"],
        ["h", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["ɣ", "j"], ["ʕ", "j"], ["ʕ", "j"], ["؟", "j"],
        ["ˤ", "j"], ["χ", "j"],
        /* nasals */
        ["m̩", "m"],
        ["ŋ", "n"], ["ɳ", "n"], ["ɲ", "n"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    word.split("").forEach(function (glyph) {
      if(Glyph24Alphabet.indexOf(glyph) < 0) {
        console.log("glyph `" + glyph + "' #" + 
                    glyph.charCodeAt(0).toString(16));
        throw new Error("24Glyph word not fully converted " + word);
      }
    });
    return word;
}

function ipaTo28Glyph(word) {
/*
// c = /ʃ/
// j = /ʒ/
// y = /j/
// q = /ŋ/
// 6 = /ə/
// . = /ʔ/ // glotal stop only used for grammar ya
// h = /h/ // glotal fricative only used for grammar ya
*/
  word = word.toLowerCase();
    var Glyph28Alphabet = [ "m","k","i","a", "y","u","p","w",
                            "n","s","t","l", "h","f",".","c",
  
                         "e","o","r","b", "g","d","z","j",
                         "v","q","6","x"],
        matchReplaceArray = [
  /* arabic overflow */
        ["ي", "aj"], ["ﺶ", "s"], ["ﺷ", "s"], ["ﺷ", "s"],
        ["ت", "t"], ["ؤ", ""], ["ن", "n"], ["ﺗ", "t"], 
        ["س", "s"], ["ط", "tˤ"], ["ﻷ", "lo"], ["ا", "a"], 
        ["ﺔ", "t"], ["ﺃ", "ʔ"],  ["ﺒ", "p"], ["ﺬ", "t"], 

        ["ﺚ", "t"], ["ة", "t"], ["ل", "l"],["ﻟ", "l"],
        ["ﺰ", "s"], ["ﺥ", "k"], ["ﻜ", "k"], ["ﺻ","sˤ"],
        ["ب","b"], ["ﻨ","n"], ["ر","r"], ["ﻦ","n"], 
        ["ى", "aj"],["ﻗ","q"], ["ث","t"], ["ﺤ","ħ"], 

        ["ك", "k"], ["ﺴ", "s"],["ع","ʕ"], ["م","ʕ"], 
        ["ﻔ","f"], ["ﺨ","x"], ["ﻝ","l"], ["ج","dʒ"],
        ["ﻱ","j"], ["ق","g"], ["ﺧ","x"], ["ﺜ",""],
        ["ﻥ","n"], [String.fromCharCode(0x64b),"n"],
        ["ﺎ","a"], ["ﺋ","ʔ"], ["ﺸ","ʃ"], ["ﺍ","a"],
        ["ﻀ","ð"], ["ﻮ","w"], ["ﻃ","tˤ"], ["ح","h"],
        ["ﺯ","z"], ["ﺟ","dʒ"],["ﺠ","dʒ"], ["ﻲ","j"],
        ["ﻠ","l"], ["ﻻ","lo"],["و", "w"], ["ﻤ","m"],
        ["ﻴ","ji"], ["ﻅ","zˤ"], ["ﺂ","ʔa:"],
        [String.fromCharCode(0x64f),"u"],
        ["ﻸ","lo"], ["ف","f"],  ["ﺼ","sˤ"],  ["ﺆ","ʔ"],
        ["ﺈ","aʔ"],  ["ﻺ","lo"],  ["ﺫ","ð"], ["ﻐ","ɣ"],
        ["ﺮ","r"], ["ﻰ","ji"],  ["ش","ʃ"],  ["ز","z"],
        ["ص","sˤ"],  ["خ","x"],  ["ﻳ","ja"],  ["ذ","ð"],

        ["ه","h"], ["ئ","ʔ"],
        ["4",""],  ["ض","dˤ"], ["ﻸ","la"],
        /* punctuation */
        ["\\" + String.fromCharCode(0x5D), ""],
        ["\\" + String.fromCharCode(91), ""],
        [String.fromCharCode(0x200B), ""],
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""], [",", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        ["\n", ""], [":", ""], [String.fromCharCode(797), ""],
        [String.fromCharCode(0x27), ""],  ["[0-9]", ""],
        [String.fromCharCode(778), ""], ["7", ""], ["\\+", ""],
        ["`", ""], [String.fromCharCode(771), ""],
        ["1", ""], [String.fromCharCode(809), ""],
        [String.fromCharCode(1548), ""],
        [String.fromCharCode(0xfeff), ""],
        [String.fromCharCode(0x32a), ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"], ["ᵻ", "i"], ["I", "i"], ["ʏ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"], ["E", "e"],
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"], ["A", "a"], ["ɒ", "o"], 
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"], ["O", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", "6"], ["U", "u"],
        /* tones */
        ["˨", ""], ["˩", ""],
        ["˥", ""], ["˦", ""],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", "k"],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["ɥ", "yw"],
        ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"], ["L", "l"],
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"],/* espeak for ʀ */ ["R", "r"], 
        /* fricatives */
        ["S", "s"],
        ["v", "v"], ["β", "b"],
        ["θ", "f"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"], ["ç", "c"],
        ["ɕ", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["x", "x"], ["ħ", "x"], ["h", "x"], ["ʰ", "x"],
        ["ɣ", "x"], ["ʕ", "x"], ["ʕ", "x"], ["؟", "x"],
        ["ˤ", "x"], ["χ", "x"],
        /* nasals */
        ["m̩", "m"],
        ["ɳ", "n"],
        ["ŋ", "q"], ["ɲ", "q"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    word.split("").forEach(function (glyph) {
      if(Glyph28Alphabet.indexOf(glyph) < 0) {
        console.log("glyph `" + glyph + "' #" + 
                    glyph.charCodeAt(0).toString(16));
        throw new Error("28Glyph word not fully converted " + word);
      }
    });
    return word;
}

function ipaTo32Glyph(word) {
/*
// c = /ʃ/
// j = /ʒ/
// y = /j/
// q = /ŋ/
// 6 = /ə/
// 7 = /˦/ // high tone for rare words
// _ = /˨/ // low tone for rare words
// 1 = /ǀ/ // dental click for temporary words
// 8 = /ǁ/ // lateral click for temporary words
// . = /ʔ/ // glotal stop only used for grammar ya
// h = /h/ // glotal fricative only used for grammar ya
*/
  word = word.toLowerCase();
    var Bit5Alphabet =  ["m","k","i","a", "y","u","p","w",
                         "n","s","t","l", "h","f",".","c",
                         "e","o","r","b", "g","d","z","j",
                         "v","q","7","_", "6","x","1","8"],
        matchReplaceArray = [
  /* arabic overflow */
        ["ي", "aj"], ["ﺶ", "s"], ["ﺷ", "s"], ["ﺷ", "s"],
        ["ت", "t"], ["ؤ", ""], ["ن", "n"], ["ﺗ", "t"], 
        ["س", "s"], ["ط", "tˤ"], ["ﻷ", "lo"], ["ا", "a"], 
        ["ﺔ", "t"], ["ﺃ", "ʔ"],  ["ﺒ", "p"], ["ﺬ", "t"], 

        ["ﺚ", "t"], ["ة", "t"], ["ل", "l"],["ﻟ", "l"],
        ["ﺰ", "s"], ["ﺥ", "k"], ["ﻜ", "k"], ["ﺻ","sˤ"],
        ["ب","b"], ["ﻨ","n"], ["ر","r"], ["ﻦ","n"], 
        ["ى", "aj"],["ﻗ","q"], ["ث","t"], ["ﺤ","ħ"], 

        ["ك", "k"], ["ﺴ", "s"],["ع","ʕ"], ["م","ʕ"], 
        ["ﻔ","f"], ["ﺨ","x"], ["ﻝ","l"], ["ج","dʒ"],
        ["ﻱ","j"], ["ق","g"], ["ﺧ","x"], ["ﺜ",""],
        ["ﻥ","n"], [String.fromCharCode(0x64b),"n"],
        ["ﺎ","a"], ["ﺋ","ʔ"], ["ﺸ","ʃ"], ["ﺍ","a"],
        ["ﻀ","ð"], ["ﻮ","w"], ["ﻃ","tˤ"], ["ح","h"],
        ["ﺯ","z"], ["ﺟ","dʒ"],["ﺠ","dʒ"], ["ﻲ","j"],
        ["ﻠ","l"], ["ﻻ","lo"],["و", "w"], ["ﻤ","m"],
        ["ﻴ","ji"],  ["ﻅ","zˤ"],  ["ﺂ","ʔa:"],
        [String.fromCharCode(0x64f),"u"],
        ["ﻸ","lo"], ["ف","f"],  ["ﺼ","sˤ"], ["ﺆ","ʔ"],
        ["ﺈ","aʔ"],  ["ﻺ","lo"],  ["ﺫ","ð"], ["ﻐ","ɣ"],
        ["ﺮ","r"], ["ﻰ","ji"],  ["ش","ʃ"],  ["ز","z"],
        ["ص","sˤ"],  ["خ","x"],  ["ﻳ","ja"],  ["ذ","ð"],

        ["ه","h"],  ["ض","dˤ"],
        ["4",""],  ["ئ","ʔ"],  ["ﻸ","la"],
        /* punctuation */
        [String.fromCharCode(0x200B), ""],
        ["\\" + String.fromCharCode(0x5D), ""],
        ["\\" + String.fromCharCode(91), ""],
        ["\\(..\\)", ""], ["\\(...\\)", ""], ["ˈ", ""], [",", ""],
        ["ˌ", ""], ["\\.", ""], ["\\^", ""], ["\\-", ""],
        ["_", ""], ['"', ""], ["ː", ""], [" ", ""],
        ["\n", ""], [":", ""], [String.fromCharCode(797), ""],
        [String.fromCharCode(0x27), ""],  ["[0-9]", ""],
        [String.fromCharCode(778), ""], ["7", ""], ["\\+", ""],
        ["`", ""], [String.fromCharCode(771), ""],
        ["1", ""], [String.fromCharCode(809), ""],
        [String.fromCharCode(1548), ""],
        [String.fromCharCode(0xfeff), ""],
        [String.fromCharCode(0x32a), ""],
        /* vowels */
        ["y", "i"], ["Y", "i"], ["ɪ", "i"], ["ĩ", "i"],
        ["ɨ", "i"], ["ᵻ", "i"], ["I", "i"], ["ʏ", "i"],
        ["e", "e"], ["ɛ", "e"], ["ɜ", "e"], ["ø", "e"],
        ["œ̃", "e"], ["œ", "e"], ["E", "e"],
        ["æ", "a"], ["ɑ̃", "a"], ["ã", "a"], ["ɑ", "a"],
        ["ɐ̃", "a"], ["ɐ", "a"], ["A", "a"], ["ɒ", "o"], 
        ["ʌ", "o"], ["o", "o"], ["ɔ", "o"], ["ɵ", "o"],
        ["õ", "o"],
        ["ʊ", "u"], ["ʉ", "u"], ["ũ", "u"], ["ɯ", "u"],
        ["ə", "6"],
        /* tones */
        ["˨", "_"], ["˩", "_"],
        ["˥", "7"], ["˦", "7"],
        ["˧", ""],
        /** consonants **/
        /* plosives */
        ["ʈ", "t"], ["t̪", "t"], ["ʈ", "t"],
        ["ð", "d"], ["ɗ", "d"], ["ɖ", "d"], ["d", "d"],
        ["b", "b"],
        ["c", "k"], ["q", "k"], ["ʔ", "k"], ["ˀ", ""],
        ["ɟ", "g"], ["g", "g"], ["ɡ", "g"],
        /* approximants */
        ["ɥ", "yw"],
        ["w̃", "w"], ["ʋ", "w"],
        ["l̩", "l"], ["ɫ", "l"], ["ɬ", "l"], ["ɭ", "l"],
        ["ʎ", "l"], ["L", "l"],
        ["j", "y"], ["ʲ", "y"],
        ["ɾ", "r"], ["ɹ", "r"], ["ɻ", "r"], ["ɚ", "r"],
        ["ʁ", "r"],/* espeak for ʀ */ ["R", "r"],
        /* fricatives */
        ["S", "s"],
        ["v", "v"], ["β", "b"],
        ["θ", "f"],
        ["ʃ", "c"], ["ʃ", "c"], ["ʂ", "c"], ["ç", "c"],
        ["ɕ", "c"],
        ["ʒ", "j"], ["ʐ", "j"], ["ʑ", "j"], ["ʝ", "j"],
        ["x", "x"], ["ħ", "x"], ["h", "x"], ["ʰ", ""],
        ["ɣ", "x"], ["ʕ", "x"], ["ʕ", "x"], ["؟", "x"],
        ["ˤ", ""],  ["χ", "x"],
        /* nasals */
        ["m̩", "m"],
        ["ɳ", "n"],
        ["ŋ", "q"], ["ɲ", "q"],
    ];
    matchReplaceArray.forEach(function (tuple) {
        var match = new RegExp(tuple[0], "g"),
            replace = tuple[1];
        word = word.replace(match, replace);
    });
    word.split("").forEach(function (glyph) {
      if(Bit5Alphabet.indexOf(glyph) < 0) {
        console.log("glyph `" + glyph + "' #" + 
                    glyph.charCodeAt(0).toString(16));
        throw new Error("32Glyph word not fully converted " + word);
      }
    });
    return word;
}
function objToArray(obj) {
    var objArray = [];
    if (obj) {
        Object.keys(obj).forEach(function (key) {
            objArray.push([key, obj[key]]);
        });
    }
    return objArray;
}

function sortByWeight(glyphWeightObj) {
    var objArray = [],
        resultArray = [];
    Object.keys(glyphWeightObj).forEach(function (key) {
        objArray.push([key, glyphWeightObj[key]]);
    });
    objArray.sort(function (first, match) {
        return (first[1] - match[1]);
    });
    objArray.reverse();
    objArray.forEach(function (elem) {
        resultArray.push(elem[0]);
    });
    return resultArray;
}
function addWeighted(typeList, startElem) {
    var result = [],
        start = startElem[0],
        weight = startElem[1];
    Object.keys(typeList).forEach(function (key) {
        var end = key,
            endWeight = typeList[key],
            entry = [start + end, endWeight + weight];
        result.push(entry);
    });
    return result;
}
//function addWeight(weightedArray, weight) {
//    return weightedArray.map(function (elem) {
//        elem[1] += weight;
//        return elem;
//    });
//}
function averageWeight(weightedArray) {
    return weightedArray.map(function (elem) {
        var wordLength = elem[0].length,
            weight = elem[1];
        if (elem[0][0] === "h" || 
                elem[0][wordLength-1] === "h") {
            wordLength -= 1;
        }
        if (wordLength > 0) {
            /*jslint bitwise:true*/
            elem[1] = weight / wordLength | 0;
        }
        return elem;
    });
}
function addH(elem) {
    var word = elem[0];
    elem[0] = word+"h";
    return elem;
}
function genGram(rootPhonEntry, gramLength) {
    var rpn = rootPhonEntry,
        vowelsList = rpn.vowels,
        initialList = rpn.initialConsonants,
        secondList = rpn.middleConsonants,
        //finalList = rpn.finalConsonants,
        tonesList = rpn.tone,
        initialListAr = objToArray(initialList),
        wordList = [],
        cvList = initialListAr,
        csvList = initialListAr,
        cvtList,
        csvtList;
    if (gramLength !== 3) {
        cvList = cvList.expand(addWeighted.curry(vowelsList));
        wordList = wordList.concat(cvList);
        if (tonesList && Object.keys(tonesList).length > 0) {
            cvtList = cvList.expand(addWeighted.  curry(tonesList));
            wordList = wordList.concat(cvtList);
        }
    }
    if (gramLength !== 2) {
        csvList = csvList.expand(addWeighted.curry(secondList));
        csvList = csvList.expand(addWeighted.curry(vowelsList));
        if (tonesList && Object.keys(tonesList).length > 0) {
            csvtList = csvList.expand(addWeighted.curry(tonesList));
            csvtList = csvtList.map(addH);
            wordList = wordList.concat(csvtList);
        }
        csvList = csvList.map(addH);
        wordList = wordList.concat(csvList);
    }
    averageWeight(wordList);
    wordList = wordList.sort(function (first, match) {
        return parseInt(match[1], 10) - parseInt(first[1], 10);
    });
    return wordList;
}
function addInitialH(elem) {
    var word = elem[0];
    elem[0] = "h" + word;
    return elem;
}
function genRoot(rootPhonEntry) {
    var rpn = rootPhonEntry,
        vowelsList = rpn.vowels,
        initialList = rpn.initialConsonants,
        secondList = rpn.middleConsonants,
        finalList = rpn.finalConsonants,
        tonesList = rpn.tone,
        initialListAr = objToArray(initialList),
        wordList = [],
        cvfList = initialListAr,
        csvfList = initialListAr,
        cvtfList,
        csvtfList;
    cvfList = cvfList.expand(addWeighted.curry(vowelsList));
    csvfList = csvfList.expand(addWeighted.curry(secondList));
    csvfList = csvfList.expand(addWeighted.curry(vowelsList));
    if (tonesList && Object.keys(tonesList).length > 0) {
        cvtfList = cvfList.expand(addWeighted.curry(tonesList));
        csvtfList = csvfList.expand(addWeighted.curry(tonesList));
        cvtfList = cvtfList.expand(addWeighted.curry(finalList));
        csvtfList = csvtfList.expand(addWeighted.curry(finalList));
        cvtfList = cvtfList.map(addInitialH);
        wordList = wordList.concat(cvtfList);
        wordList = wordList.concat(csvtfList);
    }
    cvfList = cvfList.expand(addWeighted.curry(finalList));
    csvfList = csvfList.expand(addWeighted.curry(finalList));
    cvfList = cvfList.map(addInitialH);
    wordList = wordList.concat(cvfList);
    wordList = wordList.concat(csvfList);
    averageWeight(wordList);
    wordList = wordList.sort(function (first, match) {
        return parseInt(match[1], 10) - parseInt(first[1], 10);
    });
    return wordList;
}

function addWordToList(word, phonEntry, wordArray, availList, typeList) {
    /* if  already in list then don't add it */
    Function.prototype(phonEntry);
    var i = 0,
        wordArrayLength = wordArray.length,
        langWordElem,
        langWord,
        weight,
        availIndex;
    for (i = 0; i < wordArrayLength; i += 1) {
        langWordElem = wordArray[i];
        langWord = langWordElem[0];
        weight = langWordElem[1];
        availIndex =  availList.indexOf(langWord);
        if (availIndex > -1) {
            if (typeList["X" + word] === undefined) {
                typeList["X" + word] = [langWord, weight];
                   // phonEntry.hi, phonEntry.zh];
                availList[availIndex] = undefined;
                availList.splice(availIndex, 1);
                break;
               // console.log(langWord + " " +
               //     availList.indexOf(langWord));
            }
        }
    }
    console.log("ADtL i " + i + " wordArrayLength " + wordArrayLength);
    if (i >= (wordArrayLength - 1)){
        throw new Error(wordArrayLength + " '" + word +
            " "  + JSON.stringify(typeList["X" + word]) + " " + wordArray);
    }
    console.log(word + " " + typeList["X" + word]);
    return availList;
}
function formatDictionary(thesaurus, mainWords) {
    var result = "";
    mainWords.forEach(function (word) {
        if (thesaurus["X" + word]) {
            result += word + ": ";
            result += thesaurus["X" + word][0] + ", ";
            result += thesaurus["X" + word][1];//+ ", ";
            //result += thesaurus["X" + word][2] + ", ";
            //result += thesaurus["X" + word][3];
            result += "\n";
        }
    });
    return result;
}
function removeBlacklisted(wordLines, blacklist) {
    return wordLines.filter(function (line) {
        var word = line[0];
        if (blacklist.indexOf(word) === -1) {
            return true;
        } 
        //console.log(word + " removed");
        return false;
    });
}

function main() {
    function makeWord(line, phonObjX, rootPhonObjX, availableList, rootCount,
                      gramCount, shortGramCount){
        var phonEntry,
        phonWord,
        rootGlyphWord,
        gramGlyphWord,
        rootPhonEntry,
        gramPhonEntry,
        G16GramMax = 144,
        G16ShortGramMax = 33,
        G16RootMax = 960,
        G24GramMax = 450,
        G24ShortGramMax = 85,
        G24RootMax = 3520,
        G28ShortGramMax = 120,
        G28GramMax = 666,
        G28RootMax = 5898,
        someG28Words = ["litre"],
        someG32Words = ["ob-","-oma","iraq",/*"liberia", "litre", "brachylogia", 
            "gamma", "astatine", "xml", "wiki", "topos",
            "trademark",*/ "antessive-case",/* "cocoa", "meter", "bromine", 
            "canada", "adam"*/];
        var word = line[0],
            gram = line[1],
            gramLength = line[2] && parseInt(line[2], 10),
            genedGram,
            present = false;
        if (/^-/.test(word) || /-$/.test(word)) {
          gram = "g";
        }
        phonEntry = phonObjX["X" + word];
        if (phonEntry === undefined) {
            console.log(word + " undefined");
            return false;
        }
        rootPhonEntry = rootPhonObjX["X" + word];
        gramPhonEntry = rootPhonObjX["X" + word];
        if (rootPhonEntry === undefined) {
            rootPhonEntry = new RootPhonEntry();
        }
        if (gramPhonEntry === undefined) {
            gramPhonEntry = new RootPhonEntry();
        }
        // be add ob sub entry for each lang ya
        allPhonLangs.forEach(function (langCode) {
            phonWord = phonEntry[langCode];
            if (phonWord !==  undefined) {
                /*jslint bitwise:true*/
                //console.log("langCode " + langCode);
                if (someG32Words.indexOf(word) > -1 ||
                        rootCount > ((G28RootMax / 1.61) | 0)) {
                    if (someG32Words.indexOf(word) > -1) {
                      console.log("convering " + word + " to 32Glyph");
                    }
                    rootGlyphWord = ipaTo32Glyph(phonWord);
                } else if (someG28Words.indexOf(word) > -1 ||
                        rootCount > ((G24RootMax / 1.61) | 0)
                        ) {
                    rootGlyphWord = ipaTo28Glyph(phonWord);
                } else if (rootCount > ((G16RootMax / 1.61) | 0) 
                        ) {
                    rootGlyphWord = ipaTo24Glyph(phonWord);
                } else {
                    rootGlyphWord = ipaTo16Glyph(phonWord);
                }
                if (someG32Words.indexOf(word) > -1 || (gram &&
                        (gramCount > ((G28GramMax / 1.61) |
                        0))) || (gram && (shortGramCount >
                        ((G28ShortGramMax / 1.61) | 0)))) {
                    gramGlyphWord = ipaTo32Glyph(phonWord);
                } else if ((gram && (gramCount > ((G24GramMax /
                        1.61) | 0))) || (gram && (shortGramCount >
                        ((G24ShortGramMax / 1.61) | 0)))) {
                    gramGlyphWord = ipaTo28Glyph(phonWord);
                } else if ((gram && (gramCount >
                        ((G16GramMax / 1.61) | 0))) ||
                        (gram && (shortGramCount >
                        ((G16ShortGramMax / 1.61) | 0)))) {
                    gramGlyphWord = ipaTo24Glyph(phonWord);
                } else {
                    gramGlyphWord = ipaTo16Glyph(phonWord);
                }
            }
            if (langWeights[langCode] === undefined) {
                throw new Error("undefined langWeight for " +
                    langCode);
            }
            addGlyphs(gramPhonEntry, gramGlyphWord, langWeights[langCode]);
            addGlyphs(rootPhonEntry, rootGlyphWord, langWeights[langCode]);
            if (someG32Words.indexOf(word) > -1) {
              addGlyphs(gramPhonEntry, "7", 0.02);
              addGlyphs(gramPhonEntry, "_", 0.01);
              addGlyphs(rootPhonEntry, "7", 0.02);
              addGlyphs(rootPhonEntry, "_", 0.01);
              console.log("vowels " + JSON.stringify(rootPhonEntry.vowels));
              console.log("tones " + JSON.stringify(rootPhonEntry.tone));
            }
        });
        if (gram === "g" && 
            gramList["X" + word] === undefined) { /* grammar word*/
            if (gramLength !== undefined) {
                Function.prototype();
               // console.log(word + " " + gramLength);
            }
            genedGram =  genGram(gramPhonEntry, gramLength);
            //if (word === "future-tense") {
            //    //console.log(gramLength !== 2);
            //    //console.log(genedGram);
            //}
            availableList = addWordToList(word, phonEntry,
                genedGram, availableList, gramList);
        /* if including all gram words as roots */
            availableList = addWordToList(word, phonEntry,
                genRoot(rootPhonEntry), availableList, rootList);
            if (rootList["X" + word] === undefined ||
                gramList["X" + word] === undefined) {
              throw new Error(word + " not added properly");
            }
        } else if (rootList["X" + word] === undefined) { 
            /* root word*/ 
            availableList = addWordToList(word, phonEntry,
                genRoot(rootPhonEntry), availableList, rootList);
            if (rootList["X" + word] === undefined) {
              throw new Error(word + " not added properly");
            }
        } else {
            console.log(word + " present"); 
            present = true;
        }
        if (present === false) { 
          if (gram !== undefined) {
              gramCount += 1;
              if (gramLength && gramLength === 2) {
                  shortGramCount += 1;
              }
          }
          rootCount += 1;
        }
        rootPhonObjX["X" + word] = rootPhonEntry;
        console.log("shortGramCount " + shortGramCount);
        console.log("gramCount " + gramCount);
        console.log("rootCount " + rootCount);
        return {"gramCount": gramCount, "rootCount": rootCount,
                "shortGramCount": shortGramCount, 
                 "availableList":availableList};
    }
    var fileContents = io.fileRead("comboUniqList-core.txt"),
        midFileContents = io.fileRead("comboUniqList-mid.txt"),
        megaFileContents = io.fileRead("comboUniqList-mega.txt"),
        wordLines = stringToWordLines(fileContents),
        midWordLines = stringToWordLines(midFileContents),
        megaWordLines = stringToWordLines(megaFileContents),
       // wordLines = removeBlacklisted(wordLinesRaw, blacklist),
        //Glyph16File = io.fileRead("16GlyphWordList.txt"),
        //G16Lines = stringToWordLines(Glyph16File),
        //G16List = wordOfEachLine(0, G16Lines),
        Glyph24File = io.fileRead("32GlyphWordList.txt"),
        G24Lines = stringToWordLines(Glyph24File),
        availableList = wordOfEachLine(0, G24Lines),
        mainWords = wordOfEachLine(0, wordLines),
        midMainWords = wordOfEachLine(0, midWordLines),
        megaMainWords = wordOfEachLine(0, megaWordLines),
        phonJSON = io.fileRead("genPhonX.json"),
        phonObjX = JSON.parse(phonJSON),
        //langWordJSON = "{}", //
        langWordJSON = io.fileRead("langWords-mid.json"),
        langWordObj = JSON.parse(langWordJSON),
        //rootPhonJSON = "", //io.fileRead("rootPhon.json"),
        rootPhonObjX = {},
        gramCount = 0,
        rootCount = 0,
        shortGramCount = 0,
        //i = 0,
        //line = [],
        tmpObj = {},
        outObj = {}; //JSON.parse(rootPhonJSON);
        //transEntry,
        //consonantArray,
        //vowelArray,
    if (langWordObj.gramList) {
        gramList = langWordObj.gramList;
    }
    if (langWordObj.rootList) {
        rootList = langWordObj.rootList;
    }
    if (langWordObj.availableList) {
        availableList = langWordObj.availableList;
    }
    if (langWordObj.gramCount) {
        gramCount = langWordObj.gramCount;
    }
    if (langWordObj.shortGramCount) {
        shortGramCount = langWordObj.shortGramCount;
    }
    if (langWordObj.rootCount) {
        rootCount = langWordObj.rootCount;
    }
// core words
    // mainWords.map(getTranslations.curry(transObj));
    //for (i = 0; i << wordLines.length; i++) {
    wordLines.forEach(function (line) {
      console.log("core words");
     // line = wordLines[i];
      if (!rootList["X" + line[0]] /* ||
          (line[1] && !gramList["X" + line[0]])*/) {
        tmpObj = makeWord(line, phonObjX, rootPhonObjX, availableList, rootCount,
                gramCount, shortGramCount);
        gramCount = tmpObj.gramCount;
        rootCount = tmpObj.rootCount;
        shortGramCount = tmpObj.shortGramCount;
        availableList = tmpObj.availableList;
      }
    });
    outObj.mainWords = mainWords;
    outObj.gramList = gramList;
    outObj.rootList = rootList;
    outObj.availableList = availableList;
    outObj.gramCount = gramCount;
    outObj.rootCount = rootCount;
    outObj.shortGramCount = shortGramCount;
    io.fileWrite("gramWords-core.txt",
            formatDictionary(gramList, mainWords));
    io.fileWrite("rootWords-core.txt",
            formatDictionary(rootList, mainWords));
    io.fileWrite("langWords-core.json", JSON.stringify(outObj));
   // }
// mid words
    midWordLines.forEach(function (line) {
      console.log("mid words");
      if (!rootList["X" + line[0]] /*||
          (line[1] && !gramList["X" + line[0]])*/) {
        tmpObj = makeWord(line, phonObjX, rootPhonObjX, availableList, rootCount,
                  gramCount, shortGramCount);
        gramCount = tmpObj.gramCount;
        rootCount = tmpObj.rootCount;
        shortGramCount = tmpObj.shortGramCount;
        availableList = tmpObj.availableList;
      }
    });
    //console.log(gramList);
    //console.log(rootList);
    io.fileWrite("rootPhon.json", JSON.stringify(rootPhonObjX));
    outObj.mainWords = mainWords;
    outObj.gramList = gramList;
    outObj.rootList = rootList;
    outObj.availableList = availableList;
    outObj.gramCount = gramCount;
    outObj.rootCount = rootCount;
    outObj.shortGramCount = shortGramCount;
    io.fileWrite("gramWords-mid.txt",
            formatDictionary(gramList, midMainWords));
    io.fileWrite("rootWords-mid.txt",
            formatDictionary(rootList, midMainWords));
    io.fileWrite("langWords-mid.json", JSON.stringify(outObj));
// mega words
    megaWordLines.forEach(function (line) {
      console.log("mega words");
      if (!rootList["X" + line[0]]/* ||
          (line[1] && !gramList["X" + line[0]])*/) {
        tmpObj = makeWord(line, phonObjX, rootPhonObjX, availableList, rootCount,
                  gramCount, shortGramCount);
        gramCount = tmpObj.gramCount;
        rootCount = tmpObj.rootCount;
        shortGramCount = tmpObj.shortGramCount;
        availableList = tmpObj.availableList;
      }
    });
    //console.log(gramList);
    //console.log(rootList);
    io.fileWrite("rootPhon.json", JSON.stringify(rootPhonObjX));
    outObj.mainWords = mainWords;
    outObj.gramList = gramList;
    outObj.rootList = rootList;
    outObj.availableList = availableList;
    outObj.gramCount = gramCount;
    outObj.rootCount = rootCount;
    outObj.shortGramCount = shortGramCount;
    io.fileWrite("gramWords-mega.txt",
            formatDictionary(gramList, megaMainWords));
    io.fileWrite("rootWords-mega.txt",
            formatDictionary(rootList, megaMainWords));
    io.fileWrite("langWords-mega.json", JSON.stringify(outObj));
}

main();
