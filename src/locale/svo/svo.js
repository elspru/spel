exports.wordOrder =  function(){return svoWordOrder;};
var svoWordOrder = {
headFinal : false,
verbFinal : false,
nounFinal : false,
typeFinal : false,
subjectProminent: true,
clauseInitial: false,
genitiveInitial: false,
postpositional : false,
phraseOrder: ["sla","ku","twa",".u",".i",".a"]
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
