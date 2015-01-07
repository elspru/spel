//exports.hello = hello;
"use strict"
var io = require("../lib/wio");
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Phrase = require("../class/phrase");
var Sentence = require("../class/sentence");
var Type = require("../class/type");
var Text = require("../class/text");
var Dictionary = require("../lang/dictionary");
var Grammar = require("../lang/grammar");
var Language = require("../lang/language");
var Word = require("../class/word");

var /*Elem*/ mainArea =  document.getElementById("main");
var /*Elem*/ infoArea =  document.getElementById("info");
var synMode = false;

infoUpdate("<blink>be flow download ob file ya</blink>");
var mwakFile = io.fileRead("../vocab/mwak.txt");
var engFile = io.fileRead("../vocab/eng.txt");
var spaFile = io.fileRead("../vocab/spa.txt");
var fraFile = io.fileRead("../vocab/fra.txt");
var rusFile = io.fileRead("../vocab/rus.txt");
var epoFile = io.fileRead("../vocab/epo.txt");
var cmnFile = io.fileRead("../vocab/cmn.txt");
var javsFile = io.fileRead("../vocab/javs.txt");
infoUpdate("<blink>be flow load ob file ya</blink>");
var mwak = new Language();
var mwakText = new Text(mwak,mwakFile);
var engText = new Text(mwak,engFile);
var spaText = new Text(mwak,spaFile);
var fraText = new Text(mwak,fraFile);
var rusText = new Text(mwak,rusFile);
var epoText = new Text(mwak,epoFile);
var cmnText = new Text(mwak,cmnFile);
infoUpdate("<blink>be flow load ob language ya</blink>");
var grammar = new Grammar();
var engDict = new Dictionary(mwak,engText);
var spaDict = new Dictionary(mwak,spaText);
var fraDict = new Dictionary(mwak,fraText);
var rusDict = new Dictionary(mwak,rusText);
var epoDict = new Dictionary(mwak,epoText);
var cmnDict = new Dictionary(mwak,cmnText);
infoUpdate("");

function themeSet(mode){
var cssElem = document.querySelector( "link[rel=stylesheet]");
if (mode === "day") cssElem.href = "spel-day.css";
else cssElem.href = "spel-night.css";
}

var HtmlFormat = { newline: "<br/>"};
var synesthesia = require("../lang/synesthesia");
var htmlSynGlyphsTransform = 
synesthesia.htmlSynGlyphsTransform;
var htmlTypeGlyphsTransform =
synesthesia.htmlTypeGlyphsTransform;
synSet("off");
syntaxSet("on");
function synSet(mode){
if (mode === "on"){
HtmlFormat.glyphsTransform = htmlSynGlyphsTransform;
synMode = true;}
else {
HtmlFormat.glyphsTransform = undefined;
synMode = false;}
}

function syntaxSet(mode){
if (mode === "on")
HtmlFormat.typeGlyphsTransform = htmlTypeGlyphsTransform;
else 
HtmlFormat.typeGlyphsTransform = undefined;
}


var engWordOrder = {
	headFinal : false,
	verbFinal : true,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","tua",".u",".i","ta",".a"]
};
var fraWordOrder = {
	headFinal : false,
	verbFinal : false,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","tua",".u",".i","nia","ta",".a"]
};
var cmnWordOrder = {
	headFinal : true,
	verbFinal : true,
	typeFinal : true,
	postpositional : true,
	clauseInitial: true,
	genitiveInitial: true,
	phraseOrder: ["sla","ku","tua",".u",".i","nia","ta",".a"]
};
var JavsFormat = { 
newline: "<br/>",
phraseHeadJoiner: ':',
phraseJoiner: ',',
phrasesStart: '({',
phrasesEnd: '})'
};
var javsWordOrder = {
	headFinal : false,
	verbFinal : false,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["ku","tua",".i"]
};

