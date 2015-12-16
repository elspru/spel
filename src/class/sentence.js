var tokenize = require("../compile/tokenize");
var parse = require("../compile/parse");
var translate = require("../compile/translate");
var Word = require("./word");
var Phrase = require("./phrase");
var Junction = require("./junction");
var TopClause = require("./topClause");
var err = require("../lib/error");
/// su sentence be object ya
function Sentence(language, input, conjLevel) {
    "use strict";
    if (language === undefined) {
        console.log(err.stackTrace());
        throw "Sentence error: language undefined";
    }
    this.be = "Sentence";
    var tokens, i, error;
    if (typeof input === "string") {
        tokens = tokenize.stringToWords(input);
    } else if (typeof input === "object" &&
            input.be === "Sentence") {
        this.phrases = [];
        for (i = 0; i < input.phrases.length; i = i + 1) {
            if (input.phrases[i].be === "Phrase") {
                this.phrases[i] = new Phrase(language,
                    input.phrases[i], conjLevel);
            } else if (input.phrases[i].be === "Junction") {
                this.phrases[i] = new Junction(language,
                    input.phrases[i]);
            } else if (input.phrases[i].be === "TopClause") {
                this.phrases[i] = new TopClause(language,
                    input.phrases[i]);
            }
        }
        if (input.head) {
            this.head = new Word(language, input.head);
        }
        if (input.mood !== undefined) {
            this.mood = new Word(language, input.mood);
        }
        if (input.nominal !== undefined) {
            this.nominal = input.nominal;
        }
        return this;
    }
    else if (Array.isArray(input)) {
        tokens = input;
    } else {
        error = new TypeError(input +
            " is not a valid Phrase input");
        console.log(error.stack);
        throw error;
    }

// algorithm de
//
// if conjLevel set then disconjugate ya
// be extract ob quotes ya
// be get ob last case word index ya
// be get ob last word or mood word of sentence ya
// if postpositional then ob last words of sentence at end ya
// if prepositional then ob last words of sentence at start ya
// be get ob each phrase or top clause ya
// if clause initial then be get via last ya
// if clause final then be get via first ya
// if intransitive and intransitiveWord set
// then adjust accordingly ya
// be set ob many part of this ya
// if conjLevel set then disjugate ya
    if (conjLevel) {
    var string = tokens.join(" ");
    //var disjug =
    //translate.disjugate(language,string,conjLevel);
    //tokens = tokenize.stringToWords(disjug);
    }
// extract quotes
    tokens = parse.quotesExtract(language,tokens);
//if (!tokenize.isTokens(tokens))
//    throw new TypeError("su Phrase be need bo tokens ya");
    //this.string = tokens.join("");
    //this.tokens = tokens;


    var grammar = language.grammar;
    var wordOrder = grammar.wordOrder;
    // get last case word index
    var lastCaseIndex =parse.lastCaseIndex(grammar,tokens);
    var lastTopClauseIndex =
    parse.lastTopClauseWordIndex(grammar,tokens);
    if (lastTopClauseIndex === -1) lastTopClauseIndex = -1;
    var lastAnyCaseI =
    Math.max(lastTopClauseIndex,lastCaseIndex);
    if (lastCaseIndex === -1) parse.phraseError(grammar,tokens);
    lastCaseIndex++;
    lastAnyCaseI++;
    var lastWord,
        otherTokens,
        mood;       
// be get ob last word or mood word of sentence ya
// if postpositional then last words of sentence at end ya
    if (wordOrder.postpositional) {
        var lastWordStart = parse.lastSentenceWordIndex(grammar,
            tokens);
        if (lastWordStart == -1) {
            lastWordStart = tokens.length;
        }
        if (lastWord!==-1) {
            lastWord = tokens.slice(lastWordStart,
                lastWordStart + 1);
            if (lastWordStart > lastAnyCaseI) {
                mood = tokens.slice(lastAnyCaseI,lastWordStart);
            }
        }
        otherTokens = tokens.slice(0,lastAnyCaseI);
    } else {
// if prepositional then ob last words of sentence at start ya
        var firstCaseIndex =parse.firstCaseIndex(grammar,tokens);
        var firstTopClauseIndex =
        parse.firstTopClauseWordIndex(grammar,tokens);
        if (firstTopClauseIndex === -1)
        firstTopClauseIndex = tokens.length;
        var firstAnyCaseI =
        Math.min(firstTopClauseIndex,firstCaseIndex);
        var lastWordI =
        parse.lastSentenceWordIndex(grammar,tokens);
        if (lastWordI !== -1)
        lastWord = tokens[lastWordI];
        if (firstCaseIndex !== 0)
        mood = tokens.slice(0,firstAnyCaseI);
        otherTokens = tokens.slice(firstAnyCaseI,
                tokens.length);
    }

// be get ob each phrase or top clause ya
    var previousLength = 0;
    var phrases = [];
    var thePhraseI, thePhrase, phrase,
    theTopClauseI, theClause, topClause;
    while (otherTokens.length>0 &&
            otherTokens.length != previousLength) {
// avoid infinite loops from starter garbage
    previousLength = otherTokens.length;

// if clause initial then get via last phrases ya
    if (wordOrder.clauseInitial===true) {
    thePhraseI= parse.lastJunctionPhraseIndex(grammar, otherTokens);
    if (Array.isArray(otherTokens))
    theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
    thePhrase= otherTokens.slice(thePhraseI[0],thePhraseI[1]);
    if (theTopClauseI && theTopClauseI[1]>thePhraseI[1]) {
    theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
    topClause = new TopClause(language, theClause);
    phrases.unshift(topClause);
    otherTokens.splice(theTopClauseI[0],
    theTopClauseI[1]-theTopClauseI[0]);
    }
    else if (thePhrase.length === 0) break;
    else {
    phrase =  new Phrase(language, thePhrase);
    phrases.unshift(phrase);
    otherTokens.splice(thePhraseI[0],
    thePhraseI[1]-thePhraseI[0]); }
    } // be end of if for clause initial ya
   
    // if clause final then get via first phrases ya
    else if (wordOrder.clauseInitial===false) {
    if (parse.firstCaseIndex(grammar,otherTokens) === -1) break;
    thePhraseI =
    parse.firstJunctionPhraseIndex(grammar, otherTokens);
    theTopClauseI = parse.topClauseIndex(grammar, otherTokens);
    var length = otherTokens.length;
    if (thePhraseI[0] === -1) thePhraseI[0]= length;
    if (theTopClauseI[0] === -1) theTopClauseI[0]= length;
    if (theTopClauseI && theTopClauseI[0]<thePhraseI[0]) {
    theClause= otherTokens.slice(theTopClauseI[0],theTopClauseI[1]);
    topClause = new TopClause(language, theClause);
    phrases.push(topClause);
    otherTokens.splice(theTopClauseI[0],
    theTopClauseI[1]-theTopClauseI[0]);
    }
    else if (thePhraseI[0]===length) break;
    else {
    thePhrase = otherTokens.slice(thePhraseI[0],thePhraseI[1]);
    phrase = new Phrase(language, thePhrase);
    phrases.push(phrase);
    otherTokens.splice(thePhraseI[0],
    thePhraseI[1]-thePhraseI[0]); }
    } // be end of else if for clause final ya
    } // be end of while loop  for phrase or top clause get ya
   
    // if intransitive and intransitiveWord set
    // then adjust accordingly ya
    // intransitives have 2 phrases, one of which is a verb ya
    var intransitiveWord = wordOrder.intransitiveWord;
    if (phrases.length === 2 && intransitiveWord)
    if (phrases[1].head.head === "hi" &&
            phrases[0].head.head === intransitiveWord)
        phrases[0].head.head = "hu";
    else if (phrases[0].head.head === "hi" &&
            phrases[1].head.head === intransitiveWord)
    phrases[1].head.head = "hu";
   
    // be set ob many part of this ya
    this.phrases = phrases;
    if (mood && mood.length>0)
    this.mood = new Word(language,mood);
    if (lastWord && lastWord.length>0)
    this.head = new Word(language,lastWord);
   
    var verbIndex = this.phrases.find(function(phrase) {
    var result = false;
    if (phrase.be === "TopClause" || phrase.head.head === "hi" &&
            phrase.body && phrase.body.body ||
            phrase.head.head === "fa" && phrase.head.body &&
            phrase.head.body.head === "hi" &&
            phrase.head.body.body && phrase.head.body.body.body)
        result= true;
        return result;
    });
    if (verbIndex === null) {
    this.nominal = true;}
   
    return this;
}// su sentence be end of constructor function ya



