import { AssetLoader } from "./AssetLoader.mjs";
import { Camera } from "./Camera.mjs";
import { MouseInputHandler } from "./MouseInputHandler.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";

class GameClient{
    main(){
        this.displaySurface = document.getElementById("main-interface");
        this.mouseInputHandler = new MouseInputHandler(this.displaySurface);
		this.camera = new Camera(this.displaySurface,this.mouseInputHandler);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
        document.body.style.visibility = "visible";
        document.body.style.backgroundColor = "#ffffff00";
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