import { AssetLoader } from "./AssetLoader.mjs";
import { Camera } from "./Camera.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";

class GameClient{
    constructor(){

    }
    main(){
        this.displaySurface = document.getElementById("main-interface");
		this.camera = new Camera(this.displaySurface);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
    }
}

var loaded = false;
var assetsLoaded = false;
var client = new GameClient();

document.addEventListener("DOMContentLoaded",(event)=>{
    loaded = true;
});

function loadAssets(){
    let assetLoader = new AssetLoader("./../assets/assets.json");
    assetLoader.load(()=>{assetsLoaded = true;});
}

function onSpinWait(condition,end){
    if(condition()){
        setTimeout(onSpinWait,500,condition,end);
    }else{
        end();
    }
}

loadAssets();
onSpinWait(()=>{return ((!loaded)||(!assetsLoaded))},()=>{client.main()});