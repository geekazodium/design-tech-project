class TextureAtlas{
    constructor(texture,references){
        this.texture = texture;
        this.references = new Map();
        references.forEach(element => {
            this.references.set(element.id,element);
        });
    }
    getTextureCoordinates(name){
        this.references.get(name);
    }
}

export {TextureAtlas};