exports.sentenceInputToMatch = sentenceInputToMatch;
function sentenceInputToMatch(language, input) {
    if (typeof input === "string"||
        Array.isArray(input))
         return new Sentence(language, input);
    else if (input && input.be === "Sentence")
        return input;
    else throw new TypeError(input+" not valid match for "+"Sentence");
}
Sentence.prototype.isSubset = function(language,input) {
    var match = sentenceInputToMatch(language,input);
    if (this.head && !this.head.isSubset(match.head))
        return false;
    // check phrases are a subset
    var thisPhrases = this.phrases;
    var matchPhrases = match.phrases;
    var result = thisPhrases.every(function(thisPhrase) {
        if (!matchPhrases.some(function(phrase) {
            return thisPhrase.isSubset(language,phrase);}))
            return false;
        return true;
    });
    return result;
};
Sentence.prototype.isSuperset= function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.head && !this.head.isSuperset(match.head))
    return false;
// check phrases are a subset
var thisPhrases = this.phrases;
var matchPhrases = match.phrases;
var result = matchPhrases.every(function(matchPhrase) {
 if (!thisPhrases.some(function(phrase) {
  return phrase.isSuperset(language,matchPhrase);
 })) return false;
 else return true;
});
return result;
};
Sentence.prototype.isLike = function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.isSuperset(language,match) ||
        this.isSubset(language,match)) return true;
