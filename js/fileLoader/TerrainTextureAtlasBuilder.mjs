
class TerrainTextureAtlasBuilder{
    constructor(){
        this.startedCount = 0;
        this.finishedCount = 0;
    }
    load(json){
        this.assets = json;
        if(this.assets.version == this.getCurrentTextureVersion()){
            //todo: load locally saved texture atlas
        }
        var textures = this.assets.textures;
        var canvas = document.createElement("canvas");
        document.body.append(canvas);
        canvas.id = "terrain-texture-atlas";
        canvas.width = 128;
        canvas.height = 128;
        var drawContext = canvas.getContext("2d");
        drawContext.imageSmoothingEnabled = false;
        drawContext.mozImageSmoothingEnabled = false;
        drawContext.webkitImageSmoothingEnabled = false;
        drawContext.msImageSmoothingEnabled = false;
        this.startedCount = 0;
        this.finishedCount = 0;
        textures.forEach(texture => {
            this.pasteToAtlas(texture,drawContext);
        });
        this.setCurrentVersion(this.assets.version);
    }
    getCurrentTextureVersion(){
        return parseInt(localStorage.getItem("textureVersion")|"0");
    }
    setCurrentVersion(version){
        localStorage.setItem("textureVersion",""+version);
    }
    pasteToAtlas(texture,drawContext){
        this.startedCount ++;
        var temporaryImage = new Image(texture.width,texture.height);
        temporaryImage.src = texture.src;
        temporaryImage.onload = ()=>{
            drawContext.drawImage(
                temporaryImage,
                texture.x,
                texture.y,
                texture.width,
                texture.height
            );
            this.finishedCount ++;
        }
    }
}

export {TerrainTextureAtlasBuilder};