//@ClientIgnoreStart
import Cookies from "cookies";
//@ClientIgnoreEnd

import { RequestHandler } from "./RequestHandler.mjs";
const path = "/Signup";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class SignupAccountRequest{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}

class SignupAccountRequestHandler extends RequestHandler{
    getPath(){
        return path;
    }
    createBuffer(packet){
        var _password = this.encodeStringToArray(packet.password);
        var _username = this.encodeStringToArray(packet.username);
        return _username.concat(0).concat(_password); //TODO optimze this
    }
    onResponse(bytes){
        if(bytes[0] == 115) return "success!";
        else throw new Error("failed to create account");
    }
    //@ClientIgnoreStart
    async recieve(req,res,next,params){
        var args = await this.readArgs(req);
        if(args == undefined)return;
        var username = textDecoder.decode(Buffer.from(args[0]));
        var password = textDecoder.decode(Buffer.from(args[1]));
        var authHelper = params.authHelper;

        if(authHelper.signUp(username,password)){
            var cookies = new Cookies(req, res, { keys: params.keys });

            var sessionCookie = cookies.get(authHelper.sessionCookieId, { signed: true });

            if(sessionCookie !== undefined){
                authHelper.invalidateCookie(sessionCookie);
            }

            cookies.set(
                authHelper.sessionCookieId, 
                authHelper.createSessionCookie(username), 
                { signed: true }
            );
            
            res.send("success");
            return;
        }
        res.send("failed");
    }
    //@ClientIgnoreEnd
}

const signupAccountRequestHandler = new SignupAccountRequestHandler();

export {SignupAccountRequest,signupAccountRequestHandler};