//exports.hello = hello;
"use strict"
var io = require("../lib/wio");
var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var Phrase = require("../type/phrase");
var Sentence = require("../type/sentence");
var Type = require("../type/type");
var Text = require("../type/text");
var Dictionary = require("../lang/dictionary");
var Grammar = require("../lang/grammar");
var Language = require("../lang/language");
var Word = require("../type/word");

var file = io.fileRead("../vocab/vocab-mwak-C16glyph.txt");
var mwak = new Language();
var text = new Text(mwak,file);
var grammar = new Grammar();
var engDict = new Dictionary(mwak,text);

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
if (mode === "on")
HtmlFormat.glyphsTransform = htmlSynGlyphsTransform;
else 
HtmlFormat.glyphsTransform = undefined;
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
	phraseOrder: [".u",".i","ta",".a"]
};

var engGrammar = new Grammar(engWordOrder,engDict);
var eng = new Language(engGrammar,engDict);
var lang;// = new Language(grammar,dict);
var /*Elem*/ mainArea =  document.getElementById("main");
var /*Elem*/ infoArea =  document.getElementById("info");
var /*Elem*/ toLangChoice = document.getElementById("toLang");
var /*Elem*/ fromLangChoice=document.getElementById("fromLang");
var toLangCode = "en", 
    fromLangCode = "mwak",
    inLangCode = "en";
var toLangL = eng, 
    fromLangL = mwak,
    inLangL = eng;
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
function submitInput(userInput){
	infoUpdate("");//clear info
	mainUpdate("");//clear main
	var fromLangv = fromLangChoice.value;
	var toLangv = toLangChoice.value;
	if (toLangv === "en")
		toLangL = eng;
	if (toLangv === "mwak")
		toLangL = mwak;
	if (fromLangv === "en")
		fromLangL = eng;
	if (fromLangv === "mwak")
		fromLangL = mwak;
	var noError= true;
	try{
	var text = new Text(fromLangL,userInput);
	console.log(JSON.stringify(text));
	var translation = text.toLocaleString(toLangL,
			HtmlFormat);
	} 
	catch (error){
		infoUpdate(error);
		noError = false;
	}
	mainUpdate(translation);
	if (noError)
	infoUpdate("ha :-D 😃  su translation be success ya");
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
// 	put listeners on dictionary viewer
	synSet("off");
	var dictButton = document.getElementById("dict");
	var dictDefs = inLangL.dictionary;
dictButton.onclick = function(){
if (dictShown === false){
infoUpdate(dictDefs.toLocaleString(inLangL, HtmlFormat));
dictShown = true;}
else {if (dictShown === true)
infoUpdate("");
dictShown = false;}
	}
// 	put listeners on theme selector
	var themeButton = document.getElementById(
			"themeButton");
	themeButton.addEventListener("click",function(){
	var themeModeElem = document.getElementById(
			"theme");
	var themeMode = themeModeElem.value;
	themeSet(themeMode);
	},false);
// 	put listeners on syntax highlighting selector 
var syntaxButton = document.getElementById( "syntaxButton");
syntaxButton.addEventListener("click",function(){
var syntaxModeElem = document.getElementById( "syntax");
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
+'<span class="lh">clause head  </span><br/>'
+'<span class="mh">mood </span> ya <br/>');
syntaxInfoShown = true;
} else infoUpdate('');
},false);
// 	put listeners on synesthezia selector
var synButton = document.getElementById("synButton");
synButton.addEventListener("click",function(){
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
	submitInput(userInput);
	},false);
}
//window.onload = init;
init();
