var sha256;
import("../common/SHA-256.mjs").then((module)=>{sha256 = module.sha256;}); 

class AuthHelper{
    constructor(){
        this.users = new Map();
        this._crypto_;
        if (typeof window === 'undefined'){
            import("crypto").then((mod)=>{
                this._crypto_ = mod;
            });
        }
    }
    signUp(user,password){
        if(this.users.has(user))return false;
        var salt = this.encodeToHex(this._crypto_.randomBytes(66));
        var hash = sha256(password.concat(salt));
        this.users.set(user,{"salt": salt,"hash": hash});
        console.log(this.users);
        return true;
    }
    login(user,password){
        if(!this.users.has(user))return false;
        var userContainer = this.users.get(user);
        var hash = sha256(password.concat(userContainer.salt));
        console.log(hash,userContainer.hash);
        return hash === userContainer.hash;
    }
    encodeToHex(array){
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
}

exports.AuthHelper = AuthHelper;