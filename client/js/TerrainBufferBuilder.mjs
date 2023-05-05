import { perlinNoise } from "../../common/PerlinNoise.mjs";
import { min } from "../libraries/esm/vec3.js";
import { BufferBuilder } from "./BufferBuilder.mjs";
import { BlockTextureMap, negX, negY, negZ, posX, posY, posZ } from "./render/BlockTextureMap.mjs";
import { TextureAtlas } from "./render/TextureAtlas.mjs";
import { Chunk } from "./utils/World.mjs";

class TerrainBufferBuilder extends BufferBuilder{
    /**
     * 
     * @param {TextureAtlas} textureAtlas 
     * @param {BlockTextureMap} texMap 
     */
    constructor(textureAtlas,texMap){
        super(textureAtlas);
        this.texMap = texMap;
    }
    async rebuild(gl){
        super.rebuild();
        var tempVBO = [];
        var tempIBO = [];

        for (let chunkX = 0; chunkX < 8; chunkX++) {
            for(let chunkZ = 0; chunkZ < 8; chunkZ++){
                var chunk = new Chunk(chunkX,chunkZ);
                chunk.generate(chunkX,chunkZ);
                this.addChunkBuffer(chunk,chunkX,chunkZ,tempVBO,tempIBO);
            }
        }

        this.bufferLength = tempIBO.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tempVBO), gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tempIBO), gl.DYNAMIC_DRAW);
    }
    addChunkBuffer(chunk,chunkX,chunkZ,tempVBO,tempIBO){
        const vertical = 0b100000000;
        const forward = 0b1;
        const side = 0b10000;
        for (let i = 0; i < chunk.blocks.length; i++) {
            const block = chunk.blocks[i];
            if(block == 0){
                continue;
            }
            var minX = i&0b1111;
            var minZ = (i&0b11110000)>>4;
            var minY = (i&0b1111111100000000)>>8;
            const under = chunk.blocks[i-vertical];
            const above = chunk.blocks[i+vertical];
            const negX_ = chunk.blocks[i-forward];
            const posX_ = chunk.blocks[i+forward];
            const posZ_ = chunk.blocks[i+side];
            const negZ_ = chunk.blocks[i-side];
            minX+=chunkX*16;
            minZ+=chunkZ*16;
            if(above == 0){
                var tex = this.texMap.getForBlock(block,posY);
                this.createCubeFacePosY(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
            if(under == 0){
                var tex = this.texMap.getForBlock(block,negY);
                this.createCubeFaceNegY(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
            if(negX_ == 0){
                var tex = this.texMap.getForBlock(block,negX);
                this.createCubeFaceNegX(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
            if(posX_ == 0){
                var tex = this.texMap.getForBlock(block,posX);
                this.createCubeFacePosX(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
            if(negZ_ == 0){
                var tex = this.texMap.getForBlock(block,negZ);
                this.createCubeFaceNegZ(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
            if(posZ_ == 0){
                var tex = this.texMap.getForBlock(block,posZ);
                this.createCubeFacePosZ(tempVBO,tempIBO,minX,minY,minZ,tex[0],tex[1]);
            }
        }
    }
    createSurface(VBO,IBO,points){
        IBO.push(
            this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
            this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
        );
        points.forEach(e => {
            VBO.push(e);
        });
        this.indexCounter += 4;
    }
    createCube(VBO,IBO,minX,minY,minZ,uvMin,uvMax){

        this.createCubeFacePosY(VBO,IBO,minX,minY,minZ ,uvMin,uvMax);

        this.createCubeFaceNegY(VBO,IBO,minX,minY,minZ,uvMin,uvMax);

        this.createCubeFacePosX(VBO,IBO,minX,minY,minZ,uvMin,uvMax);

        this.createCubeFaceNegX(VBO,IBO,minX,minY,minZ,uvMin,uvMax);

        this.createCubeFacePosZ(VBO,IBO,minX,minY,minZ,uvMin,uvMax);

        this.createCubeFaceNegZ(VBO,IBO,minX,minY,minZ,uvMin,uvMax);
    }
    createCubeFacePosY(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX, minY+1, minZ,       uvStart[0], uvStart[1],
            minX, minY+1, minZ+1,     uvStart[0], uvEnd[1],
            minX+1, minY+1, minZ+1,   uvEnd[0], uvEnd[1],
            minX+1, minY+1, minZ,     uvEnd[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
            this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
    createCubeFaceNegY(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX, minY, minZ,       uvStart[0], uvStart[1],
            minX, minY, minZ+1,     uvStart[0], uvEnd[1],
            minX+1, minY, minZ+1,   uvEnd[0], uvEnd[1],
            minX+1, minY, minZ,     uvEnd[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+1, this.indexCounter+0, this.indexCounter+2,
            this.indexCounter+2, this.indexCounter+0, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
    createCubeFacePosX(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX+1, minY+1, minZ+1,   uvStart[0], uvStart[1],
            minX+1, minY, minZ+1,     uvStart[0], uvEnd[1],
            minX+1, minY, minZ,       uvEnd[0], uvEnd[1],
            minX+1, minY+1, minZ,     uvEnd[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
            this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
    createCubeFaceNegX(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX, minY+1, minZ+1,   uvEnd[0], uvStart[1],
            minX, minY, minZ+1,     uvEnd[0], uvEnd[1],
            minX, minY, minZ,       uvStart[0], uvEnd[1],
            minX, minY+1, minZ,     uvStart[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+1, this.indexCounter+0, this.indexCounter+2,
            this.indexCounter+2, this.indexCounter+0, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
    createCubeFacePosZ(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX+1, minY+1, minZ+1,   uvEnd[0], uvStart[1],
            minX+1, minY, minZ+1,     uvEnd[0], uvEnd[1],
            minX, minY, minZ+1,       uvStart[0], uvEnd[1],
            minX, minY+1, minZ+1,     uvStart[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+1, this.indexCounter+0, this.indexCounter+2,
            this.indexCounter+2, this.indexCounter+0, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
    createCubeFaceNegZ(VBO,IBO,minX,minY,minZ,uvStart,uvEnd){
        VBO.push(
            minX+1, minY+1, minZ,   uvStart[0], uvStart[1],
            minX+1, minY, minZ,     uvStart[0], uvEnd[1],
            minX, minY, minZ,       uvEnd[0], uvEnd[1],
            minX, minY+1, minZ,     uvEnd[0], uvStart[1]
        );
        IBO.push(
            this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
            this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
        );
        this.indexCounter += 4;
    }
}

export {TerrainBufferBuilder};