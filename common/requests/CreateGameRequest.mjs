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
        alert( textDecoder.decode(bytes));
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
        var authUser = params.accountHandler.getRequestUser(req,res,params.keys);
        var settings = this.createReqSettings(args);
        var gameInfo = params.accountHandler.createGame(authUser,settings);
        console.log(settings);
        res.send(gameInfo);
    }
    //@ClientIgnoreEnd
    createReqSettings(args){
        return {"join":args[0],"name":args[1]}
    }
    createRequest(args){
        return new CreateGameRequest(this.createReqSettings(args));
    }
}

const createGameRequestHandler = new CreateGameRequestHandler();

export {CreateGameRequest,createGameRequestHandler};