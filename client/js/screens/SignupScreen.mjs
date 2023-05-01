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
        this.styleAsTitle(this.title,-150);

        this.loginButton = this.createButton(0,75,150,"log in instead");
        this.loginButton.onclick = (event)=>{
            client.setScreen(new LoginScreen(this.renderDispatcher));
        }
        this.loginButton.style.fontSize = "15px";

        this.signupStatus = document.createElement("p1");
        this.div.append(this.signupStatus);
        this.styleAsTitle(this.signupStatus,100);
        this.signupStatus.style.fontSize = "18px";
        this.signupStatus.style.color = "#ff0000ff";

        this.signupButton = this.createButton(0,30,150,"sign up");
        this.signupButton.onclick = (event)=>{
            if(this.usernameInvalid(this.usernameInput.value)){
                this.signupStatus.innerText = "invalid username";
                return;
            }
            if(this.passwordInput.value.length<8)return;
            if(this.passwordInput.value != this.verifyInput.value){
                return;
            }
            client.registerAccount(this.usernameInput.value,this.passwordInput.value);
        };
        
        this.usernameInput = this.createField(0,-80,150,"username");
        this.passwordInput = this.createField(0,-45,150,"password");
        this.verifyInput = this.createField(0,-10,150,"verify password");
    }
}

export {SignupScreen};