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
var porFile = io.fileRead("../vocab/por.txt");
var fraFile = io.fileRead("../vocab/fra.txt");
var rusFile = io.fileRead("../vocab/rus.txt");
var araFile = io.fileRead("../vocab/ara.txt");
var cmnFile = io.fileRead("../vocab/cmn.txt");
var hinFile = io.fileRead("../vocab/hin.txt");
var indFile = io.fileRead("../vocab/ind.txt");
var jpnFile = io.fileRead("../vocab/jpn.txt");
var deuFile = io.fileRead("../vocab/deu.txt");
var korFile = io.fileRead("../vocab/kor.txt");
var turFile = io.fileRead("../vocab/tur.txt");
var swaFile = io.fileRead("../vocab/swa.txt");
var ukrFile = io.fileRead("../vocab/ukr.txt");
var sweFile = io.fileRead("../vocab/swe.txt");
var nldFile = io.fileRead("../vocab/nld.txt");
var javsFile = io.fileRead("../vocab/javs.txt");
infoUpdate("<blink>be flow load ob file ya</blink>");
var mwak = new Language();
var mwakText = new Text(mwak,mwakFile);
var engText = new Text(mwak,engFile);
var spaText = new Text(mwak,spaFile);
var porText = new Text(mwak,porFile);
var fraText = new Text(mwak,fraFile);
var rusText = new Text(mwak,rusFile);
var araText = new Text(mwak,araFile);
var cmnText = new Text(mwak,cmnFile);
var hinText = new Text(mwak,hinFile);
var indText = new Text(mwak,indFile);
var jpnText = new Text(mwak,jpnFile);
var deuText = new Text(mwak,deuFile);
var korText = new Text(mwak,korFile);
var turText = new Text(mwak,turFile);
var swaText = new Text(mwak,swaFile);
var ukrText = new Text(mwak,ukrFile);
var sweText = new Text(mwak,sweFile);
var nldText = new Text(mwak,nldFile);
infoUpdate("<blink>be flow load ob language ya</blink>");
var grammar = new Grammar();
var engDict = new Dictionary(mwak,engText);
var spaDict = new Dictionary(mwak,spaText);
var porDict = new Dictionary(mwak,porText);
var fraDict = new Dictionary(mwak,fraText);
var rusDict = new Dictionary(mwak,rusText);
var araDict = new Dictionary(mwak,araText);
var cmnDict = new Dictionary(mwak,cmnText);
var hinDict = new Dictionary(mwak,hinText);
var indDict = new Dictionary(mwak,indText);
var jpnDict = new Dictionary(mwak,jpnText);
var deuDict = new Dictionary(mwak,deuText);
var korDict = new Dictionary(mwak,korText);
var turDict = new Dictionary(mwak,turText);
var swaDict = new Dictionary(mwak,swaText);
var sweDict = new Dictionary(mwak,sweText);
var nldDict = new Dictionary(mwak,nldText);
var ukrDict = new Dictionary(mwak,ukrText);
infoUpdate("");

function themeSet(mode){
var cssElem = document.querySelector( "link[rel=stylesheet]");
if (mode === "day") cssElem.href = "spel-day.css";
else cssElem.href = "spel-night.css";
}

var HtmlFormat = { newline: "<br/>", lineLength: 0};
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
	phraseOrder: ["sla","ku","twa",".u",".i","ta",".a"]
};
var svoWordOrder = {
	headFinal : false,
	verbFinal : false,
	typeFinal : false,
	clauseInitial: false,
	genitiveInitial: false,
	postpositional : false,
	phraseOrder: ["sla","ku","twa",".u",".i","nya","ta",".a"]
};
var indWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["sla","ku","twa","nya","ta",".a",".i",".u"],
intransitiveWord: ".a" 
};
var cmnWordOrder = {
headFinal : true,
verbFinal : true,
typeFinal : true,
postpositional : true,
clauseInitial: true,
genitiveInitial: true,
phraseOrder: ["sla","ku","twa",".u",".i","nya","ta",".a"]
};
var sovWordOrder = {
headFinal : true,
verbFinal : true,
typeFinal : true,
postpositional : true,
clauseInitial: true,
genitiveInitial: true,
phraseOrder: ["sla","ku","twa",".u","nya","ta",".a",".i"]
};
var vsoWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["sla","ku","twa",".i",".u","nya","ta",".a"]
};
//var JavsFormat = { 
//newline: "<br/>",
//phraseHeadJoiner: ':',
//phraseJoiner: ',',
//phrasesStart: '({',
//phrasesEnd: '})'
//};
//var javsWordOrder = {
//	headFinal : false,
//	verbFinal : false,
//	typeFinal : false,
//	clauseInitial: false,
//	genitiveInitial: false,
//	postpositional : false,
//	phraseOrder: ["ku","twa",".i"]
//};

