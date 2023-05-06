import { LayeredPerlinNoise, perlinNoise, terrainLayered } from "../../../common/PerlinNoise.mjs";
import { Vec3i } from "../../../common/Vec.mjs";

class World{
    /**
     * 
     * @param {Vec3i} size 
     */
    constructor(size,seed){
        this.seed = seed;
        this.size = size;
        this.chunks = new Map();
    }
    getChunkId(x,y){
        return x+","+y;
    }
    setChunk(x,y,chunk){
        this.chunks.set(this.getChunkId(x,y),chunk);
    }
    getChunkForPosition(x,z){
        return this.chunks.get(this.getChunkId(x>>4,z>>4));
    }
    setBlock(x,y,z){
        var x = parseInt(x);
        var z = parseInt(z);
        var chunk = this.getChunkForPosition(x,z);
        var chunkX = x&0xf;
        var chunkZ = z&0xf;
        return chunk.getBlockPointer(chunkX,parseInt(y),chunkZ);
    }
}
const chunkHeight = 128;
const chunkLX = 16;
const chunkLZ = 16;

class Chunk{
    constructor(){
        this.blocks = new Uint16Array(chunkLX*chunkLZ*chunkHeight);
    }
    getBlockPointer(x,y,z){
        if(x>=chunkLX)return;
        if(y>=chunkHeight)return;
        if(z>=chunkLZ)return;
        return x + chunkLX*z + chunkLX*chunkLZ*y;
    }
    generate(chunkX,chunkZ){
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                var height = Math.floor((terrainLayered.get((x+chunkX*16)/16,(z+chunkZ*16)/16)+1));
                for(let y = 0; y<height;y++){
                    if(y==height-1){
                        this.setBlockAt(x,y,z,1);
                    }else{
                        this.setBlockAt(x,y,z,2);
                    }
                }
            }
        }
    }
    setBlockAt(x,y,z,id){
        this.blocks[this.getBlockPointer(x,y,z)]=id;
    }
    getBlockAtChunkCoords(x,y,z){
        return this.blocks[this.getBlockPointer(x,y,z)];
    }
}

export {World,Chunk};