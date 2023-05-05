import { client } from "../ClientMain.mjs";
import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { SkyboxRenderer } from "../render/SkyboxRenderer.mjs";
import { TerrainRenderer } from "../render/TerrainRenderer.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";

class IngameScreen extends AbstractScreen{
    constructor(params){
        if(params.ingameScreen == undefined){
            super(params.renderDispatcher);
            var init = async()=>{
                while(params.assetLoader.blockTextureMap == undefined){
                    await this.resolveAfter(200);
                }
                this.texAtlas = params.assetLoader.terrainTextureMap;
                this.blockTextureMap = params.assetLoader.blockTextureMap;
                this.terrainBufferBuilder = new TerrainBufferBuilder(this.texAtlas,this.blockTextureMap);
                this.renderDispatcher.initRenderers([
                    new SkyboxRenderer(this.renderDispatcher.ctx),
                    new TerrainRenderer(this.renderDispatcher.ctx)
                ]);
                this.renderDispatcher.attachBufferBuilder(this.terrainBufferBuilder,"terrain","terrainBufferBuilder");
                client.mouseInputHandler.canLock = true;
            }
            init();
        }else{
            super(params.ingameScreen.renderDispatcher);
            this.terrainBufferBuilder = params.ingameScreen.terrainBufferBuilder;
            this.texAtlas = params.ingameScreen.texAtlas;
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