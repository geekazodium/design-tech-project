var express = require('express');
const fs = require('fs');
var router = express.Router();
const commons = new Map();
function loadFile(fileName){
    fs.readFile("./common"+fileName, {encoding:"utf-8"}, function (err, f) {
        if (err) {
            return console.error(err);
        }
        var ignore = false;
        var content = f.split("\n");
        var filtered = [];
        content.forEach(line => {
            if(line.includes("//@ClientIgnoreStart")){
                ignore = true;
                return;
            }
            if(line.includes("//@ClientIgnoreEnd")){
                ignore = false;
                return;
            }
            if(ignore) return;
            filtered.push(line);
        })
        commons.set(fileName,filtered.join("\n"));
    });
}
loadFile("/requests/LoginRequest.mjs");
loadFile("/requests/RequestHandler.mjs");
loadFile("/requests/SignupRequest.mjs");
loadFile("/requests/AccountInfoRequest.mjs");
loadFile("/SHA-256.mjs");
loadFile("/BigInteger.js");

router.get('/*', function(req, res, next) {
    var url = req.url.trimStart();
    if(url.includes('"')||url.includes("..")||url.includes("%22"))return;
    res.setHeader("Content-Type","application/javascript");
    res.send(commons.get(url));
});

router.get('/', function(req, res, next) {
    res.send("plink");
});

module.exports = router;