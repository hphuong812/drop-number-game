import { EventEmitter } from "@pixi/utils";
export const ColliderEvent = Object.freeze({
    Colliding: "collider:colliding",
    NeedRemove: "collider:needremove"
});

export class Collider extends EventEmitter {
    constructor() {
        super();

    }
}
