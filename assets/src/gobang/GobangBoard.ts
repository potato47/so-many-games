import { GobangScene } from "./GobangScene";
import { NONE, BLACK, WHITE } from "./GobangConstants";
import { GobangPiece } from "./GobangPiece";

const { ccclass, property } = cc._decorator;

@ccclass
export class GobangBoard extends cc.Component {

    @property(cc.Integer)
    private colsSum: number = 15;
    @property(cc.Integer)
    private rowsSum: number = 15;
    @property(cc.Graphics)
    private graphics: cc.Graphics = null; // 用来画棋盘棋子
    @property(cc.Graphics)
    private graphics2: cc.Graphics = null; // 用来画上层UI

    private tileWidth: number = 0; // 一个方块的宽度
    private startX: number = 0; // 棋盘左下角
    private startY: number = 0;
    private boardWidth: number = 0; // 棋盘节点宽高
    private boardHeight: number = 0;
    public pieceMap: Array<Array<GobangPiece>>;
    public lastPiece: GobangPiece = null;

    private gobangScene: GobangScene = null;

    public init(gobangScene: GobangScene) {
        this.gobangScene = gobangScene;

        this.tileWidth = this.node.width / this.colsSum;
        this.startX = this.tileWidth / 2;
        this.startY = this.tileWidth / 2;
        this.boardWidth = this.tileWidth * (this.colsSum - 1);
        this.boardHeight = this.tileWidth * (this.rowsSum - 1);
        this.reset();

        this.addListeners();
    }

    public reset() {
        this.graphics.clear();
        this.graphics2.clear();
        // 画棋盘
        this.graphics.strokeColor = cc.Color.BLACK;
        for (let x = 0; x < this.colsSum; x++) {
            this.graphics.moveTo(this.startX + x * this.tileWidth, this.startY);
            this.graphics.lineTo(this.startX + x * this.tileWidth, this.startY + this.boardHeight);
            this.graphics.stroke();
        }
        for (let y = 0; y < this.rowsSum; y++) {
            this.graphics.moveTo(this.startX, this.startY + y * this.tileWidth);
            this.graphics.lineTo(this.startX + this.boardWidth, this.startY + y * this.tileWidth);
            this.graphics.stroke();
        }
        // 中心点
        this.graphics.strokeColor = cc.Color.RED;
        this.graphics.fillColor = cc.Color.RED;
        let centerCol = Math.floor(this.colsSum / 2);
        let centerRow = Math.floor(this.rowsSum / 2);
        this.graphics.circle(this.startX + centerCol * this.tileWidth, this.startY + centerRow * this.tileWidth, 5);
        this.graphics.fill();

        this.pieceMap = [];
        for (let y = 0; y < this.rowsSum; y++) {
            this.pieceMap[y] = [];
            for (let x = 0; x < this.colsSum; x++) {
                this.pieceMap[y][x] = new GobangPiece(x, y, NONE);
            }
        }
    }

    private drawLastPieceRect() {
        this.graphics2.clear();
        if (this.lastPiece) {
            this.graphics2.strokeColor = cc.Color.RED;
            this.graphics2.rect(this.startX + this.tileWidth * this.lastPiece.x - this.tileWidth / 2,
                this.startY + this.tileWidth * this.lastPiece.y - this.tileWidth / 2,
                this.tileWidth, this.tileWidth);
            this.graphics2.stroke();
        }
    }

    public placeBlack(coor: cc.Vec2) {
        this.graphics.strokeColor = cc.Color.BLACK;
        this.graphics.fillColor = cc.Color.BLACK;
        this.graphics.circle(this.startX + coor.x * this.tileWidth, this.startY + coor.y * this.tileWidth, this.tileWidth * 0.45);
        this.graphics.fill();
        this.pieceMap[coor.x][coor.y] = new GobangPiece(coor.x, coor.y, BLACK);
        this.lastPiece = this.pieceMap[coor.x][coor.y];
        this.drawLastPieceRect();
    }

    public placeWhite(coor: cc.Vec2) {
        this.graphics.strokeColor = cc.Color.WHITE;
        this.graphics.fillColor = cc.Color.WHITE;
        this.graphics.circle(this.startX + coor.x * this.tileWidth, this.startY + coor.y * this.tileWidth, this.tileWidth * 0.45);
        this.graphics.fill();
        this.pieceMap[coor.x][coor.y] = new GobangPiece(coor.x, coor.y, WHITE);
        this.lastPiece = this.pieceMap[coor.x][coor.y];
        this.drawLastPieceRect();
    }

    public getPieceByCoor(coor: cc.Vec2): GobangPiece {
        return this.pieceMap[coor.x][coor.y];
    }

    private onTouched(event: cc.Event.EventTouch) {
        let localPos = this.node.convertToNodeSpaceAR(event.getLocation());
        let coor = this.getCoorByPos(localPos);
        this.gobangScene.onBoardTouched(coor);
    }

    private getCoorByPos(pos: cc.Vec2): cc.Vec2 {
        let touchCol = Math.round((pos.x - this.startX) / this.tileWidth);
        let touchRow = Math.round((pos.y - this.startY) / this.tileWidth);
        return cc.v2(touchCol, touchRow);
    }

    public judgeWin(): boolean {
        //判断横向
        let fiveCount = 0;
        for (let x = 0; x < this.colsSum; x++) {
            if (this.pieceMap[x][this.lastPiece.y].color === this.lastPiece.color) {
                fiveCount++;
                if (fiveCount === 5) {
                    return true;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断纵向
        fiveCount = 0;
        for (let y = 0; y < this.rowsSum; y++) {
            if (this.pieceMap[this.lastPiece.x][y].color === this.lastPiece.color) {
                fiveCount++;
                if (fiveCount == 5) {
                    return true;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断右上斜向
        let f = this.lastPiece.y - this.lastPiece.x;
        fiveCount = 0;
        for (let x = 0; x < this.colsSum; x++) {
            if (f + x < 0 || f + x >= this.rowsSum) {
                continue;
            }
            if (this.pieceMap[x][f + x].color === this.lastPiece.color) {
                fiveCount++;
                if (fiveCount == 5) {
                    return true;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断右下斜向
        f = this.lastPiece.y + this.lastPiece.x;
        fiveCount = 0;
        for (let x = 0; x < 15; x++) {
            if (f - x < 0 || f - x >= this.rowsSum) {
                continue;
            }
            if (this.pieceMap[x][f - x].color === this.lastPiece.color) {
                fiveCount++;
                if (fiveCount == 5) {
                    return true;
                }
            } else {
                fiveCount = 0;
            }
        }
        return false;
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
    }

    private removeListeners() {

    }
}