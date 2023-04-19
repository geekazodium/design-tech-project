class AssetLoader{
    constructor(path){ 
        this.path = path;
        this.loaders = new Map();
        this.initImgLoader();
        this.initBBMLoader();
        this.bbModels = [];
    }
    initImgLoader(){
        this.loaders.set("img",(element)=>{
            var img = new Image(element.width,element.height);
            img.src = element.src;
            img.id = element.id;
            document.body.appendChild(img);
        });
    }
    initBBMLoader(){
        this.loaders.set("bbModel",(element)=>{
            fetch(this.path)
                .then((response) => response.json())
                .then((json) => {this.json = json;})
                .then(() => {
                    this.bbModels.push(this.json);
                });
        });
    }
    load(res){
        this.json = undefined;
        fetch(this.path)
            .then((response) => response.json())
            .then((json) => {this.json = json;})
            .then(() => {
                this.json.forEach(element => {
                    this.loadItem(element);
                });
                res();
            });
    }
    async loadItem(element){
        var loader = this.loaders.get(element.type);
        if(loader == undefined) return;
        loader(element);
    }
}

export {AssetLoader};