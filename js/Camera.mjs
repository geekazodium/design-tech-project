import { InterfaceHelper } from "./InterfaceHelper.mjs";
import * as Vec3 from "/libraries/esm/vec3.js";

class Camera{
    constructor(canvas,mouseInputHandler){
        this.canReorient = true;
        this.interfaceHelper = new InterfaceHelper(canvas,this);
        this.position = new Float32Array(3);
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
    move(x,y,z){
        this.position[0] += x;
        this.position[1] += y;
        this.position[2] += z;
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