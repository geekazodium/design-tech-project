//@ClientIgnoreStart
import Cookies from "cookies";
import { AccountHandler } from "../../server/AccountHandler.js";
//@ClientIgnoreEnd

import { RequestHandler } from "./RequestHandler.mjs";
const path = "/CreateGame";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

class CreateGameRequest{
    /**
     * 
     * @param {Object} settings 
     * @param {Boolean} settings.join
     * @param {String} settings.name
     */
    constructor(settings){
        this.join = settings.join;
        this.name = settings.name;
    }
}

class CreateGameRequestHandler extends RequestHandler{
    getPath(){
        return path;
    }
    createBuffer(packet){
        console.log(packet);
        return this.encodeStringArgs(packet.join,packet.name);
    }
    async onResponse(bytes){
        return textDecoder.decode(bytes);
    }
    //@ClientIgnoreStart
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     * @param {Object} params 
     * @param {AccountHandler} params.accountHandler
     * @returns 
     */
    async recieve(req,res,next,params){
        var args = await this.readStringArgs(req);
        if(args === undefined)return;
        
        params.accountHandler.createGame();
        console.log(args);
        res.send();
    }
    //@ClientIgnoreEnd
    createRequest(args){
        return new CreateGameRequest({"join":args[0],"name":args[1]});
    }
}

const createGameRequestHandler = new CreateGameRequestHandler();

export {CreateGameRequest,createGameRequestHandler};