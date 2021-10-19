import { KeyBoard } from "./keyBoard";
import { MoveManager } from "./moveManager";

export class ControlManager {
   constructor() {
      this.left = new KeyBoard("ArrowLeft");
      this.right = new KeyBoard("ArrowRight");
      this.down = new KeyBoard("ArrowDown");
      this.space = new KeyBoard(" ")
      this.moveManager = new MoveManager
   }
   control(blockManager) {
      this.left.setPress(() => {
         this.moveManager.pressLeft(blockManager.listBlock, blockManager.blockMove)
      })

      this.left.setRelease(() => {
         this.moveManager.rePress(blockManager.blockMove)
      })

      this.right.setPress(() => {
         this.moveManager.pressRight(blockManager.listBlock, blockManager.blockMove)
      })
      this.right.setRelease(() => {
         this.moveManager.rePress(blockManager.blockMove)
      })

      this.down.setPress(() => {
         this.moveManager.pressDown(blockManager.blockMove)
      })
      this.down.setRelease(() => {
         this.moveManager.rePress(blockManager.blockMove, true)
      })

      this.space.setPress(() => {
         this.moveManager.pressSpace(blockManager.blockMove)
      })
      this.space.setRelease(() => {
         this.moveManager.rePress(blockManager.blockMove, true)
      })
   }
}

