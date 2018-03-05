import { STATE } from "./PuzzleConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export class JumpScene extends cc.Component {

    public state: STATE = STATE.NONE;

    start() {
        this.addListeners();
        this.startGame();
    }

    private startGame() {
        this.state = STATE.START;
    }

    private overGame(isSuccess: boolean) {

    }

    private addListeners() {

    }

    private removeListeners() {

    }

}
