import { RegisterAccountC2SPacket } from "./C2S/RegisterAccountC2SPacket.mjs";
import { RequestConnectionC2SPacket } from "./C2S/RequestConnectionC2SPacket.mjs";

class Packets{
    constructor(){
        this.packetMap = new Map();
        this.addPacket(RequestConnectionC2SPacket);
        this.addPacket(RegisterAccountC2SPacket);
    }
    registerListener(packetId,listener){
        var packet = this.packetMap.get(packetId);
        packet.listeners.push(listener);
    }
    addPacket(packetClass){
        this.packetMap.set(new packetClass().id,{"class":packetClass,"listeners":[]});
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
        var packetContainer = this.packetMap.get(packetId);
        var packetClass = packet.class;
        if(packetClass == undefined)return;
        var packet = new packetClass();
        packet.read(buffer);
        this.notifyListeners(packet,packetContainer);
    }
    recieveServer(buffer){
        var packetId = buffer[0];
        var packetContainer = this.packetMap.get(packetId);
        var packetClass = packetContainer.class;
        if(packetClass == undefined)return;
        var packet = new packetClass();
        packet.read(buffer);
        this.notifyListeners(packet,packetContainer);
    }
    notifyListeners(packet,container){
        container.listeners.forEach((callback)=>{
            callback(packet);
        });
    }
}

export {Packets};