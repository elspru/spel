#!/bin/bash
TRANSUP="./translateUpdateW.js "
for lang in "spa.txt es" "por.txt pt" "fra.txt fr" "zho.txt zh"\
            "rus.txt ru" "ara.txt ar" "ind.txt id" "hin.txt hi"
do  
        $TRANSUP $lang &
done
wait;
echo "all done";
