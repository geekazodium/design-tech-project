class Keybind{
    constructor(key){
        this.key = key;
        this.pressed = 0;
        this.isPressed = false;
    }
    onPress(event){
        this.isPressed = true;
        this.pressed++;
    }
    onRelase(event){
        this.isPressed = false;
    }
    wasPressed(){
        if(this.pressed>0){
            this.pressed--; 
            return true;
        }
        return false;
    }
}

export {Keybind};