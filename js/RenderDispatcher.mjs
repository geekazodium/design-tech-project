import { InterfaceHelper } from "./InterfaceHelper.mjs";
import { SkyboxRenderer } from "./SkyboxRenderer.mjs";
import { SortedNode } from "./SortedNode.mjs";

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
        this.renderers = this.initRenderers();
        this.init = true;
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
    initRenderers(){
        var renderers = new Array();
        renderers.push(new SkyboxRenderer());
        return new SortedNode(renderers,(a,b)=>{return a.getPriority()<b.getPriority();}).getList();
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
    render(timeStamp){
        this.renderers.forEach((renderer)=>{
            renderer.render(this.ctx,timeStamp);
        });
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
}

export {RenderDispatcher};