var engGrammar = new Grammar(engWordOrder,engDict);
var spaGrammar = new Grammar(fraWordOrder,spaDict);
var fraGrammar = new Grammar(fraWordOrder,fraDict);
var rusGrammar = new Grammar(engWordOrder,rusDict);
var epoGrammar = new Grammar(engWordOrder,epoDict);
var cmnGrammar = new Grammar(cmnWordOrder,cmnDict);
var eng = new Language(engGrammar,engDict);
var spa = new Language(spaGrammar,spaDict);
var fra = new Language(fraGrammar,fraDict);
var rus = new Language(rusGrammar,rusDict);
var epo = new Language(epoGrammar,epoDict);
var cmn = new Language(cmnGrammar,cmnDict);
var mwakCode = "mwak";
var engCode = "eng";
var spaCode = "spa";
var fraCode = "fra";
var rusCode = "rus";
var epoCode = "epo";
var cmnCode = "cmn";
var jsonCode = "json";
var jsCode = "js";
var lang;
var /*Elem*/ toLangChoice = document.getElementById("toLang");
var /*Elem*/ fromLangChoice=document.getElementById("fromLang");
var toLangCode = engCode, 
    fromLangCode = mwakCode,
    inLangCode = engCode;
var toLangL = eng, 
    fromLangL = eng,
    inLangL = eng,
    dictLangL = eng;
var dictShown = false;
var syntaxInfoShown = false;
var synInfoShown = false;
function hello(text){
	return text;
}
function mainUpdate(input){
	mainArea.innerHTML = input;
}
function infoUpdate(input){
	// set output
	infoArea.innerHTML = input;
	// clear shown variables
	dictShown = false;
	syntaxInfoShown = false;
	synInfoShown = false;
}
function inputSubmit(userInput){
	infoUpdate("");//clear info
	mainUpdate("");//clear main
	var fromLangv = fromLangChoice.value;
	if (fromLangv === engCode)
		fromLangL = eng;
	else if (fromLangv === spaCode)
		fromLangL = spa;
	else if (fromLangv === fraCode)
		fromLangL = fra;
	else if (fromLangv === rusCode)
		fromLangL = rus;
	else if (fromLangv === epoCode)
		fromLangL = epo;
	else if (fromLangv === cmnCode)
		fromLangL = cmn;
	else if (fromLangv === mwakCode)
		fromLangL = mwak;
// make text object from input
try{ 
var textObject = new Text(fromLangL,userInput); }
catch (error){
infoUpdate(error);
noError = false;
}
// select multiple languages and output all in sequence
var /*Elem*/ toLangChoice = document.getElementById("toLang");
var toLangLength=toLangChoice.options.length;
var i, option;
infoUpdate("<blink>be flow translate ya</blink>");
mainUpdate("");
var translation = new String();
for (i=0;i<toLangLength;i++){
if( toLangChoice.options[i].selected){
var toLangv = toLangChoice.options[i].value;
if (toLangv === jsonCode){
translation = translation +"json: "
+ JSON.stringify(textObject);}
else if (toLangv === jsCode){
translation = translation +"js: " 
+ translate.toJavascript(textObject);
}
else {
if (toLangv === engCode) toLangL = eng;
else if (toLangv === spaCode) toLangL = spa;
else if (toLangv === fraCode) toLangL = fra;
else if (toLangv === rusCode) toLangL = rus;
else if (toLangv === epoCode) toLangL = epo;
else if (toLangv === cmnCode) toLangL = cmn;
else if (toLangv === mwakCode) toLangL = mwak;
var noError= true;
try{
var trans = textObject.toLocaleString(toLangL, HtmlFormat);
translation = translation + toLangv+': ' +trans;
} 
catch (error){
infoUpdate(error);
noError = false;
}
}
mainUpdate(translation);
if (noError)
infoUpdate("ha :-D 😃  su translation be success ya");
}}
}

