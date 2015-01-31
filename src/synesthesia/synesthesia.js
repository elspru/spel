'use strict';
console.log('start');
/*globals*/
var siteBase=('http://spel.sourceforge.net/src/web/');

/*functions*/
function themeSet(mode){
var head = document.getElementsByTagName('head')[0];
var prevCssLink= document.querySelector('link[rel=stylesheet]');
var cssURI = (siteBase+'spel-night2.css');
console.log(cssURI);
console.log(prevCssLink);
if (prevCssLink){
prevCssLink.type='text/css';
prevCssLink.href=cssURI;}
else if (!prevCssLink){
var fileRef = 
document.createElement('link');
  fileRef.setAttribute('rel', 'stylesheet');
  fileRef.setAttribute('type', 'text/css');
fileRef.setAttribute('href', cssURI);
head.appendChild(fileRef);
prevCssLink= 
document.querySelector('link[rel=stylesheet]');
}
console.log(prevCssLink);
/*var prevStyle = 
document.getElementsByTagName('style');
console.log(prevStyle);
if (prevStyle){
var i;
for (i=0;i<prevStyle.length;i++)
 head.removeChild(prevStyle[i]);
}*/
console.log(prevCssLink);
}
function stringToGlyphs(/*string*/string){
return string.split('');};

function span(classId,glyph){
return '<span class='+classId+'>'+glyph+'</span>';
}

function htmlSynGlyphsTransform(string){
var glyphs=stringToGlyphs(string);
var result = new String();
var i, glyph, inTag = false;
var inQuote = false;
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
/* skip if space */
if (/\s/.test(glyph) && !/\S/.test(glyph)){
result+= glyph; continue;}
if (glyph === '.') glyph = span('gs',glyph);
else if (glyph === '>' || glyph === ';') inTag = false;
else if (glyph === '<' || glyph === '&') { inTag = true;}
else if (inTag || inQuote) true;
else glyph = span(glyph+'y',glyph);
result+=glyph;}
return result;}

function elemGlyphsTransform(elem){
var content = elem.innerHTML;
if (content) {var htmlSyn =  
htmlSynGlyphsTransform(content);
elem.textContent='';
elem.innerHTML = htmlSyn;
}
}

/*main*/
function main(){
console.log('setting theme');
themeSet('night');
var bodyElement = document.getElementsByTagName('body')[0];
var children = bodyElement.children;
console.log('iterating');
iterate(children);
}
function iterate(children){
var i;
for(i=0;i<children.length;i++){
var child = children[i];
child.normalize();
/*var subChildren = child.children;
if (subChildren.length > 0) iterate(subChildren);*/
elemGlyphsTransform(child);
}
}
main();
console.log('done');
