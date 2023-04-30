import { client } from "../ClientMain.mjs";
import { RenderDispatcher } from "../RenderDispatcher.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { LoginScreen } from "./LoginScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";

class SignupScreen extends MenuScreen{
    onExit(){
        document.body.removeChild(this.div);
    }
    createMenuItems(){
        this.div = document.createElement("div");
        document.body.appendChild(this.div);

        this.title = document.createElement("h1");
        this.div.append(this.title);
        this.title.innerText = "ThisThingy";
        this.styleAsTitle(this.title);

        this.loginButton = this.createButton(0,135,100,"log in instead");
        this.loginButton.onclick = (event)=>{
            client.setScreen(new LoginScreen(this.renderDispatcher));
        }

        this.signupButton = this.createButton(0,85,100,"sign up");
        this.signupButton.onclick = (event)=>{
            if(this.passwordInput.value != this.verifyInput.value){
                return;
            }
            client.registerAccount(this.usernameInput.value,this.passwordInput.value);
        };
        
        this.usernameInput = this.createField(0,-35,150,"username");
        this.passwordInput = this.createField(0,0,150,"password");
        this.verifyInput = this.createField(0,35,150,"verify password");
    }
}

export {SignupScreen};