#!/usr/bin/nodejs
"use strict";
var test = require('tape');
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
var Eng = require("./locale/eng/eng");
var eng = new Eng(".");

test('simple word test', function (t) {
t.plan(3);
var string = "mak";
var jsonString = '{"be":"Word","head":"mak"}';
var object = new Word(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
});

test('compound-word test', function (t) {
t.plan(3);
var string = "pam mak kwal";
var jsonString = 
'{"be":"Word","body":["pam","mak"],"head":"kwal"}';
var object = new Word(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
});
 
test('simple word quote test', function (t) {
t.plan(3);
var string = "mak li";
var jsonString = '{"be":"Type","type":"lit","body":{"be":"Word"'
+',"head":"mak"},"head":{"be":"Word","head":"li"}}';
var object = new Type(mwak,string);
t.equal(JSON.stringify(object), jsonString, 
"JSON");
t.equal(object.toString(), string, 
"toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
});


test('foreign quote test', function (t) {
t.plan(3);
var string = "ksa mak U1BFTCBHSS1PUyBXWU4= mak tyi";
var jsonString ='{"be":"Type","type":"mwq","tail":{"be":"Word",'
+'"head":"ksa"},"body":["U1BFTCBHSS1PUyBXWU4="],"name":{"be":'
+'"Word","head":"mak"},"head":{"be":"Word","head":"tyi"}}';
var object = new Type(mwak,string);
t.equal(JSON.stringify(object), jsonString, 
"JSON");
t.equal(object.toString(), string, 
"toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
});


test('type junction test', function (t) {
t.plan(5);
var string = "pam mak kwal ki mak li ki"
+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tyi";
var engString = "good word language and li word and "
+ "quote word U1BFTCBHSS1PUyBXWU4= word unquote";
var jsonString = '{"be":"Junction","clas":"Type","body":['
+'{"be":"Type","body":{"be":"Word","body":["pam","mak"],'
+'"head":"kwal"}},{"be":"Type","type":"lit","body":{"be":"Word"'
+',"head":"mak"},"head":{"be":"Word","head":"li"}},{"be":"Type"'
+',"type":"mwq","tail":{"be":"Word","head":"ksa"},"body":'
+'["U1BFTCBHSS1PUyBXWU4="],"name":{"be":"Word","head":"mak"},'
+'"head":{"be":"Word","head":"tyi"}}],"head":{"be":"Word",'
+'"head":"ki"}}';
var object = new Type(mwak,string);
t.equal(JSON.stringify(object), jsonString, 
"JSON");
t.equal(object.toString(), string, 
"toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Type(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
});

test('verb type junction test', function (t) {
t.plan(5);
var string = "pam mak kwal ki mak li ki"
+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tyi hi ";
var engString = "be language word good and li word and "
+ "quote word U1BFTCBHSS1PUyBXWU4= word unquote ";
var jsonString = '{"be":"Phrase","body":{"be":"Junction","clas":"Type","body":[{"be":"Type","body":{"be":"Word","body":["pam","mak"],"head":"kwal"}},{"be":"Type","type":"lit","body":{"be":"Word","head":"mak"},"head":{"be":"Word","head":"li"}},{"be":"Type","type":"mwq","tail":{"be":"Word","head":"ksa"},"body":["U1BFTCBHSS1PUyBXWU4="],"name":{"be":"Word","head":"mak"},"head":{"be":"Word","head":"tyi"}}],"head":{"be":"Word","head":"ki"}},"head":{"be":"Word","head":"hi"}}';
var object = new Phrase(mwak,string);
t.equal(JSON.stringify(object), jsonString, 
"JSON");
t.equal(object.toString(), string, 
"toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Phrase(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
});

test('noun phrase test', function (t) {
t.plan(5);
var string = "mak kwal hu ";
var engString = "su word language ";
var jsonString = '{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["mak"],"head":"kwal"}},"head":{"be":"Word","head":"hu"}}';
var object = new Phrase(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
var object = new Phrase(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
});

test('verb phrase test', function (t) {
t.plan(5);
var string = "fyas kat hi ";
var engString = "be get phrase ";
var jsonString = '{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["fyas"],"head":"kat"}},"head":{"be":"Word","head":"hi"}}';
var object = new Phrase(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Phrase(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
});


test('phrase junction test', function (t) {
t.plan(5);
var string = "pam mak kwal ta ki mak li ta ki"
+" ksa mak U1BFTCBHSS1PUyBXWU4= mak tyi ta ";
var engString = "to good word language and to li word and "
+ "to quote word U1BFTCBHSS1PUyBXWU4= word unquote ";
var jsonString = '{"be":"Junction","clas":"Phrase","body":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["pam","mak"],"head":"kwal"}},"head":{"be":"Word","head":"ta"}},{"be":"Phrase","body":{"be":"Type","type":"lit","body":{"be":"Word","head":"mak"},"head":{"be":"Word","head":"li"}},"head":{"be":"Word","head":"ta"}},{"be":"Phrase","body":{"be":"Type","type":"mwq","tail":{"be":"Word","head":"ksa"},"body":["U1BFTCBHSS1PUyBXWU4="],"name":{"be":"Word","head":"mak"},"head":{"be":"Word","head":"tyi"}},"head":{"be":"Word","head":"ta"}}],"head":{"be":"Word","head":"ki"}}';
var object = new Type(mwak,string);
t.equal(JSON.stringify(object), jsonString, 
"JSON");
t.equal(object.toString(), string, 
"toString");
t.equal(object.toLocaleString(mwak), string, 
"toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Type(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
});

test('sub clause test', function (t) {
t.plan(5);
var string = "pult tcan ha kwa mi hi ";
var engString = "be me that-which ob old tree ";
var jsonString =
'{"be":"Phrase","clause":{"be":"Clause","body":{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["pult"],"head":"tcan"}},"head":{"be":"Word","head":"ha"}}],"nominal":true},"head":{"be":"Word","head":"kwa"}},"body":{"be":"Type","head":{"be":"Word","head":"mi"}},"head":{"be":"Word","head":"hi"}}';
var object = new Phrase(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Phrase(eng,engString);
t.equal(JSON.stringify(object), jsonString, "JSON English");
});


test('top clause test', function (t) {
t.plan(4);
var string = "si hu lis ha ku si mwa myan hi pac twa ya";
var engString = "if su them ob live then joy be soft with them ya";
var jsonString =
'{"be":"Sentence","phrases":[{"be":"TopClause","body":{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","head":{"be":"Word","head":"si"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lis"}},"head":{"be":"Word","head":"ha"}}],"nominal":true},"head":{"be":"Word","head":"ku"}},{"be":"TopClause","body":{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["si","mwa"],"head":"myan"}},"head":{"be":"Word","head":"hi"}}],"mood":{"be":"Word","head":"pac"}},"head":{"be":"Word","head":"twa"}}],"head":{"be":"Word","head":"ya"},"nominal":true}'
;
var object = new Sentence(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Sentence(eng,engString);
var jsonObject = JSON.parse(jsonString);
var match = new Sentence(mwak,jsonObject);
//t.true(match.equals(mwak,object), "JSON English");
});

test('subordinate text test', function (t) {
t.plan(4);
var string = "si hu lis ha ku si mwa myan hi pac twa ya";
var engString = "if su them ob live then joy be soft with them ya";
var jsonString =
'{"be":"Sentence","phrases":[{"be":"TopClause","body":{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","head":{"be":"Word","head":"si"}},"head":{"be":"Word","head":"hu"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"lis"}},"head":{"be":"Word","head":"ha"}}],"nominal":true},"head":{"be":"Word","head":"ku"}},{"be":"TopClause","body":{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","body":["si","mwa"],"head":"myan"}},"head":{"be":"Word","head":"hi"}}],"mood":{"be":"Word","head":"pac"}},"head":{"be":"Word","head":"twa"}}],"head":{"be":"Word","head":"ya"},"nominal":true}'
;
var object = new Sentence(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Sentence(eng,engString);
var jsonObject = JSON.parse(jsonString);
var match = new Sentence(mwak,jsonObject);
//t.true(match.equals(mwak,object), "JSON English");
});


test('hello world test', function (t) {
t.plan(4);
var string = "ksa fyas hello world fyas tyi ha say hi ya";
var engString = "be say ob quote phrase hello world phrase"
+ " unquote ya";
var jsonString =
'{"be":"Sentence","phrases":[{"be":"Phrase","body":{"be":"Type","type":"mwq","tail":{"be":"Word","head":"ksa"},"body":["hello","world"],"name":{"be":"Word","head":"fyas"},"head":{"be":"Word","head":"tyi"}},"head":{"be":"Word","head":"ha"}},{"be":"Phrase","body":{"be":"Type","body":{"be":"Word","head":"say"}},"head":{"be":"Word","head":"hi"}}],"head":{"be":"Word","head":"ya"}}';
var object = new Sentence(mwak,string);
t.equal(JSON.stringify(object), jsonString, "JSON");
t.equal(object.toString(), string, "toString");
t.equal(object.toLocaleString(mwak), string, "toLocaleString");
t.equal(object.toLocaleString(eng), engString, 
"toLocaleString English");
var object = new Sentence(eng,engString);
var jsonObject = JSON.parse(jsonString);
var match = new Sentence(mwak,jsonObject);
//t.true(match.equals(mwak,object), "JSON English");
});
