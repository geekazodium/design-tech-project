import { AssetLoader } from "./fileLoader/AssetLoader.mjs";
import { ButtonHandler } from "./ButtonHandler.mjs";
import { Camera } from "./render/Camera.mjs";
import { Keybind } from "./Keybind.mjs";
import { MouseInputHandler } from "./MouseInputHandler.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";
import { TerrainBufferBuilder } from "./TerrainBufferBuilder.mjs";
import { Packets } from "../../common/Packets.mjs";
import { Packet } from "../../common/Packet.mjs";
import { RequestConnectionC2SPacket } from "/common/C2S/RequestConnectionC2SPacket.mjs";

class GameClient{
    main(){
        this.clientPacketHandler = new Packets();
        var packet = new RequestConnectionC2SPacket();
        packet.setUserName("you Suck");
        packet.setPassword("something");
        this.clientPacketHandler.sendClient(packet);
        this.displaySurface = document.getElementById("main-interface");
        this.mouseInputHandler = new MouseInputHandler(this.displaySurface);
        this.buttonInputHandler = new ButtonHandler();
		this.camera = new Camera(this.displaySurface,this.mouseInputHandler);
        this.terrainBufferBuilder = new TerrainBufferBuilder(assetLoader.terrainTextureAtlas);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        this.renderDispatcher.attachBufferBuilder(this.terrainBufferBuilder,"terrain");
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
        this.initKeybinds();
        this.loop = setInterval(()=>{this.tick();},10);
        document.body.style.visibility = "visible";
        document.body.style.backgroundColor = "#ffffff00";
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
        this.upKey = new Keybind("Space");
        this.buttonInputHandler.registerKeybind(this.upKey);
        this.downKey = new Keybind("ShiftLeft");
        this.buttonInputHandler.registerKeybind(this.downKey);
    }
    tick(){
        var velocity = 0.05;
        var forward = (this.forwardKey.isPressed+this.backwardKey.isPressed*-1)*velocity;
        var left =  (this.leftKey.isPressed+this.rightKey.isPressed*-1)*velocity;
        var up =  (this.upKey.isPressed+this.downKey.isPressed*-1)*velocity;
        var movement = [-forward,-left];
        this.rotate(movement,-this.camera.yaw);
        this.camera.move(movement[0],up,movement[1]);
    }
    rotate(i,a){
        var x = i[0];
        var y = i[1];
        i[0] = Math.sin(a)*x + Math.cos(a)*y;
        i[1] = Math.cos(a)*x - Math.sin(a)*y; 
    }
}

var loaded = false;
var assetsLoaded = false;
var assetLoader;
var client = new GameClient();

document.addEventListener("DOMContentLoaded",(event)=>{
    loaded = true;
});

function loadAssets(){
    assetLoader = new AssetLoader("./assets/assets.json");
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