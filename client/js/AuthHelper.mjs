import { AccountInfoRequest, accountInfoRequestHandler } from "../../common/requests/AccountInfoRequest.mjs";
import { LoginAccountRequest, loginAccountRequestHandler } from "../../common/requests/LoginRequest.mjs";
import { SignupAccountRequest, signupAccountRequestHandler } from "../../common/requests/SignupRequest.mjs";
import { client } from "./ClientMain.mjs";

class AuthHelper{
    constructor(){
        this.account = undefined;
    }
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     */
    async registerAccount(username,password){
        var ret = await signupAccountRequestHandler.send(new SignupAccountRequest(username,password));
        client.updateGeneralAccountInfo();
        return ret;
    }
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     */
    async login(username,password){
        var ret = await loginAccountRequestHandler.send(new LoginAccountRequest(username,password));  
        client.updateGeneralAccountInfo();
        return ret;
    }
    async getAccountInfo(dataToAccess){
        var ret = await accountInfoRequestHandler.send(new AccountInfoRequest(dataToAccess));
        console.log(ret);
        return ret;
    }
}

export {AuthHelper};