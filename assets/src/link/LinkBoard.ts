import { Piece } from "./LinkPiece";
import { LinkScene } from "./LinkScene";
import { PIECE_STATE } from "./LinkConstants";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export class LinkBoard extends cc.Component {

    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Integer)
    private colNum: number = 10;
    @property(cc.Integer)
    private colSpace: number = 5;

    private colWidth: number = 0;
    private pieceMap: Array<Array<Piece>>;
    private lastPiece: Piece = null;

    private linkScene: LinkScene = null;

    // init(linkScene: LinkScene) {
    //     this.linkScene = linkScene;
    //     this.addListeners();
    // }

    start() {
        this.reset();
    }

    public reset() {
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
                pieceNode.width = this.colWidth;
                pieceNode.height = this.colWidth;
                let piece = pieceNode.getComponent(Piece);
                this.pieceMap[x][y] = piece;
                // 最外一圈当作墙
                if (x === 0 || y === 0 || x === this.colNum - 1 || y === this.colNum - 1) {
                    this.pieceMap[x][y].init(x, y, 0);
                } else {
                    this.pieceMap[x][y].init(x, y, 25);
                }
                this.addTouchEvent(piece);
            }
        }
        this.shuffle();
    }

    private addTouchEvent(piece: Piece) {
        piece.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (piece.type === 0) {
                return;
            }
            if (piece.state === PIECE_STATE.IDLE) {
                if (this.lastPiece === null) {
                    piece.setState(PIECE_STATE.PRESS);
                    this.lastPiece = piece;
                } else {
                    if (this.canLink(piece, this.lastPiece)) {
                        this.link(piece, this.lastPiece);
                    } else {
                        this.lastPiece.setState(PIECE_STATE.IDLE);
                        this.lastPiece = null;
                    }
                }
            } else if (piece.state === PIECE_STATE.PRESS) {
                piece.setState(PIECE_STATE.IDLE);
                this.lastPiece = null;
            }
        }, this);
    }

    private find(piece: Piece, excPieces: Piece[] = []): Piece[] {
        let pX = piece.x, pY = piece.y;
        let path: Piece[] = [];
        for (let x = pX + 1; x < this.colNum; x++) {
            if (this.pieceMap[x][pY].type === 0) {
                path.push(this.pieceMap[x][pY]);
            } else {
                break;
            }
        }
        for (let x = pX - 1; x >= 0; x--) {
            if (this.pieceMap[x][pY].type === 0) {
                path.push(this.pieceMap[x][pY]);
            } else {
                break;
            }
        }
        for (let y = pY + 1; y < this.colNum; y++) {
            if (this.pieceMap[pX][y].type === 0) {
                path.push(this.pieceMap[pX][y]);
            } else {
                break;
            }
        }
        for (let y = pY - 1; y >= 0; y--) {
            if (this.pieceMap[pX][y].type === 0) {
                path.push(this.pieceMap[pX][y]);
            } else {
                break;
            }
        }
        return path;
    }

    // 可以直线相连
    private canPass(piece1: Piece, piece2: Piece) {

    }

    private canLink(piece1: Piece, piece2: Piece): boolean {
        if (piece1 === piece2) {
            return false;
        }
        let s0 = this.find(piece1);
        let crossNum = 0;
        while(s0.indexOf(piece2) === -1 && crossNum < 3) {
            let s1: Piece[] = [];
            s0.forEach(p => {

            });
            s0.push();
            crossNum++;
        }
        // 一条线
        let pass = true;
        let path = [];
        if (piece1.y === piece2.y) {
            let minX = Math.min(piece1.x, piece2.x);
            let maxX = Math.max(piece1.x, piece2.x);
            for (let x = minX; x <= maxX; x++) {
                if (this.pieceMap[x][piece1.y].type !== 0) {
                    pass = false;
                }
            }
        } else if (piece1.x === piece2.x) {
            let minY = Math.min(piece1.y, piece2.y);
            let maxY = Math.max(piece1.y, piece2.y);
            for (let y = minY; y <= maxY; y++) {
                if (this.pieceMap[piece1.x][y].type !== 0) {
                    pass = false;
                }
            }
        } else {

        }
        return false;
    }

    private link(piece1: Piece, piece2: Piece) {

    }

    private shuffle() {
        // for (let i = 0; i < 1000; i++) {
        //     let nearPieces = this.getNearPieces(this.blankPiece);
        //     let n = Math.floor(Math.random() * nearPieces.length);
        //     this.exchangeTwoPiece(this.blankPiece, nearPieces[n]);
        // }
    }

    // private onBoadTouch(event: cc.Event.EventTouch) {
    //     let worldPos = event.getLocation();
    //     let localPos = this.node.convertToNodeSpaceAR(worldPos);
    //     let x = Math.floor((localPos.x - this.colSpace) / (this.colWidth + this.colSpace));
    //     let y = Math.floor((localPos.y - this.colSpace) / (this.colWidth + this.colSpace));
    //     this.puzzleScene.onBoardTouch(x, y);
    // }

    // public movePiece(x, y): boolean {
    //     let piece = this.pieceMap[x][y];
    //     let nearPieces = this.getNearPieces(piece);
    //     for (let nearPiece of nearPieces) {
    //         if (nearPiece.isBlank) {
    //             this.exchangeTwoPiece(piece, nearPiece);
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // public judgeWin(): boolean {
    //     for (let x = 0; x < this.colNum; x++) {
    //         for (let y = 0; y < this.colNum; y++) {
    //             if (!this.pieceMap[x][y].isRight) {
    //                 return false;
    //             }
    //         }
    //     }
    //     this.blankPiece.node.active = true;
    //     return true;
    // }

    // private getNearPieces(piece: Piece): Array<Piece> {
    //     let nearPieces = [];
    //     if (piece.curCol > 0) { // left
    //         nearPieces.push(this.pieceMap[piece.curCol - 1][piece.curRow]);
    //     }
    //     if (piece.curCol < this.colNum - 1) { // right
    //         nearPieces.push(this.pieceMap[piece.curCol + 1][piece.curRow]);
    //     }
    //     if (piece.curRow > 0) { // bottom
    //         nearPieces.push(this.pieceMap[piece.curCol][piece.curRow - 1]);
    //     }
    //     if (piece.curRow < this.colNum - 1) { // top
    //         nearPieces.push(this.pieceMap[piece.curCol][piece.curRow + 1]);
    //     }
    //     return nearPieces;
    // }

    // public exchangeTwoPiece(piece1: Piece, piece2: Piece) {
    //     this.pieceMap[piece2.curCol][piece2.curRow] = piece1;
    //     this.pieceMap[piece1.curCol][piece1.curRow] = piece2;

    //     [piece1.curCol, piece2.curCol] = [piece2.curCol, piece1.curCol];
    //     [piece1.curRow, piece2.curRow] = [piece2.curRow, piece1.curRow];

    //     [piece1.node.position, piece2.node.position] = [piece2.node.position, piece1.node.position];
    // }

    // private addListeners() {
    //     this.node.on(cc.Node.EventType.TOUCH_END, this.onBoadTouch, this);
    // }

    // private removeListeners() {

    // }

}