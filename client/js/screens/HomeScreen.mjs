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
        this.title.innerText = "ThisThingy";
        this.styleAsTitle(this.title,-125);

        this.loginButton = this.createButton(0,20,150,"have an account? log in!");
        this.loginButton.style.fontSize = "20px";
        this.loginButton.onclick = (event)=>{
            client.setScreen(new LoginScreen(this.renderDispatcher,this))
        };
    }
}

export {HomeScreen};