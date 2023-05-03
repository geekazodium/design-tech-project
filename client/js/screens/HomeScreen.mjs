import { client } from "../ClientMain.mjs";
import { LoginScreen } from "./LoginScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";
import { SignupScreen } from "./SignupScreen.mjs";

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

        this.accountButton = this.createButton(0,20,150,"have an account? log in!");

        this.accountButton.style.fontSize = "20px";
        this.toLoginScreen = (event)=>{
            client.setScreen(new LoginScreen(this.renderDispatcher,this));
        };
        this.signOut = (event)=>{
            
        };
        this.lastClientAccount = undefined;
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