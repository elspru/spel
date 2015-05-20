
var parse = require("../../compile/parse");
var Language = require("../../lang/language");
var mwak = new Language();
exports.wordOrder =  function(){return svoWordOrder;};
var svoWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
subjectProminent: true,
clauseInitial: false,
genitiveInitial: false,
typeFinal : false,
phraseOrder: ["sla","ku","twa","hu","hi","ha"]
};
var conjugation = new Object();
conjugation.guillemetSpaceQuote = 
function(language,foreignQuoteObject,format){
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '« '+foreignQuoteObject.body.join(" ")+' »'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'« '+foreignQuoteObject.body.join(" ")+' »';
else return '« '+foreignQuoteObject.body.join(" ")+' »';
}
conjugation.guillemetQuote = 
function(language,foreignQuoteObject,format){
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '«'+foreignQuoteObject.body.join(" ")+'»'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'«'+foreignQuoteObject.body.join(" ")+'»';
else return '«'+foreignQuoteObject.body.join(" ")+'»';
}
conjugation.citationQuote = 
function (language,foreignQuoteObject,format){
var typeFinal = language.grammar.wordOrder.typeFinal;
if (typeFinal)
return '“'+foreignQuoteObject.body.join(" ")+'”'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (typeFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'“'+foreignQuoteObject.body.join(" ")+'”';
else return '“'+foreignQuoteObject.body.join(" ")+'”';
}


conjugation.copulaNominal =
function (language, sentence, format, conjLevel){

var result = new String();
var joiner = " ";
var copula = language.grammar.conjugation.copula;


var phrases = sentence.phrases;

var subjectIndex = sentence.phrases.find(function(phrase){
if ( phrase.head.head === "hu"
|| phrase.head.head === "fa" && phrase.head.body.head === "hu")
return true; else return false;
});

if (subjectIndex !== null){
var subjectPhrase = sentence.phrases[subjectIndex];
result += subjectPhrase.toLocaleString
(language,format,"n",conjLevel);
}

var objectIndex = phrases.find(function(phrase){
if ( phrase.head.head === "ha"
|| phrase.head.head === "fa" && phrase.head.body.head === "ha")
return true; else return false;
});

result += copula + " "; 

if (objectIndex !== null){
var objectPhrase = phrases[objectIndex];
result +=
objectPhrase.toLocaleString(language,format,"n",conjLevel);
}

if (sentence.head)
result +=
sentence.head.toLocaleString(language,format,"sh",conjLevel);

return  result;

}

conjugation.isPronoun  = 
function (phrase){
var pronouns = mwak.grammar.pronouns;
var body = phrase && phrase.body
&& phrase.body.head && phrase.body.head.head;
var i;
if (parse.wordMatch(pronouns,body)){
 return true;
}

return false;
}



exports.conjugation = conjugation;


