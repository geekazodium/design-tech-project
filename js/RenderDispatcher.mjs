import { RenederDispatcherContext } from "./render/RenderDispatcherContext.mjs";
import { SkyboxRenderer } from "./render/SkyboxRenderer.mjs";
import { SortedNode } from "./utils/SortedNode.mjs";
import { TerrainRenderer } from "./render/TerrainRenderer.mjs";

class RenderDispatcher{
    constructor(canvas,camera){
        this.rebuildTimer = 0;

        this.init = false;
        this.canvas = canvas;
        if(!this.updateCanvasContext()){
            return;
        }
        this.renderersIdMap = new Map();
        this.renderers = this.initRenderers(this.ctx,this.renderersIdMap);
        this.renderContext = new RenederDispatcherContext(this.ctx);
        this.bufferBuilders = new Array();
        this.camera = camera;
        this.camera.setDispatcher(this);
        this.init = true;
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
    updateCanvasContext(){
        let ctx = this.getContext(this.canvas);
        if(!ctx)return false;
        this.ctx = ctx;
        return true;
    }
    initRenderers(ctx,idMap){
        var renderers = new Array();
        renderers.push(new SkyboxRenderer(ctx));
        renderers.push(new TerrainRenderer(ctx));
        var ret = new SortedNode(renderers,(a,b)=>{return a.getPriority()<b.getPriority();}).getList();
        ret.forEach((item)=>{
            idMap.set(item.id,item);
        });
        return ret;
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
    attachBufferBuilder(bufferBuilder,rendererId){
        this.bufferBuilders.push(bufferBuilder);
        this.renderersIdMap.get(rendererId).attachBufferBuilder(bufferBuilder);
    }
    rebuildBuffers(ctx){
        this.bufferBuilders.forEach((builder)=>{
            builder.rebuild(ctx);
        })
    }
    render(timeStamp){
        this.camera.update();
        this.rebuildTimer--;
        if(this.rebuildTimer<=0){
            this.rebuildTimer = 100;
            this.rebuildBuffers(this.ctx);
        }
        this.renderContext.update(this.canvas,this.camera);
        this.renderers.forEach((renderer)=>{
            renderer.render(this.ctx,timeStamp,this.renderContext);
        });
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
}

export {RenderDispatcher};