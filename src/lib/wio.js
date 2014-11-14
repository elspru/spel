"use strict";
exports.fileRead = function(url){
var xmlhttp, text;
xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', url, false);
xmlhttp.send();
text = xmlhttp.responseText;
return text;
}
