import { BufferBuilder } from "./BufferBuilder.mjs";

class TerrainBufferBuilder extends BufferBuilder{
    constructor(textureAtlas){
        super(textureAtlas);
        this.FACE_NEG_X = 0;
        this.FACE_POS_X = 1;
        this.FACE_NEG_Y = 2;
        this.FACE_POS_Y = 3;
        this.FACE_NEG_Z = 4;
        this.FACE_POS_Z = 5;
    }
    rebuild(gl){
        super.rebuild();
        var tempVBO = [];
        var tempIBO = [];

        this.createCube(tempVBO,tempIBO,0,0,-2,[0,0],[1/8,1/8]);
        this.createCube(tempVBO,tempIBO,1,0,-2,[1/8,0],[2/8,1/8]);
        this.createCube(tempVBO,tempIBO,1,1,-2,[2/8,0],[3/8,1/8]);

        this.bufferLength = tempIBO.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tempVBO), gl.DYNAMIC_DRAW);
 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tempIBO), gl.DYNAMIC_DRAW);
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
    createCubeFaceMPos(VBO,IBO,direction,minPos,uvStart,uvEnd){
        return this.createCubeFaceMXYZ(VBO,IBO,direction,minPos[0],minPos[1],minPos[2],uvStart,uvEnd);
    }
    createCube(VBO,IBO,minX,minY,minZ,uvMin,uvMax){

        this.createCubeFaceMPos(VBO,IBO,this.FACE_POS_Y,[minX,minY+1,minZ],uvMin,uvMax);

        this.createCubeFaceMPos(VBO,IBO,this.FACE_NEG_Y,[minX,minY,minZ],uvMin,uvMax);

        this.createCubeFaceMPos(VBO,IBO,this.FACE_NEG_X,[minX,minY,minZ],uvMin,uvMax);

        this.createCubeFaceMPos(VBO,IBO,this.FACE_POS_X,[minX+1,minY,minZ],uvMin,uvMax);

        this.createCubeFaceMPos(VBO,IBO,this.FACE_NEG_Z,[minX,minY,minZ+1],uvMin,uvMax);

        this.createCubeFaceMPos(VBO,IBO,this.FACE_POS_Z,[minX,minY,minZ],uvMin,uvMax);
    }
    createCubeFaceMXYZ(VBO,IBO,direction,minX,minY,minZ,uvStart,uvEnd){
        if(direction == this.FACE_POS_Y){
            VBO.push(
                minX, minY, minZ,       uvStart[0], uvStart[1],
                minX, minY, minZ+1,     uvStart[0], uvEnd[1],
                minX+1, minY, minZ+1,   uvEnd[0], uvEnd[1],
                minX+1, minY, minZ,     uvEnd[0], uvStart[1]
            );
            IBO.push(
                this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
                this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
            );
            this.indexCounter += 4;
        }else if(direction == this.FACE_NEG_Y){
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
        }else if(direction == this.FACE_NEG_X){
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
        }else if(direction == this.FACE_POS_X){
            VBO.push(
                minX, minY+1, minZ+1,   uvStart[0], uvStart[1],
                minX, minY, minZ+1,     uvStart[0], uvEnd[1],
                minX, minY, minZ,       uvEnd[0], uvEnd[1],
                minX, minY+1, minZ,     uvEnd[0], uvStart[1]
            );
            IBO.push(
                this.indexCounter+0, this.indexCounter+1, this.indexCounter+2,
                this.indexCounter+0, this.indexCounter+2, this.indexCounter+3
            );
            this.indexCounter += 4;
        }else if(direction == this.FACE_NEG_Z){
            VBO.push(
                minX+1, minY+1, minZ,   uvEnd[0], uvStart[1],
                minX+1, minY, minZ,     uvEnd[0], uvEnd[1],
                minX, minY, minZ,       uvStart[0], uvEnd[1],
                minX, minY+1, minZ,     uvStart[0], uvStart[1]
            );
            IBO.push(
                this.indexCounter+1, this.indexCounter+0, this.indexCounter+2,
                this.indexCounter+2, this.indexCounter+0, this.indexCounter+3
            );
            this.indexCounter += 4;
        }else if(direction == this.FACE_POS_Z){
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
}

export {TerrainBufferBuilder};