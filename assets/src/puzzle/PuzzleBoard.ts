import { Piece } from "./PuzzlePiece";
import { PuzzleScene } from "./PuzzleScene";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
// @executeInEditMode
export class PuzzleBoard extends cc.Component {

    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Integer)
    private colNum: number = 5;
    @property(cc.Integer)
    private colSpace: number = 5;

    private colWidth: number = 0;
    private pieceMap: Array<Array<Piece>>;
    private blankPiece: Piece = null;

    private puzzleScene: PuzzleScene = null;

    init(puzzleScene: PuzzleScene) {
        this.puzzleScene = puzzleScene;
        this.addListeners();
    }

    public reset(colNum?: number) {
        this.colNum = colNum;
        this.colWidth = (this.node.width - this.colSpace * (this.colNum + 1)) / this.colNum;
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
                if (this.pieceMap[x][y].isBlank) {
                    this.blankPiece = this.pieceMap[x][y];
                }
            }
        }
        this.shuffle();
    }

    private shuffle() {
        for (let i = 0; i < 1000; i++) {
            let nearPieces = this.getNearPieces(this.blankPiece);
            let n = Math.floor(Math.random() * nearPieces.length);
            this.exchangeTwoPiece(this.blankPiece, nearPieces[n]);
        }
    }

    private onBoadTouch(event: cc.Event.EventTouch) {
        let worldPos = event.getLocation();
        let localPos = this.node.convertToNodeSpaceAR(worldPos);
        let x = Math.floor((localPos.x - this.colSpace) / (this.colWidth + this.colSpace));
        let y = Math.floor((localPos.y - this.colSpace) / (this.colWidth + this.colSpace));
        this.puzzleScene.onBoardTouch(x, y);
    }

    public movePiece(x, y): boolean {
        let piece = this.pieceMap[x][y];
        let nearPieces = this.getNearPieces(piece);
        for (let nearPiece of nearPieces) {
            if (nearPiece.isBlank) {
                this.exchangeTwoPiece(piece, nearPiece);
                return true;
            }
        }
        return false;
    }

    public judgeWin(): boolean {
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                if(!this.pieceMap[x][y].isRight) {
                    return false;
                }
            }
        }
        this.blankPiece.node.active = true;
        return true;
    }

    private getNearPieces(piece: Piece): Array<Piece> {
        let nearPieces = [];
        if (piece.curCol > 0) { // left
            nearPieces.push(this.pieceMap[piece.curCol - 1][piece.curRow]);
        }
        if (piece.curCol < this.colNum - 1) { // right
            nearPieces.push(this.pieceMap[piece.curCol + 1][piece.curRow]);
        }
        if (piece.curRow > 0) { // bottom
            nearPieces.push(this.pieceMap[piece.curCol][piece.curRow - 1]);
        }
        if (piece.curRow < this.colNum - 1) { // top
            nearPieces.push(this.pieceMap[piece.curCol][piece.curRow + 1]);
        }
        return nearPieces;
    }

    public exchangeTwoPiece(piece1: Piece, piece2: Piece) {
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