return false;
};
Sentence.prototype.equals = function(language,input) {
var match = sentenceInputToMatch(language,input);
if (this.isSuperset(language,match) &&
        this.isSubset(language,match)) return true;
    return false;
};


Sentence.prototype.indexOf = phraseIndexFind;
Sentence.prototype.phraseIndexFind = phraseIndexFind;
function phraseIndexFind(language,cases) {
var caseWord = cases;
var i, phrase,
phrases = this.phrases,
length = phrases.length;
var result = -1;

for (i=0;i<length;i++) {
phrase = phrases[i];
if(phrase.be === "Junction" &&
        phrase.body[0].head.isLike(language,caseWord) ||
        phrase.head.isLike(language,caseWord)) {
    result = i; break; }
}
return result;

}
/// su phraseGet be get bo phrase by cases ya

Sentence.prototype.phraseGet = phraseGet;
function phraseGet(language, input) {
    if (typeof input === "number")
        return this.byIndexPhraseGet(input);
    if (typeof input === "string" || Array.isArray(input))
        return this.phraseFindGet(language,input);
    // else
    throw new TypeError(JSON.stringify(input) +
        " not valid match for "+"phraseGet");
}
Sentence.prototype.phraseFindGet = phraseFindGet;
function phraseFindGet(language,cases) {
    var index = this.indexOf(language,cases);
    if (index === -1)
        return undefined;
    //    throw new RangeError(cases +" not found in "+this);
    return this.byIndexPhraseGet(index);
}
Sentence.prototype.byIndexPhraseGet = byIndexPhraseGet;
function byIndexPhraseGet(index) {
    err.indexCheck(this.phrases.length,index);
    return this.phrases[index];
}
///
Sentence.prototype.phraseFindDel = phraseFindDelete;
Sentence.prototype.phraseFindDelete = phraseFindDelete;
function phraseFindDelete(language,cases) {
    var index = this.indexOf(language,cases);
    if (index === -1) /// if none
        return this;/// return itself
    return this.byIndexPhraseDelete(index);
}
Sentence.prototype.byIndexPhraseDelete = byIndexPhraseDelete;
function byIndexPhraseDelete(index) {
    err.indexCheck(this.phrases.length,index);
    // remove phrase from array.
    var sentence = this;
    sentence.phrases.splice(index,1);
    return sentence;
}
Sentence.prototype.phraseDelete = phraseDelete;
Sentence.prototype.phraseDel = phraseDelete;
function phraseDelete(language, input) {
    if (typeof input === "number")
        return this.byIndexPhraseDelete(input);
    if (typeof input === "string" ||
            Array.isArray(input))
        return this.phraseFindDelete(language, input);
    // else
    throw new TypeError("unsupported type:"+input);
}
Sentence.prototype.phraseSet = function(input, replacement) {
    if (typeof input === "number")
        return this.byIndexPhraseSet(input,replacement);
    if (typeof input === "string" ||
            Array.isArray(input))
        return this.phraseFindSet(input,replacement);
    // else
    throw new TypeError("unsupported type:"+input+" "+replacement);
};
Sentence.prototype.phraseFindSet = function(match,replacement) {
    var index = this.indexOf(match);
    return this.byIndexPhraseSet(index,replacement);
};
Sentence.prototype.byIndexPhraseSet = function(index,replacement) {
    err.indexCheck(this.phrases.length,index);
    var phrase;
    if (typeof replacement === "string" ||
            Array.isArray(replacement))
        phrase = new Phrase(language, replacement);
    else if (replacement.be === "Phrase")
        phrase = replacement;
    else throw new TypeError("unrecognized type");
    // remove phrase from array.
    var sentence = this;
    sentence.phrases.splice(index,1,phrase);
    return sentence;
};
Sentence.prototype.copy = function(language) {
return new Sentence(language, JSON.parse(JSON.stringify(this)));
};
Sentence.prototype.toString = function(format) {
    var joiner = ' ';
    var mood = this.mood;
    var endWords = this.head;
    var ender = '';
    //if (tokenize.isTokens(endWords)) {
    //    joiner = "";
    //    ender = '\n'
    //}
    var result = "";
    var phrases = this.phrases;
    var phrasesLength = phrases.length;
    var i;
    for (i=0; i<phrasesLength; i++)
       
result += simpleClauseTermMaybeAdd(format,phrases[i],i);
    if (mood)
    result += mood.toString()+joiner;
    if (endWords)
    result += endWords.toString();
    result += ender;
    return result;
};


