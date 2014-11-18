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

var file = io.fileRead("../vocab-mwak-C4bit.txt");
var mwak = new Language();
var text = new Text(mwak,file);
var grammar = new Grammar();
var dict = new Dictionary(mwak,text);
var engWordOrder = {
	verbFinal : true,
	postpositional : false,
	phraseOrder: [".u","ta",".a","ki",".i"]
};
var engGrammar = new Grammar(engWordOrder,dict);
var eng = new Language(engGrammar,dict);
var lang;// = new Language(grammar,dict);
var /*Elem*/ mainArea =  document.getElementById("main");
var /*Elem*/ infoArea =  document.getElementById("info");
var /*Elem*/ toLangChoice = document.getElementById("toLang");
var /*Elem*/ fromLangChoice=document.getElementById("fromLang");

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
	var toLang, fromLang;
	console.log("toLangv"+toLangv);
	if (toLangv === "en")
		toLang = eng;
	if (toLangv === "mwak")
		toLang = mwak;
	console.log(toLang);
	try{
	var text = new Text(fromLang,userInput);
	var translation = text.toLocaleString(toLang);
	} 
	catch (error){
		infoUpdate(error);
	}
	mainUpdate(translation);
}

function init(){
	//var inputForm = document.getElementById("inputForm");
	//inputForm.action = "javascript:submitInput()";
	var inputForm = document.querySelector("input#submitButton");
	var compileButton = document.getElementById("compileButton");
//	compileButton.href = "javascript: submitInput()";
	inputForm.addEventListener("click",function(){
	var /*Elem*/ userInputEl = document.getElementById("inputText");
	var /*String*/ userInput = userInputEl.value;
	console.log(userInput);
	submitInput(userInput);
	},false);
	compileButton.onclick = function(){
	var /*Elem*/ userInputEl = document.getElementById("inputText");
	var /*String*/ userInput = userInputEl.value;
	console.log(userInput);
	submitInput(userInput);
	}
}
//window.onload = init;
init();
