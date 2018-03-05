import { Piece } from "./PuzzlePiece";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export class PuzzleBoard extends cc.Component {

    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Integer)
    private colNum: number = 5;
    @property(cc.Integer)
    private colSpace: number = 5;

    private colWidth: number = 0;
    private pieceMap: Array<Array<Piece>>;

    onLoad() {
        this.colWidth = (this.node.width - this.colSpace * (this.colNum + 1)) / this.colNum;

        this.reset();
    }

    start() {
        this.addListeners();
    }

    private reset() {
        this.node.removeAllChildren();
        this.pieceMap = [];
        for (let x = 0; x < this.colNum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.colNum; y++) {
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.node.addChild(pieceNode);
                pieceNode.x = x * (this.colWidth + this.colSpace) + this.colSpace;
                pieceNode.y = y * (this.colWidth + this.colSpace) + this.colSpace;
                this.pieceMap[x][y] = pieceNode.getComponent(Piece);
                this.pieceMap[x][y].init(x, y, this.colNum, this.colWidth);
            }
        }
    }

    private onBoadTouch(event: cc.Event.EventTouch) {
        let worldPos = event.getLocation();
        let localPos = this.node.convertToNodeSpaceAR(worldPos);
        let x = Math.floor((localPos.x - this.colSpace) / this.colWidth);
        let y = Math.floor((localPos.y - this.colSpace) / this.colWidth);
        this.movePiece(x,y);
    }

    public movePiece(x, y): boolean {
        let piece = this.pieceMap[x][y];
        let blank = null;;

        if (x > 0 && this.pieceMap[x - 1][y].isBlank) { // left
            blank = this.pieceMap[x - 1][y];
        } else if (x < this.colNum - 1 && this.pieceMap[x + 1][y].isBlank) { // right
            blank = this.pieceMap[x + 1][y];
        } else if (y > 0 && this.pieceMap[x][y - 1].isBlank) { // bottom
            blank = this.pieceMap[x][y - 1];
        } else if (y < this.colNum - 1 && this.pieceMap[x][y + 1].isBlank) { // top
            blank = this.pieceMap[x][y + 1];
        } 
        if(blank) {
            this.exchangeTwoPiece(piece,blank);
            return true;
        }else{
            return false;
        }
    }

    public exchangeTwoPiece(piece1:Piece,piece2:Piece) {
        this.pieceMap[piece2.curCol][piece2.curRow] = piece1;
        this.pieceMap[piece1.curCol][piece1.curRow] = piece2;
        
        [piece1.curCol, piece2.curCol] = [piece2.curCol, piece1.curCol];
        [piece1.curRow, piece2.curRow] = [piece2.curRow, piece1.curRow];

        [piece1.node.position, piece2.node.position] = [piece2.node.position, piece1.node.position];
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onBoadTouch, this);
    }

    private removeListeners() {

    }

}