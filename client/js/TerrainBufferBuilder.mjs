import { perlinNoise } from "../../common/PerlinNoise.mjs";
import { min } from "../libraries/esm/vec3.js";
import { BufferBuilder } from "./BufferBuilder.mjs";
import { BlockTextureMap, negX, negY, negZ, posX, posY, posZ } from "./render/BlockTextureMap.mjs";
import { TextureAtlas } from "./render/TextureAtlas.mjs";
import { Chunk } from "./utils/World.mjs";

const maxGlIndex = Math.pow(2,16);

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
        var tempVBOs = [[]];
        var tempIBOs = [[]];

        var chunks = [];
        for (let chunkX = 0; chunkX < 8; chunkX++) {
            chunks.push([]);
            for(let chunkZ = 0; chunkZ < 8; chunkZ++){
                var chunk = new Chunk(chunkX,chunkZ);
                chunk.generate(chunkX,chunkZ);
                chunks[chunkX].push(chunk);
            }
        }
        
        for (let chunkX = 0; chunkX < 8; chunkX++) {
            for(let chunkZ = 0; chunkZ < 8; chunkZ++){
                const chunk = chunks[chunkX][chunkZ];
                const chunkPX = (chunkX+1 < 8)?chunks[chunkX+1][chunkZ]:undefined;
                const chunkNX = (chunkX > 0)?chunks[chunkX-1][chunkZ]:undefined;
                const chunkPZ = chunks[chunkX][chunkZ+1];
                const chunkNZ = chunks[chunkX][chunkZ-1];
                this.addChunkBuffer(chunk,chunkPX,chunkNX,chunkPZ,chunkNZ,chunkX,chunkZ,tempVBOs,tempIBOs);
            }
        }

        this.bufferLengths = [];
        tempIBOs.forEach(ibo=>{
            this.bufferLengths.push(ibo.length);
        });
        while(tempVBOs.length>this.renderer.terrainVBOs.length){
            this.renderer.appendBufferObjects(gl);
        }
        while(tempVBOs.length<this.renderer.terrainVBOs.length){
            this.renderer.removeBufferObjects(gl);
        }
        for (let i = 0; i < tempVBOs.length; i++) {
            const vboArray = tempVBOs[i];
            const vertexBuffer = this.renderer.terrainVBOs[i];
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vboArray), gl.DYNAMIC_DRAW);
        }
        for (let i = 0; i < tempIBOs.length; i++) {
            const iboArray = tempIBOs[i];
            const indexBuffer = this.renderer.terrainIBOs[i];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(iboArray), gl.DYNAMIC_DRAW);
        }

    }
    /**
     * 
     * @param {Chunk} chunk 
     * @param {Chunk} chunkNextX 
     * @param {Chunk} chunkPrevX 
     * @param {Chunk} chunkNextZ 
     * @param {Chunk} chunkPrevZ 
     * @param {Number} chunkX 
     * @param {Number} chunkZ 
     * @param {*} tempVBOs 
     * @param {*} tempIBOs 
     */
    addChunkBuffer(chunk,chunkNextX,chunkPrevX,chunkNextZ,chunkPrevZ,chunkX,chunkZ,tempVBOs,tempIBOs){
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

            var negX_ = chunk.blocks[i-forward];
            if(chunkPrevX) negX_ = (minX-1 < 0) ? chunkPrevX.getBlockAtChunkCoords(0b1111,minY,minZ):negX_;
            else negX_ *= !(minX-1 < 0); // type conversion magic, true = 1, false = 0, I want it to return the value if true and 0 if false. I'm trying to avoid branching.
            
            var posX_ = chunk.blocks[i+forward];
            if(chunkNextX) posX_ = (minX+1 > 0b1111) ? chunkNextX.getBlockAtChunkCoords(0,minY,minZ):posX_;
            else posX_ *= !(minX+1 > 0b1111);

            var negZ_ = chunk.blocks[i-side];
            if(chunkPrevZ) negZ_ = (minZ-1 < 0) ? chunkPrevZ.getBlockAtChunkCoords(minX,minY,0b1111):negZ_;
            else negZ_ *= !(minZ-1 < 0);

            var posZ_ = chunk.blocks[i+side];
            if(chunkNextZ) posZ_ = (minZ+1 > 0b1111) ? chunkNextZ.getBlockAtChunkCoords(minX,minY,0):posZ_;
            else posZ_ *= !(minZ+1 > 0b1111);

            minX+=chunkX*16;
            minZ+=chunkZ*16;

            var tempVBO = tempVBOs[tempVBOs.length-1];
            var tempIBO = tempIBOs[tempIBOs.length-1];
            if(this.indexCounter >= maxGlIndex-64){
                tempVBO = [];
                tempVBOs.push(tempVBO);
                tempIBO = [];
                tempIBOs.push(tempIBO);
                this.indexCounter = 0;
            }

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