Sentence.prototype.toLocaleString =
function(language,format,type,conjLevel) {
// be convert bo sentence to language with format de
// algorithm:
// be set ob joiner and ender from format ya
// be set ob empty string for translation result ya
// be clone ob this sentence to working sentence ya
//
// if intransitive and intransitiveWord set then adjust
// accordingly ya
//
// if prepositional then translate mood and prepend to result
//
// be wh front ob the types with interrogative pronoun ya
//
// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
//
// su phrase order output
// be start of loop for each phrase in language phrase order de
// be get ob phrase from working sentence ya
// if found then
// be may add ob clause term to phrase translation ya
// if su prevTopClause boolean be set and su this be phrase
//    then be prepend ob clauseTerm to result ya
// if be top clause then be set ob prevTopClause boolean ya
// else if be phrase then be unset ob prevTopClause boolean ya
// be append ob it to result ya and
// be delete ob phrase from sentence ya
// be end of loop ya
//
// be loop for each phrase in working sentence de
// if head initial
// be append ob phrase translation to result ya
// if head final
// be prepend
//
// if postpositional then translate mood and append to result
//
// be translate ob end words ya
// be append to result ya
// be append ob ender ya
// if conjugation level set then be conjugate  ya
// return result ya
//


// be set bo joiner and ender from format ya
    var joiner = ' ';
if (format && format.joiner!==undefined) joiner = format.joiner;
var ender = '';
//var newline = '\n';
//if (newline && format.newline) newline = format.newline;
// be set bo empty string for translation result ya
    var result = "";
// be clone bo this sentence to working sentence ya
var grammar = language.grammar;
var wordOrder = grammar.wordOrder;
var topClauseTerm =
new Word(language, grammar.topClauseTerminator[0]);
var conj = {};

if (conjLevel >= 3) conj = language.grammar.conjugation;
// if cant find verb, then is nominal sentence
if (conj.nominal) {
if (this.nominal)
return conj.nominal(language,this,format,type,conjLevel);
}
if (conj.sentence)
return conj.sentence(language,this,format,type,conjLevel);

var verbPhrase = "";
if (conj.verbAgreement) {
verbPhrase =
conj.verbAgreement(language,this,format,type,conjLevel);
}

if (conj && conj.format && conj.format.joiner !== undefined) {
joiner = conj.format.joiner;}

var sentence = this.copy(language);

var mood = this.mood;
var moodPhrase = "";
if (mood)
moodPhrase =
mood.toLocaleString(language,format,"mh",conjLevel);
//if (conj.mood) moodPhrase = conj.mood(moodPhrase);

var phraseJoiner = "";
if (conj.phraseJoiner) phraseJoiner = conj.phraseJoiner;

var prevTopClause = false;
var nextTopClause = false;

// if intransitive and intransitiveWord set then adjust
// accordingly ya
var phrases = sentence.phrases;
if (phrases.length === 2 && wordOrder.intransitiveWord)
if (phrases[1].head.head === "hi" &&
        phrases[0].head.head === "hu")
    phrases[0].head.head = wordOrder.intransitiveWord;
else if (phrases[0].head.head === "hi" &&
        phrases[1].head.head === "hu")
phrases[1].head.head = wordOrder.intransitiveWord;


//

var pendingPrepends = false;

// be vocative front ya
var vocativePair = vocativeFront(language,sentence);
var vocativeArray = vocativePair[0];
sentence = vocativePair[1];
if (vocativeArray.length > 0) pendingPrepends = true;

// be topClause extract ya
var topClausePair = topClauseFront(language,sentence);
var topClauseArray = topClausePair[0];
sentence = topClausePair[1];
if (topClauseArray.length > 0) pendingPrepends = true;

// be topic front
var topicPair = topicFront(language,sentence);
var topicArray = topicPair[0];
sentence = topicPair[1];
if (topicArray.length > 0) pendingPrepends = true;


// if subject prominent then subject front ya
if (wordOrder.subjectProminent===true) {
var subjectPair = subjectFront(language,sentence);
var subjectArray = subjectPair[0];
sentence = subjectPair[1];
if (subjectArray.length > 0) pendingPrepends = true;
}

// be wh front ob the types with interrogative pronoun ya
var whPair = whFront(language,sentence);
var whArray = whPair[0];
sentence = whPair[1];
if (whArray.length > 0) pendingPrepends = true;


var headFinal = wordOrder.headFinal;

// be start of loop for each phrase in language phrase order de
var phraseOrder = wordOrder.phraseOrder;
var phraseOrderLength = phraseOrder.length;
phrases = sentence.phrases;
var i;
var phraseIndex = -1;
prevTopClause = false;
var phraseTrans = "";

for (i=0; i<phraseOrderLength; i++) {
// be get bo phrase from working sentence ya
phraseIndex = sentence.indexOf(language,phraseOrder[i]);
if (phraseOrder[i]===grammar.verbWord && verbPhrase.length > 0)
phraseTrans = verbPhrase;
else {
// if found then
if (phraseIndex !== -1) {
// be may add ob clause term to phrase translation ya
var phrase = phrases[phraseIndex];
phraseTrans =
clauseTermMaybeAdd(language,phrase, format,type, conjLevel,
result.length, sentence.phrases, pendingPrepends);
if (wordOrder.postpositional === false) {
// if su prevTopClause boolean be set and su this be phrase
//    then be prepend ob clauseTerm to result ya
if (prevTopClause && phrase.be === "Phrase")
phraseTrans = topClauseTerm.toLocaleString(language, format, "jh",
conjLevel)+ joiner + phraseTrans;
// if be top clause then be set ob prevTopClause boolean ya
if ( phrase.be === "TopClause") {
prevTopClause = true;
}
// else if  be phrase then be unset ob prevTopClause boolean ya
else if (phrase.be === "Phrase")
prevTopClause = false;}
}}

if (phraseTrans.length > 0) {
// be append ob it to result ya and
result +=  phraseTrans;
// be delete ob phrase from sentence ya
if (phraseIndex !== -1)
sentence.byIndexPhraseDelete(phraseIndex);
}
phraseTrans = "";
// be end of loop for phrase order ya
}


// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
var performancePair = performanceGrammar(sentence);
var resultTailArray = performancePair[0];
var resultTail = "";
var clauseInitial = wordOrder.clauseInitial;
// if clause final reverse order of result tail array
if(clauseInitial === false)
resultTailArray.reverse();

var isNotLast = true;
var wasVerb = false;
for(i=0;i<resultTailArray.length;i++) {
if (i === resultTailArray.length-1) isNotLast = false;
var phrase = resultTailArray[i];
resultTail+=
clauseTermMaybeAdd(language,phrase,format,type,conjLevel,
result.length, sentence.phrases, pendingPrepends, isNotLast);
if (wasVerb && isNotLast) resultTail += phraseJoiner;
if (phrase.head.head === "hi") { wasVerb = true; }


}

sentence = performancePair[1];



//
// be loop for each phrase in working sentence de
var phrasesLength = phrases.length;
for (i=0; i<phrasesLength; i++) {
// if head initial
// be append bo phrase translation to result ya
if (headFinal === false) {
result +=
phrases[i].toLocaleString(language,format,type,
conjLevel);}
// if head final
// be prepend
else if (headFinal) {
result = phrases[i].toLocaleString(language,format,type,
conjLevel) +result;}
}
if (clauseInitial)
result = resultTail + result;
else if (clauseInitial === false)
result += resultTail;
//



// prepend subject
if (subjectArray && subjectArray.length>0) {
for (i = 0; i<subjectArray.length; i++) {
if (topicArray.length >0 || vocativeArray.length > 0 ||
        whArray.length || subjectArray.length -i > 1) {
    pendingPrepends = true;
} else {
    pendingPrepends = false;
}
var subject =
clauseTermMaybeAdd(language,subjectArray[i],format,type,
conjLevel,result.length, sentence.phrases, pendingPrepends);
if(conj.subject) subject = conj.subject(subject);
result = subject + result;
}
}

// prepend wh
if (whArray.length>0) {
for (i = 0; i<whArray.length; i++) {
if (topicArray.length >0 || vocativeArray.length > 0 ||
        whArray.length-i > 1)
pendingPrepends = true;
else pendingPrepends = false;
result =
clauseTermMaybeAdd(language,whArray[i],format,type, conjLevel,
result.length, sentence.phrases, pendingPrepends, true) + result;}
}

// prepend topic  if topicInitial
if (topicArray.length>0 && wordOrder.topicInitial !== false) {
for (i = 0; i<topicArray.length; i++) {
if (vocativeArray.length > 0 || (topicArray.length-i) > 1)
pendingPrepends = true; else pendingPrepends = false;
result =
clauseTermMaybeAdd(language,topicArray[i],format,type,
conjLevel, result.length, sentence.phrases,
pendingPrepends, true) + result;}
}
// append topic if topicFinal
if (topicArray.length>0 && wordOrder.topicInitial === false) {
for (i = 0; i<topicArray.length; i++) {
result += topicArray[i].toLocaleString(language,format,
type, conjLevel);
}
}

if (topClauseArray.length>0 ) {
var len = topClauseArray.length;
for (i = 0; i<len; i++) {
if (wordOrder.clauseInitial)
result = topClauseArray[len-(i+1)].toLocaleString(language,format,
type, conjLevel) + result;
else if (wordOrder.clauseInitial === false)
result += topClauseArray[i].toLocaleString(language,format,
type, conjLevel);
}
}

// prepend vocative
if (vocativeArray.length>0) {
for (i = 0; i<vocativeArray.length; i++) {
if ( vocativeArray.length-i > 1)
pendingPrepends = true;
else pendingPrepends = false;
result = clauseTermMaybeAdd(language,vocativeArray[i],format,type,
conjLevel, result.length, sentence.phrases, pendingPrepends, true) + result;}
}


// if postpositional then translate mood and append to result
if (mood && wordOrder.postpositional === true)
result+=moodPhrase+joiner;
// be translate bo end words ya
    if (this.head) {
var endWords = this.head.
toLocaleString(language,format,"sh",conjLevel);
//if (conj.sentenceHead) endWords = conj.sentenceHead(endWords);

// be append to result ya
    result = result+endWords;
        //result.replace(/  $/,joiner)+endWords;
    }
// be append bo ender ya
    result += ender;

// if prepositional then translate mood and prepend to result
if (mood && wordOrder.postpositional === false)
result=moodPhrase+joiner+result;

// if conjugation level set then be conjugate  ya
if (conjLevel)
result = translate.conjugate(language,result,conjLevel);
// return result ya
    return result;
};

