import { LinkBoard } from "./LinkBoard";
import { STATE } from "./LinkConstants";
import { G } from "../G";
import { Timer } from "../shared/Timer";

const { ccclass, property } = cc._decorator;

@ccclass
export class LinkScene extends cc.Component {

    @property(LinkBoard)
    private board: LinkBoard = null;
    @property(cc.Node)
    private rewardNode: cc.Node = null;
    @property(Timer)
    private timer: Timer = null;

    private state = STATE.NONE;

    start() {
        this.board.init(this);
        this.startGame();
    }

    private startGame() {
        this.state = STATE.START;
        this.board.reset();
        this.rewardNode.active = false;
        this.timer.reset();
        this.timer.run();
    }

    public overGame() {
        this.state = STATE.OVER;
        this.timer.stop();
        G.gameRoot.showMaskMessage("你用了" + this.timer.time.toFixed(1) + "秒", { label: "领取奖励", cb: ()=>{this.rewardNode.active = true}});
    }

    private onBtnReturn() {
        G.returnHall();
    }

    private onBtnRestart() {
        this.startGame();
    }
}
