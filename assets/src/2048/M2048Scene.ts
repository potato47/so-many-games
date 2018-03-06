import { M2048Board } from "./M2048Board";
import { G } from "../G";
import { DIR, STATE } from "./M2048Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export class M2048Scene extends cc.Component {
    @property(M2048Board)
    private board: M2048Board = null;

    public state: STATE = STATE.NONE;

    start() {
        this.board.init(this);
        this.startGame();
    }

    startGame() {
        this.state = STATE.START;
        this.board.reset();
        G.gameRoot.showTip("四方向手势滑动");
    }

    overGame() {
        let max = this.board.getMaxNLabel();
        G.gameRoot.showMaskMessage(max,
            { label: "OK", cb: () => { }, target: this });
        this.state = STATE.OVER;
    }

    onBtnReturn() {
        G.returnHall();
    }

    onBtnRestart() {
        this.startGame();
    }

    onBoardSlid(dir: DIR) {
        let isMove = false;
        switch (dir) {
            case DIR.LEFT:
                isMove = this.board.slideLeft();
                break;
            case DIR.RIGHT:
                isMove = this.board.slideRight();
                break;
            case DIR.UP:
                isMove = this.board.slideUp();
                break;
            case DIR.DOWN:
                isMove = this.board.slideDown();
                break;
            default:
                cc.error("方向错误");
                break;
        }
        if (isMove) {
            if (this.board.judgeOver()) {
                this.overGame();
            }
        }
    }

}
