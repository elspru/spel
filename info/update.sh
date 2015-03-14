#!/bin/bash
rm readme.toc readme.aux readme.log
latex readme.tex
latex readme.tex
dvipdf readme.dvi
pdf2svg readme.pdf readme%d.svg all
