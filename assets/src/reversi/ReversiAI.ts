import { ReversiBoard } from "./ReversiBoard";
import { NONE, BLACK, WHITE } from "./ReversiConstants";

export class ReversiAI {
    constructor(private board: ReversiBoard) { }

    getNextCoor(): cc.Vec2 {
        let moveableList = [];
        for (let x = 0; x < this.board.pieceMap.length; x++) {
            for (let y = 0; y < this.board.pieceMap[x].length; y++) {
                if (this.board.pieceMap[x][y].color === NONE && this.board.canPlace(WHITE,cc.v2(x,y))) {
                    // 优先占边
                    if (x === 0 || y === 0 || x === this.board.pieceMap.length - 1 || y === this.board.pieceMap[x].length - 1){
                        return cc.v2(x,y);
                    }else{
                        moveableList.push(cc.v2(x, y));
                    }
                }
            }
        }
        let n = Math.floor(Math.random()*moveableList.length);
        return moveableList[n];
    }
}
