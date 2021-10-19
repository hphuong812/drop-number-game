import * as PIXI from 'pixi.js'
import * as Constant from '../gameConstant'
import { Scene } from './scene';

export const MenuManagerEvent = Object.freeze({
    UpdateScore: "menumanager:updatescore",
    UpdateJump: "menumanager:updatejump",
    UpdaeLevel: "menumanager:updatelevel",
    Complete: "menumanager:complete",
})
export class MenuManager extends PIXI.Container {
    constructor(jump, level) {
        super();
        this.jump = jump;
        this.level = level
        this._init();
    }
    _init() {
        let horizontalLine = new PIXI.Graphics();
        horizontalLine.position.set(5, Constant.menuHeight - 5)
        horizontalLine.beginFill(0xFFFFFF);
        horizontalLine.drawRect(0, 0, Constant.gameSceneWidth, 1);
        horizontalLine.endFill();
        this.addChild(horizontalLine);

        this.scoreBar = new Scene();
        this.scoreBar.position.set((Constant.gameSceneWidth - 300) / 2, Constant.menuHeight / 2);
        this.addChild(this.scoreBar);

        let innerBar = new PIXI.Graphics();
        innerBar.beginFill(0xFFFFFF);
        innerBar.drawRect(0, 0, 300, 20);
        innerBar.endFill();
        this.scoreBar.addChild(innerBar);

        let outerBar = new PIXI.Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, 1, 20);
        outerBar.endFill();
        this.scoreBar.addChild(outerBar);
        this.scoreBar.outer = outerBar;
        this.scoreBar.outer.width = 0

        const style = new PIXI.TextStyle({
            fontFamily: "Roboto",
            fontSize: 32,
            fill: "white"
        });

        this.message = new PIXI.Text("Level " + this.level, style);

        this.message.x = (Constant.gameSceneWidth - this.message.width) / 2 + 5;
        this.message.y = Constant.menuHeight / 2 - this.scoreBar.height * 3;

        this.addChild(this.message);
    }
    updateScore() {
        if (this.scoreBar.outer.width >= 300) {
            this.scoreBar.outer.width = 0
            this.emit(MenuManagerEvent.Complete)
        } else {
            this.scoreBar.updateAnimationScore(this.jump, this.scoreBar)
        }

    }
    setPosition(x, y) {
        this.position.set(x, y)
    }

}