var engGrammar = new Grammar(engWordOrder,engDict);
var spaGrammar = new Grammar(svoWordOrder,spaDict);
var porGrammar = new Grammar(svoWordOrder,porDict);
var fraGrammar = new Grammar(svoWordOrder,fraDict);
var rusGrammar = new Grammar(engWordOrder,rusDict);
var araGrammar = new Grammar(vsoWordOrder,araDict);
var hinGrammar = new Grammar(sovWordOrder,hinDict);
var indGrammar = new Grammar(indWordOrder,indDict);
var jpnGrammar = new Grammar(sovWordOrder,jpnDict);
var deuGrammar = new Grammar(engWordOrder,deuDict);
var korGrammar = new Grammar(sovWordOrder,korDict);
var turGrammar = new Grammar(sovWordOrder,turDict);
var swaGrammar = new Grammar(svoWordOrder,swaDict);
var ukrGrammar = new Grammar(engWordOrder,ukrDict);
var sweGrammar = new Grammar(engWordOrder,sweDict);
var nldGrammar = new Grammar(engWordOrder,nldDict);
var cmnGrammar = new Grammar(cmnWordOrder,cmnDict);
var eng = new Language(engGrammar,engDict);
var spa = new Language(spaGrammar,spaDict);
var por = new Language(porGrammar,porDict);
var fra = new Language(fraGrammar,fraDict);
var rus = new Language(rusGrammar,rusDict);
var ara = new Language(araGrammar,araDict);
var cmn = new Language(cmnGrammar,cmnDict);
var hin = new Language(hinGrammar,hinDict);
var ind = new Language(indGrammar,indDict);
var jpn = new Language(jpnGrammar,jpnDict);
var deu = new Language(deuGrammar,deuDict);
var kor = new Language(korGrammar,korDict);
var tur = new Language(turGrammar,turDict);
var swa = new Language(swaGrammar,swaDict);
var ukr = new Language(ukrGrammar,ukrDict);
var swe = new Language(sweGrammar,sweDict);
var nld = new Language(nldGrammar,nldDict);
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
var korCode = "kor";
var turCode = "tur";
var swaCode = "swa";
var ukrCode = "ukr";
var sweCode = "swe";
var nldCode = "nld";
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
	else if (fromLangv === porCode)
		fromLangL = por;
	else if (fromLangv === fraCode)
		fromLangL = fra;
	else if (fromLangv === rusCode)
		fromLangL = rus;
	else if (fromLangv === araCode)
		fromLangL = ara;
	else if (fromLangv === cmnCode)
		fromLangL = cmn;
	else if (fromLangv === hinCode)
		fromLangL = hin;
	else if (fromLangv === indCode)
		fromLangL = ind;
	else if (fromLangv === jpnCode)
		fromLangL = jpn;
	else if (fromLangv === deuCode)
		fromLangL = deu;
	else if (fromLangv === korCode)
		fromLangL = kor;
	else if (fromLangv === turCode)
		fromLangL = tur;
	else if (fromLangv === swaCode)
		fromLangL = swa;
	else if (fromLangv === ukrCode)
		fromLangL = ukr;
	else if (fromLangv === sweCode)
		fromLangL = swe;
	else if (fromLangv === nldCode)
		fromLangL = nld;
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
else if (toLangv === porCode) toLangL = por;
else if (toLangv === fraCode) toLangL = fra;
else if (toLangv === rusCode) toLangL = rus;
else if (toLangv === araCode) toLangL = ara;
else if (toLangv === cmnCode) toLangL = cmn;
else if (toLangv === hinCode) toLangL = hin;
else if (toLangv === indCode) toLangL = ind;
else if (toLangv === jpnCode) toLangL = jpn;
else if (toLangv === deuCode) toLangL = deu;
else if (toLangv === korCode) toLangL = kor;
else if (toLangv === turCode) toLangL = tur;
else if (toLangv === swaCode) toLangL = swa;
else if (toLangv === ukrCode) toLangL = ukr;
else if (toLangv === sweCode) toLangL = swe;
else if (toLangv === nldCode) toLangL = nld;
else if (toLangv === mwakCode) toLangL = mwak;
var noError= true;
try{
var trans = textObject.toLocaleString(toLangL, HtmlFormat);
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
	if (inLangV === engCode)
		inLangL = eng;
	else if (inLangV === spaCode)
		inLangL = spa;
	else if (inLangV === porCode)
		inLangL = por;
	else if (inLangV === fraCode)
		inLangL = fra;
	else if (inLangV === rusCode)
		inLangL = rus;
	else if (inLangV === araCode)
		inLangL = ara;
	else if (inLangV === cmnCode)
		inLangL = cmn;
	else if (inLangV === hinCode)
		inLangL = hin;
	else if (inLangV === indCode)
		inLangL = ind;
	else if (inLangV === jpnCode)
		inLangL = jpn;
	else if (inLangV === deuCode)
		inLangL = deu;
	else if (inLangV === korCode)
		inLangL = kor;
	else if (inLangV === turCode)
		inLangL = tur;
	else if (inLangV === swaCode)
		inLangL = swa;
	else if (inLangV === ukrCode)
		inLangL = ukr;
	else if (inLangV === sweCode)
		inLangL = swe;
	else if (inLangV === nldCode)
		inLangL = nld;
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
