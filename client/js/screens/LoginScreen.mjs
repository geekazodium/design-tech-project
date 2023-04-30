import { client } from "../ClientMain.mjs";
import { RenderDispatcher } from "../RenderDispatcher.mjs";
import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";
import { SignupScreen } from "./SignupScreen.mjs";

class LoginScreen extends MenuScreen{
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

        this.signupButton = this.createButton(0,135,100,"sign up instead");
        this.signupButton.onclick = (event)=>{
            client.setScreen(new SignupScreen(this.renderDispatcher));
        }

        this.loginButton = this.createButton(0,50,100,"log in");
        this.loginButton.onclick = (event)=>{
            client.login(this.usernameInput.value,this.passwordInput.value);
        };
        
        this.usernameInput = this.createField(0,-35,150,"username");
        this.passwordInput = this.createField(0,0,150,"password");
    }
}

export {LoginScreen};