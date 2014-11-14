
this.CompoundWord = CompoundWord;
function CompoundWord(mwakCompound){
	this.data = mwakCompound;
	this.lemma = new Word();
	this.adwords = new Array();
	this.affixes = new Array(); // types
}
