import { AccountInfoRequest, accountInfoRequestHandler } from "../../common/requests/AccountInfoRequest.mjs";
import { LoginAccountRequest, loginAccountRequestHandler } from "../../common/requests/LoginRequest.mjs";
import { SignupAccountRequest, signupAccountRequestHandler } from "../../common/requests/SignupRequest.mjs";

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
        return await signupAccountRequestHandler.send(new SignupAccountRequest(username,password));
    }
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     */
    async login(username,password){
        return await loginAccountRequestHandler.send(new LoginAccountRequest(username,password));
    }
    async getAccountInfo(dataToAccess){
        var ret = await accountInfoRequestHandler.send(new AccountInfoRequest(dataToAccess));
        console.log(ret);
        return ret;
    }
}

export {AuthHelper};