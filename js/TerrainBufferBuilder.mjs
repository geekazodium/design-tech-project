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
        var tempVBO =
        [ // x, y, z,     u, v
            // Top
            -1.0, 1.0, -1.0,    0, 0,
            -1.0, 1.0, 1.0,     0, 1/8,
            1.0, 1.0, 1.0,      1/8, 1/8,
            1.0, 1.0, -1.0,     1/8, 0,
        
            // Left
            -1.0, 1.0, 1.0,     0, 0,
            -1.0, -1.0, 1.0,    0, 1/8,
            -1.0, -1.0, -1.0,   1/8, 1/8,
            -1.0, 1.0, -1.0,    1/8, 0,
        
            // Right
            1.0, 1.0, 1.0,      0, 0,
            1.0, -1.0, 1.0,     0, 1/8,
            1.0, -1.0, -1.0,    1/8, 1/8,
            1.0, 1.0, -1.0,     1/8, 0,
        
            // Front
            1.0, 1.0, 1.0,      0, 0,
            1.0, -1.0, 1.0,     0, 1/8,
            -1.0, -1.0, 1.0,    1/8, 1/8,
            -1.0, 1.0, 1.0,     1/8, 0,
        
            // Back
            1.0, 1.0, -1.0,     0, 0,
            1.0, -1.0, -1.0,    0, 1/8,
            -1.0, -1.0, -1.0,   1/8, 1/8,
            -1.0, 1.0, -1.0,    1/8, 0,
        
            // Bottom
            -1.0, -1.0, -1.0,   0, 0,
            -1.0, -1.0, 1.0,    0, 1/8,
            1.0, -1.0, 1.0,     1/8, 1/8,
            1.0, -1.0, -1.0,    1/8, 0
        ];
        
        var tempIBO = [
            // Top
            0, 1, 2,
            0, 2, 3,
        
            // Left
            5, 4, 6,
            6, 4, 7,
        
            // Right
            8, 9, 10,
            8, 10, 11,
        
            // Front
            13, 12, 14,
            15, 14, 12,
        
            // Back
            16, 17, 18,
            16, 18, 19,
        
            // Bottom
            21, 20, 22,
            22, 20, 23
        ];

        this.indexCounter = 24;

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_POS_Y,[0,-1,-2],[0,0],[1,1]);

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_NEG_Y,[0,1,-2],[0,0],[1,1]);

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_NEG_X,[0,0,-2],[0,0],[1,1]);

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_POS_X,[-1,-1,-2],[0,0],[1,1]);

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_NEG_Z,[-1,-1,-2],[0,0],[1,1]);

        this.createCubeFaceMPos(tempVBO,tempIBO,this.FACE_POS_Z,[-1,-1,-2],[0,0],[1,1]);

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