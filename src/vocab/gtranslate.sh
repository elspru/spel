#!/bin/bash
if [[ $# -gt 3 ]]
then 
	BY=$1; 
	FROM=$2; 
	TO=$3
	shift;
	shift;
	shift
elif  [[ $# -gt 2 ]]
then
	BY="google";
	FROM=$1; 
	TO=$2;
	shift;
	shift
elif [[ $# -gt 1 ]]
then
	FROM="en" 
	shift;
fi
OB=$@

if [[ $TO == $FROM ]]
then
OUT=$OB
else
OUT=`./trans -s $FROM :$TO` $OB 2>/dev/null
fi

echo $OUT

#LANG=$1
#shift
#WORD=$@
#./trans --brief :$LANG $WORD
