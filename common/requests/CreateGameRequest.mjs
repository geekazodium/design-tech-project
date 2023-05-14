//@ClientIgnoreStart
import Cookies from "cookies";
import { AuthHelper } from "../../server/AuthHandler.js";
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
        var dataToAccess = this.encodeStringToArray(packet.dataToAccess);
        return dataToAccess;
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
     * @param {AuthHelper} params.authHelper
     * @returns 
     */
    async recieve(req,res,next,params){
        var args = await this.readArgs(req);
        if(args === undefined)return;
    }
    //@ClientIgnoreEnd
}

const createGameRequestHandler = new CreateGameRequestHandler();

export {CreateGameRequest,createGameRequestHandler};