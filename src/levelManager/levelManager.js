import * as PIXI from 'pixi.js'
import { LevelEvent } from './level';
import { BlockDownManagerEvent } from '../scene/blockDownManager';
export const LevelManagerEvent = Object.freeze({
  Start: "levelmanager:start",
  Complete: "levelmanager:complete",
  GameOver: "levelmanager:gameover",
  Finish: "levelmanager:finish"
});

class LevelManager extends PIXI.Container {
  constructor() {
    super();

    /** @type {Array<Level>} */
    this.levels = [];
    this.curLevelIndex = 0;
    this.numberLevel = 0;
    this.cl = 5;
    this.rw = 9;
  }

  addLevel(level) {
    this.levels.push(level);
  }

  start() {
    if (this.levels.length <= 0) {
      return;
    }
    this.startLevel(0);
  }

  startLevel(index) {
    this.curLevelIndex = index;
    if (this.curLevelIndex >= this.levels.length) {
      return;
    }

    let level = this.levels[this.curLevelIndex];
    level.on(LevelEvent.Complete, this.onLevelComplete, this);
    level.on(LevelEvent.GameOver, this.onLevelFail, this);

    this.addChild(level);

    this.emit(LevelManagerEvent.Start, level);
    this.oldLevel = level;
  }

  nextLevel() {
    this.removeChild(this.oldLevel);
    this.startLevel(this.curLevelIndex + 1);
  }
  onLevelFail() {
    this.emit(LevelManagerEvent.GameOver);
  }
  onLevelComplete() {
    this.emit(LevelManagerEvent.Complete);
  }
  updateBlock(delta) {
    this.oldLevel.emit(BlockDownManagerEvent.Update, delta)
    this.oldLevel.updateCollision(delta);
  }
}

export { LevelManager }