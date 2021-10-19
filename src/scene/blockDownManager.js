import * as PIXI from 'pixi.js'
import { Sprite } from '../sprite/sprite'
import * as Constant from '../gameConstant'
import { createNewBlock, updateTextTure } from '../util/util'
import { ControlManager} from '../control/controlManager'

export const BlockDownManagerEvent = Object.freeze({
    CreateNewBlock: "blockmanager:createNewBlock",
    Update: "blockmanager:update",
    SetPositionNew: "blockmanager:setbottom",
    UpdateValue: "blockmanager:updatevalue",
    UpdateScore: "blockmanager:updatescore",
    GameOver: "blockmanage:gameover",
    CreateEffect: "blockmanager:CreateEffect"
})
export class BlockDownManager extends PIXI.Container {
    constructor(listBlock) {
        super();
        this.listBlock = listBlock;
        this.blockMove;
        this.column = Constant.column;
        this.row = Constant.row;
        this.win = false
        // this.effectManager = new EffectManager();
        // this.addChild(this.effectManager)
        this._init();
        this.on(BlockDownManagerEvent.SetPositionNew, this.setPositionNew, this)
        this.on(BlockDownManagerEvent.UpdateValue, this.updateValue, this)
        // create list value of block
        this.valueBlock = []
        for (let i = 1; i <= 17; i++) {
            this.valueBlock.push(2 ** i)
        }
        // limited value 
        this.valueLimit = this.valueBlock.splice(0, 7);
        this.sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        this.controlManager = new ControlManager();
        this.controlManager.control(this)

    }
    _init() {
        for (var c = 0; c < this.column; c++) {
            for (var r = 0; r < this.row; r++) {
                if (this.listBlock[c][r].obj != null) {
                    this.addChild(this.listBlock[c][r].obj);
                }
            }
        }
    }
    createNewBlock() {
        if (!this.win) {
            let columnRandom = Math.floor(Math.random() * 5)

            // Create gradient tail for block
            

            this.blockMove = createNewBlock(columnRandom, this.valueLimit)
            this.listBlock[columnRandom][0].obj = this.blockMove

            
            if (this.blockMove.value == 128) {
                this.gradientTail = new Sprite(Constant.TextureCache['gradient_2.png']);
            }else{
                this.gradientTail = new Sprite(Constant.TextureCache['gradient_'+this.blockMove.value+'.png']);
            }
            this.gradientTail.setPosition(Constant.blockHeight * columnRandom + Constant.space * columnRandom + Constant.marginLeft, Constant.menuHeight - this.gradientTail.height + 50)
            this.gradientTail.alpha = 0.3
            this.addChild(this.gradientTail);
            this.addChild(this.blockMove);
        }

    }
    setPositionNew(collum, row = null) {
        this.removeChild(this.gradientTail)
        if (row == null) {
            this.clearRowZero()
            this.blockMove.lock = 1
            this.listBlock[collum][Constant.row - 1].obj = this.blockMove
            this.listBlock[collum][Constant.row - 1].obj.y = Constant.gameSceneHeight - Constant.blockHeight
            this.listBlock[collum][Constant.row - 1].obj.lock = 1
            this.listBlock[collum][Constant.row - 1].obj.vy = 0
            this.listBlock[collum][Constant.row - 1].obj.setFalseMove()
        } else
            if (row != null && row > 0 && row <= 8) {
                this.clearRowZero()
                if (this.listBlock[collum][row - 1].obj == null) {
                    this.blockMove.lock = 1
                    this.listBlock[collum][row - 1].obj = this.blockMove
                    this.listBlock[collum][row - 1].obj.lock = 1
                    this.listBlock[collum][row - 1].obj.setFalseMove()
                    this.listBlock[collum][row - 1].obj.y = this.listBlock[collum][row].y - Constant.blockHeight - Constant.space
                    this.listBlock[collum][row - 1].obj.vy = 0
                }

            }

    }
    async updateValue(coordinates, jumb) {
        this.clearRowZero()
        // update texture for block center
        updateTextTure(this.listBlock[coordinates[0].column][coordinates[0].row].obj, jumb)
        // update Score
        this.emit(BlockDownManagerEvent.UpdateScore)
        // remove block around
        for (let i = 1; i < coordinates.length; i++) {
            this.removeBlock(coordinates[i].column, coordinates[i].row, coordinates[0])
        }
        // Wait remove block
        await this.sleep(150 * (coordinates.length - 1))
        this.updateNewPosition();
    }

