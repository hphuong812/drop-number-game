import { Sprite } from './sprite'
import { BlockCollider } from '../collision/blockCollider'
import * as TWEEN from '@tweenjs/tween.js'
class Block extends Sprite {
    constructor(texTureCache) {
        super(texTureCache);
        this.lock = 0;
        this.move = false;
        this.column = 0;
        this.newColumn = 0;
        this.collider = new BlockCollider(this)
    }
    setFalseMove() {
        this.move = false;
    }
    setTrueMove() {
        this.move = true;
    }
    updateAnimation(xOld, yOld, xNew, yNew, speed = null) {
        let speedAnimation;
        if (speed == null) {
            speedAnimation = 200
        } else {
            speedAnimation = speed
        }
        let finish = false
        this.positionMove = { x: xOld, y: yOld }
        this.movePosition = { x: xNew, y: yNew }
        this.tween = new TWEEN.Tween(this.positionMove);
        this.tween.to(this.movePosition, speedAnimation)
            .onUpdate((pos) => {
                this.y = pos.y
                this.x = pos.x
            })
            .start()
    }

}

export { Block }