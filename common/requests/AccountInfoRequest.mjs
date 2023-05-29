//@ClientIgnoreStart
import Cookies from "cookies";
import { AccountHandler } from "../../server/AccountHandler.js";
//@ClientIgnoreEnd

import { RequestHandler } from "./RequestHandler.mjs";
const path = "/AccountInfo";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class AccountInfoRequest{
    constructor(dataToAccess){
        this.dataToAccess = dataToAccess;
    }
}

class AccountInfoRequestHandler extends RequestHandler{
    getPath(){
        return path;
    }
    createBuffer(packet){
        var dataToAccess = this.encodeStringToArray(packet.dataToAccess);
        return dataToAccess;
    }
    async onResponse(bytes){
        return textDecoder.decode(bytes);
    }
    //@ClientIgnoreStart
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @param {Object} params 
     * @param {AccountHandler} params.authHelper
     * @returns 
     */
    async recieve(req,res,next,params){
        var args = await this.readArgs(req);
        if(args === undefined)return;
        var dataToAccess = textDecoder.decode(Buffer.from(args[0]));
        var authHelper = params.authHelper;
        var cookies = new Cookies(req, res, { keys: params.keys });
        var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });
        var account = authHelper.getUser(sessionCookie);
        if(account === undefined){
            authHelper.clearCookie(cookies);
            res.send("");
            return;
        }
        console.log("Data Accessed:"+dataToAccess);
        res.send(authHelper.getUserData(account));
    }
    //@ClientIgnoreEnd
}

const accountInfoRequestHandler = new AccountInfoRequestHandler();

export {AccountInfoRequest,accountInfoRequestHandler};