#!/bin/bash
cd mwak;
./vocabUpdate.js
cd ..
./defExtract.js
./translationUpdate.js
