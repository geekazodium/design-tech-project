class Vec3i{
    constructor(x,y,z){
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.z = parseInt(z);
    }
};

class Vec2f{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

export {Vec3i,Vec2f}