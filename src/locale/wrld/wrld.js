exports.wordOrder =  function(){return svoWordOrder;};
var svoWordOrder = {
headFinal : false,
verbFinal : false,
typeFinal : false,
subjectProminent: true,
clauseInitial: false,
genitiveInitial: false,
nounFinal : false,
phraseOrder: ["sla","ku","twa",".u",".i",".a"]
};
var conjugation = new Object();
conjugation.guillemetSpaceQuote = 
function(language,foreignQuoteObject,format){
var nounFinal = language.grammar.wordOrder.nounFinal;
if (nounFinal)
return '« '+foreignQuoteObject.body.join(" ")+' »'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (nounFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'« '+foreignQuoteObject.body.join(" ")+' »';
else return '« '+foreignQuoteObject.body.join(" ")+' »';
}
conjugation.guillemetQuote = 
function(language,foreignQuoteObject,format){
var nounFinal = language.grammar.wordOrder.nounFinal;
if (nounFinal)
return '«'+foreignQuoteObject.body.join(" ")+'»'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (nounFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'«'+foreignQuoteObject.body.join(" ")+'»';
else return '«'+foreignQuoteObject.body.join(" ")+'»';
}
conjugation.citationQuote = 
function (language,foreignQuoteObject,format){
var nounFinal = language.grammar.wordOrder.nounFinal;
if (nounFinal)
return '“'+foreignQuoteObject.body.join(" ")+'”'+" "
+foreignQuoteObject.name.toLocaleString(language);
if (nounFinal === false)
return foreignQuoteObject.name.toLocaleString(language)+
" "+'“'+foreignQuoteObject.body.join(" ")+'”';
else return '“'+foreignQuoteObject.body.join(" ")+'”';
}
exports.conjugation = conjugation;
