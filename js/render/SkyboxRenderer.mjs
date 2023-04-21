import { Renderer } from "./Renderer.mjs";

const BOX_VERTICES = 
[ // x, y, z,     u, v
    // Top
    -1.0, 1.0, -1.0,    0, 0,
    -1.0, 1.0, 1.0,     0, 0,
    1.0, 1.0, 1.0,      0, 0,
    1.0, 1.0, -1.0,     0, 0,

    // Left
    -1.0, 1.0, 1.0,     0, 0,
    -1.0, -1.0, 1.0,    0, 1,
    -1.0, -1.0, -1.0,   1, 1,
    -1.0, 1.0, -1.0,    1, 0,

    // Right
    1.0, 1.0, 1.0,      0, 0,
    1.0, -1.0, 1.0,     0, 1,
    1.0, -1.0, -1.0,    1, 1,
    1.0, 1.0, -1.0,     1, 0,

    // Front
    1.0, 1.0, 1.0,      0, 0,
    1.0, -1.0, 1.0,     0, 1,
    -1.0, -1.0, 1.0,    1, 1,
    -1.0, 1.0, 1.0,     1, 0,

    // Back
    1.0, 1.0, -1.0,     0, 0,
    1.0, -1.0, -1.0,    0, 1,
    -1.0, -1.0, -1.0,   1, 1,
    -1.0, 1.0, -1.0,    1, 0,

    // Bottom
    -1.0, -1.0, -1.0,   1, 1,
    -1.0, -1.0, 1.0,    1, 1,
    1.0, -1.0, 1.0,     1, 1,
    1.0, -1.0, -1.0,    1, 1
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

const SKYBOX_VERTEX = 
`precision mediump float;

attribute vec3 vertPosition;
attribute vec2 texPosition;
uniform mat4 mRotation;
uniform mat4 mProjection;

varying vec2 fragTexPosition;

void main(){
    fragTexPosition = texPosition;
    gl_Position = mProjection * mRotation * vec4(vertPosition, 1.0);
}`;

const SKYBOX_FRAGMENT =
`precision mediump float;

varying vec2 fragTexPosition;

uniform sampler2D sampler;

void main(){
    gl_FragColor = texture2D(sampler, fragTexPosition)-vec4(0.0, 0.0, 0.0, 0.1);
}`;

class SkyboxRenderer extends Renderer{
    constructor(gl){
        super(0);

        this.compileProgram(gl);

        gl.useProgram(this.skyboxRendererProgram);

        this.rotationUniformLocation = gl.getUniformLocation(this.skyboxRendererProgram, 'mRotation');
        this.projectionUniformLocation = gl.getUniformLocation(this.skyboxRendererProgram, 'mProjection');
        
        this.skyBoxVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBoxVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BOX_VERTICES), gl.STATIC_DRAW);

        this.skyBoxIBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyBoxIBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(BOX_INDICES), gl.STATIC_DRAW);

        this.positionAttribLocation = gl.getAttribLocation(this.skyboxRendererProgram, 'vertPosition');
        this.textureAttribLocation = gl.getAttribLocation(this.skyboxRendererProgram, "texPosition");

        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            this.textureAttribLocation,
            2,
            gl.FLOAT,
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT,
            3 * Float32Array.BYTES_PER_ELEMENT
        );

        this.skyBoxTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.skyBoxTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        var img = document.getElementById("sky-box");
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
	    );
	    gl.bindTexture(gl.TEXTURE_2D, null);
    }
    compileProgram(gl){
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, SKYBOX_VERTEX);
        gl.shaderSource(fragmentShader, SKYBOX_FRAGMENT);

        this.compileShader(gl,vertexShader);
        this.compileShader(gl,fragmentShader);

        this.skyboxRendererProgram = this.linkProgram(gl,vertexShader,fragmentShader);
    }
    render(gl,timestamp,renderContext){
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);
        gl.cullFace(gl.BACK);
        
        gl.useProgram(this.skyboxRendererProgram);

        gl.enableVertexAttribArray(this.positionAttribLocation);

        gl.enableVertexAttribArray(this.textureAttribLocation);

        gl.uniformMatrix4fv(this.rotationUniformLocation, gl.FALSE, renderContext.rotationMatrix);
        gl.uniformMatrix4fv(this.projectionUniformLocation, gl.FALSE, renderContext.projMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBoxVBO);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyBoxIBO);

        gl.clearColor(0.35, 0.55, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D,this.skyBoxTexture);
        gl.activeTexture(gl.TEXTURE0);
		gl.drawElements(gl.TRIANGLES, BOX_INDICES.length, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(this.positionAttribLocation);

        gl.disableVertexAttribArray(this.textureAttribLocation);
    }
}

export {SkyboxRenderer};