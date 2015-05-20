exports.wordOrder =  function(){return svoWordOrder;};
var svoWordOrder = {
headFinal : false,
verbFinal : false,
nounFinal : false,
typeFinal : false,
topicInitial : false,
subjectProminent: true,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["hu","hi","ha"/*,"ta","ni","wu"*/]
};
var conjugation = new Object();
conjugation.guillemetSpaceQuote = 
function(foreignQuoteObject){
return '« '+foreignQuoteObject.body.join(" ")+' »';
}
conjugation.guillemetQuote = 
function(foreignQuoteObject){
return '«'+foreignQuoteObject.body.join(" ")+'»';
}
conjugation.citationQuote = function (foreignQuoteObject){
return '“'+foreignQuoteObject.body.join(" ")+'”';
}
exports.conjugation = conjugation;
