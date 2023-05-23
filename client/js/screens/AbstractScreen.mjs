import { client } from "../ClientMain.mjs";
import { Keybind } from "../Keybind.mjs";

var escapeKeybind;
function initMenuKeybinds(){
    escapeKeybind = new Keybind("Escape");
    client.buttonInputHandler.registerKeybind(escapeKeybind);
}

class AbstractScreen{ 
    /**
     * @method constructor
     * @description creates a new Screen
     * @param {RenderDispatcher} renderDispatcher the render dispatcher instance
     */
    constructor(renderDispatcher,parent){
        this.renderDispatcher = renderDispatcher;
        this.parent = parent;
    }
    onSet(){

    }
    onExit(){

    }
    onAnimationFrame(){
        if(escapeKeybind.wasPressed()){
            if(this.parent === undefined)return;
            client.setScreen(this.parent);
        }
    }
}

export {AbstractScreen,escapeKeybind,initMenuKeybinds};