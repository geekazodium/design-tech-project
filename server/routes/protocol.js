var packets = undefined;
import("../../common/Packets.mjs").then((module)=>{packets = new module.Packets();}); 
var express = require('express');
const { authHelper } = require("../Server.js");
const Cookies = require("cookies");
var sha256;
import("../../common/SHA-256.mjs").then((module)=>{
    sha256 = module.sha256; 
    keys = [sha256('GeekaTheDepressed')];
}); 
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
    packets.registerListener(1,(packet,res,req)=>{
        if(authHelper.login(packet.username,packet.password)){

            var cookies = new Cookies(req, res, { keys: keys });

            var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });

            if(sessionCookie !== undefined){
                authHelper.invalidateCookie(sessionCookie);
            }

            cookies.set(
                authHelper.sessionCookieId, 
                authHelper.createSessionCookie(packet.username), 
                { signed: true }
            );

            authHelper.getUser(sessionCookie);

            res.send("success");
            return;
        }
        res.send("failed");
    });
}
const maxWait = 100;
const maxSize = 128;

var keys;
router.get('/', function(req, res, next) {
    res.send();
});

async function readReqBuffer(req,ignoreMaxSize){
    var waitTime = 0;
    while(!req.complete){
        await resolveAfter(100);
        waitTime++;
        if(waitTime>maxWait)return;
    }
    return req.read(ignoreMaxSize?undefined:maxSize);
}

router.get('/CookieAuth', async function(req, res, next) {
    var cookies = new Cookies(req, res, { keys: keys });
    var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });
    var user = authHelper.getUser(sessionCookie);
    if(user === undefined){   
        cookies.set(
            authHelper.sessionCookieId, 
            "", 
            { signed: true }
        );
    }
    res.send(user);
});

router.put('/Login',async function(req, res){
    var buffer = readReqBuffer(req);
    //read packet
    var buf = [[]];
    var c = 0;
    for(let i = 1;i<buffer.length;i++){
        let byte = buffer[i];
        if(byte == 0){
            buf.push([]);
            c++;
            continue;
        }
        buf[c].push(byte);
    }
    var username = textDecoder.decode(Buffer.from(buf[0]));
    var password = textDecoder.decode(Buffer.from(buf[1]));

    if(authHelper.login(username,password)){
        var cookies = new Cookies(req, res, { keys: keys });

        var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });

        if(sessionCookie !== undefined){
            authHelper.invalidateCookie(sessionCookie);
        }

        cookies.set(
            authHelper.sessionCookieId, 
            authHelper.createSessionCookie(packet.username), 
            { signed: true }
        );

        authHelper.getUser(sessionCookie);

        res.send("success");
        return;
    }
    res.send("failed");
});

router.put('/',async function(req, res, next){
    var waitTime = 0;
    while(!req.complete){
        await resolveAfter(100);
        waitTime++;
        if(waitTime>maxWait)return;
    }
    var buffer = req.read();
    if(!buffer)return;
    packets.recieveServer(buffer,res,req);
});

module.exports = router;
module.exports.maxWait = maxWait;
module.exports.maxSize = maxSize;
registerServerListeners();