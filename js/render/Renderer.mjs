class Renderer{
    constructor(priority){
        this.priority = priority;
    }
    getPriority(){
        return this.priority;
    }
    render(gl,timestamp){
    }
    compileShader(gl,shader){
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(shader));
            return;
        }
    }
    linkProgram(gl,vertex,fragment){
        var program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }
        return program;
    }
}

export {Renderer};