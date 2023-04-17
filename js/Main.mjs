import { Camera } from "./Camera.mjs";
import { RenderDispatcher } from "./RenderDispatcher.mjs";

class GameClient{
    main(){
        this.displaySurface = document.getElementById("main-interface");
		this.camera = new Camera(this.displaySurface);
        this.renderDispatcher = new RenderDispatcher(this.displaySurface,this.camera);
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
    }
}

var client = new GameClient();
client.main();