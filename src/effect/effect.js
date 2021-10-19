import { Emitter } from "pixi-particles";
import * as PIXI from 'pixi.js'
export class Effect extends Emitter {
    constructor(x, y, parent, texture, jsonFile) {
        let config = require(`../../assets/effect/${jsonFile}`);
        config.pos.x = x;
        config.pos.y = y;

        let txt = PIXI.utils.TextureCache[texture];
        super(parent, [txt], config);
    }

    update(delta) {
        super.update(delta);
    }
}