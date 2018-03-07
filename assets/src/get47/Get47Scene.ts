import { Get47Board } from "./Get47Board";
import { Piece } from "./Get47Piece";
import { DIR, STATE } from "./Get47Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export class Get47Scene extends cc.Component {

    @property(Get47Board)
    private board: Get47Board = null;

    private state:STATE = STATE.NONE;

    start() {
        this.board.init(this);
        this.startGame();
    }

    private startGame() {
        this.state = STATE.START;
        this.board.reset();
    }

    public onPieceTouch(piece: Piece, dir: DIR) {
        if(this.state === STATE.START) {
            this.board.tryExchange(piece,dir);
        }
    }

}
