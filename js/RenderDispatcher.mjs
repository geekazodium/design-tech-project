import { InterfaceHelper } from "./InterfaceHelper.mjs";

class RenderDispatcher{
    constructor(canvas){
        this.init = false;
        this.canvas = canvas;
        this.interfaceHelper = new InterfaceHelper(canvas);
        {
            let ctx = this.getContext(this.canvas);
            if(!ctx)return;
            this.ctx = ctx;
        }
        this.init = true;
    }
    getContext(canvas){
        let ctx = canvas.getContext("webgl");
        if(ctx)return ctx;
        console.warn("browser does not support webgl, attempting to fallback on experimental");
        ctx = canvas.getContext("experimental-webgl");
        if(ctx)return ctx;
        console.error("browser does not support experimental webgl, shutting down...");
        return false;
    }
}

export {RenderDispatcher};