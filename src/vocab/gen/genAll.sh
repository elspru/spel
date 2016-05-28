#!/bin/bash
./makeWordList.sh && ./sortWordList.js && \
# ./wordListTrans.js &&\
( ./transWordPhon.js & ./transWordUnique.js ); wait &&  \
./rootWordPhon.js && \
./transAllLists.js
