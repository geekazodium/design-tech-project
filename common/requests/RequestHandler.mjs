
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const maxWait = 100;
const maxSize = 256;

const packetHandlers = new Map();

class RequestHandler{
    constructor(){
        packetHandlers.set(this.getPath(),this);
        console.log(this.getPath());
    }
    getPath(){
        return "";
    }
    encodeStringToArray(string){
        return Array.from(textEncoder.encode(string));
    }
    createBuffer(packet){
        return [];
    }
    encodeStringArgs(...args){
        var buffer = [];
        args.forEach(arg=>{
            if(buffer.length>0){
                buffer.push(0);
            }
            buffer = buffer.concat(this.encodeStringToArray(arg));
        });
        return buffer;
    }
    async onResponse(bytes){

    }
    async send(packet){
        try{
            var buffer = this.createBuffer(packet);
            if(buffer.length>255){
                throw new Error("packet buffer too long");
            }
            var bytes = await this.putRequest(buffer,this.getPath());
            return await this.onResponse(bytes);
        }catch(err){
            return err;
        }
    }
    async putRequest(buffer,path){
        const res = await fetch('./game'+path, {
            method: "PUT",
            body: new Uint8Array(buffer)
        });
        return (await res.body.getReader().read()).value;
    }
    resolveAfter(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    //@ClientIgnoreStart
    async readReqBuffer(req,ignoreMaxSize){
        var waitTime = 0;
        while(!req.complete){
            await this.resolveAfter(100);
            waitTime++;
            if(waitTime>maxWait)return;
        }
        return req.read(ignoreMaxSize?undefined:maxSize);
    }
    resolveAfter(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    async readArgsFl(req){
        var buffer = await this.readReqBuffer(req);
        if(buffer == undefined)return undefined;
        var buf = [];
        var currentArg = -1;
        var currentArgLeft = 0;
        for(let i = 0;i<buffer.length;i++){
            let byte = buffer[i];
            if(currentArgLeft == 0){
                currentArgLeft = byte;
                currentArg ++;
                buf.push([]);
                continue;
            }
            buf[currentArg].push(byte);
        }
        return buf;
    }
    async readArgs(req){
        var buffer = await this.readReqBuffer(req);
        if(buffer == undefined)return undefined;
        var buf = [[]];
        var c = 0;
        for(let i = 0;i<buffer.length;i++){
            let byte = buffer[i];
            if(byte == 0){
                buf.push([]);
                c++;
                continue;
            }
            buf[c].push(byte);
        }
        return buf;
    }
    async readStringArgs(req){
        var buf = await this.readArgs(req);
        if(buf === undefined) return;
        var args = [];
        buf.forEach(element =>{
            args.push(textDecoder.decode(new Uint8Array(element)));
        });
        return args;
    }
    async recieve(req,res,next,params){
        res.send();
    }
    listen(router,params){
        /**
         * @param {Response} res
         */
        router.put(this.getPath(),(req,res,next)=>{
            this.recieve(req,res,next,params);
        })
    }
    //@ClientIgnoreEnd
    createRequest(args){
    }
}

export {RequestHandler,packetHandlers};