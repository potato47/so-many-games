import { Piece } from "./MinePiece";
import { PIECE_TYPE, PIECE_STATE } from "./MineConstans";
import { MineScene } from "./MineScene";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export class Board extends cc.Component {

    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Integer)
    private colNum: number = 9;
    @property(cc.Integer)
    private colSpace: number = 9;
    @property(cc.Float)
    private pressTime: number = 1;

    private colWidth: number = 80;
    private pieceMap: Array<Array<Piece>>;
    private touchingPiece: Piece = null;
    private touchStartTime = 0;
    private bombNum = 0;
    private flagNum = 0;
    private mineScene: MineScene = null;

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
                this.pieceMap[x][y] = pieceNode.getComponent(Piece);
                this.pieceMap[x][y].init(x, y, PIECE_TYPE.OPEN0, PIECE_STATE.OPEN);
                pieceNode.on(cc.Node.EventType.TOUCH_START, () => {
                    this.onPieceTouchStart(this.pieceMap[x][y]);
                }, this);
                pieceNode.on(cc.Node.EventType.TOUCH_END, () => {
                    this.onPieceTouchEnd(this.pieceMap[x][y]);
                }, this);
            }
        }
    }

    public init(mineScene: MineScene) {
        this.mineScene = mineScene;
    }

    private onPieceTouchStart(piece: Piece) {
        this.touchStartTime = new Date().getTime();
        this.touchingPiece = piece;
    }

    private onPieceTouchEnd(piece: Piece) {
        let touchEndTime = new Date().getTime();
        if (touchEndTime - this.touchStartTime > this.pressTime * 1000) {
            this.mineScene.onPressPiece(piece);
        } else {
            this.mineScene.onClickPiece(piece);
        }
    }

    public openPiece(piece: Piece) {
        if (piece.state === PIECE_STATE.PENDING) {
            if (piece.type === PIECE_TYPE.BOMB) {
                piece.state = PIECE_STATE.OPEN;
                this.showAll();
                this.mineScene.overGame(false);
            } else {
                this.showBlank(piece);
                this.judgeWin();
            }
        }
    }

    public flagPiece(piece: Piece) {
        if (piece.state === PIECE_STATE.PENDING) {
            piece.state = PIECE_STATE.FLAG;
            this.flagNum--;
            if (this.flagNum === 0) {
                let isWin = this.showRest();
                this.mineScene.overGame(isWin);
            }
        } else if (piece.state === PIECE_STATE.FLAG) {
            piece.state = PIECE_STATE.PENDING;
            this.flagNum++;
        }
    }

    public getBombNum() {
        return this.bombNum;
    }

    public getFlagNum() {
        return this.flagNum;
    }

    public getMaxLevel() {
        return this.colNum * this.colNum - 1;
    }

    private judgeWin() {
        let openNum = 0;
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                if (this.pieceMap[x][y].state === PIECE_STATE.OPEN) {
                    openNum++;
                }
            }
        }
        if (openNum === this.colNum ** 2 - this.bombNum) {
            this.mineScene.overGame(true);
        }
    }

    public reset(level: number) {
        this.resetBlank();
        this.resetBombs(level);
        this.resetHintsAndMask();
    }

    private resetBlank() {
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                this.pieceMap[x][y].type = PIECE_TYPE.OPEN0;
            }
        }
    }

    private resetBombs(bombNum: number) {
        this.bombNum = bombNum;
        this.flagNum = bombNum;
        let pieceMapIndex = [];
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                pieceMapIndex.push({ x: x, y: y });
            }
        }
        for (let n = 0; n < bombNum; n++) {
            let i = Math.random() * pieceMapIndex.length | 0;
            let piecePos = pieceMapIndex[i];
            cc.log(piecePos);
            this.pieceMap[piecePos.x][piecePos.y].type = PIECE_TYPE.BOMB;
            pieceMapIndex.splice(i, 1);
        }
    }

    private resetHintsAndMask() {
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                if (this.pieceMap[x][y].type !== PIECE_TYPE.BOMB) {
                    let roundPieces = this.getRoundPieces(x, y);
                    let roundBombs = 0;
                    roundPieces.forEach((piece) => {
                        if (piece.type === PIECE_TYPE.BOMB) {
                            roundBombs++;
                        }
                    });
                    this.pieceMap[x][y].type = roundBombs;
                }
                this.pieceMap[x][y].state = PIECE_STATE.PENDING;
            }
        }
    }

    private getRoundPieces(x, y): Array<Piece> {
        let roundPieces: Piece[] = [];
        // left
        if (x >= 1) {
            roundPieces.push(this.pieceMap[x - 1][y]);
        }
        // left top
        if (x >= 1 && y <= this.colNum - 2) {
            roundPieces.push(this.pieceMap[x - 1][y + 1]);
        }
        // top
        if (y <= this.colNum - 2) {
            roundPieces.push(this.pieceMap[x][y + 1]);
        }
        // right top
        if (x <= this.colNum - 2 && y <= this.colNum - 2) {
            roundPieces.push(this.pieceMap[x + 1][y + 1]);
        }
        // right
        if (x <= this.colNum - 2) {
            roundPieces.push(this.pieceMap[x + 1][y]);
        }
        // right bottom
        if (x <= this.colNum - 2 && y >= 1) {
            roundPieces.push(this.pieceMap[x + 1][y - 1]);
        }
        // bottom
        if (y >= 1) {
            roundPieces.push(this.pieceMap[x][y - 1]);
        }
        // left bottom
        if (x >= 1 && y >= 1) {
            roundPieces.push(this.pieceMap[x - 1][y - 1]);
        }
        return roundPieces;
    }

    private showBlank(piece: Piece) {
        let testPieces: Array<Piece> = [piece];
        while (testPieces.length > 0) {
            let testPiece = testPieces.pop();
            if (testPiece.type === PIECE_TYPE.OPEN0) {
                testPiece.state = PIECE_STATE.OPEN;
                let roundPieces = this.getRoundPieces(testPiece.x, testPiece.y);
                roundPieces.forEach(p => {
                    if (p.state === PIECE_STATE.PENDING) {
                        testPieces.push(p);
                    }
                });
            } else if (testPiece.type >= PIECE_TYPE.OPEN1 && testPiece.type <= PIECE_TYPE.OPEN8) {
                testPiece.state = PIECE_STATE.OPEN;
            }
        }
    }

    // 失败后显示全部格子
    private showAll() {
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                this.pieceMap[x][y].state = PIECE_STATE.OPEN;
            }
        }
    }

    // 旗子插满后显示其他没有插旗的地方
    private showRest(): boolean {
        let isWin = true;
        for (let x = 0; x < this.colNum; x++) {
            for (let y = 0; y < this.colNum; y++) {
                if (this.pieceMap[x][y].state === PIECE_STATE.PENDING) {
                    this.pieceMap[x][y].state = PIECE_STATE.OPEN;
                    if (this.pieceMap[x][y].type === PIECE_TYPE.BOMB) {
                        isWin = false;
                    }
                }
            }
        }
        return isWin;
    }
}