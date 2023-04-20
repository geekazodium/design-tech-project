import { AssetLoader } from "./AssetLoader.mjs";
import { ButtonHandler } from "./ButtonHandler.mjs";
import { Camera } from "./Camera.mjs";
import { Keybind } from "./Keybind.mjs";
import { MouseInputHandler } from "./MouseInputHandler.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";

class GameClient{
    main(){
        this.loop = setInterval(()=>{this.tick();},10);
        this.displaySurface = document.getElementById("main-interface");
        this.mouseInputHandler = new MouseInputHandler(this.displaySurface);
        this.buttonInputHandler = new ButtonHandler();
		this.camera = new Camera(this.displaySurface,this.mouseInputHandler);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
        document.body.style.visibility = "visible";
        document.body.style.backgroundColor = "#ffffff00";
        this.initKeybinds();
    }
    initKeybinds(){
        this.forwardKey = new Keybind("KeyW");
        this.buttonInputHandler.registerKeybind(this.forwardKey);
        this.backwardKey = new Keybind("KeyS");
        this.buttonInputHandler.registerKeybind(this.backwardKey);
        this.leftKey = new Keybind("KeyA");
        this.buttonInputHandler.registerKeybind(this.leftKey);
        this.rightKey = new Keybind("KeyD");
        this.buttonInputHandler.registerKeybind(this.rightKey);
    }
    tick(){
        
        this.camera.move();
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