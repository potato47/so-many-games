const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property([cc.SpriteFrame])
    private pics: Array<cc.SpriteFrame> = [];
    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    public x: number = 0;
    public y: number = 0;
    public posIndex: cc.Vec2 = cc.v2();
    public isAlive: boolean = true;
    private _n: number = 0;
    public get type(): number {
        return this._n;
    }
    public set type(value: number) {
        this._n = value;
        this.sprite.spriteFrame = this.pics[value - 1];
    }

    public init(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.posIndex = this.node.position;
        this.randomType();
        this.isAlive = true;
    }

    randomType(){
        this.type = Math.floor(Math.random()*this.pics.length) + 1 ;
    }
}