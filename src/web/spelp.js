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

var file = io.fileRead("../vocab-mwak-C16glyph.txt");
var mwak = new Language();
var text = new Text(mwak,file);
var grammar = new Grammar();
var engDict = new Dictionary(mwak,text);
var engWordOrder = {
	verbFinal : true,
	postpositional : false,
	phraseOrder: [".u","ta",".a","ki",".i"]
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
	try{
	var text = new Text(fromLangDict,userInput);
	var translation = text.toLocaleString(toLangDict);
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
// 	put listeners on compilation buttons


// 	put listeners on main language selector
// 	put listeners on dictionary viewer
	var dictButton = document.getElementById("dict");
	var dictDefs =  text.select(mwak,".a");
	var HtmlFormat = { newline: "<br/>"};
	dictButton.onclick = function(){
		//infoUpdate(text.toString());
		infoUpdate(dictDefs.toLocaleString(inLangDict,
					HtmlFormat));
	}
// 	put listeners on compilation buttons
	//var inputForm = document.getElementById("inputForm");
	//inputForm.action = "javascript:submitInput()";
	var inputForm = document.querySelector("input#submitButton");
//	compileButton.href = "javascript: submitInput()";
	inputForm.addEventListener("click",function(){
	var /*Elem*/ userInputEl = document.getElementById("inputText");
	var /*String*/ userInput = userInputEl.value;
	submitInput(userInput);
	},false);
}
//window.onload = init;
init();
