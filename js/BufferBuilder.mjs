class BufferBuilder{
    constructor(textureAtlas){
        this.textureAtlas = textureAtlas;
        this.bufferLength = 0;
        this.VBO = undefined;
        this.IBO = undefined;
    }
    setBuildTo(VBO,IBO){
        this.VBO = VBO;
        this.IBO = IBO;
    }
    rebuild(gl){
        this.indexCounter = 0;
    }
}

export {BufferBuilder};