var Language = require("../../lang/language");
var mwak = new Language();

module.exports = Mwak;
function Mwak(srcBase){
return mwak;
}

Mwak.prototype.code = function(){console.log("blah"); return "mwak"};
exports.code = function(){console.log("blah"); return "mwak"};
