var packets;
import("./../common/Packets.mjs").then((module)=>{packets = new module.Packets();}); 
var express = require('express');
var router = express.Router();

function resolveAfter(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

router.get('/', function(req, res, next) {
    res.send();
});

router.put('/',async function(req, res, next){
    while(!req.complete){
        await resolveAfter(100);
    }
    var buffer = req.read();
    if(!buffer)return;
    packets.recieveServer(buffer);
    res.send();
});

module.exports = router;