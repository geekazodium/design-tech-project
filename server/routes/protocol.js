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
    packets.registerListener(2,(packet,res)=>{
        if(authHelper.signUp(packet.username,packet.password)){
            res.send("success");
            return;
        }
        res.send("failed");
    });
    packets.registerListener(1,(packet,res)=>{
        if(authHelper.login(packet.username,packet.password)){
            res.send("success");
            return;
        }
        res.send("failed");
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
    packets.recieveServer(buffer,res);
});

module.exports = router;
registerServerListeners();