import * as PIXI from 'pixi.js'
import { Block } from '../sprite/block';
import * as Constant from '../gameConstant'
import { BlockDownManagerEvent, BlockDownManager } from '../scene/blockDownManager';
import { CollisionManager } from '../collision/collisionManager';
import { MenuManagerEvent, MenuManager } from '../scene/menuManager';
import { EffectManager } from '../effect/effectManager';

export const LevelEvent = Object.freeze({
  Start: "level:start",
  Complete: "level:complete",
  BlockMove: "level:blockmove",
  GameOver: "level:gameover"
});
class Level extends PIXI.Container {
  constructor(data) {
    super();
    this.cl = Constant.column;
    this.rw = Constant.row;
    this.data = data.map;
    this.scoreJump = data.jump;
    this.levelNumber = data.level;
    this.listBlockDown = [];

    this._initBlockMap();

    this._initBlockDown();
    this._initMenu()

    this.on(BlockDownManagerEvent.CreateNewBlock, this.blockDownManager.createNewBlock, this.blockDownManager)
    this._initCollisionManager(this.listBlockDown, this.blockDownManager)
    this.on(BlockDownManagerEvent.Update, this.blockDownManager.update, this.blockDownManager)

    this.blockDownManager.on(BlockDownManagerEvent.UpdateScore, this.updateScore, this)
    this.blockDownManager.on(BlockDownManagerEvent.GameOver, this.gameOver, this)
    this.menuManager.on(MenuManagerEvent.Complete, this.complete, this)
    this.blockDownManager.on(BlockDownManagerEvent.CreateEffect, this.createEffect, this)
    this.effectManager = new EffectManager();
    this.addChild(this.effectManager)
  }
  _initMenu() {
    this.menuManager = new MenuManager(this.scoreJump, this.levelNumber)
    this.menuManager.setPosition(0, 0)
    this.addChild(this.menuManager)
  }
  updateScore() {
    this.menuManager.updateScore();
  }
  createEffect(x, y) {
    this.effectManager.collisionEffect(x + 20, y + Constant.blockHeight)
  }
  _initBlockMap() {
    for (var c = 0; c < this.cl; c++) {
      this.listBlockDown[c] = [];
      for (var r = 0; r < this.rw; r++) {
        if (this.data[c][r].value != 0) {
          this.newBlock = new Block(Constant.TextureCache[this.data[c][r].value + ".png"]);
          this.newBlock.setPosition(this.data[c][r].x + Constant.marginLeft, this.data[c][r].y + Constant.menuHeight);
          this.newBlock.setVelocity(0, 1)
          this.newBlock.value = this.data[c][r].value;
          this.newBlock.lock = 1;
          this.newBlock.column = c;
          this.newBlock.newBlock = c;
          this.listBlockDown[c][r] = { obj: this.newBlock, x: this.data[c][r].x + Constant.marginLeft, y: this.data[c][r].y + Constant.menuHeight }
        } else {
          this.listBlockDown[c][r] = { obj: null, x: this.data[c][r].x + Constant.marginLeft, y: this.data[c][r].y + Constant.menuHeight }
        }

      }
    }
  }
  _initBlockDown() {
    this.blockDownManager = new BlockDownManager(this.listBlockDown);
    this.blockDownManager.createNewBlock()
    this.addChild(this.blockDownManager)
  }
  _initCollisionManager(listBlockDown, blockManager) {
    this.collisionManager = new CollisionManager(listBlockDown, blockManager);
  }
  updateCollision(delta) {
    this.effectManager.update(delta)
    this.collisionManager.addData(this.blockDownManager.blockMove)
    this.collisionManager.update();
  }
  complete() {
    this.blockDownManager.complete();
    this.emit(LevelEvent.Complete);
  }
  gameOver() {
    console.log("end game")
    for (var i = this.blockDownManager.children.length - 1; i >= 0; i--) {
      this.blockDownManager.removeChild(this.blockDownManager.children[i]);
    };
    for (var c = 0; c < this.cl; c++) {
      for (var r = 0; r < this.rw; r++) {
        this.listBlockDown[c][r].obj = null;
        this.listBlockDown[c][r].x = 0;
        this.listBlockDown[c][r].y = 0;
      }
    }
    this.emit(LevelEvent.GameOver);
  }
}
export { Level }