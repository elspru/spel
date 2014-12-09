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

function span(classId,glyph){
return "<span class="+classId+">"+glyph+"</span>";
}

function htmlSynGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph === '.') glyph = span("gs",glyph);
else glyph = span(glyph+'y',glyph);
result+=glyph;
}
return result;
}

function htmlTypeGlyphsTransform(string,type){
if (this.glyphsTransform)
var synResult = this.glyphsTransform(string);
else synResult = string;
return span(type,synResult);
}

function themeSet(mode){
var cssElem = document.querySelector( "link[rel=stylesheet]");
if (mode === "day") cssElem.href = "spel-day.css";
else cssElem.href = "spel-night.css";
}

var HtmlFormat = { newline: "<br/>"};
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
var toLangDict = eng, 
    fromLangDict = mwak,
    inLangDict = eng;
function hello(text){
	return text;
}
function mainUpdate(input){
	mainArea.innerHTML = input;
}
function infoUpdate(input){
	infoArea.innerHTML = input;
}
function submitInput(userInput){
	infoUpdate("");//clear info
	mainUpdate("");//clear main
	var fromLangv = fromLangChoice.value;
	var toLangv = toLangChoice.value;
	if (toLangv === "en")
		toLangDict = eng;
	if (toLangv === "mwak")
		toLangDict = mwak;
	if (fromLangv === "en")
		fromLangDict = eng;
	if (fromLangv === "mwak")
		fromLangDict = mwak;
	try{
	var text = new Sentence(fromLangDict,userInput);
	var translation = text.toLocaleString(toLangDict,
			HtmlFormat);
	} 
	catch (error){
		infoUpdate(error);
	}
	mainUpdate(translation);
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
	var dictDefs =  text.select(mwak,".a");
	dictButton.onclick = function(){
		//infoUpdate(text.toString());
		infoUpdate(dictDefs.toLocaleString(inLangDict,
					HtmlFormat));
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
	var syntaxButton = document.getElementById(
			"syntaxButton");
	syntaxButton.addEventListener("click",function(){
	var syntaxModeElem = document.getElementById(
			"syntax");
	var syntaxMode = syntaxModeElem.value;
	syntaxSet(syntaxMode);
	},false);
// 	put listeners on synesthezia selector
	var synButton = document.getElementById(
			"synButton");
	synButton.addEventListener("click",function(){
	var synModeElem = document.getElementById(
			"syn");
	var synMode = synModeElem.value;
	synSet(synMode);
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
