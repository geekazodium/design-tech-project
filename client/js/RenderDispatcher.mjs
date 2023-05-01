import { RenederDispatcherContext } from "./render/RenderDispatcherContext.mjs";
import { SkyboxRenderer } from "./render/SkyboxRenderer.mjs";
import { SortedNode } from "./utils/SortedNode.mjs";
import { TerrainRenderer } from "./render/TerrainRenderer.mjs";

class RenderDispatcher{
    constructor(canvas,camera){
        this.rebuildTimer = 0;
        this.init = false;
        this.preRender = ()=>{};
        this.canvas = canvas;
        if(!this.updateCanvasContext()){
            return;
        }
        this.renderersIdMap = new Map();
        this.renderers = new Array();
        this.renderContext = new RenederDispatcherContext(this.ctx);
        this.bufferBuilders = new Map();
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
    initRenderers(renderers){
        var idMap = new Map();
        var ret = new SortedNode(renderers,(a,b)=>{return a.getPriority()<b.getPriority();}).getList();
        ret.forEach((item)=>{
            idMap.set(item.id,item);
        });
        this.renderers = ret;
        this.renderersIdMap = idMap;
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
    attachBufferBuilder(bufferBuilder,rendererId,key){
        this.bufferBuilders.set(key,bufferBuilder);
        this.renderersIdMap.get(rendererId).attachBufferBuilder(bufferBuilder);
    }
    async rebuildBuffers(ctx){
        this.bufferBuilders.forEach((builder,key)=>{
            builder.rebuild(ctx);
        });
    }
    render(timeStamp){
        this.preRender();
        this.camera.update();
        this.renderContext.update(this.canvas,this.camera);
        this.renderers.forEach((renderer)=>{
            renderer.render(this.ctx,timeStamp,this.renderContext);
        });
        this.rebuildTimer--;
        if(this.rebuildTimer<=0){
            this.rebuildTimer = 100;
            this.rebuildBuffers(this.ctx);
        }
        window.requestAnimationFrame((time)=>{this.render(time);});
    }
}

export {RenderDispatcher};