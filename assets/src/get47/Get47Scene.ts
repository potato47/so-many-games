import { Get47Board } from "./Get47Board";
import { Piece } from "./Get47Piece";
import { DIR, STATE } from "./Get47Constants";
import { G } from "../G";
import { Score } from "./Get47Score";

const { ccclass, property } = cc._decorator;

@ccclass
export class Get47Scene extends cc.Component {

    @property(Get47Board)
    private board: Get47Board = null;
    @property(Score)
    private score: Score = null;
    @property(cc.Integer)
    private target: number = 47;

    private state: STATE = STATE.NONE;

    start() {
        this.board.init(this);
        this.startGame();
        this.addListeners();
    }

    private startGame() {
        this.state = STATE.START;
        this.board.reset();
        this.score.reset(0);
    }

    private overGame() {
        this.state = STATE.OVER;
        G.gameRoot.showMaskMessage("666",
            { label: "233", cb: () => { }, target: this });
    }

    public updateScore(score: number) {
        if (this.state !== STATE.START) {
            return;
        }
        if (score > 0) {
            this.score.add(score);
        } else if (score < 0) {
            this.score.minus(-score);
        }
        if (this.score.num === this.target) {
            this.overGame();
        }
    }

    public onPieceTouch(piece: Piece, dir: DIR) {
        if (this.state === STATE.START) {
            this.board.tryExchange(piece, dir);
        }
    }

    private onBtnReturn() {
        G.returnHall();
    }

    private onBtnRestart() {
        this.startGame();
    }

    private addListeners() {
        (cc as any).inputManager.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    }

    private removeListeners() {
        (cc as any).inputManager.setAccelerometerEnabled(false);
    }

    private onDeviceMotionEvent(event) {
        if (Math.abs(event.acc.x) > 0.3 && Math.abs(event.acc.y) > 0.3) {
            this.board.newView();
        }
        // 一个失败的创意
        // if(event.acc.x > 0.5){
        //     this.board.newView(1);
        // }
        // if(event.acc.x < -0.5) {
        //     this.board.newView(-1);
        // }
    }

}