    async removeBlock(column, row, originCoordinates) {
        if (this.listBlock[column][row].obj != null) {
            let xOld = this.listBlock[column][row].x,
                yOld = this.listBlock[column][row].y,
                xNew = this.listBlock[originCoordinates.column][originCoordinates.row].x,
                yNew = this.listBlock[originCoordinates.column][originCoordinates.row].y;
            let finish = this.listBlock[column][row].obj.updateAnimation(xOld, yOld, xNew, yNew)
            // wait tween complete
            await this.sleep(150)
            this.removeChild(this.listBlock[column][row].obj);
            this.listBlock[column][row].obj = null
        }
    }
    async updateNewPosition() {
        let blockcheck = true, countCheck;
        while (blockcheck) {
            countCheck = 0
            for (var c = 0; c < this.column; c++) {
                for (var r = 0; r < this.row - 1; r++) {
                    if (this.listBlock[c][r].obj != null) {
                        blockcheck = this.listBlock[c][r].obj
                        if (this.listBlock[c][r + 1].obj == null) {
                            countCheck++;
                            this.listBlock[c][r].obj.updateAnimation(this.listBlock[c][r].x, this.listBlock[c][r].y, this.listBlock[c][r + 1].x, this.listBlock[c][r + 1].y)
                            await this.sleep(200)
                            this.emit(BlockDownManagerEvent.CreateEffect, this.listBlock[c][r].x, this.listBlock[c][r].y + Constant.blockHeight)
                            this.listBlock[c][r + 1].obj = this.listBlock[c][r].obj
                            this.listBlock[c][r].obj = null
                        }
                    }
                }
            }

            if (countCheck == 0) {
                blockcheck = false
            }
        }
        // find groups of equal value
        this.findGroup()

    }
    // clear first row data
    clearRowZero() {
        for (var c = 0; c < this.column; c++) {
            if (this.listBlock[c][0].obj != null) {
                this.listBlock[c][0].obj = null
            }
        }
    }
    findGroup() {
        let groupBlock = [];
        let groupBlockBottom = []
        let max = []
        let maxbottom = []
        let maxCount1 = 0;
        let maxCount2 = 0;
        // find in center
        for (var c = 0; c < this.column; c++) {
            for (var r = 0; r < this.row - 1; r++) {
                if (this.listBlock[c][r].obj != null) {
                    groupBlock.push(this.checkGroup(this.listBlock[c][r].obj, c, r))
                }
            }
        }
        // find in bottom
        for (var c = 0; c < this.column; c++) {
            if (this.listBlock[c][8].obj != null) {
                groupBlockBottom.push(this.checkGroup(this.listBlock[c][8].obj, c, 8))
            }
        }
        // get group with the most blocks in center
        for (let i = 0; i < groupBlockBottom.length; i++) {
            if (groupBlockBottom[i].count != 0) {
                if (groupBlockBottom[i].count >= maxCount1) {
                    maxCount1 = groupBlockBottom[i].count;
                    maxbottom = { coordinates: groupBlockBottom[i].coordinates, jumb: groupBlockBottom[i].jumb }
                }
            }
        }
        //  get group with the most blocks in bottom
        for (let i = 0; i < groupBlock.length; i++) {
            if (groupBlock[i].count != 0) {
                if (groupBlock[i].count >= maxCount2) {
                    maxCount2 = groupBlock[i].count;
                    max = { coordinates: groupBlock[i].coordinates, jumb: groupBlock[i].jumb }
                }
            }
        }
        if (maxCount1 != 0) {
            this.updateValue(maxbottom.coordinates, maxbottom.jumb)
        } else if (maxCount2 != 0) {
            this.updateValue(max.coordinates, max.jumb)
        } else if (maxCount1 == 0 && maxCount2 == 0) {
            this.createNewBlock();
        }
    }
    update(delta) {
        if (!this.win) {
            for (var c = 0; c < this.column; c++) {
                for (var r = 0; r < this.row; r++) {
                    if (this.listBlock[c][r].obj != null) {
                        if (this.listBlock[c][r].obj.lock == 0) {
                            this.listBlock[c][r].obj.update(delta)
                            this.gradientTail.y += this.listBlock[c][r].obj.vy * delta
                            this.gradientTail.x = this.listBlock[c][r].obj.x

                        }
                    }
                }
            }

        }
    }
    checkGroup(blockCheck, column, row) {
        let count = 0;
        let coordinates = []
        coordinates.push({ column: column, row: row })
        if (row + 1 <= Constant.row - 1) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlock[column][row + 1].obj.value)) {
                count += 1;
                coordinates.push({ column: column, row: row + 1 })
            }
        }
        if (column - 1 >= 0 && this.listBlock[column - 1][row].obj != null) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlock[column - 1][row].obj.value)) {
                count += 1;
                coordinates.push({ column: column - 1, row: row })
            }
        }
        if (column + 1 <= Constant.column - 1 && this.listBlock[column + 1][row].obj != null) {
            if (this.blockMove.collider.checkBlockNear(blockCheck.value, this.listBlock[column + 1][row].obj.value)) {
                count += 1;
                coordinates.push({ column: column + 1, row: row })
            }
        }

        if (count == 3) {
            return { coordinates: coordinates, count: count, jumb: 4 }
        } else if (count == 2) {
            return { coordinates: coordinates, count: count, jumb: 2 }
        } else if (count == 1) {
            return { coordinates: coordinates, count: count, jumb: 1 }
        }
        else {
            return { coordinates: null, count }
        }
    }
    complete() {
        this.win = true
        let speed = 1000
        for (var c = 0; c < this.column; c++) {
            for (var r = 0; r < this.row; r++) {
                if (this.listBlock[c][r].obj != null) {
                    this.listBlock[c][r].obj.updateAnimation(this.listBlock[c][r].x, this.listBlock[c][r].y, this.listBlock[c][r].x, -100, speed)
                    this.listBlock[c][r].obj = null
                }

            }
        }

    }

}
