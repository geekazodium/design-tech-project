import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { Renderer } from "./Renderer.mjs";

const TERRAIN_VERTEX = 
`precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texPosition;
uniform mat4 mRotation;
uniform vec3 vPosition;
uniform mat4 mProjection;

varying highp vec2 fragTexPosition;

void main(){
    fragTexPosition = texPosition;
    gl_Position = mProjection * mRotation * vec4(vertPosition - vPosition, 1.0);
}`;

const TERRAIN_FRAGMENT =
`precision mediump float;

varying highp vec2 fragTexPosition;

uniform sampler2D sampler;

void main(){
    gl_FragColor = texture2D(sampler, fragTexPosition);
}`;

class TerrainRenderer extends Renderer{
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl){
        super(1,"terrain");

        this.textureAtlas = document.getElementById("terrain-texture-atlas");

        this.compileProgram(gl);

        gl.useProgram(this.terrainRenderProgram);

        this.rotationUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'mRotation');
        this.projectionUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'mProjection');
        this.positionUniformLocation = gl.getUniformLocation(this.terrainRenderProgram, 'vPosition');

        this.terrainVBOs = new Array();
        this.terrainIBOs = new Array();

        this.positionAttribLocation = gl.getAttribLocation(this.terrainRenderProgram, 'vertPosition');
        this.textureAttribLocation = gl.getAttribLocation(this.terrainRenderProgram, 'texPosition');

        this.terrainTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.terrainTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
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
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    removeBufferObjects(gl){
        var lastVBO = this.terrainVBOs.pop();
        var lastIBO = this.terrainIBOs.pop();
        gl.deleteBuffer(lastIBO);
        gl.deleteBuffer(lastVBO);
    }
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    appendBufferObjects(gl){
        var tempVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,tempVBO);
        var tempIBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,tempIBO);
        this.terrainIBOs.push(tempIBO);
        this.terrainVBOs.push(tempVBO);
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

        gl.bindTexture(gl.TEXTURE_2D,this.terrainTexture);
        gl.activeTexture(gl.TEXTURE0);

        for(let i = 0; i < this.terrainVBOs.length; i++){
            const vbo = this.terrainVBOs[i];
            const ibo = this.terrainIBOs[i];
            const bufferLength = this.bufferBuilder.bufferLengths[i];
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(
                this.positionAttribLocation,
                3,
                gl.FLOAT,
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT,
                0 
            );
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            gl.vertexAttribPointer(
                this.textureAttribLocation,
                2,
                gl.FLOAT,
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT,
                3 * Float32Array.BYTES_PER_ELEMENT
            );
		    gl.drawElements(gl.TRIANGLES, bufferLength, gl.UNSIGNED_SHORT, 0);
        }

        gl.disableVertexAttribArray(this.positionAttribLocation);

        gl.disableVertexAttribArray(this.textureAttribLocation);
    }
    attachBufferBuilder(bufferBuilder){
        if(!(bufferBuilder instanceof TerrainBufferBuilder))return;
        this.bufferBuilder = bufferBuilder;
        bufferBuilder.setBuildTo(this);
    }
}

export {TerrainRenderer};