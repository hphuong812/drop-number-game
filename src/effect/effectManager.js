import * as PIXI from "pixi.js";
import { Effect } from "./effect";

export class EffectManager extends PIXI.Container {
    constructor() {
        super();
        this._listEffect = [];
        this.defaultBrickTextureName = 'white2.png';
        this.defaultBrickJson = 'emitter.json';
        this.effect;
    }

    collisionEffect(x, y) {
        this.effect = new Effect(x, y, this, this.defaultBrickTextureName, this.defaultBrickJson);
        console.log(this.width, this.height)
        this.effect.playOnceAndDestroy(() => this.remove(this.effect))
        this._listEffect.push(this.effect);
    }

    remove(effect) {
        let index = this._listEffect.indexOf(effect);
        if (index !== -1) {
            this._listEffect.splice(index, 1);
            this.removeChild(effect);
        }
    }

    update(delta, x, y) {
        this._listEffect.forEach(effect => {
            effect.x = x
            effect.y += y
            effect.update(delta)
        })


    }
}