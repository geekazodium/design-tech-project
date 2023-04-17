class InterfaceHelper{
    constructor(canvas,camera){
        this.canvas = canvas;
        this.camera = camera;
        this.updateCanvasSize();
        window.addEventListener("resize",()=>{this.updateCanvasSize();});
    }
    updateCanvasSize(){
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
        if(this.camera.renderDispatcher == undefined)return;
        let gl = this.camera.renderDispatcher.ctx;
        gl.viewport(0, 0, w, h);
    }
}

export {InterfaceHelper};