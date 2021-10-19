import { Block } from '../sprite/block';
import * as Constant from '../gameConstant'

let textTurePlus;
export function createBlock(cl, value) {
    let newBlock = new Block(Constant.TextureCache[value + ".png"]);
    newBlock.setPosition(Constant.blockHeight * cl + Constant.space * cl + Constant.marginLeft, Constant.menuHeight);
    newBlock.setVelocity(0, 1)
    newBlock.value = value;
    newBlock.lock = 0;
    newBlock.column = cl;
    newBlock.newColumn = cl;
    newBlock.setTrueMove()
    return newBlock
    // console.log(game.newBlock.y)
}


export function createNewBlock(cl, value) {
    let valueRandom = random(value);
    return createBlock(cl, valueRandom);
}
function random(arr) {
    const randomElement = arr[Math.floor(Math.random() * arr.length)];
    return randomElement;
}

export function updateTextTure(block, jump) {
    block.value = block.value * 2 * jump
    textTurePlus = Constant.TextureCache[block.value + ".png"];
    block.texture = textTurePlus;
}
