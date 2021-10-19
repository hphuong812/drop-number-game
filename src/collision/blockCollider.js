import { Collider } from "./collider";
import * as Constant from '../gameConstant'
export class BlockCollider extends Collider {
    constructor(blockMove) {
        super(blockMove)
        this.blockMove = blockMove;
    }

    checkBottom() {
        if (this.blockMove.y >= Constant.gameSceneHeight - Constant.blockHeight) {
            return this.blockMove.newColumn
        } else {
            return null
        }
    }

    checkBlock(columnBlockMove, yBlockMove, column, y, blockCheckEndGame) {
        let check = 0
        if (blockCheckEndGame.y <= Constant.menuHeight + 10) {
            return check = 1
        } else if (columnBlockMove == column && yBlockMove + Constant.blockHeight + Constant.space >= y) {
            return check = 2
        } else return check


    }
    checkBlockNear(valueBlockMove, valueBlockCheck) {
        if (valueBlockMove == valueBlockCheck) {
            return true
        } else {
            return false
        }
    }
}
