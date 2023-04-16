import * as mat4 from "/libraries/esm/mat4.js";

class RenederDispatcherContext{
    constructor(gl){
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);
    }
    update(displaySurface){
        mat4.lookAt(this.viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
        mat4.perspective(this.projMatrix, 45/180*Math.PI, displaySurface.clientWidth / displaySurface.clientHeight, 0.1, 1000.0);
    }
}

export {RenederDispatcherContext};