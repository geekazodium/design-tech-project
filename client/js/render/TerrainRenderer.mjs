import { TerrainBufferBuilder } from "../TerrainBufferBuilder.mjs";
import { Renderer } from "./Renderer.mjs";

const TERRAIN_VERTEX = 
`#version 300 es
precision mediump float;

uniform mat4 mRotation;
uniform vec3 vPosition;
uniform mat4 mProjection;
layout(location=0) in vec3 vertPosition;
layout(location=1) in vec3 texPosition;

out float vDepth;
out vec2 fragTexPosition;

void main(){
    vDepth = texPosition[2];
    fragTexPosition = vec2(texPosition);
    gl_Position = mProjection * mRotation * vec4(vertPosition - vPosition, 1.0);
}`;

const TERRAIN_FRAGMENT =
`#version 300 es

precision mediump float;

uniform mediump sampler2DArray sampler;

in vec2 fragTexPosition;
in float vDepth;

out vec4 fragColor;

void main(){
    fragColor = texture(sampler, vec3(fragTexPosition, vDepth));
}`;

class TerrainRenderer extends Renderer{
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
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
        this.layerAttribLocation = gl.getAttribLocation(this.terrainRenderProgram, 'aDepth');

        this.terrainTexture = gl.createTexture();
        this.texturePixelBufferObject = gl.createBuffer();
        var img = this.convertToArray(this.textureAtlas);

        this.bindTextureAtlas(gl,this.texturePixelBufferObject,img,this.terrainTexture);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY,null);
    }
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {*} pbo (pointer, blank buffer)
     * @param {Uint8Array} imageData 
     * @param {*} texture (pointer, blank glTexture)
     */
    bindTextureAtlas(gl,pbo,imageData,texture){

        const textureWidth = 16;
        const textureHeight = 16;
        const newLineAt = 8;

        gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);

        // Step 2: allocate space on the GPU for your texture data
        const totalTextures = imageData.length/4/textureHeight/textureWidth;
        gl.texStorage3D(
            gl.TEXTURE_2D_ARRAY, 
            4, 
            gl.RGBA8, 
            textureWidth,
            textureHeight,
            totalTextures
        );

        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Step 3: create a PBO
        gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
        gl.bufferData(gl.PIXEL_UNPACK_BUFFER, imageData, gl.STATIC_DRAW);

        // Step 4: assign a width and height to the PBO
        gl.pixelStorei(gl.UNPACK_ROW_LENGTH, textureWidth*newLineAt);
        gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, textureHeight*totalTextures/newLineAt);

        // Step 5: Loop through each image in your atlas
        for (let i = 0; i < totalTextures; i++) {
            gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pbo);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
            //Step 6: figure out the origin point of the texture at that index
            const row = Math.floor(i / newLineAt) * textureHeight;
            const col = (i % newLineAt) * textureWidth;

            // Step 7: Assign that origin point to the PBO
            gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, col);
            gl.pixelStorei(gl.UNPACK_SKIP_ROWS, row);

            // Step 8: Tell webgl to use the PBO and write that texture at its own depth
            gl.texSubImage3D(
                gl.TEXTURE_2D_ARRAY, 
                0,

                0,0,i, 

                textureWidth,
                textureHeight,
                1, 

                gl.RGBA, 
                gl.UNSIGNED_BYTE,
                0
            );
        }
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
    convertToArray(canvas){
        return new Uint8Array(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data.buffer);
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
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {*} timestamp 
     * @param {*} renderContext 
     * @param {*} visibleChunks 
     */
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

        gl.bindTexture(gl.TEXTURE_2D_ARRAY,this.terrainTexture);
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
                6 * Float32Array.BYTES_PER_ELEMENT,
                0 
            );
            gl.vertexAttribPointer(
                this.textureAttribLocation,
                3,
                gl.FLOAT,
                gl.FALSE,
                6 * Float32Array.BYTES_PER_ELEMENT,
                3 * Float32Array.BYTES_PER_ELEMENT
            );
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
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