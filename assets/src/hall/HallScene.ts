import { G } from "../G";

const { ccclass, property } = cc._decorator;

@ccclass
export class HallScene extends cc.Component {

    onBtnGobang() {
        G.enterGobang();
    }

    onBtnReversi() {
        G.enterReversi();
    }

    onBtn2048() {
        G.enter2048();
    }

    onBtnJump() {
        G.enterJump();
    }

    onBtnPuzzle() {
        G.enterPuzzle();
    }

    onBtnGet47() {
        G.enterGet47();
    }

    onBtnTetris() {
        G.enterTetris();
    }

    onBtnMine() {
        G.enterMine();
    }

}
