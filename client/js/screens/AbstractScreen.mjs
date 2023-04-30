class AbstractScreen{ 
    /**
     * @method constructor
     * @description creates a new Screen
     * @param {RenderDispatcher} renderDispatcher the render dispatcher instance
     */
    constructor(renderDispatcher){
        this.renderDispatcher = renderDispatcher;
    }
    onSet(){

    }
    onExit(){

    }
}

export {AbstractScreen};