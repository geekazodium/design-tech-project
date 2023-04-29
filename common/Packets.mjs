import { RequestConnectionC2SPacket } from "./C2S/RequestConnectionC2SPacket.mjs";

class Packets{
    constructor(){
        this.packetMap = new Map();
        this.packetMap.set(new RequestConnectionC2SPacket().id,RequestConnectionC2SPacket);
    }
    getBuffer(packet){
        return new Uint8Array([packet.id].concat(packet.write()));
    }
    sendClient(packet) {
        fetch('./game/', {
            method: "PUT",
            body: this.getBuffer(packet)
        })
        .then(res => {this.res = res})
        .catch(err => alert(err));
    }
    sendServer(packet,res) {
        res.send(this.getBuffer(packet));
    }
    recieveClient(buffer){
        var packetId = buffer[0];
        var packetClass = this.packetMap.get(packetId);
        if(packetClass == undefined)return;
        var packet = new packetClass();
        packet.read(buffer);
    }
    recieveServer(buffer){
        var packetId = buffer[0];
        var packetClass = this.packetMap.get(packetId);
        if(packetClass == undefined)return;
        var packet = new packetClass();
        packet.read(buffer);
    }
}

export {Packets};