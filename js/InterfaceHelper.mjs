class InterfaceHelper{
    constructor(canvas){
        this.canvas = canvas;
        this.updateCanvasSize();
        window.addEventListener("resize",()=>{this.updateCanvasSize();});
    }
    updateCanvasSize(){
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
    }
}

export {InterfaceHelper};