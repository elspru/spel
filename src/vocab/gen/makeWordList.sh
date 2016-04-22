#!/bin/bash
# make an initial word list
cat coreGrammar.txt > comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat glossingAbbreviations.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat emotionWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
#cat UNLRelat.txt >> comboWordList.txt
#echo -e "\n" >> comboWordList.txt
#cat UNLAtrib.txt >> comboWordList.txt
#echo -e "\n" >> comboWordList.txt
cat mwak_wordList.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat leipzig-jakarta.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat special-english.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat oxford-3000.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat wordnetWordList.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat uld-en.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat NGSL.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat NAWL_Lemmas.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
#cat unl_wl.txt >> comboWordList.txt
#echo -e "\n" >> comboWordList.txt
cat atoms.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat spiritualWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat computerTerms.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
