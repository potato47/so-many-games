import { Board } from "./TetrisBoard";

const {ccclass,property} = cc._decorator;

@ccclass
export class TetrisScene extends cc.Component {

    @property(Board)
    private board:Board = null;

    start() {
        cc.director.setDisplayStats(false);
    }

    startGame() {

    }

    onBtnLeft() {
        this.board.playerMove(-1);
    }

    onBtnRight() {
        this.board.playerMove(1);
    }

    onBtnRotate() {
        this.board.playerRotate(1);
    }

    onBtnDrop() {
        this.board.playerDrop();
    }
}