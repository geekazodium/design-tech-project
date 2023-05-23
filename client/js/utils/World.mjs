import { LayeredPerlinNoise, perlinNoise, terrainLayered } from "../../../common/PerlinNoise.mjs";
import { Vec3i } from "../../../common/Vec.mjs";

class World{
    constructor(seed){
        this.seed = seed;
        this.noiseSource = new LayeredPerlinNoise(
            {scale:10.5,x:1,y:-2,weight:35,bias:0.5},
            {scale:15.5,x:10,y:0,weight:50,bias:0.5},
            {scale:14.72,x:2,y:6,weight:10,bias:0},
            {scale:2,x:0,y:19,weight:5,bias:0},
            {scale:2,x:7.7,y:-1.5,weight:5,bias:0},
            //{scale:0.5,x:29,y:0,weight:2,bias:0}
        );
        this.noiseSource.shiftLayers(seed);
        this.chunks = new Map();
    }
    generateArea(start,end){
        const startX = start[0]<end[0]?start[0]:end[0];
        const startZ = start[1]<end[1]?start[1]:end[1];
        const endX = start[0]>=end[0]?start[0]:end[0];
        const endZ = start[1]>=end[1]?start[1]:end[1];
        for(let chunkZ = startZ;chunkZ<=endZ;chunkZ++){
            for(let chunkX = startX;chunkX<=endX;chunkX++){
                const chunk = new Chunk();
                this.chunks.set(this.getChunkId(chunkX,chunkZ),chunk);
                chunk.generate(chunkX,chunkZ,this.noiseSource);
            }
        }
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
    getChunk(chunkX,chunkZ){
        return this.chunks.get(this.getChunkId(chunkX,chunkZ));
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
    generate(chunkX,chunkZ,noiseSource){
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                var height = Math.floor((noiseSource.get((x+chunkX*16)/16,(z+chunkZ*16)/16)+1));
                for(let y = 0; y<height;y++){
                    if(y==height-1){
                        this.setBlockAt(x,y,z,1);
                    }else{
                        this.setBlockAt(x,y,z,2);
                    }
                }
                // var treeNoise = perlinNoise.perlin((x+chunkX*16+0.5),(z+chunkZ*16+0.5));
                // var canTree = perlinNoise.perlin((x+chunkX*16+0.5)/32,(z+chunkZ*16+0.5)/32);
                // if(canTree>0){
                //     var treeHeight = 0;
                //     if(treeNoise>0.5){
                //         for (treeHeight = 0; treeHeight < treeNoise*10; treeHeight++) {
                //             this.setBlockAt(x,height+treeHeight,z,3);
                //         }
                //         treeHeight += height;
                //         this.setBlockAt(x,treeHeight,z,4);
                //         this.setBlockAt(x-1,treeHeight,z,4);
                //     }
                // }
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