function clauseTermMaybeAdd(language, phrase,format, type,
conjLevel,
resultLength, phrases, pendingPrepends, isFinal) {
// if clauseInitial and phrase has clause and result non zero
// or pendingPrepends
// then prepend clauseTerm translation ya
// if clauseFinal and phrase has clause
//    and phrases length is non zero
// then append clauseTerm translation ya

var phrasesLength = phrases.length;
var phraseTrans =
phrase.toLocaleString(language,format,type,
conjLevel);
var clause = phrase.clause;
var grammar = language.grammar;
var clauseInitial = grammar.wordOrder.clauseInitial;
var joiner = " ";

// if clauseInitial and phrase has clause and result non zero
// or pendingPrepends
if (clauseInitial && clause && ( pendingPrepends ||
        resultLength>0  && isFinal)) {
// then prepend clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return clauseTerm.toLocaleString(language,format,"lh",
conjLevel) +joiner+phraseTrans;}

// if clauseFinal and phrase has clause
//     and phrases length is non zero
else if ( clauseInitial===false && clause &&
        isFinal !== false && ((phrasesLength > 1) || isFinal &&
        resultLength > 0 ) ) {
// then append clauseTerm translation ya
var clauseTerm = new Word(language,grammar.clauseTerminator[0]);
return phraseTrans+
clauseTerm.toLocaleString(language,format,"lh", conjLevel
)+joiner;}
return phraseTrans; }

