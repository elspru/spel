
'use strict';
console.log('start');
/*globals*/
var siteBase=('http://mwak.tk/spel/src/web/');

/*functions*/
function themeSet(mode){
var cssElem = document.querySelector('link[rel=stylesheet]');
if (mode === 'day') cssElem.href = siteBase+'spel-day.css';
else cssElem.href = siteBase+'spel-night.css';}

function stringToGlyphs(/*string*/string){
return string.split('');};

function span(classId,glyph){
return '<span class='+classId+'>'+glyph+'</span>';
}

function htmlSynGlyphsTransform(string){
var glyphs=stringToGlyphs(string);
var result = new String();
var i, glyph, inTag = false;
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph === '.') glyph = span('gs',glyph);
else if (glyph === '>' || glyph === ';') inTag = false;
else if (glyph === '<' || glyph === '&') inTag = true;
else if (inTag) true;
else glyph = span(glyph+'y',glyph);
result+=glyph;}
return result;}

function HTMLNodeIterator(){ 
this.iterate = function iterate(task,node){
console.log(node.childNodes.length);
var x; for(x=0;x<node.childNodes.length;x++){
var childNode = node.childNodes[x];
console.log(childNode.tagName);
if (childNode.tagName !== 'SPAN'){
task(childNode);
/*if( childNode.childNodes.length > 0 )
this.iterate(task,childNode);*/}}}}

function elemGlyphsTransform(elem){
var content = elem.innerHTML;
if (content) elem.innerHTML =  
htmlSynGlyphsTransform(content);}

/*main*/
function main(){
themeSet('night');
var bodyElement = document.getElementsByTagName('body')[0];
var htmlNodeIterator = new HTMLNodeIterator();
htmlNodeIterator.iterate(elemGlyphsTransform,bodyElement);
}

main();
console.log('done');
