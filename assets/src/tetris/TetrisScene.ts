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
}