function simpleClauseTermMaybeAdd(format, phrase, resultLength) {
// if phrase has clause and result non zero
// then prepend clauseTerm translation ya

var phraseTrans = phrase.toString(format);
// if phrase has clause and result non zero
var clause = phrase.clause;
if (clause && !clause.clauseTerm && resultLength > 0) {
var joiner = " ";
// then prepend clauseTerm translation ya
var clauseTerm = "tai"/* mwak clauseTerminator */ ;
return clauseTerm+joiner+phraseTrans;}
return phraseTrans; }



// su performance grammar output ob langugage and working
// sentence to tuple of output and remainder ya
//
// ideal? algorithm
// sort phrases by length comparison function
// get average by reduction
// for each that has length greater than average
// add to result tail and splice from phrases
// reverse tail if head initial
// output tuple
function performanceGrammar(sentence) {
// sort phrases by length comparison function
var phrases = sentence.phrases;
phrases.sort(function(first,second) {
return second.toString().length -
    first.toString().length ;
});
// get average by reduction
var avg = phrases.reduce(function(previous, current) {
var prev = previous.toString().split(" ").length;
var cur = current.toString().split(" ").length;
return prev+cur;
},0);
avg = (avg/phrases.length);
var basis = (avg*1.618*1).toFixed();
// for each that has length greater than basis
// add to result tail and splice from phrases
var i;
var tail = [];
for(i=0;i<phrases.length;i++) {
var phrase = phrases[i];
if( phrase.toString().split(" ").length > basis ||
        phrase.clause ) {
tail.push(phrases[i]);
phrases.splice(i,1);
i--;
}
}
// reverse tail if head initial
// output tuple
return [tail,sentence];
}
function simplePerformanceGrammar(sentence) {
//
// su simple algorithm de
// be identify ob first phrase with clause ya
// if found then
// be add ob it to tail yand
// remove it from sentences
// return tail and rest of sentences

// be identify ob first phrase with clause ya
var phrases = sentence.phrases;
var phrase = null;
var i;
var tail = "";
for (i=0;i<phrases.length;i++) {
// if found then
if (phrases[i].clause) {
// be add ob it to tail yand
tail = phrases[i];
// remove it from phrases
phrases.splice(i,1);
break;}
}
// return tail and rest of sentence
return [tail,sentence];
}

