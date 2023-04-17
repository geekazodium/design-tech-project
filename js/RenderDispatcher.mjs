import { InterfaceHelper } from "./InterfaceHelper.mjs";
import { RenederDispatcherContext } from "./RenderDispatcherContext.mjs";
import { SkyboxRenderer } from "./SkyboxRenderer.mjs";
import { SortedNode } from "./SortedNode.mjs";

class RenderDispatcher{
    constructor(canvas,camera){
        this.init = false;
        this.canvas = canvas;
        this.interfaceHelper = new InterfaceHelper(canvas);
        {
            let ctx = this.getContext(this.canvas);
            if(!ctx)return;
            this.ctx = ctx;
        }
        this.renderers = this.initRenderers(this.ctx);
        this.renderContext = new RenederDispatcherContext(this.ctx);
        this.camera = camera;
        this.init = true;
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
    initRenderers(ctx){
        var renderers = new Array();
        renderers.push(new SkyboxRenderer(ctx));
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
        this.camera.update();
        this.renderContext.update(this.canvas,this.camera);
        this.renderers.forEach((renderer)=>{
            renderer.render(this.ctx,timeStamp,this.renderContext);
        });
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
}

export {RenderDispatcher};