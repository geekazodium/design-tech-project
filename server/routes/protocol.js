var express = require('express');
const { accountHandler } = require("../Server.js");
const Cookies = require("cookies");

var sha256;
import("../../common/SHA-256.mjs").then((module)=>{
    sha256 = module.sha256; 
    keys = [sha256('GeekaTheDepressed')];
}); 

var router = express.Router();

const maxWait = 100;
const maxSize = 128;

var keys;
router.get('/', function(req, res, next) {
    res.send();
});

router.get('/CookieAuth', async function(req, res, next) {
    const sessionCookie = accountHandler.getRequestAuthCookies(req,res,keys);
    var user = accountHandler.getUser(sessionCookie);
    if(user === undefined){
        accountHandler.clearCookie(cookies);
    }
    res.send(user);
});

import("../../common/requests/AccountInfoRequest.mjs").then(
    module => {module.accountInfoRequestHandler.listen(router,{"keys":keys,"authHelper":accountHandler});}
)
import("../../common/requests/LoginRequest.mjs").then(
    (module)=>{module.loginAccountRequestHandler.listen(router,{"keys":keys,"authHelper":accountHandler});}
);
import("../../common/requests/SignupRequest.mjs").then(
    (module)=>{module.signupAccountRequestHandler.listen(router,{"keys":keys,"authHelper":accountHandler});}
);
import("../../common/requests/CreateGameRequest.mjs").then(
    (module)=>{module.createGameRequestHandler.listen(router,{"keys":keys,"accountHandler":accountHandler});}
);

module.exports = router;
module.exports.maxWait = maxWait;
module.exports.maxSize = maxSize;