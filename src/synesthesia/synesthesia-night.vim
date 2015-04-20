" syntax/synesthesia.vim
syntax match a "a"
syntax match b "b"
syntax match c "c"
syntax match d "d"
syntax match e "e"
syntax match f "f"
syntax match g "g"
syntax match h "h"
syntax match i "i"
syntax match j "j"
syntax match k "k"
syntax match l "l"
syntax match m "m"
syntax match n "n"
syntax match o "o"
syntax match p "p"
syntax match q "q"
syntax match r "r"
syntax match s "s"
syntax match t "t"
syntax match u "u"
syntax match v "v"
syntax match w "w"
syntax match x "x"
syntax match y "y"
syntax match z "z"

syntax match a "A"
syntax match b "B"
syntax match c "C"
syntax match d "D"
syntax match e "E"
syntax match f "F"
syntax match g "G"
syntax match h "H"
syntax match i "I"
syntax match j "J"
syntax match k "K"
syntax match l "L"
syntax match m "M"
syntax match n "N"
syntax match o "O"
syntax match p "P"
syntax match q "Q"
syntax match r "R"
syntax match s "S"
syntax match t "T"
syntax match u "U"
syntax match v "V"
syntax match w "W"
syntax match x "X"
syntax match y "Y"
syntax match z "Z"

" syntax match caseWord " for "
" syntax match caseWord " ob "
" syntax match caseWord " su "

" numbers
syntax match n0 "0"
syntax match n1 "1"
syntax match n2 "2"
syntax match n3 "3"
syntax match n4 "4"
syntax match n5 "5"
syntax match n6 "6"
syntax match n7 "7"
syntax match n8 "8"
syntax match n9 "9"
" symbols
syntax match period "\."
syntax match comma "\,"
syntax match question "?"
syntax match semicomma "\;"
syntax match colon "\:"
syntax match amper "&"
syntax match dollar "\$"
syntax match wave "\~"
syntax match equal "="
syntax match add "+"
syntax match sub "-"
syntax match div "\/"
syntax match mul "\*"
syntax match percent "%"
syntax match hash "#"
syntax match atsign "@"
syntax match esc "\\"
syntax match pipe "|"
syntax match doublequote "\""
syntax match apostrophe "'"
syntax match parentheses "("
syntax match parentheses ")"
syntax match squarebracket "\["
syntax match squarebracket "\]"
syntax match curlybrace "}"
syntax match curlybrace "{"
syntax match chevron "<"
syntax match chevron ">"
syntax match underscore "_"
syntax match grave "`"

" emoji
syntax match emojiFaces "[😀-😷]"

" highlight default link caseWord BgGray 

" Latin letters
highlight default link i Black
highlight default link period Lgray
highlight default link o White

highlight default link a RedVowel
highlight default link c Scarlet
highlight default link w Orange
highlight default link s Amber
highlight default link y Yellow
highlight default link e LimeVowel
highlight default link l Chartr
highlight default link d Harleq
highlight default link k Green
highlight default link g Libre
highlight default link t Lspring
highlight default link q Mspring
highlight default link u CyanVowel
highlight default link b Sky
highlight default link v Dodger
highlight default link h Royal
highlight default link p Blue
highlight default link z Han
highlight default link n Indigo
highlight default link x Purple
highlight default link m Magenta
highlight default link j Hmagent
highlight default link f Pink
highlight default link r Torch

" NUMBERS
highlight default link n0 Black
highlight default link n1 Red
highlight default link n2 Orange
highlight default link n3 Yellow
highlight default link n4 Green
highlight default link n5 Cyan
highlight default link n6 Blue
highlight default link n7 Magenta
highlight default link n8 White
highlight default link n9 Scarlet

" PUNCTUATION
"highlight default link period LightGray
highlight default link comma Red
highlight default link question Blue
highlight default link semicomma Magenta
highlight default link colon LightGray
highlight default link amper Green
highlight default link dollar Yellow
highlight default link wave Blue
highlight default link equal Green
highlight default link add Red
highlight default link sub Blue
highlight default link mul Yellow
highlight default link div Cyan
highlight default link percent Cyan
highlight default link hash Green
highlight default link atsign LightGray
highlight default link esc Red
highlight default link pipe Blue
highlight default link doublequote Red
highlight default link apostrophe LightGray
highlight default link grave Cyan
highlight default link parentheses Red
highlight default link chevron Yellow
highlight default link curlybrace Green
highlight default link squarebracket Blue
highlight default link underscore LightGray

" emoji
highlight default link emojiFaces Yellow

" COLORS

highlight Gray ctermfg=Gray
highlight DarkGray ctermfg=Gray
highlight BrightGray ctermfg=White
highlight DarkRed ctermfg=DarkRed
highlight nRed ctermfg=DarkRed
highlight nOrange ctermfg=DarkYellow
highlight Chartr ctermfg=LightGreen
highlight DarkGreen ctermfg=DarkGreen
highlight LightGreen ctermfg=LightGreen
highlight Turq ctermfg=Cyan
highlight DarkCyan ctermfg=DarkCyan
highlight Saphire ctermfg=Blue
highlight DarkBlue ctermfg=DarkCyan
highlight DarkMagenta ctermfg=DarkMagenta

highlight GreenVowel ctermfg=Green
highlight BlueVowel ctermfg=Blue

highlight Black 	ctermfg=LightGray	guifg=#9E9E9E
highlight Lgray		ctermfg=White	guifg=#C2C2C2
highlight White		ctermfg=White		guifg=#DADADA
highlight RedVowel	ctermfg=Red		guifg=#F04C4C
highlight Red		ctermfg=Red		guifg=#DA6262
highlight Scarlet	ctermfg=Red		guifg=#DA8062
highlight Orange	ctermfg=Red 	guifg=#DA9E62
highlight Amber		ctermfg=Yellow	guifg=#DABC62
highlight Yellow	ctermfg=Yellow		guifg=#DADA62
highlight YellowVowel	ctermfg=Yellow		guifg=#9EF04C
highlight Lime		ctermfg=Yellow		guifg=#BCDA62
highlight LimeVowel	ctermfg=Yellow		guifg=#C7F04C
highlight Chartr	ctermfg=Green		guifg=#9EDA62
highlight Harleq	ctermfg=Green		guifg=#80DA62
highlight Green		ctermfg=Green	guifg=#62DA62
highlight Libre		ctermfg=Green	guifg=#62DA80
highlight Lspring	ctermfg=Cyan		guifg=#62DA9E
highlight Mspring 	ctermfg=Cyan		guifg=#62DABC
highlight CyanVowel	ctermfg=Cyan		guifg=#4CF0F0
highlight Cyan		ctermfg=Cyan		guifg=#62DADA
highlight Sky		ctermfg=Cyan	guifg=#62BCDA
highlight Dodger	ctermfg=Cyan	guifg=#629EDA
highlight Royal		ctermfg=Blue		guifg=#6280DA
highlight Blue		ctermfg=Blue		guifg=#6262DA
highlight Han		ctermfg=Blue		guifg=#8062DA
highlight Indigo	ctermfg=Magenta	guifg=#9E62DA
highlight Purple 	ctermfg=Magenta	guifg=#BC62DA
highlight Magenta	ctermfg=Magenta		guifg=#DA62DA
highlight Hmagent 	ctermfg=Magenta		guifg=#DA62BC
highlight Pink		ctermfg=Red		guifg=#DA629E
highlight Torch		ctermfg=Red		guifg=#DA6280
"highlight BgRed		guibg=#390D0D
"highlight BgGray	guibg=#3A3A3A
