class Packet{
    constructor(id){
        this.id = id;
        if(id == undefined) this.id = 0;
    }
    write(){
        return [];
    }
    read(){

    }
}

export {Packet};