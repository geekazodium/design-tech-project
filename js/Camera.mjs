class Camera{
    constructor(){
        this.pitch = 0;
        this.yaw = 0;
    }
    update(){
        this.pitch+=0;
        this.yaw+=0.01;
    }
}

export {Camera};