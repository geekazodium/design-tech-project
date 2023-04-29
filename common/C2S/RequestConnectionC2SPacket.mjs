import { Packet } from "../Packet.mjs";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class RequestConnectionC2SPacket extends Packet{
    constructor(){
        super(1);
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
        this.username = textDecoder.decode(Buffer.from(buf[0]));
        this.password = textDecoder.decode(Buffer.from(buf[1]));
        console.log(this.username,this.password);
    }
}

export {RequestConnectionC2SPacket};