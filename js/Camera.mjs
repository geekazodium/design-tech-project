import { InterfaceHelper } from "./InterfaceHelper.mjs";

class Camera{
    constructor(canvas){
        this.canReorient = true;
        this.interfaceHelper = new InterfaceHelper(canvas,this);
        this.pitch = 0;
        this.yaw = 0;
        window.addEventListener("mousemove",(event)=>{this.onMouseMove(event)});
        canvas.addEventListener("mouseclick",(event)=>{this.onMouseClick(event)});
    }
    onMouseMove(event){
        if(this.canReorient){
            this.pitch += event.movementY*0.01;
            this.pitch = clamp(this.pitch,-Math.PI/2,Math.PI/2);
            this.yaw += event.movementX*0.01;
        }
    }
    onMouseClick(event){
        this.interfaceHelper.canvas.requestPointerLock();
        this.interfaceHelper.canvas.requestPointerHide();
    }
    update(){
        if(this.canReorient){
            
        }
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