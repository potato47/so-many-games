const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    public hide() {
        this.node.active = false;
    }

    public show() {
        this.node.active = true;
    }
}