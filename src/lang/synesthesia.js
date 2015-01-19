var tokenize = require('../compile/tokenize');
/* for HTML */

function span(classId,glyph){
return "<span class="+classId+">"+glyph+"</span>";
}
exports. htmlSynGlyphsTransform = 
	 htmlSynGlyphsTransform;
function htmlSynGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph === '.') glyph = span("gs",glyph);
else if (glyph === "'") glyph = span("as",glyph);
else glyph = span(glyph+'y',glyph);
result+=glyph;
}
return result;
}

exports. htmlTypeGlyphsTransform =
	 htmlTypeGlyphsTransform;
function htmlTypeGlyphsTransform(string,type){
if (this.glyphsTransform)
var synResult = this.glyphsTransform(string);
else synResult = string;
return span(type,synResult);
}

/* for Console */
exports. darkConsoleGlyphsTransform = 
	 darkConsoleGlyphsTransform;
function darkConsoleGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
var colors=require("colors");
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph ==='a') glyph = glyph.red.bold;
if (glyph ==='u') glyph = glyph.blue.bold;
if (glyph ==='i') glyph = glyph.yellow.bold;
if (glyph ==='e') glyph = glyph.green.bold;
if (glyph ==='o') glyph = glyph.cyan.bold;
if (glyph ==='w') glyph = glyph.red.bold;
if (glyph ==='y') glyph = glyph.yellow.bold;
if (glyph ==='l') glyph = glyph.green.bold;
if (glyph ==='.') glyph = glyph.yellow.bold;
if (glyph ==='k') glyph = glyph.green.bold;
if (glyph ==='t') glyph = glyph.cyan.bold;
if (glyph ==='d') glyph = glyph.cyan.bold;
if (glyph ==='p') glyph = glyph.blue.bold;
if (glyph ==='b') glyph = glyph.blue.bold;
if (glyph ==='x') glyph = glyph.magenta.bold;
if (glyph ==='h') glyph = glyph.blue.bold;
if (glyph ==='c') glyph = glyph.yellow.bold;
if (glyph ==='s') glyph = glyph.yellow.bold;
if (glyph ==='r' ||  glyph === 'm' || glyph === 'c'
		|| glyph === 'r')
	glyph = glyph.red;
if (glyph ==='n')
	glyph = glyph.red.bold;
if (glyph ==='t' )
	glyph = glyph.cyan;
if (glyph ==='l' )
	glyph = glyph.green.bold;
result+=glyph;
}
return result;
}

exports. grayConsoleGlyphsTransform =
	 grayConsoleGlyphsTransform;
function grayConsoleGlyphsTransform(string){
var glyphs=tokenize.stringToGlyphs(string);
var result = new String();
var i, glyph;
var colors=require("colors");
for (i=0;i<glyphs.length;i++){
glyph = glyphs[i];
if (glyph ==='a' )
	glyph = glyph.red;
if (glyph ==='u' || glyph ==='p')
	glyph = glyph.blue;
if (glyph=== 'i')
	glyph = glyph.yellow.bold;
if (glyph ==='e' )
	glyph = glyph.green;
if (glyph ==='o' )
	glyph = glyph.cyan;
if (glyph ==='k' )
	glyph = glyph.green;
if (glyph ==='w')
	glyph = glyph.yellow;
if (glyph ==='h')
	glyph = glyph.blue;
if (glyph ==='b')
	glyph = glyph.magenta.bold;
if (glyph ==='d')
	glyph = glyph.blue.bold;
if (glyph ==='s' || glyph ==='.' || glyph==='y')
	glyph = glyph.yellow.bold;
if (glyph ==='r' ||  glyph === 'm' || glyph === 'c'
		|| glyph === 'r')
	glyph = glyph.red;
if (glyph ==='n')
	glyph = glyph.red.bold;
if (glyph ==='t' )
	glyph = glyph.cyan;
if (glyph ==='l' )
	glyph = glyph.green.bold;
result+=glyph;
}
return result;
}
