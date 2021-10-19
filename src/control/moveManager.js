import * as Constant from '../gameConstant'
class MoveManager {
    constructor() {
        this.moveStateL, this.moveStateR;
    }
    pressLeft(listBlock, blockMove, type) {
        this.moveStateL = false;
        for (var c = 0; c < Constant.column; c++) {
            for (var r = 0; r < Constant.row; r++) {
                if (listBlock[c][r].obj != null) {
                    if (!listBlock[c][r].obj.move) {
                        if (blockMove.y + Constant.blockHeight + Constant.space >= listBlock[c][r].obj.y
                            && blockMove.x == listBlock[c][r].obj.x + Constant.blockHeight + Constant.space) {
                            this.moveStateL = true;
                        }
                    }
                }
            }
        }
        if (this.moveStateL) {
            blockMove.x += 0;
        } else if (blockMove.x <= Constant.marginLeft) {
            blockMove.x += 0;
        } else if (!blockMove.move) {
            blockMove.x -= 0;
        }
        else {
            blockMove.x -= Constant.blockHeight + Constant.space;
            blockMove.newColumn = blockMove.newColumn - 1;
        }
    }
    pressRight(listBlock, blockMove, type) {
        this.moveStateR = false;
        for (var c = 0; c < Constant.column; c++) {
            for (var r = 0; r < Constant.row; r++) {
                if (listBlock[c][r].obj != null) {
                    if (!listBlock[c][r].obj.move) {
                        if (blockMove.y + Constant.blockHeight + Constant.space >= listBlock[c][r].obj.y
                            && blockMove.x + Constant.blockHeight + Constant.space == listBlock[c][r].obj.x) {
                            this.moveStateR = true;
                        }
                    }
                }
            }
        }
        if (this.moveStateR) {
            blockMove.x += 0;
        } else if (blockMove.x + Constant.blockHeight + Constant.space >= Constant.gameSceneWidth) {
            blockMove.x += 0;
        } else if (!blockMove.move) {
            blockMove.x -= 0;
        }
        else {
            blockMove.x += Constant.blockHeight + Constant.space;
            blockMove.newColumn = blockMove.newColumn + 1;
        }
    }
    pressDown(blockMove) {
        if (blockMove.move) {
            blockMove.vy = 5;
        }
    }
    pressSpace(blockMove) {
        if (blockMove.move) {
            if (blockMove.vy > 1) {
                this.rePress(blockMove, true)
            } else {
                blockMove.vy = blockMove.vy + 70;
                if (blockMove.y >= Constant.gameSceneHeight - Constant.blockHeight) {
                    blockMove.vy = 1
                }
            }
        }
    }
    rePress(blockMove, down = null) {
        if (down) {
            blockMove.vy = 1;
        }
        blockMove.x += 0;
    }


}
export { MoveManager }