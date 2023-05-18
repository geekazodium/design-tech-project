import { client } from "../ClientMain.mjs";
import { RenderDispatcher } from "../RenderDispatcher.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";
import { SignupScreen } from "./SignupScreen.mjs";
import { createGameRequestHandler,CreateGameRequest } from "./../../../common/requests/CreateGameRequest.mjs"
import { packetHandlers } from "../../../common/requests/RequestHandler.mjs";

class TestGameProtocolScreen extends MenuScreen{
    onExit(){
        document.body.removeChild(this.div);
    }
    createMenuItems(){
        this.div = document.createElement("div");
        document.body.appendChild(this.div);
        this.packetArgs = this.createField(0,-55,150,"packetArgs");

        this.packetSelector = this.createDropdown(0,-10,150,"packetType");
        this.loadGamePacketOptions(this.packetSelector);

        this.sendButton = this.createButton(0,-100,150,"send");
        this.sendButton.onclick = async event=>{
            const path = this.packetSelector.selectedOptions.item(0).value;
            const requestHandler = packetHandlers.get(path);
            const args = this.packetArgs.value.split(" ");
            console.log(await requestHandler.send(requestHandler.createRequest(args)));
            console.log(path);
        }
    }
    createDropdown(x,maxY,width,text){
        var dropdown = document.createElement("select");
        this.div.append(dropdown);
        dropdown.innerText = text;
        this.styleAsButton(dropdown,x,maxY,width);
        dropdown.style.fontSize = "18px";
        return dropdown;
    }
    /**
     * 
     * @param {HTMLSelectElement} dropdown 
     */
    loadGamePacketOptions(dropdown){
        this.addOption(dropdown,"Create Game","/CreateGame");
        this.addOption(dropdown,"Create Game","/Login");
    }
    /**
     * 
     * @param {HTMLSelectElement} dropdown 
     */
    addOption(dropdown,name,value){
        var option = document.createElement("option");
        option.textContent = name;
        option.value = value;
        dropdown.add(option);
    }
    onAnimationFrame(){
        super.onAnimationFrame();
    }
}

export {TestGameProtocolScreen};