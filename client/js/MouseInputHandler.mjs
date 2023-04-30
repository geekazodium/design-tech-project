class MouseInputHandler{
    constructor(element){
        this.canLock = false;
        this.element = element;
        this.delta = [0,0];
        this.initPointerLock();
        this.initPointerMove();
    }
    initPointerMove(){
        window.addEventListener("mousemove",async (event)=>{
            if(!document.pointerLockElement)return;
            this.delta[0]+=event.movementX;
            this.delta[1]+=event.movementY;
        });
    }
    initPointerLock(){
        window.addEventListener("mousedown",async ()=>{
            try{
                if(!this.canLock)return;
                this.attemptLockPointer(this.element);
            }catch(e){
                document.exitPointerLock();
            }
        });
    }
    async attemptLockPointer(element){
        await element.requestPointerLock({
            unadjustedMovement: true,
        });
    }
    getMovedBy(){
        var ret = this.delta;
        this.delta = [0,0];
        return ret;
    }
}

export {MouseInputHandler};