const { ccclass, property } = cc._decorator;

@ccclass
export class Score extends cc.Component {

    @property(cc.Label)
    private scoreLabel: cc.Label = null;
    @property(cc.Label)
    private addLabel: cc.Label = null;
    @property(cc.Label)
    private minusLabel: cc.Label = null;
    @property(cc.Animation)
    private anim: cc.Animation = null;

    public num: number = 0;

    public reset(n: number) {
        this.num = n;
        this.scoreLabel.string = n + "";
    }

    public add(n: number) {
        this.num += n;
        this.scoreLabel.string = this.num + "";
        this.addLabel.string = "+" + n;
        this.anim.play("add");
    }

    public minus(n: number) {
        this.num -= n;
        this.scoreLabel.string = this.num + "";
        this.minusLabel.string = "-" + n;
        this.anim.play("minus");
    }

}