function init(){
// algorithm:
// 	put listeners on main language selector
// 	put listeners on dictionary viewer
// 	put listeners on theme selector
// 	put listeners on syntax highlighting selector 
// 	put listeners on synesthezia selector
// 	put listeners on compilation buttons


// 	put listeners on main language selector
var inLangSelect = document.getElementById("inLang");
inLangSelect.addEventListener("change",function(){
	var inLangV = inLangSelect.value;
if (inLangV === jsonCode)
infoUpdate(JSON.stringify(dictDefs));
else{
	if (inLangV === engCode)
		inLangL = eng;
	else if (inLangV === spaCode)
		inLangL = spa;
	else if (inLangV === fraCode)
		inLangL = fra;
	else if (inLangV === rusCode)
		inLangL = rus;
	else if (inLangV === epoCode)
		inLangL = epo;
	else if (inLangV === cmnCode)
		inLangL = cmn;
	else if (inLangV === mwakCode)
		inLangL = mwak;
var dictString = dictDefs.toLocaleString(inLangL, HtmlFormat);
infoUpdate(dictString);}
dictShown = true;
},false);
// 	put listeners on dictionary viewer
var dictButton = document.getElementById("dict");
var dictDefs = mwakText;
dictButton.onclick = function(){
if (dictShown === false){
var dictString = dictDefs.toLocaleString(inLangL, HtmlFormat);
infoUpdate(dictString);
dictShown = true;}
else {if (dictShown === true)
infoUpdate("");
dictShown = false;}
}


// 	put listeners on theme selector
var themeModeElem = document.getElementById( "theme");
themeModeElem.addEventListener("change",function(){
var themeMode = themeModeElem.value;
themeSet(themeMode);
},false);
// 	put listeners on syntax highlighting selector 
var syntaxModeElem = document.getElementById( "syntax");
syntaxModeElem.addEventListener("change",function(){
var syntaxMode = syntaxModeElem.value;
syntaxSet(syntaxMode);
infoUpdate("click translate to apply changes");
},false);

var syntaxInfo = document.getElementById( "syntaxInfo");
syntaxInfo.addEventListener("click",function(){
if (syntaxInfoShown === false){
infoUpdate('syntax highlighting consists of <br/>'
+'<span class="sh">sentence head</span><br/>'
+'<span class="ch">phrase head  </span><br/>'
+'<span class="th">type head  </span><br/>'
+'<span class="gh">genitive head  </span><br/>'
+'<span class="jh">junction head  </span><br/>'
+'<span class="lh">clause head  </span><br/>'
+'<span class="mh">mood </span> ya <br/>');
syntaxInfoShown = true;
} else infoUpdate('');
},false);
// 	put listeners on synesthezia selector
var synButton = document.getElementById("syn");
synButton.addEventListener("change",function(){
var synModeElem = document.getElementById("syn");
var synMode = synModeElem.value;
synSet(synMode);
infoUpdate("click translate to apply changes");
},false);

var synInfo = document.getElementById( "synInfo");
synInfo.addEventListener("click",function(){
if (synInfoShown === false){
infoUpdate('<p>Synesthesia training can boost IQ '
+'as shown in the study by University of Sussex ob <a '
+'href="http://www.nature.com/srep/2014/141118/srep07089/full/srep07089.html">'
+'Adults Can Be Trained to Acquire Synesthetic Experiences</a>.'
+'</p><p>'
+'The synesthesia here is based on the study by MIT ob '
+'<a href="http://web.mit.edu/synesthesia/www/trends.html">'
+'Trends in colored letter synesthesia</a> '
+'and maximizing hue distance between similar looking glyphs '
+'and similar sounding phonemes.</p>');
synInfoShown = true;
} else infoUpdate('');
},false);
// 	put listeners on compilation buttons
	var inputForm = document.querySelector(
			"input#submitButton");
	inputForm.addEventListener("click",function(){
	var /*Elem*/ userInputEl = document.getElementById(
		"inputText");
	var /*String*/ userInput = userInputEl.value;
	inputSubmit(userInput);
	},false);
}
//window.onload = init;
init();