function whFront(language,sentence) {
// searches through phrases to see if any are headed by an
// interrogative pronoun, if so then add it to wh array
// and drop from sentence ya
// return pair consisting of wh array and sentence ya
function whCheck(phrase) {
if (phrase.body && phrase.body.head &&
    phrase.body.head.head === "ma") return true;
else return false;
}
var phrases = sentence.phrases;
var whArray = phrases.filter(whCheck);
var otherPhrases =
phrases.filter(function(phrase) { return !whCheck(phrase); });
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [whArray,newSentence];
}

function topicFront(language,sentence) {
// searches through phrases to see if any are headed by an
// topic case, if so then add it to topic array
// and drop from sentence ya
// return pair consisting of topic array and sentence ya
function topicMatch(language,phrase) {
if (phrase.head && phrase.head.head &&
        phrase.head.head === "fa")
if (clauseContains(phrase))  return false;
else return true;
else return false;
}
var phrases = sentence.phrases;
var topicArray = phrases.filter(function(phrase) {
return topicMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !topicMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [topicArray,newSentence];
}

function vocativeFront(language,sentence) {
// searches through phrases to see if any are headed by an
// vocative case, if so then add it to vocative array
// and drop from sentence ya
// return pair consisting of vocative array and sentence ya
function vocativeMatch(language, phrase) {
if (phrase.head && phrase.head.head  &&
        (phrase.head.head === "sla" || phrase.head.body &&
        phrase.head.body[0] === "sla")) return true;
else return false;
}
var phrases = sentence.phrases;
var vocativeArray = phrases.filter(function(phrase) {
return vocativeMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !vocativeMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [vocativeArray,newSentence];
}


function subjectFront(language,sentence) {
// searches through phrases to see if any are headed by an
// subject case, if so then add it to subject array
// and drop from sentence ya
// return pair consisting of subject array and sentence ya
function subjectMatch(phrase) {
if (phrase.head && phrase.head.head  &&
    (phrase.head.head === "hu" || phrase.head.body &&
    phrase.head.body[0] === "hu")) return true;
else return false;
}
var phrases = sentence.phrases;
var subjectArray = phrases.filter(function(phrase) {
return subjectMatch(phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !subjectMatch(phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [subjectArray,newSentence];
}

function clauseContains(phrase) {
if (phrase.clause) return true;
return false;
}


function topClauseFront(language,sentence) {
// searches through phrases to see if any are headed by an
// topClause case, if so then add it to topClause array
// and drop from sentence ya
// return pair consisting of topClause array and sentence ya
function topClauseMatch(language,phrase) {
if (phrase && phrase.be === "TopClause") return true;
else return false;
}
var phrases = sentence.phrases;
var topClauseArray = phrases.filter(function(phrase) {
return topClauseMatch(language,phrase);});
var otherPhrases = phrases.filter(function(phrase) {
return !topClauseMatch(language,phrase);});
var newSentence = sentence.copy(language);
newSentence.phrases = otherPhrases;
return [topClauseArray,newSentence];
}
module.exports = Sentence;
