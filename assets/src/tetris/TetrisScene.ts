import { Board } from "./TetrisBoard";
import { STATE } from "./TetrisConstants";
import { G } from "../G";

const { ccclass, property } = cc._decorator;

@ccclass
export class TetrisScene extends cc.Component {

    @property(Board)
    private board: Board = null;
    @property(cc.Label)
    private scoreLabel: cc.Label = null;
    @property(cc.Label)
    private nextLabel: cc.Label = null;

    private state:STATE = STATE.NONE;

    start() {
        this.addListeners();
        this.board.init(this);
        this.startGame();
    }

    startGame() {
        this.state = STATE.START;
        this.board.reset();
        this.updateScore(0);
    }

    stopGame(score: number) {
        this.state = STATE.OVER;
        this.board.stop();
        G.gameRoot.showMaskMessage("无聊指数："+score,
        {
            label: "再来", cb: () => {
                this.startGame();
            }, target: this
        },
        {
            label: "溜了", cb: () => {
                G.returnHall();
            }, target: this
        });
    }

    updateScore(score: number) {
        this.scoreLabel.string = score + "";
    }

    updateHint(hint: string) {
        this.nextLabel.string = hint;
    }

    onBtnExit() {
        this.board.stop();
        G.returnHall();
    }

    onBtnLeft() {
        if(this.state === STATE.START) {
            this.board.playerMove(-1);
        }
    }

    onBtnRight() {
        if(this.state === STATE.START) {
            this.board.playerMove(1);
        }
    }

    onBtnRotate() {
        if(this.state === STATE.START) {
            this.board.playerRotate(1);
        }
    }

    onBtnDrop() {
        if(this.state === STATE.START) {
            this.board.playerDrop();
        }
    }

    private addListeners() {
        this.board.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
            let startPos = event.getStartLocation();
            let endPos = event.getLocation();
            let offsetX = endPos.x - startPos.x;
            let offsetY = endPos.y - startPos.y;
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                if (offsetX > 0) {
                    this.onBtnRight();
                } else {
                    this.onBtnLeft();
                }
            } else {
                if (offsetY > 0) {
                    this.onBtnRotate();
                } else {
                    this.onBtnDrop();
                }
            }
        }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            switch ((event as any).keyCode) {
                case cc.KEY.left:
                case cc.KEY.a:
                    this.onBtnLeft();
                    break;
                case cc.KEY.right:
                case cc.KEY.d:
                    this.onBtnRight();
                    break;
                case cc.KEY.up:
                case cc.KEY.w:
                    this.onBtnRotate();
                    break;
                case cc.KEY.down:
                case cc.KEY.s:
                    this.onBtnDrop();
                    break;
            }
        }, this);
    }
}