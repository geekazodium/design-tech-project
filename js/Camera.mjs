import { InterfaceHelper } from "./InterfaceHelper.mjs";

class Camera{
    constructor(canvas,mouseInputHandler){
        this.canReorient = true;
        this.interfaceHelper = new InterfaceHelper(canvas,this);
        this.pitch = 0;
        this.yaw = 0;
        this.mouseInputHandler = mouseInputHandler;
    }
    onMouseMove(delta){
        var dx = delta[0];
        var dy = delta[1];
        if(this.canReorient){
            this.pitch = clamp(this.pitch + dy * 0.01,-Math.PI/2,Math.PI/2);
            this.yaw += dx*0.01;
        }
    }
    update(){
        this.onMouseMove(this.mouseInputHandler.getMovedBy());
    }
    setDispatcher(renderDispatcher){
        this.renderDispatcher = renderDispatcher;
    }
}

function clamp(n,min,max){
    if(n>max)return max;
    if(n<min)return min;
    return n;
}

export {Camera};