class BufferBuilder{
    constructor(textureAtlas){
        this.textureAtlas = textureAtlas;
        this.bufferLength = 0;
        this.renderer = undefined;
    }
    setBuildTo(renderer){
        this.renderer = renderer;
    }
    rebuild(gl){
        this.indexCounter = 0;
    }
}

export {BufferBuilder};