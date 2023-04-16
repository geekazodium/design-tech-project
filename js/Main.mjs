import { RenderDispatcher } from "./RenderDispatcher.mjs";

class GameClient{
    main(){
        this.displaySurface = document.getElementById("main-interface");
        this.renderDispatcher = new RenderDispatcher(this.displaySurface);
        if(!this.renderDispatcher.init){
            stop();
            return;
        }
    }
}

var client = new GameClient();
client.main();