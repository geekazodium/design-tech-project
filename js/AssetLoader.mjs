class AssetLoader{
    constructor(path){ 
        this.path = path
    }
    load(res){
        this.json = undefined;
        fetch(this.path)
            .then((response) => response.json())
            .then((json) => {this.json = json;})
            .then(() => {
                this.json.forEach(element => {
                    if(element.type == "img"){
                        var img = new Image(element.width,element.height);
                        img.src = element.src;
                        img.id = element.id;
                        document.body.appendChild(img);
                    }
                });
                res();
            });
    }
}

export {AssetLoader};