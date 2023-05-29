import { Renderer } from "./Renderer.mjs";

class BlankRenderer extends Renderer{
    constructor(gl){
        super(-1,"blank");
    }
    render(gl,timestamp,renderContext){
        gl.clearColor(0.35, 0.55, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}

export {BlankRenderer};