import { ReversiPiece } from "./ReversiPiece";
import { ReversiScene } from "./ReversiScene";
import { NONE, BLACK, WHITE } from "./ReversiConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export class ReversiBoard extends cc.Component {
    @property(cc.Integer)
    private colsSum: number = 8;
    @property(cc.Integer)
    private rowsSum: number = 8;
    @property(cc.Graphics)
    private graphics: cc.Graphics = null; // 用来画棋盘
    @property(cc.Graphics)
    private graphics2: cc.Graphics = null; // 用来画棋子

    private tileWidth: number = 0; // 一个方块的宽度
    private startX: number = 0; // 棋盘左下角
    private startY: number = 0;
    private boardWidth: number = 0; // 棋盘节点宽高
    private boardHeight: number = 0;
    public pieceMap: Array<Array<ReversiPiece>>;
    public lastPiece: ReversiPiece = null;

    private reversiScene: ReversiScene = null;

    public init(reversiScene: ReversiScene) {
        this.reversiScene = reversiScene;

        this.tileWidth = this.node.width / (this.colsSum + 1);
        this.startX = this.tileWidth / 2;
        this.startY = this.tileWidth / 2;
        this.boardWidth = this.tileWidth * this.colsSum;
        this.boardHeight = this.tileWidth * this.rowsSum;
        this.reset();

        this.addListeners();
    }

    public reset() {
        this.graphics.clear();
        this.graphics2.clear();
        // 画棋盘
        this.graphics.strokeColor = cc.Color.BLACK;
        for (let x = 0; x < this.colsSum + 1; x++) {
            this.graphics.moveTo(this.startX + x * this.tileWidth, this.startY);
            this.graphics.lineTo(this.startX + x * this.tileWidth, this.startY + this.boardHeight);
            this.graphics.stroke();
        }
        for (let y = 0; y < this.rowsSum + 1; y++) {
            this.graphics.moveTo(this.startX, this.startY + y * this.tileWidth);
            this.graphics.lineTo(this.startX + this.boardWidth, this.startY + y * this.tileWidth);
            this.graphics.stroke();
        }

        this.pieceMap = [];
        for (let x = 0; x < this.colsSum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.rowsSum; y++) {
                this.pieceMap[x][y] = new ReversiPiece(x, y, NONE);
            }
        }

        this.placeBlack(cc.v2(Math.floor(this.colsSum / 2) - 1, Math.floor(this.rowsSum / 2) - 1));
        this.placeBlack(cc.v2(Math.floor(this.colsSum / 2), Math.floor(this.rowsSum / 2)));
        this.placeWhite(cc.v2(cc.v2(Math.floor(this.colsSum / 2) - 1, Math.floor(this.rowsSum / 2))));
        this.placeWhite(cc.v2(cc.v2(Math.floor(this.colsSum / 2), Math.floor(this.rowsSum / 2) - 1)));

    }

    private refresh() {
        this.graphics2.clear();
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                if (this.pieceMap[x][y].color === BLACK) {
                    this.graphics2.strokeColor = cc.Color.BLACK;
                    this.graphics2.fillColor = cc.Color.BLACK;
                    this.graphics2.circle(this.startX + x * this.tileWidth + this.tileWidth / 2, this.startY + y * this.tileWidth + this.tileWidth / 2, this.tileWidth * 0.45);
                    this.graphics2.fill();
                } else if (this.pieceMap[x][y].color === WHITE) {
                    this.graphics2.strokeColor = cc.Color.WHITE;
                    this.graphics2.fillColor = cc.Color.WHITE;
                    this.graphics2.circle(this.startX + x * this.tileWidth + this.tileWidth / 2, this.startY + y * this.tileWidth + this.tileWidth / 2, this.tileWidth * 0.45);
                    this.graphics2.fill();
                }
            }
        }
    }

    public placeBlack(coor: cc.Vec2) {
        this.pieceMap[coor.x][coor.y] = new ReversiPiece(coor.x, coor.y, BLACK);
        this.lastPiece = this.pieceMap[coor.x][coor.y];
        this.refresh();
    }

    public placeWhite(coor: cc.Vec2) {
        this.pieceMap[coor.x][coor.y] = new ReversiPiece(coor.x, coor.y, WHITE);
        this.lastPiece = this.pieceMap[coor.x][coor.y];
        this.refresh();
    }

    public getPieceByCoor(coor: cc.Vec2): ReversiPiece {
        return this.pieceMap[coor.x][coor.y];
    }

    private onTouched(event: cc.Event.EventTouch) {
        let localPos = this.node.convertToNodeSpaceAR(event.getLocation());
        if (localPos.x < this.startX || localPos.y < this.startY
            || localPos.x > this.startX + this.boardWidth
            || localPos.y > this.startY + this.boardHeight) {
            return;
        }
        let coor = this.getCoorByPos(localPos);
        this.reversiScene.onBoardTouched(coor);
    }

    private getCoorByPos(pos: cc.Vec2): cc.Vec2 {
        let touchCol = Math.round((pos.x - this.startX - this.tileWidth / 2) / this.tileWidth);
        let touchRow = Math.round((pos.y - this.startY - this.tileWidth / 2) / this.tileWidth);
        return cc.v2(touchCol, touchRow);
    }

    private nearPiece(piece: ReversiPiece, dir: number): ReversiPiece {
        switch (dir) {
            case 1://left
                if (piece.x !== 0) {
                    return this.pieceMap[piece.x - 1][piece.y];
                }
                break;
            case 2://left up
                if (piece.x !== 0 && piece.y !== this.rowsSum - 1) {
                    return this.pieceMap[piece.x - 1][piece.y + 1];
                }
                break;
            case 3://up
                if (piece.y !== this.rowsSum - 1) {
                    return this.pieceMap[piece.x][piece.y + 1];
                }
                break;
            case 4://right up
                if (piece.x !== this.colsSum - 1 && piece.y !== this.rowsSum - 1) {
                    return this.pieceMap[piece.x + 1][piece.y + 1];
                }
                break;
            case 5://right
                if (piece.x !== this.colsSum - 1) {
                    return this.pieceMap[piece.x + 1][piece.y];
                }
                break;
            case 6://right down
                if (piece.x !== this.colsSum - 1 && piece.y !== 0) {
                    return this.pieceMap[piece.x + 1][piece.y - 1];
                }
                break;
            case 7://down
                if (piece.y !== 0) {
                    return this.pieceMap[piece.x][piece.y - 1];
                }
                break;
            case 8://left down
                if (piece.x !== 0 && piece.y !== 0) {
                    return this.pieceMap[piece.x - 1][piece.y - 1];
                }
                break;

            default:
                break;
        }
        return null;
    }

    judgePass(stand: number, piece: ReversiPiece, dir: number) {
        let tempPiece = piece;
        tempPiece = this.nearPiece(piece, dir);
        if (tempPiece === null) {
            return false;
        }
        while (tempPiece.color === -stand) {
            tempPiece = this.nearPiece(tempPiece, dir);
            if (tempPiece === null) {
                return false;
            }
            if (tempPiece.color === stand) {
                return true;
            }
        }
        return false;
    }

    changePass(piece: ReversiPiece, dir: number) {
        let tempPiece = this.nearPiece(piece, dir);
        while (tempPiece.color === -this.reversiScene.state) {
            tempPiece.color = piece.color;
            tempPiece = this.nearPiece(tempPiece, dir);
        }
        this.refresh();
    }

    canPlace(color:number,coor:cc.Vec2):boolean {
        for (let dir = 1; dir <= 8; dir++) {
            if (this.judgePass(color, this.getPieceByCoor(coor), dir)) {
                return true;
            }
            if (dir === 8) {
                return false;
            }
        }
    }

    judgeMoveable(stand) {//判断stand是否有可落子的地方
        let tryPiece = null;
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                tryPiece = this.pieceMap[x][y];
                if (tryPiece.color === NONE) {
                    for (let dir = 1; dir <= 8; dir++) {
                        if (this.judgePass(stand, tryPiece, dir)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    judgeWin() {
        let selfMoveAble = this.judgeMoveable(this.lastPiece.color);
        let oppoMoveAble = this.judgeMoveable(-this.lastPiece.color);
        if (!selfMoveAble && !oppoMoveAble) {
            return true;
        } else {
            return false;
        }
    }

    getPieceCount() {
        let blackPieceSum = 0;
        let whitePieceSum = 0;
        for (let x = 0; x < this.pieceMap.length; x++) {
            for (let y = 0; y < this.pieceMap[x].length; y++) {
                if (this.pieceMap[x][y].color === BLACK) {
                    blackPieceSum++;
                } else if (this.pieceMap[x][y].color === WHITE) {
                    whitePieceSum++;
                }
            }
        }
        return { blackPieceSum, whitePieceSum };
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    private removeListeners() {

    }
}
