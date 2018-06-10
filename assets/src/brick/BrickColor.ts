const {ccclass, property} = cc._decorator;

@ccclass
export class BrickColor extends cc.Component {

    @property(cc.Sprite)
    brickSprite: cc.Sprite = null;
    @property([cc.SpriteFrame])
    picList: cc.SpriteFrame[] = [];
    
    start() {
        let n = Math.random() * this.picList.length | 0;
        this.brickSprite.spriteFrame = this.picList[n];
    }
}