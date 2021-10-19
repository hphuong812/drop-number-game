import * as PIXI from 'pixi.js'
import { Sprite } from '../sprite/sprite'
import * as Constant from '../gameConstant'
import { Scene } from './scene';

export const GameOverEvent = Object.freeze({
    NextLevel: "gameover:nextlevel",
    AgainLevel: "gameover:again",
})
export class GameOverScene extends Scene {
    constructor() {
        super();
        this.buttonUpTexture = Constant.TextureCache["blue_up.png"];
        this.buttonDownTexture = Constant.TextureCache["blue_down.png"];
        this._init()
    }
    _init() {
        this.button = new Scene();
        this.button.position.set(Constant.wWidth / 2 - 190 / 2, Constant.wHeight / 2 - 45)

        this.backgroundButton = new Sprite(this.buttonUpTexture);
        this.backgroundButton.setPosition(0, 0)
        this.backgroundButton.interactive = true;
        this.backgroundButton.buttonMode = true;
        this.backgroundButton
            .on('pointerdown', this.onButtonDown.bind(this))
            .on('pointerup', this.onButtonUp.bind(this))
            .on('pointerupoutside', this.onButtonUp.bind(this))
            .on('pointerover', this.onButtonOver.bind(this))
            .on('pointerout', this.onButtonOut.bind(this));

        this.button.addChild(this.backgroundButton)

        const style = new PIXI.TextStyle({
            fontFamily: "Roboto",
            fontSize: 30,
            fill: "white"
        });

        this.text = new PIXI.Text("Next", style);
        this.text.position.set(this.backgroundButton.width / 2 - this.text.width / 2, this.backgroundButton.height / 2 - this.text.height * 2 / 3)
        this.button.addChild(this.text)
        this.addChild(this.button)

        const styleMessage = new PIXI.TextStyle({
            fontFamily: "Roboto",
            fontSize: 64,
            fill: "white"
        });

        this.message = new PIXI.Text("You win", styleMessage);
        this.message.position.set(Constant.wWidth / 2 - this.message.width / 2, Constant.wHeight / 2 - this.message.height * 2)
        this.addChild(this.message)
    }
    gameOver() {
        this.message.text = "You lost"
        this.button.setVisible(false);
        this.updateAnimationScene(Constant.wHeight, 0)
    }
    complete() {
        this.button.setVisible(true)
        this.updateAnimationScene(Constant.wHeight, 0)
    }
    onButtonDown() {
        this.isdown = true;
        this.texture = this.buttonDownTexture;
        this.alpha = 1;
        // this.updateAnimationScene(0,Constant.wHeight)
        this.emit(GameOverEvent.NextLevel)
    }
    onButtonUp() {
        this.isdown = false;
        this.texture = this.buttonUpTexture;
    }

    onButtonOver() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        this.texture = this.buttonDownTexture;
    }

    onButtonOut() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        this.texture = this.buttonUpTexture;
    }

}
