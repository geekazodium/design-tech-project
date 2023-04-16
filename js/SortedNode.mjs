class SortedNode{
    constructor(section,compareFunction){
        if(section.length < 1){
            this.item = undefined;
            return;
        }else if(section.length == 1){
            this.item = section[0];
            return;
        }

        let length = section.length;
        let half = length>>1;
        this.item = section[half];

        let before = new Array();
        let after = new Array();

        for(let i = 0; i<length; i++){
            if(i == half)continue;

            let element = section[i];
            if(compareFunction(this.item,element)){
                after.push(element);
            }else{
                before.push(element);
            }
        }
        
        if(before.length>0){
            this.before = new SortedNode(before,compareFunction);
        }
        if(after.length>0){
            this.after = new SortedNode(after,compareFunction);
        }
    }
    getList(){
        let ret = new Array();
        if(this.before){
            ret = ret.concat(this.before.getList());
        }
        ret = ret.concat(this.item);
        if(this.after){
            ret = ret.concat(this.after.getList());
        }
        return ret;
    }
}

export {SortedNode};