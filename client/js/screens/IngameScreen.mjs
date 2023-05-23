import { client } from "../ClientMain.mjs";
import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { SkyboxRenderer } from "../render/SkyboxRenderer.mjs";
import { TerrainRenderer } from "../render/TerrainRenderer.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";

var lastIngamescreen = undefined;

class IngameScreen extends AbstractScreen{
    constructor(params,parent){
        if(lastIngamescreen == undefined){
            super(params.renderDispatcher,parent);
            var init = async()=>{
                while(params.assetLoader.blockTextureMap == undefined){
                    await this.resolveAfter(200);
                }
                this.texAtlas = params.assetLoader.terrainTextureMap;
                this.blockTextureMap = params.assetLoader.blockTextureMap;
                this.terrainBufferBuilder = new TerrainBufferBuilder(this.texAtlas,this.blockTextureMap);
                this.renderers = [
                    new SkyboxRenderer(this.renderDispatcher.ctx),
                    new TerrainRenderer(this.renderDispatcher.ctx)
                ];
                this.renderDispatcher.initRenderers(this.renderers);
                this.renderDispatcher.attachBufferBuilder(this.terrainBufferBuilder,"terrain","terrainBufferBuilder");
                client.mouseInputHandler.canLock = true;
            }
            init();
            lastIngamescreen = this;
        }else{
            super(lastIngamescreen.renderDispatcher,parent);
            this.terrainBufferBuilder = lastIngamescreen.terrainBufferBuilder;
            this.texAtlas = lastIngamescreen.texAtlas;
            this.renderers = lastIngamescreen.renderers;
            this.renderDispatcher.initRenderers(
                this.renderers
            );
            this.renderDispatcher.attachBufferBuilder(this.terrainBufferBuilder,"terrain","terrainBufferBuilder");
        }
    }
    resolveAfter(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
}

export {IngameScreen};