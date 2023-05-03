class SortedNode{
    /**
     * 
     * @param {Array} section 
     * @param {Function} compareFunction 
     * @returns SortedNode for that section
     */
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
        if(this.item == undefined) return [];
        return ret;
    }
}

function quickSort(section,compareFunction){
    var item
    if(section.length < 1){
        throw new Error("possibly flawed compare function, this should not be possible");
    }else if(section.length == 1){
        item = section[0];
        return item;
    }

    let length = section.length;
    let half = length>>1;
    item = section[half];

    let before = new Array();
    let after = new Array();

    for(let i = 0; i<length; i++){
        if(i == half)continue;

        let element = section[i];
        if(compareFunction(item,element)){
            after.push(element);
        }else{
            before.push(element);
        }
    }
    
    let ret = new Array();
    if(before.length>0){
        ret = ret.concat(quickSort(before,compareFunction));
    }
    ret = ret.concat(item);
    if(after.length>0){
        ret = ret.concat(quickSort(after,compareFunction));
    }
    if(item == undefined) return [];
    return ret;
}

export {SortedNode,quickSort};


function sortBenchmark(list, sortMethod, compareFunction){
    var start = +new Date();
    var sorted = sortMethod(list, compareFunction);
    var end = +new Date();
    return [sorted, end-start];
}