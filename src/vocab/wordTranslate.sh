#!/bin/bash

function translate(){
BY="google";
FROM="en" 
TO=$1
shift;
OB=$@
if [ $TO == $FROM ] 
then
OUTF=$OB
else 
OUT=`./trans --brief :$TO $OB 2>/dev/null`
OUTF=$OUT
fi
if [ $TO == "ar" ]
then PHON=`arabicToIPA $OUTF`
elif [ $TO == "zh" ]
then 
	IPHON=`espeak -q -x --ipa -v $TO "$OUTF" 2>/dev/null|
	sed -e 's/^\ //'`
	PHON=`tonesToIPA $IPHON`
else PHON=`espeak -q -x --ipa -v $TO "$OUTF" 2>/dev/null|
	sed -e 's/^\ //'`
fi
totalPhon $PHON
echo " /$PHON/ $OUTF :$TO. "
}

export M=0
export N=0
export K=0
export P=0
export T=0
export F=0
export S=0
export C=0
export Y=0
export W=0
export L=0
export I=0
export A=0
export U=0
export H=0


function totalPhon(){
if [[ $@ == *"k"* || $@ == *"c"*  || $@ == *"g"*  
	|| $@ == *"ɣ"* || $@ == *"ɡ"*
	|| $@ == *"q"* || $@ == *"ɟ"*  ]]
then ((K=$K+1)); export K=$K; fi
if [[ $@ == *"p"* || $@ == *"b"* ]];
then ((P=$P+1)); export P=$P; fi
if [[ $@ == *"t"* || $@ == *"d"* ]]; 
then ((T=$T+1)); export T=$T; fi
if [[ $@ == *"f"* || $@ = *"v"* || $@ = *"β"* || $@ == *"ɸ"* 
	|| $@ == *"θ"* || $@ == *"ð"* ]] 
then ((F=$F+1)); export F=$F; fi
if [[ $@ == *"s"* || $@ = *"z"* || $@ == *"ʑ"* ]]; 
then ((S=$S+1)); export S=$S; fi
if [[ $@ == *"ʃ"* || $@ == *"ɕ"* || $@ == *"ʒ"* 
|| $@ == *"ç"* ||   $@ == *"h"* || $@ == *"x"* 
||  $@ == *"ħ"* || $@ == *"ʐ"*  || $@ == *"ɣ"*
|| $@ == *"ʂ"* || $@ == *"ʝ"* ]]; 
then ((C=$C+1)); export C=$C; fi
if [[ $@ == *"j"* || $@ == *"ɻ"* || $@ == *"ɾ"*  || $@ == *"j̊"*
	|| $@ == *"r"* || $@ == *"ʲ"*  || $@ == *"ᴙ"* ]]; 
then ((Y=$Y+1)); export Y=$Y; fi
if [[ $@ == *"w"* || $@ == *"ʋ"*  || $@ == *"ʊ"*
	|| $@ == *"v"* || $@ == *"ɰ"* ]]; 
then ((W=$W+1)); export W=$W; fi
if [[ $@ == *"l"* || $@ == *"ɭ"* || $@ == *"ʎ"* || $@ == *"ꞎ"*
	|| $@ == *"ɬ"*  || $@ == *"ɫ"* ]]; 
then ((L=$L+1)); export L=$L; fi
if [[ $@ == *"m"* || $@ == *"ɱ"* ]]; 
then ((M=$M+1)); export M=$M; fi
if [[ $@ == *"n"* || $@ == *"ŋ"* || $@ == *"ɳ"* ]]; 
then ((N=$N+1)); export N=$N; fi
if [[ $@ == *"i"* || $@ == *"e"* || $@ == *"y"* || $@ == *"I"*
	|| $@ == *"ɛ"* ]]; 
then ((I=$I+1)); export I=$I; fi
if [[ $@ == *"a"* || $@ == *"æ"* || $@ == *"ɑ"* 
	|| $@ == *"ɐ"* ]]; 
then ((A=$A+1)); export A=$A; fi
if [[ $@ == *"u"* || $@ == *"ɯ"* || $@ == *"o"* || $@ == *"ɔ"* 
 || $@ == *"ʌ"* || $@ == *"ɤ"* || $@ == *"ɵ"* || $@ == *"ʊ"* ]]; 
then ((U=$U+1)); export U=$U; fi
}

function tonesToIPA(){
TRANS=`echo $@ | sed -e '
s/1/1˥/g;
s/2/2˧˥ʔ/g;
s/3/3˨˩˦s/g;
s/4/4˥˩p/g;
s/5/5˧/g;
'`
echo $TRANS
}

function arabicToIPA(){
TRANS=`echo $@ | sed -e '
s/ا/a/g;
s/ب/b/g;
s/ت/t/g;
s/ث/θ/g;
s/ج/ʒ/g;
s/ح/ħ/g;
s/خ/x/g;
s/d/د/g;
s/ذ/ð/g;
s/ر/r/g;
s/ز/z/g;
s/س/s/g;
s/ش/ʃ/g;
s/ص/sˤ/g;
s/ض/dˤ/g;
s/ط/tˤ/g;
s/ظ/zˤ/g;
s/ع/ʕ/g;
s/غ/ɣ/g;
s/ف/f/g;
s/ق/q/g;
s/ك/k/g;
s/ل/l/g;
s/م/m/g;
s/ن/n/g;
s/ه/h/g;
s/و/w/g;
s/ي/j/g;
s/ة/h/g;
s/أ/ʔ/g;
s/ء/ʔ/g;
s/ئ/ʔ/g;
s/إ/aʔ/g;
s/د/d/g;
s/آ/ʔaː/g;
'`
echo $TRANS
}

#PHON=`espeak -q -x --ipa -v en "$@" | sed -e 's/^\ //'`
#echo " /$PHON/ $@ :en. "
echo "ksa mak "
for i in zh en es hi ar id ru sw tr fi sv fa el 
do
translate $i $@;
done
echo -e " $M m,\n $K k,\n $I i,\n $A a,\n $Y y,\n $U u,\n \
$P p,\n $W w,\n $N n,\n $S s,\n $T t,\n $L l,\n $F f,\n $C c,\
\n"\
|sort -n -r 
echo "mak tyi psu " $@ " li ha "
