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
        var salt = this.encodeToHex(this._crypto_.randomBytes(64));
        var hash = sha256(password.concat(salt));
        this.users.set(user,{"salt": salt,"hash": hash});
        console.log(this.users);
    }
    login(user,password){

    }
    encodeToHex(array){
        var l = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
        var s = [];
        array.forEach(n => {
            s.push(l[n&0xf]);
            s.push(l[(n>>4)&0xf]);
        });
        return s.join("");
    }
}

exports.AuthHelper = AuthHelper;