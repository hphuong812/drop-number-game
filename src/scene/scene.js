import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js'
class Scene extends PIXI.Container {
    constructor() {
        super();
        this.countJump = 0
    }
    setVisible(visible) {
        super.visible = visible;
    }
    addChild(child) {
        super.addChild(child);
    }
    updateAnimationScore(jump, run) {

        this.positionMove = { x: this.countJump, y: 0 }
        this.movePosition = { x: this.countJump + jump, y: 0 }
        this.tween = new TWEEN.Tween(this.positionMove);
        this.tween.to(this.movePosition, 600)
            .onUpdate((pos) => {
                if (run.outer.width < 300) {
                    run.outer.width = pos.x
                }
            })
            .start()
        this.countJump += jump
    }
    updateAnimationScene(yOld, yNew) {
        this.positionMove = { x: 0, y: yOld }
        this.movePosition = { x: 0, y: yNew }
        this.tween = new TWEEN.Tween(this.positionMove);
        this.tween.to(this.movePosition, 800)
            .onUpdate((pos) => {
                this.y = pos.y
            })
            .start()
    }
}
export { Scene };