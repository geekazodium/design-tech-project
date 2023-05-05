import { Vec2f } from "./Vec.mjs";

class LayeredPerlinNoise{

    constructor(...layers){
        this.layers = layers;
    }

    get(x,y){
        var out = 0;
        this.layers.forEach(layer => {
            out += perlinNoise.perlin(x*layer.scale+layer.x,y*layer.scale+layer.y);
        });
        return out;
    }
}

class PerlinNoise{

    interpolate(a0, a1, w) {
        /* // You may want clamping by inserting:
         * if (0.0 > w) return a0;
         * if (1.0 < w) return a1;
         */
        return (a1 - a0) * w + a0;
        /* // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
         * return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
         *
         * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
         * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
         */
    }
    
    /* Create pseudorandom direction vector
     */
    randomGradient(ix, iy) {
        // No precomputed gradients mean this works for any number of grid coordinates
        var w = 8 * 4;
        var s = w / 2; // rotation width
        var a = ix, b = iy;
        a *= 3284157443; b ^= a << s | a >> w-s;
        b *= 1911520717; a ^= b << s | b >> w-s;
        a *= 2048419325;
        var random = a * (3.14159265 / ~(0xffff >> 1)); // in [0, 2*Pi]
        var vec2 = new Vec2f(Math.cos(random),Math.sin(random));
        return vec2;
    }
    
    // Computes the dot product of the distance and gradient vectors.
    dotGridGradient(ix,iy, x, y) {
        // Get gradient from integer coordinates
        var gradient = this.randomGradient(ix, iy);
    
        // Compute the distance vector
        var dx = x - parseFloat(ix);
        var dy = y - parseFloat(iy);
    
        // Compute the dot-product
        return (dx*gradient.x + dy*gradient.y);
    }
    
    // Compute Perlin noise at coordinates x, y
    perlin(x, y) {
        // Determine grid cell coordinates
        var x0 = Math.floor(x);
        var x1 = x0 + 1;
        var y0 = Math.floor(y);
        var y1 = y0 + 1;
    
        // Determine interpolation weights
        // Could also use higher order polynomial/s-curve here
        var sx = x - parseFloat(x0);
        var sy = y - parseFloat(y0);
    
        // Interpolate between grid point gradients
        var n0, n1, ix0, ix1, value;
    
        n0 = this.dotGridGradient(x0, y0, x, y);
        n1 = this.dotGridGradient(x1, y0, x, y);
        ix0 = this.interpolate(n0, n1, sx);
    
        n0 = this.dotGridGradient(x0, y1, x, y);
        n1 = this.dotGridGradient(x1, y1, x, y);
        ix1 = this.interpolate(n0, n1, sx);
    
        value = this.interpolate(ix0, ix1, sy);
        return value; // Will return in range -1 to 1. To make it in range 0 to 1, multiply by 0.5 and add 0.5
    }
}
const perlinNoise = new PerlinNoise();


export {LayeredPerlinNoise,perlinNoise};