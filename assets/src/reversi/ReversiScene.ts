import { ReversiBoard } from "./ReversiBoard";
import { ReversiAI } from "./ReversiAI";
import { NONE, BLACK, WHITE } from "./ReversiConstants";
import { G } from "../G";

const {ccclass, property} = cc._decorator;

@ccclass
export class ReversiScene extends cc.Component {
    @property(ReversiBoard)
    private board: ReversiBoard = null;

    private ai: ReversiAI = null;
    public state = NONE;

    start() {
        this.board.init(this);
        this.ai = new ReversiAI(this.board);
        this.startGame();
    }

    startGame() {
        this.state = BLACK;
        this.board.reset();
        G.gameRoot.showTip("你是黑棋你先走");
    }

    overGame() {
        if(this.state === BLACK) {
            cc.log("黑棋胜");
            this.state = NONE;
            G.gameRoot.showMaskMessage("你赢了阿尔法二狗！",
                { label: "朕知道了", cb: () => { }, target: this });
        }else if(this.state === WHITE) {
            cc.log("白旗胜");
            G.gameRoot.showMaskMessage("你输给了阿尔法二狗！",
            { label: "服了", cb: () => { }, target: this },
            { label: "不服", cb: () => { }, target: this });
            this.state = NONE;
        }
    }

    onBtnReturn() {
        G.returnHall();
    }

    onBtnRestart() {
        this.startGame();
    }

    onBoardTouched(coor: cc.Vec2) {
        let piece = this.board.getPieceByCoor(coor);
        if (piece.color !== NONE) {
            G.gameRoot.showTip("这里有子了，你是不是傻");
            return;
        }
        for (let dir = 1; dir <= 8; dir++) {
            if (this.board.judgePass(this.state, piece, dir)) {
                break;
            }
            if (dir === 8) {
                G.gameRoot.showTip("不符合规则");
                return;
            }
        }
        switch (this.state) {
            case NONE:

                break;
            case BLACK:
                this.board.placeBlack(coor);
                piece = this.board.getPieceByCoor(coor);
                for (let dir = 1; dir <= 8; dir++) {
                    if (this.board.judgePass(BLACK, piece, dir)) {
                        this.board.changePass(piece, dir);
                    }
                }
                if (this.board.judgeWin()) {
                    this.overGame();
                } else {
                    this.state = WHITE;
                    // this.scheduleOnce(() => {
                    //     // this.board.placeWhite(this.ai.getNextCoor());
                    //     if (this.board.judgeWin()) {
                    //         this.overGame();
                    //     } else {
                    //         this.state = BLACK;
                    //     }
                    // }, 1);
                }
                break;
            case WHITE:
                this.board.placeWhite(coor);
                piece = this.board.getPieceByCoor(coor)
                for (let dir = 1; dir <= 8; dir++) {
                    if (this.board.judgePass(WHITE, piece, dir)) {
                        this.board.changePass(piece, dir);
                    }
                }
                if(this.board.judgeWin()) {
                    cc.log("白棋胜");
                }else {
                    this.state = BLACK;
                }
                break;
            default: break;
        }
    }

}
