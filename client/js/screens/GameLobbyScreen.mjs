import { client } from "../ClientMain.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { MenuScreen, stylingHelper } from "./MenuScreen.mjs";

class GameLobbyScreen extends IngameScreen{
    constructor(renderDispatcher){
        super(renderDispatcher);
    }
    onSet(){
        super.onSet();
        this.div = document.createElement("div");
        document.body.appendChild(this.div);

        this.title = document.createElement("h1");
        this.div.append(this.title);
        this.title.innerText = "ThisThingy";
        stylingHelper.styleAsTitle(this.title,-125);

        this.renderDispatcher.camera.teleportTo(0,85,0);
        this.renderDispatcher.camera.setRotation(0.4,Math.PI/4);
    }
    createField(x,maxY,width,text){
        var fieldDiv = document.createElement("div");
        this.div.append(fieldDiv);
        this.styleAsButton(fieldDiv,x,maxY,width);

        var field = document.createElement("input");
        fieldDiv.append(field);
        this.styleAsField(field);
        field.onfocus = (event)=>{
            textOverlay.hidden = true;
        }
        field.onblur = (event)=>{
            textOverlay.hidden = field.value.length>0;
        }

        var textOverlay = document.createElement("p1");
        fieldDiv.append(textOverlay);
        this.styleAsField(textOverlay);
        textOverlay.innerText = text;
        textOverlay.style.position = "fixed";
        textOverlay.style.marginLeft = "-"+(width-4)+"px";
        textOverlay.style.marginTop = "6px";
        textOverlay.style.zIndex = 1;
        textOverlay.style.pointerEvents = "none";
        return field;
    }
}
export {GameLobbyScreen};