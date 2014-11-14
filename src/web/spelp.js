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
var text = new Text(file);
var grammar = new Grammar();
var dict = new Dictionary(text);
var lang = new Language(grammar,dict);
var word = new Word("sla");
var word2 = new Word("munt");

function hello(text){
	return text;
}
function submitInput(userInput){
	var /*Elem*/ main =  document.getElementById("main");
	var text = new Text(userInput);
	main.innerHTML = text.toLocaleString(lang);
	//	submitInput(userInput);
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
