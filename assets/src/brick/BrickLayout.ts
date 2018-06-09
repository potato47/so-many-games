const {ccclass, property} = cc._decorator;

@ccclass
export class BrickLayout extends cc.Component {

    @property(cc.Float)
    private padding: number = 0;
    @property(cc.Float)
    private spacing: number = 0;
    @property(cc.Integer)
    private colNum: number = 0;
    @property(cc.Prefab)
    private brickPrefab: cc.Prefab = null;
    @property(cc.Integer)
    private brickNum: number = 0;

    init(brickNum) {
        this.node.removeAllChildren();
        this.brickNum = brickNum;
        for (let i = 0; i < this.brickNum; i++) {
            let brickNode = cc.instantiate(this.brickPrefab);
            brickNode.parent = this.node;
            brickNode.x = this.padding + (i % this.colNum) * (brickNode.width + this.spacing) + brickNode.width / 2;
            brickNode.y = -this.padding - Math.floor(i / this.colNum) * (brickNode.height + this.spacing) - brickNode.height / 2;
        }
    }
}