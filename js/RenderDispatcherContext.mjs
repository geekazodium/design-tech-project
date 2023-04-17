import * as mat4 from "/libraries/esm/mat4.js";

class RenederDispatcherContext{
    constructor(gl){
        this.viewMatrix = new Float32Array(16);
        this.rotationMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);
        this.xRotation = new Float32Array(16);
        this.yRotation = new Float32Array(16);
        this.identity = new Float32Array(16);
        mat4.identity(this.identity);
    }
    update(displaySurface,cameraInstance){
		mat4.rotate(this.yRotation, this.identity, cameraInstance.yaw, [0, 1, 0]);
	    mat4.rotate(this.xRotation, this.identity, cameraInstance.pitch, [1, 0, 0]);
		mat4.mul(this.rotationMatrix, this.xRotation, this.yRotation);
        mat4.lookAt(this.viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
        mat4.perspective(this.projMatrix, 105/180*Math.PI, displaySurface.clientWidth / displaySurface.clientHeight, 0.1, 1000.0);
    }
}

export {RenederDispatcherContext};