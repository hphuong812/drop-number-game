import * as PIXI from 'pixi.js'
import * as Constant from './gameConstant'
import { Scene } from './scene/scene';
import { LevelLoader, LevelLoaderEvent } from './levelManager/levelLoader'
import { LevelManager, LevelManagerEvent } from './levelManager/levelManager'
import { GameOverScene, GameOverEvent } from './scene/gameOverScene'

class Game extends PIXI.Application {
    constructor() {
        super();
        document.body.appendChild(this.view);
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.top = "50%";
        this.renderer.view.style.left = "50%";
        this.renderer.view.style.transform = "translate(-50%,-50%)";
        this.renderer.backgroundColor = 0x1D2B64;
        this.renderer.autoDensity = true;
        this.renderer.resize(Constant.wWidth, Constant.wHeight);
    }
    load() {
        this.loader.add('./assets/img/blockNumber.json');
        this.loader.add('./assets/img/button.json');
        this.loader.add('./assets/img/gradientTail.json');
        this.loader.add('./assets/effect/emitter.json');
        this.loader.load(this.setup.bind(this));
    }
    setup() {
        this.gameScene = new Scene();
        this.stage.addChild(this.gameScene);
        this.gameScene.setVisible(true)


        this.levelLoader = new LevelLoader();
        this.levelManager = new LevelManager();
        this.gameScene.addChild(this.levelManager);

        this.gameOverScene = new GameOverScene();
        this.stage.addChild(this.gameOverScene);
        this.gameOverScene.setVisible(false)

        this.gameOverScene.on(GameOverEvent.NextLevel, this.nextLevel, this)
        this.gameOverScene.on(GameOverEvent.NextLevel, this.levelManager.nextLevel, this.levelManager)

        this.levelLoader.on(LevelLoaderEvent.Load, this.levelManager.addLevel, this.levelManager);
        this.levelLoader.once(LevelLoaderEvent.Load, this.levelManager.start, this.levelManager);
        this.levelManager.on(LevelManagerEvent.Complete, this.complete, this);

        this.levelManager.on(LevelManagerEvent.GameOver, this.gameOver, this);

        this.levelLoader.load();

        this.ticker.add((delta) => this.gameLoop(delta));
    }
    gameLoop(delta) {
        this.levelManager.updateBlock(delta);
    }
    complete() {
        this.gameOverScene.complete()
        this.gameScene.alpha = 0.5
        this.gameOverScene.setVisible(true)
    }
    gameOver() {
        this.gameOverScene.gameOver()
        this.gameScene.setVisible(false)
        this.gameOverScene.setVisible(true)
    }
    nextLevel() {
        this.gameScene.alpha = 1
        this.gameOverScene.setVisible(false)
    }

}
export { Game }