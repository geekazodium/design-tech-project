import { Packet } from "../Packet.mjs";
import { sha256 } from "../SHA-256.mjs";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
var _crypto_;
if (typeof window === 'undefined'){
    import("crypto").then((mod)=>{
        _crypto_ = mod;
    });
}

class RegisterAccountC2SPacket extends Packet{
    constructor(){
        super(2);
    }
    setPassword(password){
        var password = Array.from(textEncoder.encode(password));
        this.password = password; //TODO encrypt password
    }
    setUserName(userName){
        this.userName = Array.from(textEncoder.encode(userName));
    }
    write(){
        return this.userName.concat(0).concat(this.password);
    }
    read(buffer){
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
        var salt = this.encodeToHex(_crypto_.randomBytes(64));
        this.username = textDecoder.decode(Buffer.from(buf[0]));
        this.password = sha256(textDecoder.decode(Buffer.from(buf[1])).concat(salt));
        console.log(this.username,this.password,salt);
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

export {RegisterAccountC2SPacket};