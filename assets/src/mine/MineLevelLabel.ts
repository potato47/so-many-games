const { ccclass, property } = cc._decorator;

@ccclass
export class MineLevelLabel extends cc.Component {
    
    @property(cc.Sprite)
    private s1: cc.Sprite = null;
    @property(cc.Sprite)
    private s2: cc.Sprite = null;
    @property([cc.SpriteFrame])
    private nums: cc.SpriteFrame[] = [];

    private _level:number = 0;
    
    public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        this._level = value;
        let n1 = value / 10 | 0;
        let n2 = value % 10;
        this.s1.spriteFrame = this.nums[n1];
        this.s2.spriteFrame = this.nums[n2];
    }
}