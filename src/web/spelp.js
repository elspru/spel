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
function themeSet(mode){
var cssElem = document.querySelector( "link[rel=stylesheet]");
if (mode === "day") cssElem.href = "spel-day.css";
else cssElem.href = "spel-night.css";
}

var HtmlFormat = { newline: "\n<br/> ", lineLength: 0};
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
var dictShown = false;
var syntaxInfoShown = false;
var synInfoShown = false;

function syntaxSet(mode){
if (mode === "on")
HtmlFormat.typeGlyphsTransform = htmlTypeGlyphsTransform;
else 
HtmlFormat.typeGlyphsTransform = undefined;
}
var /*Elem*/ toLangChoice = document.getElementById("toLang");
var /*Elem*/ fromLangChoice=document.getElementById("fromLang");

infoUpdate('<span class="th">be flow load ob file ya</span>');
//setTimeout(localesLoad(),1);
//function localesLoad(){

var mwak = new Language();
var mwakFile = require("../vocab/mwak.txt.json");
var mwakText = new Text(mwak,mwakFile);
var Eng = require("../locale/eng/eng");
var eng = new Eng(".");

// begin browserify requires
require("../locale/zho/zho");
require("../locale/spa/spa");
require("../locale/hin/hin");
require("../locale/ara/ara");
require("../locale/por/por");
require("../locale/rus/rus");
require("../locale/ind/ind");
require("../locale/jpn/jpn");
require("../locale/deu/deu");
require("../locale/ita/ita");
require("../locale/kor/kor");
require("../locale/fra/fra");
require("../locale/tur/tur");
require("../locale/swa/swa");
require("../locale/ukr/ukr");
require("../locale/nld/nld");
require("../locale/hun/hun");
require("../locale/swe/swe");
require("../locale/mwak/mwak");
// end of browserify requires

var langs = [
["eng",eng], ["zho"], ["spa"], ["hin"], ["ara"], ["por"], 
["rus"], ["ind"], ["jpn"], ["deu"], ["ita"], ["kor"], ["fra"],
["tur"], ["swa"], ["ukr"], ["nld"], ["hun"], ["swe"], 
["mwak",mwak]
];

var lang;
var toLangCode = "eng", 
    fromLangCode = "eng",
    inLangCode = "eng";
var toLangL = eng, 
    fromLangL = eng,
    inLangL = eng,
    dictLangL = eng;
infoUpdate("su load be complete ya");
//}
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
function languageGet(code){
var langPairI = langs.find(function(pair){
if (pair[0]===code) return true; else return false; });
if (langPairI === null)
throw Error(code + " be not known ob language code ya ");
var langPair = langs[langPairI];
var lang = langPair[1];
if (!lang){
var Lang = require("../locale/"+code+"/"+code);
lang = new Lang();
langPair[1] = lang;
 }
return lang;
}
function inputSubmit(userInput){
infoUpdate("");//clear info
mainUpdate("");//clear main
var fromLangCode = fromLangChoice.value;
fromLangL = languageGet(fromLangCode);
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
infoUpdate('<span class="th">be flow translate ya</span>');
mainUpdate("");
var translation = new String();
for (i=0;i<toLangLength;i++){
if( toLangChoice.options[i].selected){
var toLangCode = toLangChoice.options[i].value;
if (toLangCode === "json"){
translation = translation +"json: "
+ JSON.stringify(textObject);}
else if (toLangCode === "js"){
translation = translation +"js: " 
+ translate.toJavascript(textObject);
}
else {
toLangL = languageGet(toLangCode);
var noError= true;
try{
var conjugationLevel = 0;
//document.getElementById("conjugationLevel").value;
var trans = textObject.toLocaleString(toLangL,
HtmlFormat,conjugationLevel);
if(toLangCode === "ara")
trans = '<p class="ara">'+trans+'</p>';
translation = translation + toLangCode+': ' +trans;
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
	var inLangCode = inLangSelect.value;
if (inLangCode === "json")
infoUpdate(JSON.stringify(dictDefs));
else{
inLangL = getLanguage(inLangCode);
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
