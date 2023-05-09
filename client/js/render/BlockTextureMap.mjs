import { TextureAtlas } from "./TextureAtlas.mjs";

class BlockTextureMap{
    /**
     * 
     * @param {*} json 
     * @param {TextureAtlas} atlas 
     */
    constructor(json, atlas){
        this.mapping = new Map();
        json.forEach(element => {
            this.mapping.set(element.id,element);
        });
        this.atlas = atlas;
        this.width = this.atlas.texture.width;
        this.height = this.atlas.texture.height;
    }
    getTextureName(block,face){
        if(block.type == "dir-none"){
            return block.default;
        }
        if(block.type == "dir-const"){
            var ret = this.getDirectionBlockFace(block,face);
            if(ret == undefined){
                return block.default;
            }
            return ret;
        }
    }
    getDirectionBlockFace(block,face){
        if(face == posY)return block.posY;
        if(face == negY)return block.negY;
        if(face == posX)return block.posX;
        if(face == negX)return block.negX;
        if(face == posZ)return block.posZ;
        if(face == negZ)return block.negZ;
    }
    getForBlock(id,face){
        var texName = this.getTextureName(
            this.mapping.get(id),
            face
        );
        var tex = this.atlas.references.get(texName);
        var start = [tex.x,tex.y];
        var end = [tex.x+tex.width,tex.y+tex.height];
        return this.normalizeTextCoords(start,end);
    }
    normalizeTextCoords(start,end){
        const shiftIn = 5;
        start[0]+=shiftIn;
        start[1]+=shiftIn;
        start[0]/=this.width;
        start[1]/=this.height;
        end[0]-=shiftIn;
        end[1]-=shiftIn;
        end[0]/=this.width;
        end[1]/=this.height;
        return [start,end];
    }
}

const posY = 0;
const negY = 1;
const posX = 2;
const negX = 3;
const posZ = 4;
const negZ = 5;

export {BlockTextureMap,posX,negX,posY,negY,posZ,negZ};