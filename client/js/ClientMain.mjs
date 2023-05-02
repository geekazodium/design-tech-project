import { AssetLoader } from "./fileLoader/AssetLoader.mjs";
import { ButtonHandler } from "./ButtonHandler.mjs";
import { Camera } from "./render/Camera.mjs";
import { Keybind } from "./Keybind.mjs";
import { MouseInputHandler } from "./MouseInputHandler.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";
import { LoginAccountRequest, loginAccountRequestHandler } from "../../common/requests/LoginRequest.mjs";
import { HomeScreen } from "./screens/HomeScreen.mjs";
import { initMenuKeybinds } from "./screens/MenuScreen.mjs";
import { SignupAccountRequest, signupAccountRequestHandler } from "../../common/requests/SignupRequest.mjs";

class GameClient{
    main(){
        this.screen = undefined;
        this.displaySurface = document.getElementById("main-interface");
        this.mouseInputHandler = new MouseInputHandler(this.displaySurface);
        this.buttonInputHandler = new ButtonHandler();
		this.camera = new Camera(this.displaySurface,this.mouseInputHandler);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        this.renderDispatcher.preRender = ()=>{
            if(this.screen === undefined)return;
            this.screen.onAnimationFrame();
        }
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
        initMenuKeybinds();
        this.setScreen(new HomeScreen(this.renderDispatcher));
        this.initKeybinds();
        this.loop = setInterval(()=>{this.tick();},10);
        document.body.style.visibility = "visible";
        document.body.style.backgroundColor = "#ffffff00";
    }
    setScreen(screen){
        if(this.screen!=undefined)this.screen.onExit();
        this.screen = screen;
        this.screen.onSet();
    }
    getScreenParams(){
        return {
            "mouse":this.mouseInputHandler,
            "button":this.buttonInputHandler,
            "renderDispatcher":this.renderDispatcher,
            "assetLoader":assetLoader
        };
    }
    getAssetLoader(){
        return assetLoader;
    }
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     */
    async registerAccount(username,password){
        return await signupAccountRequestHandler.send(new SignupAccountRequest(username,password));
    }
    /**
     * 
     * @param {String} username 
     * @param {String} password 
     */
    async login(username,password){
        return await loginAccountRequestHandler.send(new LoginAccountRequest(username,password));
    }
    async putRequest(buffer,path){
        console.log(buffer);
        const res = await fetch('./game'+path, {
            method: "PUT",
            body: new Uint8Array(buffer)
        });
        return (await res.body.getReader().read()).value;
    }
    /**
     * @description SLOPPY CODE TO GET CAMERA MOVEMENT WORKING,
     * I'M SO SORRY I WILL MOVE THIS SOMEWHERE THAT MAKES SENSE
     * LATER.
     */
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

export {client};