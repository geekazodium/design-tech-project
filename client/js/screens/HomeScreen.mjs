import { client } from "../ClientMain.mjs";
import { GameLobbyScreen } from "./GameLobbyScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { LoginScreen } from "./LoginScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";
import { SignupScreen } from "./SignupScreen.mjs";
import { TestGameProtocolScreen } from "./TestGameProtocolScreen.mjs";

class HomeScreen extends MenuScreen{
    onExit(){
        document.body.removeChild(this.div);
    }
    createMenuItems(){
        this.div = document.createElement("div");
        document.body.appendChild(this.div);

        this.title = document.createElement("h1");
        this.div.append(this.title);
        this.title.innerText = "Test Title";
        this.styleAsTitle(this.title,-125);

        this.testButton = this.createButton(0,-40,150,"Test Scene");

        this.testButton.onclick = (event)=>{
            client.setScreen(new GameLobbyScreen(client.getScreenParams()));
        };

        this.accountButton = this.createButton(0,-5,150,"have an account? log in!");

        this.toLoginScreen = (event)=>{
            client.setScreen(new LoginScreen(this.renderDispatcher,this));
        };

        this.signOut = (event)=>{
            
        };
        this.lastClientAccount = undefined;

        this.testProtocolButton = this.createButton(0,55,150,"test portocol");
        this.testProtocolButton.onclick = event => {
            client.setScreen(new TestGameProtocolScreen(this.renderDispatcher,this));
        };
        this.accountButton.onclick = this.toLoginScreen;
    }
    setToSignedIn(){
        this.accountButton.onclick = this.signOut;
    }
    setToSignedOut(){
        this.accountButton.onclick = this.toLoginScreen;
    }
    onAnimationFrame(){
        super.onAnimationFrame();
        if(this.lastClientAccount === client.account){
            return;
        }
        if(client.account === undefined)this.setToSignedOut();
        else this.setToSignedIn();
    }
}

export {HomeScreen};