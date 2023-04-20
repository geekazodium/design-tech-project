class ButtonHandler{
    constructor(){
        this.inputStack = new InputStack();
        window.addEventListener("keydown",(event)=>{this.inputStack.append(event)});
        window.addEventListener("keyup",(event)=>{this.inputStack.append(event)});
        window.addEventListener("mousedown",(event)=>{this.inputStack.append(event)});
        window.addEventListener("mouseup",(event)=>{this.inputStack.append(event)});
    }
}

class Node{
    constructor(data, next){
        this.data = data;
        this.next = next;
    }
    relink(next){
        this.next = next;
    }
}

class InputStack{
    constructor(){
        this.initial = undefined;
        this.last = undefined;
    }
    append(input){
        if(this.initial == undefined){
            this.initial = new Node(input,undefined);
            this.last = this.initial;
            return;
        }
        this.last.next = new Node(input,undefined);
        this.last = this.last.next;
    }
    popInitial(){
        var ret = this.initial;
        this.initial = this.initial.next;
        if(this.initial == undefined){
            this.last == undefined;
        }
        return ret;
    }
    hasInitial(){
        return !(this.initial == undefined);
    }
}