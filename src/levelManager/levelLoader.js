import * as PIXI from 'pixi.js'
import LevelFile from "../../assets/level/level.json"
import { Level } from './level';

export const LevelLoaderEvent = Object.freeze({
  Load: "levelloader:load",
  LoadLevel: "levelloader:loadlevel"
});

class LevelLoader extends PIXI.utils.EventEmitter {
  constructor() {
    super();
    this.count = 0;
  }

  load() {
    this.count = LevelFile.length;
    LevelFile.forEach(file => {
      this._loadJSON(file, this._loadLevel.bind(this))
    })
  }

  _loadJSON(file, onLoad) {
    const data = require(`../../assets/level/${file}`);
    onLoad(data)
  }

  _loadLevel(data) {
    this.level = new Level(data);
    this.emit(LevelLoaderEvent.Load, this.level);
  }


}
export { LevelLoader }