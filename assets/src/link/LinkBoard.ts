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
    @property(cc.Graphics)
    private pen: cc.Graphics = null;
    @property(cc.Integer)
    private pictureNum: number = 8;

    private colWidth: number = 0;
    private pieceMap: Array<Array<Piece>>;
    private lastPiece: Piece = null;

    private linkScene: LinkScene = null;
    
    onLoad() {
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
                this.pieceMap[x][y].init(x, y, 0);
                this.addTouchEvent(piece);
            }
        }
    }

    init(linkScene: LinkScene) {
        this.linkScene = linkScene;
    }
    
    public reset() {
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
                    if (this.link(this.lastPiece, piece)) {
                        this.lastPiece = null;
                        this.judgeWin();
                    } else {
                        this.lastPiece.setState(PIECE_STATE.IDLE);
                        piece.setState(PIECE_STATE.PRESS);
                        this.lastPiece = piece;
                    }
                }
            } else if (piece.state === PIECE_STATE.PRESS) {
                piece.setState(PIECE_STATE.IDLE);
                this.lastPiece = null;
            }
        }, this);
    }

    canDirectLink(piece1: Piece, piece2: Piece): boolean {
        if (piece1.x === piece2.x) {
            let minY = Math.min(piece1.y, piece2.y);
            let maxY = Math.max(piece1.y, piece2.y);
            for (let y = minY + 1; y < maxY; y++) {
                if (this.pieceMap[piece1.x][y].type !== 0) {
                    return false
                }
            }
            return true;
        }
        if (piece1.y === piece2.y) {
            let minX = Math.min(piece1.x, piece2.x);
            let maxX = Math.max(piece1.x, piece2.x);
            for (let x = minX + 1; x < maxX; x++) {
                if (this.pieceMap[x][piece1.y].type !== 0) {
                    return false
                }
            }
            return true;
        }
        return false;
    }

    findCorner(piece1: Piece, piece2: Piece): [boolean, Array<Piece>] {
        let c1: Piece, c2: Piece;
        // 0折
        if (this.canDirectLink(piece1, piece2)) {
            return [true, []];
        }
        // 1折 找一个点
        c1 = this.pieceMap[piece1.x][piece2.y];
        if (c1.type === 0 && this.canDirectLink(c1, piece1) && this.canDirectLink(c1, piece2)) {
            return [true, [c1]];
        }
        c1 = this.pieceMap[piece2.x][piece1.y];
        if (c1.type === 0 && this.canDirectLink(c1, piece1) && this.canDirectLink(c1, piece2)) {
            return [true, [c1]];
        }
        // 2折 找一条线
        for (let x = 0; x < this.colNum; x++) {
            if (x === piece1.x || x === piece2.x) {
                continue;
            }
            c1 = this.pieceMap[x][piece1.y];
            c2 = this.pieceMap[x][piece2.y];
            if (c1.type === 0 && c2.type === 0
                && this.canDirectLink(c1, c2)
                && this.canDirectLink(c1, piece1)
                && this.canDirectLink(c2, piece2)) {
                return [true, [c1, c2]];
            }
        }
        for (let y = 0; y < this.colNum; y++) {
            if (y === piece1.y || y === piece2.y) {
                continue;
            }
            c1 = this.pieceMap[piece1.x][y];
            c2 = this.pieceMap[piece2.x][y];
            if (c1.type === 0 && c2.type === 0
                && this.canDirectLink(c1, c2)
                && this.canDirectLink(c1, piece1)
                && this.canDirectLink(c2, piece2)) {
                return [true, [c1, c2]];
            }
        }
        return [false, null];
    }

    private link(piece1: Piece, piece2: Piece): boolean {
        if (piece1.type !== piece2.type) {
            return false;
        }
        let [pass, corners] = this.findCorner(piece1, piece2);
        if (pass) {
            this.drawLine([piece1].concat(corners).concat(piece2));
            piece1.setType(0);
            piece2.setType(0);
            return true;
        } else {
            return false;
        }
    }

    private drawLine(path: Piece[]) {
        let pos = this.getPieceCenterPosition(path[0]);
        this.pen.moveTo(pos.x, pos.y);
        for (let i = 1; i < path.length; i++) {
            pos = this.getPieceCenterPosition(path[i]);
            this.pen.lineTo(pos.x, pos.y);
        }
        this.pen.stroke();
        setTimeout(() => {
            this.clearLine();
        }, 500);
    }

    private clearLine() {
        this.pen.clear();
    }

    private getPieceCenterPosition(piece: Piece): cc.Vec2 {
        let x = piece.x * (this.colWidth + this.colSpace) + this.colSpace + this.colWidth / 2;
        let y = piece.y * (this.colWidth + this.colSpace) + this.colSpace + this.colWidth / 2;
        return cc.v2(x, y);
    }

    private shuffle() {
        let pictureList = [];
        for (let i = 1; i <= 78; i++) {
            pictureList.push(i);
        }
        let pending = [];
        for (let x = 1; x < this.colNum - 1; x++) {
            for (let y = 1; y < this.colNum - 1; y++) {
                pending.push(this.pieceMap[x][y]);
            }
        }
        let p1, p2;
        let pieceNum = (this.colNum - 2) ** 2;
        let rem = pieceNum / 2 % this.pictureNum; // 余数，重复的几对
        let coupleNum = (pieceNum / 2 - rem) / this.pictureNum; // 相同的图片有多少对
        for (let i = 0; i < this.pictureNum; i++) {
            let picture = this.randomPop(pictureList);
            for (let j = 0; j < coupleNum * 2; j++) {
                let p = this.randomPop(pending);
                p.setType(picture);
                p.setState(PIECE_STATE.IDLE);
            }
            if (i < rem) {
                for(let k = 0; k < 2; k++) {
                    let p = this.randomPop(pending);
                    p.setType(picture);
                    p.setState(PIECE_STATE.IDLE);
                }
            }
        }
    }

    private randomPop(arr: Array<any>) {
        let n = Math.random() * arr.length | 0;
        return arr.splice(n, 1)[0];
    }

    public judgeWin(): boolean {
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                if (this.pieceMap[x][y].type !== 0) {
                    return false;
                }
            }
        }
        this.linkScene.overGame();
        return true;
    }

}