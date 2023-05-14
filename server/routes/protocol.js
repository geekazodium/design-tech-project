var express = require('express');
const { authHelper } = require("../Server.js");
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
    var cookies = new Cookies(req, res, { keys: keys });
    var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });
    var user = authHelper.getUser(sessionCookie);
    if(user === undefined){
        authHelper.clearCookie(cookies);
    }
    res.send(user);
});

import("../../common/requests/AccountInfoRequest.mjs").then(
    module => {module.accountInfoRequestHandler.listen(router,{"keys":keys,"authHelper":authHelper});}
)
import("../../common/requests/LoginRequest.mjs").then(
    (module)=>{module.loginAccountRequestHandler.listen(router,{"keys":keys,"authHelper":authHelper});}
);
import("../../common/requests/SignupRequest.mjs").then(
    (module)=>{module.signupAccountRequestHandler.listen(router,{"keys":keys,"authHelper":authHelper});}
);
import("../../common/requests/CreateGameRequest.mjs").then(
    (module)=>{module.createGameRequestHandler.listen(router,{"keys":keys,"authHelper":authHelper});}
);

module.exports = router;
module.exports.maxWait = maxWait;
module.exports.maxSize = maxSize;