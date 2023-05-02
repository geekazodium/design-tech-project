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
        this.styleAsTitle(this.title,-125);

        this.signupButton = this.createButton(0,65,150,"sign up instead");
        this.signupButton.onclick = (event)=>{
            client.setScreen(new SignupScreen(this.renderDispatcher,this.parent));
        }
        this.signupButton.style.fontSize = "15px";

        this.loginStatus = document.createElement("p1");
        this.div.append(this.loginStatus);
        this.styleAsTitle(this.loginStatus,90);
        this.loginStatus.style.fontSize = "18px";
        this.loginStatus.style.color = "#ff0000ff";

        this.loginButton = this.createButton(0,20,150,"log in");
        this.loginButton.onclick = async (event)=>{
            if(this.usernameInvalid(this.usernameInput.value)){
                this.loginStatus.innerText = "invalid username";
                return;
            }
            this.loginStatus.innerText = "contacting server...";
            var success = await client.login(this.usernameInput.value,this.passwordInput.value);
            this.loginStatus.innerText = success;
            if(success == "success!"){
                client.setScreen(new IngameScreen(client.getScreenParams()));
            }
        };
        
        this.usernameInput = this.createField(0,-55,150,"username");
        this.passwordInput = this.createField(0,-20,150,"password");
    }
}

export {LoginScreen};