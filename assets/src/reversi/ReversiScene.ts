import { ReversiBoard } from "./ReversiBoard";
import { ReversiAI } from "./ReversiAI";
import { NONE, BLACK, WHITE } from "./ReversiConstants";
import { G } from "../G";

const { ccclass, property } = cc._decorator;

@ccclass
export class ReversiScene extends cc.Component {
    @property(ReversiBoard)
    private board: ReversiBoard = null;
    @property(cc.Label)
    private blackScoreLabel: cc.Label = null;
    @property(cc.Label)
    private whiteScoreLabel: cc.Label = null;

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
        this.blackScoreLabel.string = "2";
        this.whiteScoreLabel.string = "2";
        G.gameRoot.showTip("你是黑棋你先走");
    }

    overGame() {
        let { blackPieceSum, whitePieceSum } = this.board.getPieceCount();
        if (blackPieceSum > whitePieceSum) {
            cc.log("白棋胜");
            G.gameRoot.showMaskMessage("你赢了阿尔法二狗！",
                { label: "朕知道了", cb: () => { }, target: this });
        } else if (blackPieceSum < whitePieceSum) {
            cc.log("黑棋胜");
            G.gameRoot.showMaskMessage("你输给了阿尔法二狗！",
                { label: "服了", cb: () => { }, target: this },
                { label: "不服", cb: () => { }, target: this });
        } else {
            cc.log("平局");
            G.gameRoot.showMaskMessage("你和阿尔法二狗五五开!",
                { label: "朕知道了", cb: () => { }, target: this });
        }
        this.state = NONE;
    }

    updateScore() {
        let { blackPieceSum, whitePieceSum } = this.board.getPieceCount();
        this.blackScoreLabel.string = blackPieceSum + "";
        this.whiteScoreLabel.string = whitePieceSum + "";
    }

    onBtnReturn() {
        G.returnHall();
    }

    onBtnRestart() {
        this.startGame();
    }

    runAi() {
        this.scheduleOnce(() => {
            let coor = this.ai.getNextCoor();
            this.board.placeWhite(coor);
            let piece = this.board.getPieceByCoor(coor);
            for (let dir = 1; dir <= 8; dir++) {
                if (this.board.judgePass(WHITE, piece, dir)) {
                    this.board.changePass(piece, dir);
                }
            }
            this.updateScore();
            if (this.board.judgeWin()) {
                this.overGame();
            } else {
                if (this.board.judgeMoveable(BLACK)) {
                    this.state = BLACK;
                } else {
                    G.gameRoot.showTip("黑棋无地可下，白棋继续");
                    this.runAi();
                }
            }
        }, 1);
    }

    onBoardTouched(coor: cc.Vec2) {
        switch (this.state) {
            case NONE:

                break;
            case BLACK:
                let piece = this.board.getPieceByCoor(coor);
                if (piece.color !== NONE) {
                    G.gameRoot.showTip("这里有子了，你是不是傻");
                    return;
                }
                if (!this.board.canPlace(this.state, coor)) {
                    G.gameRoot.showTip("不符合规则");
                    return;
                }
                this.board.placeBlack(coor);
                piece = this.board.getPieceByCoor(coor);
                for (let dir = 1; dir <= 8; dir++) {
                    if (this.board.judgePass(BLACK, piece, dir)) {
                        this.board.changePass(piece, dir);
                    }
                }
                this.updateScore();
                if (this.board.judgeWin()) {
                    this.overGame();
                } else {
                    if (this.board.judgeMoveable(WHITE)) {
                        this.state = WHITE;
                        this.runAi();
                    } else {
                        G.gameRoot.showTip("白棋无地可下，黑棋继续");
                    }
                }
                break;
            case WHITE:

                break;
            default: break;
        }
    }

}
