#!/bin/bash
if [ $# > 3 ]
then 
	BY=$1; 
	FROM=$2; 
	TO=$3
	shift;
	shift;
	shift
elif  [ $# > 2 ]
then
	BY="google";
	FROM=$1; 
	TO=$2;
	shift;
	shift
elif [ $# > 1 ]
then
	FROM="en" 
	shift;
fi
OB=$@

OUT=`echo $OB | translate-bin -s $BY -f $FROM -t $TO`

echo $OUT|awk -F'>' '{print $2;}'
