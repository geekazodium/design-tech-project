import { Packet } from "../Packet.mjs";

const textEncoder = new TextEncoder();

class RequestConnectionC2SPacket extends Packet{
    constructor(){
        super(1);
    }
    setPassword(password){
        var password = Array.from(textEncoder.encode(password));
        this.password = password //TODO encrypt password
    }
    setUserName(userName){
        this.userName = Array.from(textEncoder.encode(userName));
    }
    write(){
        return this.userName.concat(0).concat(this.password);
    }
}

export {RequestConnectionC2SPacket};