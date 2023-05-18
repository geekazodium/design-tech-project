const Cookies = require("cookies");
const { Game } = require("./Game.js");

var sha256;
import("../common/SHA-256.mjs").then((module)=>{sha256 = module.sha256;}); 

class AccountHandler{
    constructor(){
        this.sessionCookieId = "session";
        this.users = new Map();
        this.sessions = new Map();
        this.activeGames = new Map();
        this._crypto_;
        if (typeof window === 'undefined'){
            import("crypto").then((mod)=>{
                this._crypto_ = mod;
            });
        }
    }
    getUserData(user){
        var ret = this.users.get(user);
        if(ret === undefined)return undefined;
        return ret.data;
    }
    signUp(user,password){
        if(this.users.has(user))return false;
        var salt = this.encodeToB64(this._crypto_.randomBytes(66));
        var hash = sha256(password.concat(salt));
        this.users.set(user,{"salt": salt,"hash": hash,"data":{
            "currentGame":undefined
        }});
        return true;
    }
    setGame(cookie){
        
    }
    createGame(user,settings){
        var userData = this.users.get(user);
        if(userData === undefined){
            return "you are not logged in!";
        }
        if(userData.currentGame !== undefined){
            return "you are currently in a game!";
        }
        var game = new Game(user,settings.name);
        userData.currentGame = game;
        this.activeGames.set(game.name,game);
        return game.name;
    }
    login(user,password){
        if(!this.users.has(user))return false;
        var userContainer = this.users.get(user);
        var hash = sha256(password.concat(userContainer.salt));
        return hash === userContainer.hash;
    }
    getUser(cookie){
        return this.sessions.get(cookie);
    }
    invalidateCookie(cookie){
        this.sessions.delete(cookie);
    }
    clearCookie(cookies){
        cookies.set(
            this.sessionCookieId, 
            "", 
            { signed: true }
        );
    }
    createSessionCookie(user){
        var cookie;
        do{
            cookie = this.encodeToB64(this._crypto_.randomBytes(66));
        }while(this.sessions.has(cookie));
        this.sessions.set(cookie,user);
        return cookie;
    }
    encodeToB64(array){
        var l = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ=_";
        var s = [];
        var extraBits = 0;
        var extraLength = 0;
        array.forEach(n => {
            s.push(l[n&0b111111]);
            extraBits = extraBits<<2;
            extraLength += 2;
            extraBits += n>>6;
            if(extraLength>=6){
                extraLength = 0;
                s.push(l[extraBits&0b111111]);
                extraBits = 0;
            }
        });
        return s.join("");
    }
    /**
     * @deprecated does not check cookie validity
     * @returns 
     */
    getRequestAuthCookies(req,res,keys){
        var cookies = new Cookies(req, res, { keys: keys });
        var sessionCookie = cookies.get(this.sessionCookieId, { signed: true });
        return sessionCookie;
    }
    getRequestUser(req,res,keys){
        var cookies = new Cookies(req, res, { keys: keys });
        var sessionCookie = cookies.get(this.sessionCookieId, { signed: true });
        var user = this.getUser(sessionCookie);
        if(user === undefined){
            this.clearCookie(cookies);
        }
        return user;
    }
}

exports.AccountHandler = AccountHandler;