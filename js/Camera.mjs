import { InterfaceHelper } from "./InterfaceHelper.mjs";

class Camera{
    constructor(canvas){
        this.interfaceHelper = new InterfaceHelper(canvas,this);
        this.pitch = 0;
        this.yaw = 0;
    }
    update(){
        this.pitch+=0;
        this.yaw+=0.01;
    }
    setDispatcher(renderDispatcher){
        this.renderDispatcher = renderDispatcher;
    }
}

export {Camera};