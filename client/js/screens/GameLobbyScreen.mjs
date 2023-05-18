import { AbstractScreen } from "./AbstractScreen.mjs";
import { IngameScreen } from "./IngameScreen.mjs";
import { MenuScreen } from "./MenuScreen.mjs";

const creator = part => part;
const extender = (...parts) => parts.reduce(creator, AbstractAScreen);

class AbstractAScreen extends AbstractScreen{
    constructor(renderDispatcher){
        super(renderDispatcher);
    }
}

class GameLobbyScreen extends extender(IngameScreen,MenuScreen) {
    constructor(renderDispatcher){
        super(renderDispatcher);
        console.log(this);
    }
}
export {GameLobbyScreen};