import { BlockTextureMap } from "../render/BlockTextureMap.mjs";
import { TerrainTextureAtlasBuilder } from "./TerrainTextureAtlasBuilder.mjs";

class AssetLoader{
    constructor(path){ 
        this.path = path;
        this.loaders = new Map();
        this.terrainTextureAtlasBuilder = new TerrainTextureAtlasBuilder();
        this.blockTextureMap = undefined;
        this.blockTextureFile = undefined;
        this.terrainTextureAtlas = undefined;
        this.initImgLoader();
        this.initBBMLoader();
        this.initTerrainTextureAtlasBuilder();
        this.initBlockTextureFile();
        this.bbModels = [];
    }
    initImgLoader(){
        this.loaders.set("img",(element)=>{
            var img = new Image(element.width,element.height);
            img.src = element.src;
            img.id = element.id;
            document.body.appendChild(img);
        });
    }
    initBBMLoader(){
        this.loaders.set("bbModel",(element)=>{
            fetch(element.src)
                .then((response) => response.json())
                .then((json) => {
                    this.bbModels.push(json);
                });
        });
    }
    resolveAfter(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    initTerrainTextureAtlasBuilder(){
        this.loaders.set("textureRefsheet",(element)=>{
            if(element.target == "terrainAssets"){
                fetch(element.src)
                    .then((response) => response.json())
                    .then((json) => {
                        this.terrainTextureAtlas = this.terrainTextureAtlasBuilder.load(json);
                        var async_section = async ()=>{
                            while(this.blockTextureFile == undefined){
                                await this.resolveAfter(100);
                            }
                            this.blockTextureMap = new BlockTextureMap(
                                this.blockTextureFile,
                                this.terrainTextureAtlas
                                );
                        }
                        async_section();
                    });
            }
        });
    }
    initBlockTextureFile(){
        this.loaders.set("blockTextureFile",(element)=>{
            fetch(element.src)
            .then((response) => response.json())
            .then((json) => {
                this.blockTextureFile = json;
            });
        });
    }
    load(res){
        this.json = undefined;
        fetch(this.path)
            .then((response) => response.json())
            .then((json) => {
                json.forEach(element => {
                    this.loadItem(element);
                });
                this.onSpinWait(()=>{
                    if(this.terrainTextureAtlasBuilder.startedCount<=0)return false;
                    return this.terrainTextureAtlasBuilder.startedCount==this.terrainTextureAtlasBuilder.finishedCount;
                },()=>{res();});
            });
    }
    onSpinWait(condition,end){
        if(condition()){
            setTimeout(onSpinWait,500,condition,end);
        }else{
            end();
        }
    }
    async loadItem(element){
        var loader = this.loaders.get(element.type);
        if(loader == undefined) return;
        loader(element);
    }
}

export {AssetLoader};