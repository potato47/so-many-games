import Board from "./SnakeBoard";
import { DIRECTION } from "./SnakeConstants";
import { G } from "../G";

const {ccclass, property} = cc._decorator;

@ccclass
export class SnakeScene extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(Board)
    board: Board = null;

    private score = 0;

    start () {
        this.board.init(this);
        G.gameRoot.showTip("四方向手势滑动");
        this.startGame();
        /**
         * 手势，键盘，按钮操作
         */
        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
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
                    this.onBtnUp();
                } else {
                    this.onBtnDown();
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
                    this.onBtnUp();
                    break;
                case cc.KEY.down:
                case cc.KEY.s:
                    this.onBtnDown();
                    break;
            }
        }, this);
    }

    startGame() {
        this.score = 0;
        this.scoreLabel.string = this.score + "";
        this.board.startGame();
    }

    overGame() {
        G.gameRoot.showMaskMessage("你吃了" + this.score + "坨", { label: "厉害了"});
    }

    onEatFood() {
        this.score+=1;
        this.scoreLabel.string = this.score + "";
        this.board.addFood();
        let level = this.score / 10 | 0;
        this.board.updateLevel(level);
    }

    onBtnLeft() {
        this.board.turnSnake(DIRECTION.LEFT);
    }

    onBtnRight() {
        this.board.turnSnake(DIRECTION.RIGHT);
    }

    onBtnUp() {
        this.board.turnSnake(DIRECTION.UP);
    }

    onBtnDown() {
        this.board.turnSnake(DIRECTION.DOWN);    
    }

    private onBtnReturn() {
        G.returnHall();
    }

    private onBtnRestart() {
        this.startGame();
    }

}
