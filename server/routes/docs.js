var express = require('express');
var router = express.Router();
const fs = require('fs');
const commons = new Map();
function loadFile(fileName){
    fs.readFile("./docs"+fileName, {encoding:"utf-8"}, function (err, f) {
        if (err) {
            return console.error(err);
        }
        commons.set(fileName.split(".")[0],f);
    });
}
loadFile("/security.html");
loadFile("/404.html");

router.get('/*', function(req, res, next) {
    var url = req.url.trimStart();
    if(url.includes('"')||url.includes("..")||url.includes("%22"))return;
    if(!commons.has(url)){
        url = "/404";
    }
    res.setHeader("Content-Type","text/html");
    res.send(commons.get(url));
});

module.exports = router;
