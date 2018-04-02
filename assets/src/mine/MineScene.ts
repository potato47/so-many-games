import { Piece } from "./MinePiece";
import { Board } from "./MnieBoard";
import { G } from "../G";
import { STATE } from "./MineConstans";
import { MineLevelLabel } from "./MineLevelLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export class MineScene extends cc.Component {

    @property(Board)
    private board: Board = null;
    @property(cc.Label)
    private bombNumLabel: cc.Label = null;
    @property(cc.Label)
    private flagNumLabel: cc.Label = null;
    @property(MineLevelLabel)
    private levelLabel: MineLevelLabel = null;

    private state: STATE = STATE.NONE;
    private level: number = 1;
    private maxLevel: number = 20;

    start() {
        this.board.init(this);
        this.maxLevel = this.board.getMaxLevel();
        this.startGame(1);
    }

    startGame(level: number) {
        this.level = level;
        this.state = STATE.START;
        this.board.reset(level);
        this.levelLabel.level = level;
        this.bombNumLabel.string = this.board.getBombNum() + "";
        this.flagNumLabel.string = this.board.getFlagNum() + "";
    }

    overGame(isWin: boolean) {
        this.state = STATE.OVER;
        if (isWin) {
            if (this.level === this.maxLevel) {
                G.gameRoot.showMaskMessage("恭喜通关!\n获得雷公称号!",
                    { label: "233", cb: () => { G.returnHall() }, target: this }
                );
            } else {
                G.gameRoot.showMaskMessage("恭喜通过第" + this.level + "关!",
                    {
                        label: "下一关", cb: () => {
                            this.level++;
                            this.startGame(this.level);
                        }, target: this
                    },
                    { label: "不玩了", cb: () => { G.returnHall() }, target: this }
                );
            }
        } else {
            G.gameRoot.showMaskMessage("你死在了第" + this.level + "关!",
                {
                    label: "续命", cb: () => {
                        this.startGame(this.level);
                    }, target: this
                },
                { label: "不玩了", cb: () => { G.returnHall() }, target: this }
            );
        }
    }

    onClickPiece(piece: Piece) {
        if (this.state === STATE.START) {
            this.board.openPiece(piece);
            let bombNum = this.board.getBombNum();
            this.bombNumLabel.string = bombNum + "";
        }
    }

    onPressPiece(piece: Piece) {
        if (this.state === STATE.START) {
            this.board.flagPiece(piece);
            let flagNum = this.board.getFlagNum();
            this.flagNumLabel.string = flagNum + "";
        }
    }

    onBtnReturn() {
        G.returnHall();
    }

    onBtnRestart() {
        this.startGame(this.level);
    }
}