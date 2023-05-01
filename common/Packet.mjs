class Packet{
    constructor(id){
        this.id = id;
        this.listeners = [];
        if(id == undefined) this.id = 0;
    }
    write(){
        return [];
    }
    read(buffer){
        
    }
}

export {Packet};