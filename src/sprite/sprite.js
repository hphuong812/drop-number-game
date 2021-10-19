import * as PIXI from 'pixi.js';
class Sprite extends PIXI.Sprite {
    constructor(texTureCache) {
        super(texTureCache);
    }
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }
    update(detail) {
        this.x += this.vx * detail;
        this.y += this.vy * detail;
    }
}
export { Sprite }