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
    async sendClient(packet) {
        const res = await fetch('./game/', {
            method: "PUT",
            body: this.getBuffer(packet)
        });
        return (await res.body.getReader().read()).value;
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
    recieveServer(buffer,res){
        var packetId = buffer[0];
        var packetContainer = this.packetMap.get(packetId);
        var packetClass = packetContainer.class;
        if(packetClass == undefined)return;
        var packet = new packetClass();
        packet.read(buffer);
        this.notifyListeners(packet,packetContainer,res);
    }
    notifyListeners(packet,container,res){
        container.listeners.forEach((callback)=>{
            callback(packet,res);
        });
    }
}

export {Packets};