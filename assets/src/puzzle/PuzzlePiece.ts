const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property(cc.Texture2D)
    private texture: cc.Texture2D = null;

    public oriCol: number;
    public oriRow: number;
    public curCol: number;
    public curRow: number;
    public isBlank: boolean;
    public get isRight() {
        return this.curCol === this.oriCol && this.curRow === this.oriRow;
    }

    public init(col: number, row: number, colNum: number, colWidth: number) {
        this.oriCol = col;
        this.oriRow = row;
        this.curCol = col;
        this.curRow = row;

        let sprite = this.node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame(this.texture);
        let rect = sprite.spriteFrame.getRect();
        let newRectWidth = rect.width / colNum;
        let newRectHeight = rect.height / colNum;
        let newRectX = col * newRectWidth;
        let newRectY = (colNum - row - 1) * newRectHeight;
        let newRect = cc.rect(newRectX, newRectY, newRectWidth, newRectHeight);
        sprite.spriteFrame.setRect(newRect);

        this.node.width = colWidth;
        this.node.height = colWidth;

        this.isBlank = this.oriCol === colNum - 1 && this.oriRow === 0;
        if (this.isBlank) {
            this.node.active = false;
        }
    }

}