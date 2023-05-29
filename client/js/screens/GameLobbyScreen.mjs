import { client } from "../ClientMain.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { MenuScreen, stylingHelper } from "./MenuScreen.mjs";

class GameLobbyScreen extends IngameScreen{
    constructor(renderDispatcher,parent){
        super(renderDispatcher,parent);
    }
    onSet(){
        super.onSet();
        this.div = document.createElement("div");
        document.body.appendChild(this.div);

        this.title = document.createElement("h1");
        this.div.append(this.title);
        this.title.innerText = "ThisThingy";
        stylingHelper.styleAsTitle(this.title,-125);

        this.viewpointRotation = 0;
        this.viewpointDistance = 100;

        this.renderDispatcher.camera.canMove = false;
        this.renderDispatcher.camera.canReorient = false;

        this.accountLabel = document.createElement("h2");
        this.div.append(this.accountLabel);
        this.accountLabel.innerText = client.accountInfo.name;
        stylingHelper.styleAsTitle(this.accountLabel);
        this.accountLabel.style.left = "10px";
        this.accountLabel.style.top = "calc(100vh - 60px)";
        this.accountLabel.style.fontSize = "23px";
        this.accountLabel.style.textAlign = "left";

    }
    animateCameraOrbit(){
        this.renderDispatcher.camera.teleportTo(-Math.sin(this.viewpointRotation)*this.viewpointDistance,100,Math.cos(this.viewpointRotation)*this.viewpointDistance);
        this.renderDispatcher.camera.forceRotation(0.3,this.viewpointRotation);
        this.viewpointRotation = (this.viewpointRotation+0.01)%(Math.PI*2);
    }
    onExit(){
        this.div.remove();
        super.onExit();
        this.renderDispatcher.camera.canMove = true;
        this.renderDispatcher.camera.canReorient = true;
    }
    onAnimationFrame(){
        super.onAnimationFrame();
        this.animateCameraOrbit();
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