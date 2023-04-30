import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { SkyboxRenderer } from "../render/SkyboxRenderer.mjs";
import { TerrainRenderer } from "../render/TerrainRenderer.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";

class IngameScreen extends AbstractScreen{
    constructor(params){
        if(params.ingameScreen == undefined){
            super(params.renderDispatcher);
            this.texAtlas = params.assetLoader.terrainTextureAtlas;
            this.terrainBufferBuilder = new TerrainBufferBuilder(this.texAtlas);
            this.renderDispatcher.initRenderers([
                new SkyboxRenderer(this.renderDispatcher.ctx),
                new TerrainRenderer(this.renderDispatcher.ctx)
            ]);
            this.renderDispatcher.attachBufferBuilder(this.terrainBufferBuilder,"terrain","terrainBufferBuilder");
        }else{
            super(params.ingameScreen.renderDispatcher);
            this.terrainBufferBuilder = params.ingameScreen.terrainBufferBuilder;
            this.texAtlas = params.ingameScreen.texAtlas;
        }
    }
}

export {IngameScreen};