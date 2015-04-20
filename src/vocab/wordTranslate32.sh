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
OUT=`echo $OB | translate-bin -s $BY -f $FROM -t $TO 2>/dev/null`
OUTF=`echo $OUT|awk -F'>' '{print $2;}'`
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
export X=0
export R=0
export B=0
export G=0
export D=0
export Z=0
export J=0
export E=0
export O=0
export V=0
export Q=0
export TH=0
export TL=0
export V2=0
export V1=0
export C4=0



function totalPhon(){
if [[ $@ == *"k"* || $@ == *"c"*  || $@ == *"q"* ]]
then ((K=$K+1)); export K=$K; fi
if [[  $@ == *"g"*  || $@ == *"ɡ"* || $@ == *"ɟ"*  ]]
then ((G=$G+1)); export G=$G; fi
if [[ $@ == *"h"* || $@ == *"x"* ||  $@ == *"ħ"* || $@ == *"ɣ"* ]]
then ((X=$X+1)); export X=$X; fi
if [[ $@ == *"p"*  ]];
then ((P=$P+1)); export P=$P; fi
if [[  $@ == *"b"* ]];
then ((B=$B+1)); export B=$B; fi
if [[ $@ == *"t"* || $@ == *"θ"* ]]; 
then ((T=$T+1)); export T=$T; fi
if [[  $@ == *"d"* || $@ == *"ð"* ]]; 
then ((D=$D+1)); export D=$D; fi
if [[ $@ == *"f"* || $@ == *"ɸ"* ]] 
then ((F=$F+1)); export F=$F; fi
if [[ $@ = *"v"* || $@ = *"β"* || $@ = *"ʋ"* ]] 
then ((V=$V+1)); export V=$V; fi
if [[ $@ == *"s"* ]]; 
then ((S=$S+1)); export S=$S; fi
if [[  $@ = *"z"* ]]; 
then ((Z=$Z+1)); export Z=$Z; fi
if [[ $@ == *"ʃ"* || $@ == *"ɕ"* 
	|| $@ == *"ç"* || $@ == *"c"* ]]; 
then ((C=$C+1)); export C=$C; fi
if [[  $@ == *"ʒ"* || $@ == *"ɟ"* 
	|| $@ == *"ʑ"* || $@ == *"ʝ"* ]]; 
then ((J=$j+1)); export J=$J; fi
if [[ $@ == *"j"* || $@ == *"ʲ"* || $@ == *"j̊"*	 ]]; 
then ((Y=$Y+1)); export Y=$Y; fi
if [[  $@ == *"r"* || $@ == *"ᴙ"* ]]; 
then ((R=$R+1)); export R=$R; fi
if [[  $@ == *"ɻ"* || $@ == *"ɾ"*  ]]; 
then ((C4=$C4+1)); export C4=$C4; fi
if [[ $@ == *"w"* ||  $@ == *"ɰ"* || $@ == *"ʋ"* ]]; 
then ((W=$W+1)); export W=$W; fi
if [[ $@ == *"l"* || $@ == *"ɭ"* || $@ == *"ʎ"* ]]; 
then ((L=$L+1)); export L=$L; fi
if [[ $@ == *"m"* || $@ == *"ɱ"* ]]; 
then ((M=$M+1)); export M=$M; fi
if [[ $@ == *"n"* ]]; 
then ((N=$N+1)); export N=$N; fi
if [[  $@ == *"ŋ"* || $@ == *"ɳ"* ]]; 
then ((Q=$Q+1)); export Q=$Q; fi
if [[ $@ == *"i"* ||  $@ == *"y"* || $@ == *"I"*
	|| $@ == *"Y"* || $@ == *"ɨ"* ]]; 
then ((I=$I+1)); export I=$I; fi
if [[  $@ == *"e"* || $@ == *"ɛ"* || $@ == *"e̞"* || $@ == *"ø̞"* 
	|| $@ == *"ø"*  || $@ == *"œ"* ]]; 
then ((E=$E+1)); export E=$E; fi
if [[ $@ == *"a"* || $@ == *"æ"* || $@ == *"ɑ"*  || $@ == *"ɒ"* 
	|| $@ == *"ɐ"*  ]]; 
then ((A=$A+1)); export A=$A; fi
if [[  $@ == *"ʊ"* || $@ == *"u"* || $@ == *"ɯ"* ]]; 
then ((U=$U+1)); export U=$U; fi
if [[  $@ == *"o"* || $@ == *"ɔ"* 
	|| $@ == *"ʌ"* || $@ == *"ɤ"* || $@ == *"ɵ"* ]]; 
then ((O=$O+1)); export O=$O; fi
if [[  $@ == *"ɨ"* || $@ == *"ʉ"* 
	|| $@ == *"ɪ̈"* || $@ == *"ʊ̈"* ]]; 
then ((V1=$V1+1)); export V1=$V1; fi
if [[  $@ == *"ɘ"* || $@ == *"ɜ"*  || $@ == *"ɵ̞"*  
	|| $@ == *"ə"* || $@ == *"ɞ"* || $@ == *"ɵ"* ]]; 
then ((V2=$V2+1)); export V2=$V2; fi
if [[  $@ == *"˦"*  || $@ == *"˥"* ]]; 
then ((TH=$TH+1)); export TH=$TH; fi
if [[  $@ == *"˩"*  || $@ == *"˨"* ]]; 
then ((TL=$TL+1)); export TL=$TL; fi
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
for i in zh en es hi ar id ru sw tr fi sv fa el 
do
translate $i $@;
done
echo -e " $M m,\n $K k,\n $I i,\n $A a,\n $Y y,\n $U u,\n \
$P p,\n $W w,\n $N n,\n $S s,\n $T t,\n $L l,\n $F f,\n $C c,\
\n $X x,\n $R r,\n $B b,\n $G g,\n $D d,\n $Z z,\n $J j,\
\n $E e,\n $O o,\n $Q q,\n $V1 1,\n $V2 2,\n $C4 4,\
\n $V v,\n $TH 7,\n $TL 6,"\
|sort -n -r 

echo;
