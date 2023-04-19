class MouseInputHandler{
    constructor(element){
        this.locked = false;
        this.element = element;
    }
    lock(){
        this.listener = window.addEventListener("click",async ()=>{
            window.removeEventListener("click",this.listener);
            this.locked = true;
            try{
                await this.element.requestPointerLock({
                    unadjustedMovement: true,
                });
            }catch(e){
                document.exitPointerLock();
                this.locked = false;
            }
        });
    }
}

export {MouseInputHandler};