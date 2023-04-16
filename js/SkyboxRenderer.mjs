import { Renderer } from "./Renderer.mjs";

const BOX_VERTICES = 
[ // X, Y, Z   
    // Top
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Left
    -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,

    // Right
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,

    // Front
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,

    // Bottom
    -1.0, -1.0, -1.0, 
    -1.0, -1.0, 1.0,  
    1.0, -1.0, 1.0,   
    1.0, -1.0, -1.0,  
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
attribute vec3 vertColor;
uniform mat4 mView;
uniform mat4 mProj;

varying vec3 fragColor;

void main(){
  fragColor = vec3(1.0, 0.0, 1.0);
  gl_Position = mProj * mView * vec4(vertPosition, 1.0);
}`

const SKYBOX_FRAGMENT =
`precision mediump float;

varying vec3 fragColor;
void main(){
  gl_FragColor = vec4(fragColor, 1.0);
}`

class SkyboxRenderer extends Renderer{
    constructor(gl){
        super(0);

        this.compileProgram(gl);

        gl.useProgram(this.skyboxRendererProgram);

        this.viewUniformLocation = gl.getUniformLocation(this.skyboxRendererProgram, 'mView');
        this.projectionUniformLocation = gl.getUniformLocation(this.skyboxRendererProgram, 'mProj');
        
        this.skyBoxVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.skyBoxVBO);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(BOX_VERTICES), gl.STATIC_DRAW);

        this.skyBoxIBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.skyBoxIBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(BOX_INDICES), gl.STATIC_DRAW);

        this.positionAttribLocation = gl.getAttribLocation(this.skyboxRendererProgram, 'vertPosition');

        gl.vertexAttribPointer(
            this.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.enableVertexAttribArray(this.positionAttribLocation);
    }
    compileProgram(gl){
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vertexShader, SKYBOX_VERTEX);
        gl.shaderSource(fragmentShader, SKYBOX_FRAGMENT);

        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return;
        }

        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
            return;
        }

        this.skyboxRendererProgram = gl.createProgram();
        gl.attachShader(this.skyboxRendererProgram, vertexShader);
        gl.attachShader(this.skyboxRendererProgram, fragmentShader);
        gl.linkProgram(this.skyboxRendererProgram);
        if (!gl.getProgramParameter(this.skyboxRendererProgram, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(this.skyboxRendererProgram));
            return;
        }
        gl.validateProgram(this.skyboxRendererProgram);
        if (!gl.getProgramParameter(this.skyboxRendererProgram, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(this.skyboxRendererProgram));
            return;
        }
    }
    render(gl,timestamp,renderContext){
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);
        gl.cullFace(gl.BACK);
        //gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.useProgram(this.skyboxRendererProgram);
        gl.uniformMatrix4fv(this.viewUniformLocation, gl.FALSE, renderContext.viewMatrix);
        gl.uniformMatrix4fv(this.projectionUniformLocation, gl.FALSE, renderContext.projMatrix);

        gl.clearColor(0.35, 0.55, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, BOX_VERTICES.length, gl.UNSIGNED_SHORT, 0);
    }
}

export {SkyboxRenderer};