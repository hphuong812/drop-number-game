import * as PIXI from 'pixi.js'
import * as Constant from '../gameConstant'
import { BlockDownManagerEvent, BlockDownManager } from '../scene/blockDownManager';
import * as TWEEN from '@tweenjs/tween.js'

export const CollisionManagerEvent = Object.freeze({
    Colliding: "collisionManager: colliding"
})

export class CollisionManager extends PIXI.utils.EventEmitter {
    constructor(listBlockDown, blockDownManager) {
        super();
        this.listBlockDown = listBlockDown;
        this.blockDownManager = blockDownManager
        this.blockMove;
    }
    addData(blockMove) {
        this.blockMove = blockMove;
    }
    update() {
        if (typeof this.blockMove !== "undefined") {
            if (this.blockMove.lock == 0) {
                let collumNewBlockMove = this.blockMove.collider.checkBottom();
                if (collumNewBlockMove != null) {
                    this.blockDownManager.emit(BlockDownManagerEvent.CreateEffect, this.blockMove.x, this.blockMove.y)
                    this.blockDownManager.emit(BlockDownManagerEvent.SetPositionNew, collumNewBlockMove)
                    let checkBottom = this.checkNear(this.blockMove, this.blockMove.newColumn)
                    if (checkBottom.coordinates != null && checkBottom.jumb != null) {
                        this.blockDownManager.emit(BlockDownManagerEvent.UpdateValue, checkBottom.coordinates, checkBottom.jumb)
                    } else {
                        this.blockDownManager.createNewBlock()
                    }
                } else {
                    let check;
                    for (var c = 0; c < Constant.column; c++) {
                        for (var r = 0; r < Constant.row; r++) {
                            if (this.listBlockDown[c][r].obj != null && this.listBlockDown[c][r].obj.lock == 1) {
                                check = this.blockMove.collider.checkBlock(this.blockMove.newColumn, this.blockMove.y, c, this.listBlockDown[c][r].obj.y, this.listBlockDown[c][r].obj)
                                if (check == 1) {
                                    this.blockDownManager.emit(BlockDownManagerEvent.GameOver)
                                    break;
                                } else if (check == 2) {
                                    this.blockDownManager.emit(BlockDownManagerEvent.CreateEffect, this.listBlockDown[c][r].obj.x, this.listBlockDown[c][r].obj.y -Constant.blockHeight)
                                    this.blockDownManager.emit(BlockDownManagerEvent.SetPositionNew, c, r)
                                    let checkNear = this.checkNear(this.blockMove, c, r)
                                    if (checkNear.coordinates != null && checkNear.jumb != null) {
                                        this.blockDownManager.emit(BlockDownManagerEvent.UpdateValue, checkNear.coordinates, checkNear.jumb)
                                    } else {
                                        this.blockDownManager.createNewBlock()
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            TWEEN.update()
        }


    }
    checkNear(blockCheck, column, rowSend = null) {
        let row;
        if (rowSend == null) {
            row = 8
        } else {
            row = rowSend - 1
        }
        let count = 0;
        let coordinates = []
        coordinates.push({ column: column, row: row })
        if (rowSend != null) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlockDown[column][rowSend].obj.value)) {
                count += 1;
                coordinates.push({ column: column, row: rowSend })
            }
        }
        if (column - 1 >= 0 && this.listBlockDown[column - 1][row].obj != null) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlockDown[column - 1][row].obj.value)) {
                count += 1;
                coordinates.push({ column: column - 1, row: row })
            }
        }
        if (column + 1 <= Constant.column - 1 && this.listBlockDown[column + 1][row].obj != null) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlockDown[column + 1][row].obj.value)) {
                count += 1;
                coordinates.push({ column: column + 1, row: row })
            }
        }
        if (count == 3) {
            return { coordinates: coordinates, jumb: 4 }
        } else if (count == 2) {
            return { coordinates: coordinates, jumb: 2 }
        } else if (count == 1) {
            return { coordinates: coordinates, jumb: 1 }
        }
        else {
            return { coordinates: null, jumb: null }
        }
    }
}