import { Get47Scene } from "./Get47Scene";
import { Piece } from "./Get47Piece";
import { DIR } from "./Get47Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export class Get47Board extends cc.Component {

    @property(cc.Integer)
    private colsNum: number = 7;
    @property(cc.Integer)
    private rowsNum: number = 7;
    @property(cc.Integer)
    private padding: number = 5;
    @property(cc.Integer)
    private spacing: number = 5;
    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;

    private pieceWidth: number;
    private get47Scene: Get47Scene = null;
    private pieceMap: Array<Array<Piece>>;
    private runningAction: boolean = false;
    private score: number = 0;

    private inputDir: number = 0; // 手机倾斜方向，1向右分数相加，-1向左分数相减

    public init(get47Scene: Get47Scene) {
        this.get47Scene = get47Scene;
        this.pieceWidth = (this.node.width - this.padding * 2 - this.spacing * (this.colsNum - 1)) / this.colsNum;
    }

    public reset() {
        this.node.removeAllChildren();
        this.pieceMap = [];
        for (let x = 0; x < this.colsNum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.rowsNum; y++) {
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.node.addChild(pieceNode);
                pieceNode.width = this.pieceWidth;
                pieceNode.height = this.pieceWidth;
                pieceNode.position = cc.p(this.padding + x * (this.pieceWidth + this.spacing),
                    this.padding + y * (this.pieceWidth + this.spacing));
                let piece = pieceNode.getComponent(Piece);
                piece.init(x, y);
                this.addTouchEvent(piece);
                this.pieceMap[x][y] = piece;
            }
        }
        this.deletePieces();
    }

    private addTouchEvent(piece: Piece) {
        let f = (e: cc.Event.EventTouch) => {
            if (this.runningAction) {
                return;
            }
            let p1 = e.getStartLocation();
            let p2 = e.getLocation();
            let dir: DIR;
            if (Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)) {
                if (p2.x > p1.x) {
                    dir = DIR.RIGHT;
                } else {
                    dir = DIR.LEFT;
                }
            } else {
                if (p2.y > p1.y) {
                    dir = DIR.UP;
                } else {
                    dir = DIR.DOWN;
                }
            }
            this.inputDir = 0;
            this.get47Scene.onPieceTouch(piece, dir);
        };
        piece.node.on(cc.Node.EventType.TOUCH_END, f, this);
        piece.node.on(cc.Node.EventType.TOUCH_CANCEL, f, this);

    }

    public tryExchange(piece: Piece, dir: DIR) {
        let neighborPiece = this.getNeighborPiece(piece, dir);
        if (neighborPiece === null) {
            return;
        }
        this.runningAction = true;

        this.exchangeTwoPiecesState(piece, neighborPiece);
        let hLines = this.getHorizontalLines();
        let vLines = this.getVerticalLines();
        if (hLines.length + vLines.length > 0) {
            this.exchangeTwoPiecesPosIndex(piece, neighborPiece);
            let finished = 0;
            let total = 2;
            let self = this;
            let action1 = cc.sequence(cc.moveTo(0.15, piece.posIndex),
                cc.callFunc(() => {
                    finished++;
                    if (finished === total) {
                        this.runningAction = false;
                        this.deletePieces();
                    }
                })
            );
            let action2 = cc.sequence(cc.moveTo(0.15, neighborPiece.posIndex),
                cc.callFunc(() => {
                    finished++;
                    if (finished === total) {
                        this.runningAction = false;
                        this.deletePieces();
                    }
                })
            );
            piece.node.runAction(action1);
            neighborPiece.node.runAction(action2);
        } else {
            this.exchangeTwoPiecesState(piece, neighborPiece);
            let finished = 0;
            let total = 2;
            let tilePos = piece.node.position;
            let neighborTilePos = neighborPiece.node.position;
            let action1 = cc.sequence(cc.moveTo(0.1, neighborTilePos), cc.moveTo(0.1, tilePos),
                cc.callFunc(() => {
                    finished++;
                    if (finished === total) {
                        this.runningAction = false;
                    }
                })
            );
            let action2 = cc.sequence(cc.moveTo(0.1, tilePos), cc.moveTo(0.1, neighborTilePos),
                cc.callFunc(() => {
                    finished++;
                    if (finished === total) {
                        this.runningAction = false;
                    }
                })
            );
            piece.node.runAction(action1);
            neighborPiece.node.runAction(action2);
        }

    }

    private exchangeTwoPiecesState(piece1: Piece, piece2: Piece) {
        this.pieceMap[piece1.x][piece1.y] = piece2;
        this.pieceMap[piece2.x][piece2.y] = piece1;
        [piece1.x, piece2.x] = [piece2.x, piece1.x];
        [piece1.y, piece2.y] = [piece2.y, piece1.y];
    }

    private exchangeTwoPiecesPosIndex(piece1: Piece, piece2: Piece) {//交换位置信息，实际位置没有改变
        [piece1.posIndex, piece2.posIndex] = [piece2.posIndex, piece1.posIndex]
    }

    private deletePieces() {
        this.runningAction = true;
        let hLines = this.getHorizontalLines();
        let vLines = this.getVerticalLines();
        if (hLines.length + vLines.length === 0) {
            this.runningAction = false;
            return;
        }
        let addNumber = 0;//横加竖减
        let minusNumber = 0;
        let lines: Array<Piece> = [];
        for (let piece of hLines) {
            addNumber += piece.type;
            lines.push(piece);
        }
        for (let vPiece of vLines) {
            minusNumber += vPiece.type;
            if (lines.indexOf(vPiece) === -1) {
                lines.push(vPiece);
            }
        }
        // TODO:
        if (this.inputDir > 0) {
            this.get47Scene.updateScore(addNumber + minusNumber);
        } else if (this.inputDir < 0) {
            this.get47Scene.updateScore(-addNumber - minusNumber);
        } else {
            this.get47Scene.updateScore(addNumber - minusNumber);
        }
        // this.score += (addNumber - minusNumber);

        let finished = 0;
        let total = lines.length;
        for (let i = 0; i < total; i++) {
            let action = cc.sequence(cc.scaleTo(0.15, 0, 0),
                cc.callFunc(() => {
                    finished++;
                    if (finished === total) {
                        this.runningAction = false;
                        this.fallPieces();
                    }
                })
            );
            lines[i].isAlive = false;
            lines[i].node.runAction(action);
        }
    }

    private fallPieces() {
        this.runningAction = true;
        //下落
        let isAllFall = false;
        while (!isAllFall) {
            isAllFall = true;
            for (let y = 1; y < this.rowsNum; y++) {
                for (let x = 0; x < this.colsNum; x++) {
                    if (this.pieceMap[x][y].isAlive && !this.pieceMap[x][y - 1].isAlive) {
                        this.exchangeTwoPiecesState(this.pieceMap[x][y], this.pieceMap[x][y - 1]);
                        this.exchangeTwoPiecesPosIndex(this.pieceMap[x][y], this.pieceMap[x][y - 1]);
                        isAllFall = false;
                    }
                }
            }
        }
        let fallingPieces: Array<Piece> = [];
        for (let x = 0; x < this.colsNum; x++) {
            for (let y = 0; y < this.rowsNum; y++) {
                if (this.pieceMap[x][y].posIndex !== this.pieceMap[x][y].node.position) {
                    fallingPieces.push(this.pieceMap[x][y]);
                }
            }
        }

        let finished = 0;
        let total = fallingPieces.length;
        for (let i = 0; i < total; i++) {
            let action = cc.sequence(cc.moveTo(0.3, fallingPieces[i].posIndex),
                cc.callFunc(() => {
                    finished++;
                    if (finished == total) {
                        this.runningAction = false;
                        this.addPieces();
                    }
                })
            );
            fallingPieces[i].node.runAction(action);
        }

    }

    private addPieces() {
        this.runningAction = true;
        //填补空白
        let addingPieces: Array<Piece> = [];
        for (let y = 0; y < this.rowsNum; y++) {
            for (let x = 0; x < this.colsNum; x++) {
                if (!this.pieceMap[x][y].isAlive) {
                    addingPieces.push(this.pieceMap[x][y]);
                }
            }
        }

        let finished = 0;
        let total = addingPieces.length;
        for (let i = 0; i < total; i++) {
            let action = cc.sequence(cc.scaleTo(0.15, 1, 1),
                cc.callFunc(() => {
                    finished++;
                    if (finished == total) {
                        this.runningAction = false;
                        this.deletePieces();
                    }
                })
            );
            addingPieces[i].randomType();
            addingPieces[i].isAlive = true;
            addingPieces[i].node.runAction(action);
        }
    }

    private getVerticalLines(): Array<Piece> {
        let linePieces: Array<Piece> = [];
        let count = 1;
        for (let x = 0; x < this.colsNum; x++) {
            for (let y = 0; y < this.rowsNum - 2; y = y + count) {
                let piece = this.pieceMap[x][y];
                count = 1;
                for (let n = y + 1; n < this.rowsNum; n++) {
                    if (this.pieceMap[x][n].type === piece.type) {
                        count++;
                    } else {
                        break;
                    }
                }
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        linePieces.push(this.pieceMap[x][y + i]);
                    }
                }
            }
        }
        return linePieces;
    }

    private getHorizontalLines(): Array<Piece> {
        let linePieces: Array<Piece> = [];
        let count = 1;
        for (let y = 0; y < this.rowsNum; y++) {
            for (let x = 0; x < this.colsNum - 2; x = x + count) {
                let piece = this.pieceMap[x][y];
                let pieceType = piece.type;
                count = 1;
                for (let n = x + 1; n < this.colsNum; n++) {
                    if (this.pieceMap[n][y].type === pieceType) {
                        count++;
                    } else {
                        break;
                    }
                }
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        linePieces.push(this.pieceMap[x + i][y]);
                    }
                }
            }
        }
        return linePieces;
    }

    private getNeighborPiece(piece: Piece, dir: DIR): Piece {
        let x = piece.x;
        let y = piece.y;
        switch (dir) {
            case DIR.LEFT:
                if (x > 0) {
                    return this.pieceMap[x - 1][y];
                }
                break;
            case DIR.RIGHT:
                if (x < this.colsNum - 1) {
                    return this.pieceMap[x + 1][y];
                }
                break;
            case DIR.UP:
                if (y < this.rowsNum - 1) {
                    return this.pieceMap[x][y + 1];
                }
                break;
            case DIR.DOWN:
                if (y > 0) {
                    return this.pieceMap[x][y - 1];
                }
                break;
        }
        return null;
    }

    public newView(input: number = 0) {
        this.inputDir = input;
        if (!this.runningAction) {
            this.runningAction = true;
            let finished = 0;
            for (let x = 0; x < this.colsNum; x++) {
                for (let y = 0; y < this.rowsNum; y++) {
                    let action = cc.sequence(cc.scaleTo(0.3, 0, 0),
                        cc.callFunc(() => {
                            finished++;
                            if (finished === (this.colsNum - 1) * (this.rowsNum - 1)) {
                                this.runningAction = false;
                                this.addPieces();
                            }
                        })
                    );
                    this.pieceMap[x][y].isAlive = false;
                    this.pieceMap[x][y].node.runAction(action);
                }
            }
        }
    }
}