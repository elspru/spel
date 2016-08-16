#!/bin/bash
# make an initial word list
cat coreGrammar.txt > comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat glossingAbbreviations.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat emotionWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
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
cat NAWL-Headwords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "Lemmatized+TSL+for+Teaching.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat NGSL.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat NAWL_Lemmas.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat framenet.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat uld-en.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat si-units.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat atoms.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
# core finish
cp comboWordList.txt comboWordList-core.txt
cat unl_wl.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat UNLRelat.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat UNLAtrib.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat spiritualWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat computerTerms.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat mathWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat scienceWords.txt >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "geneticsVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "biologyVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "ecologyVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "physicsVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "weatherVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "scienceVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "classificationVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "roboticsVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "engineeringVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "electricityVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "farmingWords.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "archeologyVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "chemistryVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "geologyVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "machineLearningVocab.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cat "wordFreqInfo5000.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
cp comboWordList.txt comboWordList-mid.txt
# mid finish
cat "english30k.txt" >> comboWordList.txt
echo -e "\n" >> comboWordList.txt
# mega finish
cp comboWordList.txt comboWordList-mega.txt
