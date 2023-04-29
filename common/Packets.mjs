class Packets{
    constructor(){
        
    }
    getBuffer(packet){
        console.log([packet.id].concat(packet.write()));
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
}

export {Packets};