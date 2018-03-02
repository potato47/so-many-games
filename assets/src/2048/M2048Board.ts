import { M2048Piece } from "./M2048Piece";
import { M2048Scene } from "./M2048Scene";
import { DIR } from "./M2048Constants";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export class M2048Board extends cc.Component {
    @property(cc.Integer)
    private colsSum: number = 4;
    @property(cc.Integer)
    private rowsSum: number = 4;
    @property(cc.Graphics)
    private graphics: cc.Graphics = null; // 用来画棋盘
    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null; // 画不了文字，只能用prefab了
    @property(cc.Node)
    private pieceLayer: cc.Node = null;

    private tileWidth: number = 0; // 一个方块的宽度
    private startX: number = 0; // 棋盘左下角
    private startY: number = 0;
    private boardWidth: number = 0; // 棋盘节点宽高
    private boardHeight: number = 0;
    public pieceMap: Array<Array<M2048Piece>>;

    private m2048Scene: M2048Scene = null;

    protected onLoad() {
        this.tileWidth = this.node.width / (this.colsSum + 1);
        this.startX = this.tileWidth / 2;
        this.startY = this.tileWidth / 2;
        this.boardWidth = this.tileWidth * this.colsSum;
        this.boardHeight = this.tileWidth * this.rowsSum;
        this.graphics.clear();
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
        // 初始化数字位置
        this.pieceLayer.removeAllChildren();
        this.pieceMap = [];
        for (let x = 0; x < this.colsSum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.rowsSum; y++) {
                let piece = cc.instantiate(this.piecePrefab).getComponent(M2048Piece);
                piece.node.parent = this.pieceLayer;
                piece.node.x = this.startX + x * this.tileWidth + this.tileWidth / 2;
                piece.node.y = this.startY + y * this.tileWidth + this.tileWidth / 2;
                this.pieceMap[x][y] = piece;
                piece.init(x, x, 0);
            }
        }
    }

    public init(m2048Scene: M2048Scene) {
        this.m2048Scene = m2048Scene;
        this.reset();
        this.addListeners();
    }

    public reset() {
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                this.pieceMap[x][y].n = 0;
            }
        }
        for (let i = 0; i < 2; i++) {
            this.newPiece();
        }
    }

    newPiece() {
        let zeroPieces = [];
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                if (this.pieceMap[x][y].n === 0) {
                    zeroPieces.push(this.pieceMap[x][y]);
                }
            }
        }
        let n = Math.floor(Math.random() * zeroPieces.length);
        zeroPieces[n].randomNumber();
    }

    judgeOver(): boolean {
        for (let y = 0; y < this.rowsSum; y++) {
            for (let x = 0; x < this.colsSum; x++) {
                if (this.pieceMap[x][y].n === 0) {
                    return false;
                }
                if (x <= this.colsSum - 2 && this.pieceMap[x][y].n === this.pieceMap[x + 1][y].n) {
                    return false;
                }
                if (y <= this.rowsSum - 2 && this.pieceMap[x][y].n === this.pieceMap[x][y + 1].n) {
                    return false;
                }
            }
        }
        return true;
    }

    getMaxNLabel(): string {
        let max = 2;
        let str = "2";
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                if (this.pieceMap[x][y].n > max) {
                    max = this.pieceMap[x][y].n;
                    str = this.pieceMap[x][y].nLabel.string;
                }
            }
        }
        return str;
    }

    slideLeft(): boolean {
        //左滑F
        //合并
        let isMove = false;
        for (let y = 0; y < this.rowsSum; y++) {
            for (let x = 0; x < this.colsSum; x++) {
                if (this.pieceMap[x][y].n === 0) {
                    continue;
                }
                for (let x0 = x + 1; x0 < this.colsSum; x0++) {
                    if (this.pieceMap[x0][y].n === 0) {
                        continue;
                    } else if (this.pieceMap[x][y].n === this.pieceMap[x0][y].n) {
                        this.pieceMap[x][y].n *= 2;
                        this.pieceMap[x0][y].n = 0;
                        isMove = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        //移动
        for (let y = 0; y < this.rowsSum; y++) {
            for (let x = 0; x < this.colsSum; x++) {
                if (this.pieceMap[x][y].n !== 0) {
                    continue;
                }
                for (let x0 = x + 1; x0 < this.rowsSum; x0++) {
                    if (this.pieceMap[x0][y].n === 0) {
                        continue;
                    } else {
                        this.pieceMap[x][y].n = this.pieceMap[x0][y].n;
                        this.pieceMap[x0][y].n = 0;
                        isMove = true;
                        break;
                    }
                }
            }
        }
        if (isMove) {
            this.newPiece();
        }
        return isMove;
    }

    slideRight(): boolean {
        //右滑
        //合并
        let isMove = false; //判断是否有tile移动
        for (let y = 0; y < this.rowsSum; y++) {
            for (let x = this.colsSum - 1; x >= 0; x--) {
                if (this.pieceMap[x][y].n === 0) {
                    continue;
                }
                for (let x0 = x - 1; x0 >= 0; x0--) {
                    if (this.pieceMap[x0][y].n === 0) {
                        continue;
                    } else if (this.pieceMap[x][y].n === this.pieceMap[x0][y].n) {
                        this.pieceMap[x][y].n = this.pieceMap[x][y].n * 2;
                        this.pieceMap[x0][y].n = 0;
                        isMove = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        //移动
        for (let y = 0; y < this.rowsSum; y++) {
            for (let x = this.colsSum - 1; x >= 0; x--) {
                if (this.pieceMap[x][y].n !== 0) {
                    continue;
                }
                for (let x0 = x - 1; x0 >= 0; x0--) {
                    if (this.pieceMap[x0][y].n === 0) {
                        continue;
                    } else {
                        this.pieceMap[x][y].n = this.pieceMap[x0][y].n;
                        this.pieceMap[x0][y].n = 0;
                        isMove = true;
                        break;
                    }
                }
            }
        }
        //有tile移动才添加新的tile
        if (isMove) {
            this.newPiece();
        }
        return isMove;
    }

    slideDown(): boolean {
        //下滑
        //合并
        let isMove = false;
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                if (this.pieceMap[x][y].n === 0) {
                    continue;
                }
                for (let y0 = y + 1; y0 < 4; y0++) {
                    if (this.pieceMap[x][y0].n === 0) {
                        continue;
                    } else if (this.pieceMap[x][y].n === this.pieceMap[x][y0].n) {
                        this.pieceMap[x][y].n = this.pieceMap[x][y].n * 2;
                        this.pieceMap[x][y0].n = 0;
                        isMove = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        //移动
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = 0; y < this.rowsSum; y++) {
                if (this.pieceMap[x][y].n !== 0) {
                    continue;
                }
                for (let y0 = y + 1; y0 < this.rowsSum; y0++) {
                    if (this.pieceMap[x][y0].n === 0) {
                        continue;
                    } else {
                        this.pieceMap[x][y].n = this.pieceMap[x][y0].n;
                        this.pieceMap[x][y0].n = 0;
                        isMove = true;
                        break;
                    }
                }
            }
        }
        if (isMove) {
            this.newPiece();
        }
        return isMove;
    }

    slideUp(): boolean {
        //上滑
        //合并
        let isMove = false;
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = this.rowsSum - 1; y >= 0; y--) {
                if (this.pieceMap[x][y].n === 0) {
                    continue;
                }
                for (let y0 = y - 1; y0 >= 0; y0--) {
                    if (this.pieceMap[x][y0].n === 0) {
                        continue;
                    } else if (this.pieceMap[x][y].n === this.pieceMap[x][y0].n) {
                        this.pieceMap[x][y].n = this.pieceMap[x][y].n * 2;
                        this.pieceMap[x][y0].n = 0;
                        isMove = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
        //移动
        for (let x = 0; x < this.colsSum; x++) {
            for (let y = this.rowsSum - 1; y >= 0; y--) {
                if (this.pieceMap[x][y].n != 0) {
                    continue;
                }
                for (let y0 = y - 1; y0 >= 0; y0--) {
                    if (this.pieceMap[x][y0].n == 0) {
                        continue;
                    } else {
                        this.pieceMap[x][y].n = this.pieceMap[x][y0].n;
                        this.pieceMap[x][y0].n = 0;
                        isMove = true;
                        break;
                    }
                }
            }
        }
        if (isMove) {
            this.newPiece();
        }
        return isMove;
    }

    private onTouched(event: cc.Event.EventTouch) {
        let startPos = event.getStartLocation();
        let endPos = event.getLocation();
        let offsetX = endPos.x - startPos.x;
        let offsetY = endPos.y - startPos.y;
        if (Math.abs(offsetX) > Math.abs(offsetY)) {
            if (offsetX > 40) {
                this.m2048Scene.onBoardSlid(DIR.RIGHT);
            } else if (offsetX < -40) {
                this.m2048Scene.onBoardSlid(DIR.LEFT);
            }
        } else {
            if (offsetY > 40) {
                this.m2048Scene.onBoardSlid(DIR.UP);
            } else if (offsetY < -40) {
                this.m2048Scene.onBoardSlid(DIR.DOWN);
            }
        }
    }

    private onKey(event) {
        switch (event.keyCode) {
            case cc.KEY.up:
            case cc.KEY.w:
                this.m2048Scene.onBoardSlid(DIR.UP);
                break;
            case cc.KEY.down:
            case cc.KEY.s:
                this.m2048Scene.onBoardSlid(DIR.DOWN);
                break;
            case cc.KEY.left:
            case cc.KEY.a:
                this.m2048Scene.onBoardSlid(DIR.LEFT);
                break;
            case cc.KEY.right:
            case cc.KEY.d:
                this.m2048Scene.onBoardSlid(DIR.RIGHT);
                break;
        }
    }

    private addListeners() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouched, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKey, this);
    }

    private removeListeners() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKey, this);
    }
}
