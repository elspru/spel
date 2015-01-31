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

infoUpdate("<blink>be flow load ob file ya</blink>");
//setTimeout(localesLoad(),1);
//function localesLoad(){
var mwak = new Language();
var mwakFile = require("../vocab/mwak.txt.json");
var mwakText = new Text(mwak,mwakFile);
var Eng = require("../locale/eng/eng");
var eng = new Eng(".");
console.log("english language loaded");
var Cmn = require("../locale/cmn/cmn");
var cmn = new Cmn(".");
console.log("mandarin language loaded");
var Spa = require("../locale/spa/spa");
var spa = new Spa(".");
console.log("spanish language loaded");
var Hin = require("../locale/hin/hin");
var hin = new Hin(".");
console.log("hindi language loaded");
var Ara = require("../locale/ara/ara");
var ara = new Ara(".");
console.log("arabic language loaded");
var Por = require("../locale/por/por");
var por = new Por(".");
console.log("portuguese language loaded");
var Rus = require("../locale/rus/rus");
var rus = new Rus(".");
console.log("russian language loaded");
var Ind = require("../locale/ind/ind");
var ind = new Ind(".");
console.log("indonesian language loaded");
var Jpn = require("../locale/jpn/jpn");
var jpn = new Jpn(".");
console.log("japanese language loaded");
var Deu = require("../locale/deu/deu");
var deu = new Deu(".");
console.log("german language loaded");
var Ita = require("../locale/ita/ita");
var ita = new Ita(".");
console.log("italian language loaded");
var Kor = require("../locale/kor/kor");
var kor = new Kor(".");
console.log("korean language loaded");
var Fra = require("../locale/fra/fra");
var fra = new Fra(".");
console.log("french language loaded");
var Tur = require("../locale/tur/tur");
var tur = new Tur(".");
console.log("turkish language loaded");
var Swa = require("../locale/swa/swa");
var swa = new Swa(".");
console.log("swahili language loaded");
var Ukr = require("../locale/ukr/ukr");
var ukr = new Ukr(".");
console.log("ukranian language loaded");
var Nld = require("../locale/nld/nld");
var nld = new Nld(".");
console.log("dutch language loaded");
var Hun = require("../locale/hun/hun");
var hun = new Hun(".");
console.log("hungarian language loaded");
var Swe = require("../locale/swe/swe");
var swe = new Swe(".");
console.log("swedish language loaded");
var mwakCode = "mwak";
var engCode = "eng";
var spaCode = "spa";
var porCode = "por";
var fraCode = "fra";
var rusCode = "rus";
var araCode = "ara";
var cmnCode = "cmn";
var hinCode = "hin";
var indCode = "ind";
var jpnCode = "jpn";
var deuCode = "deu";
var itaCode = "ita";
var korCode = "kor";
var turCode = "tur";
var swaCode = "swa";
var ukrCode = "ukr";
var sweCode = "swe";
var hunCode = "hun";
var nldCode = "nld";
var jsonCode = "json";
var jsCode = "js";
var lang;
var toLangCode = engCode, 
    fromLangCode = mwakCode,
    inLangCode = engCode;
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
function inputSubmit(userInput){
infoUpdate("");//clear info
mainUpdate("");//clear main
var fromLangv = fromLangChoice.value;
if (fromLangv === engCode) fromLangL = eng;
else if (fromLangv === spaCode) fromLangL = spa;
else if (fromLangv === porCode) fromLangL = por;
else if (fromLangv === fraCode) fromLangL = fra;
else if (fromLangv === rusCode) fromLangL = rus;
else if (fromLangv === araCode) fromLangL = ara;
else if (fromLangv === cmnCode) fromLangL = cmn;
else if (fromLangv === hinCode) fromLangL = hin;
else if (fromLangv === indCode) fromLangL = ind;
else if (fromLangv === jpnCode) fromLangL = jpn;
else if (fromLangv === deuCode) fromLangL = deu;
else if (fromLangv === itaCode) fromLangL = ita;
else if (fromLangv === korCode) fromLangL = kor;
else if (fromLangv === turCode) fromLangL = tur;
else if (fromLangv === swaCode) fromLangL = swa;
else if (fromLangv === ukrCode) fromLangL = ukr;
else if (fromLangv === hunCode) fromLangL = hun;
else if (fromLangv === sweCode) fromLangL = swe;
else if (fromLangv === nldCode) fromLangL = nld;
else if (fromLangv === mwakCode) fromLangL = mwak;
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
else if (toLangv === porCode) toLangL = por;
else if (toLangv === fraCode) toLangL = fra;
else if (toLangv === rusCode) toLangL = rus;
else if (toLangv === araCode) toLangL = ara;
else if (toLangv === cmnCode) toLangL = cmn;
else if (toLangv === hinCode) toLangL = hin;
else if (toLangv === indCode) toLangL = ind;
else if (toLangv === jpnCode) toLangL = jpn;
else if (toLangv === deuCode) toLangL = deu;
else if (toLangv === itaCode) toLangL = ita;
else if (toLangv === korCode) toLangL = kor;
else if (toLangv === turCode) toLangL = tur;
else if (toLangv === swaCode) toLangL = swa;
else if (toLangv === ukrCode) toLangL = ukr;
else if (toLangv === hunCode) toLangL = hun;
else if (toLangv === sweCode) toLangL = swe;
else if (toLangv === nldCode) toLangL = nld;
else if (toLangv === mwakCode) toLangL = mwak;
var noError= true;
try{
var conjugation =
document.getElementById("conjugationLevel").value;
console.log(conjugation);
var trans = textObject.toLocaleString(toLangL,
HtmlFormat,conjugationLevel);
console.log(trans);
if(toLangv === araCode)
trans = '<p class="ara">'+trans+'</p>';
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
if (inLangV === engCode) inLangL = eng;
else if (inLangV === spaCode) inLangL = spa;
else if (inLangV === porCode) inLangL = por;
else if (inLangV === fraCode) inLangL = fra;
else if (inLangV === rusCode) inLangL = rus;
else if (inLangV === araCode) inLangL = ara;
else if (inLangV === cmnCode) inLangL = cmn;
else if (inLangV === hinCode) inLangL = hin;
else if (inLangV === indCode) inLangL = ind;
else if (inLangV === jpnCode) inLangL = jpn;
else if (inLangV === deuCode) inLangL = deu;
else if (inLangV === itaCode) inLangL = ita;
else if (inLangV === korCode) inLangL = kor;
else if (inLangV === turCode) inLangL = tur;
else if (inLangV === swaCode) inLangL = swa;
else if (inLangV === hunCode) inLangL = hun;
else if (inLangV === ukrCode) inLangL = ukr;
else if (inLangV === sweCode) inLangL = swe;
else if (inLangV === nldCode) inLangL = nld;
else if (inLangV === mwakCode) inLangL = mwak;
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
