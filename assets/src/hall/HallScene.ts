import { G } from "../G";

const {ccclass, property} = cc._decorator;

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
}
