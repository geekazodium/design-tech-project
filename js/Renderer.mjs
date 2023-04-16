class Renderer{
    constructor(priority){
        this.priority = priority;
    }
    getPriority(){
        return this.priority;
    }
    render(gl,timestamp){
    }
}

export {Renderer};