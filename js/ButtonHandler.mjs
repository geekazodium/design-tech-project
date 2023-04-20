class ButtonHandler{
    constructor(){
        this.keybinds = new Map();
        window.addEventListener("keydown",(event)=>{
            this.onPress(event);
        });
        window.addEventListener("keyup",(event)=>{
            this.onRelase(event);
        });
        window.addEventListener("mousedown",(event)=>{
            this.onPress(event);
        });
        window.addEventListener("mouseup",(event)=>{
            this.onRelase(event);
        });
    }
    registerKeybind(keybind){
        var bucket = this.keybinds.get(keybind.key);
        if(bucket == undefined){
            bucket = new Array();
            this.keybinds.set(keybind.key,bucket);
        }
        bucket.push(handler);
    }
    onPress(event){
        var keybinds = this.keybinds.get(this.getEventId(event));
        if(keybinds == undefined)return;
        keybinds.forEach(keybind => {
            keybind.onPress(event);
        });
    }
    onRelase(event){
        var keybinds = this.keybinds.get(this.getEventId(event));
        if(keybinds == undefined)return;
        keybinds.forEach(keybind => {
            keybind.onRelase(event);
        });
    }
    getEventId(event){
        if(event instanceof MouseEvent) return "Mouse"+event.button;
        else return event.code;
    }
}

export {ButtonHandler};