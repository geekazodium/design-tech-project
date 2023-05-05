import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { Renderer } from "./Renderer.mjs";

const BOX_VERTICES = 
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

const BOX_INDICES = [
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

const TERRAIN_VERTEX = 
`precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texPosition;
uniform mat4 mRotation;
uniform vec3 vPosition;
uniform mat4 mProjection;

varying vec2 fragTexPosition;

void main(){
    fragTexPosition = texPosition;
    gl_Position = mProjection * mRotation * vec4(vertPosition - vPosition, 1.0);
}`;

const TERRAIN_FRAGMENT =
`precision mediump float;

varying vec2 fragTexPosition;

uniform sampler2D sampler;

void main(){
    gl_FragColor = texture2D(sampler, fragTexPosition);
}`;

class TerrainRenderer extends Renderer{
    constructor(gl){
        super(1,"terrain");

        this.textureAtlas = document.getElementById("terrain-texture-atlas");

        this.compileProgram(gl);

        gl.useProgram(this.terrainRenderProgram);

        this.rotationUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'mRotation');
        this.projectionUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'mProjection');
        this.positionUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'vPosition');

        this.terrainVBO = gl.createBuffer();
        this.terrainIBO = gl.createBuffer();
        this.updateTerrainData(gl,BOX_VERTICES,BOX_INDICES);

        this.positionAttribLocation = gl.getAttribLocation(this.terrainRenderProgram, 'vertPosition');
        this.textureAttribLocation = gl.getAttribLocation(this.terrainRenderProgram, 'texPosition');

        this.terrainTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.terrainTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        var img = this.textureAtlas;
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
	    );
	    gl.bindTexture(gl.TEXTURE_2D, null);
    }
    createChunkVBO(gl){
    }
    updateTerrainData(gl,VERTICES,INDICES){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.terrainVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(VERTICES), gl.DYNAMIC_DRAW);
 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.terrainIBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(INDICES), gl.DYNAMIC_DRAW);
    }
    compileProgram(gl){
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, TERRAIN_VERTEX);
        gl.shaderSource(fragmentShader, TERRAIN_FRAGMENT);

        this.compileShader(gl,vertexShader);
        this.compileShader(gl,fragmentShader);

        this.terrainRenderProgram = this.linkProgram(gl,vertexShader,fragmentShader);
    }
    render(gl,timestamp,renderContext,visibleChunks){
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        
        gl.useProgram(this.terrainRenderProgram);
    
        gl.enableVertexAttribArray(this.positionAttribLocation);

        gl.enableVertexAttribArray(this.textureAttribLocation);

        gl.uniformMatrix4fv(this.rotationUniformLocation, gl.FALSE, renderContext.rotationMatrix);
        gl.uniformMatrix4fv(this.projectionUniformLocation, gl.FALSE, renderContext.projMatrix);
        gl.uniform3fv(this.positionUniformLocation, renderContext.cameraInstance.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.terrainVBO);
        gl.vertexAttribPointer(
            this.positionAttribLocation,
            3,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            0 
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.terrainIBO);
        gl.vertexAttribPointer(
            this.textureAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );


        gl.bindTexture(gl.TEXTURE_2D,this.terrainTexture);
        gl.activeTexture(gl.TEXTURE0);
		gl.drawElements(gl.TRIANGLES, this.bufferBuilder.bufferLength, gl.UNSIGNED_SHORT, 0);
        
        gl.disableVertexAttribArray(this.positionAttribLocation);

        gl.disableVertexAttribArray(this.textureAttribLocation);
    }
    attachBufferBuilder(bufferBuilder){
        if(!(bufferBuilder instanceof TerrainBufferBuilder))return;
        this.bufferBuilder = bufferBuilder;
        bufferBuilder.setBuildTo(this.terrainVBO,this.terrainIBO);
    }
}

export {TerrainRenderer};