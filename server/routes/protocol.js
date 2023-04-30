var packets = undefined;
import("../../common/Packets.mjs").then((module)=>{packets = new module.Packets();}); 
var express = require('express');
const { authHelper } = require("../Server.js");
var router = express.Router();

function resolveAfter(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

async function registerServerListeners(){
    while(packets === undefined || authHelper === undefined){
        await resolveAfter(90);
    }
    packets.registerListener(2,(packet)=>{
        authHelper.signUp(packet.username,packet.password);
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

console.log(authHelper);

module.exports = router;
registerServerListeners();