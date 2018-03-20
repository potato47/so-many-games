import { Piece } from "./TetrisPiece";
import { TetrisScene } from "./TetrisScene";

const { ccclass, property } = cc._decorator;

@ccclass
export class Board extends cc.Component {

    @property(cc.Integer)
    private colsNum: number = 0;
    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;
    @property(cc.Float)
    private frameTime: number = 1;

    private tetrisScene: TetrisScene;
    private isStart: boolean = false;
    private pastTime: number = 0;
    private rowsNum: number = 0;
    private gridWidth: number = 0;
    private pieceMap: Piece[][];
    private arena: number[][];
    private player = {
        pos: cc.v2(0, 0),
        matrix: null,
        score: 0,
    };
    private nextBlock: string = "囧";


    onLoad() {
        this.gridWidth = this.node.width / this.colsNum;
        // this.rowsNum = this.node.height / this.gridWidth | 0;
        this.rowsNum = cc.director.getVisibleSize().height / this.gridWidth | 0;
        this.pieceMap = [];
        for (let y = 0; y < this.rowsNum; y++) {
            this.pieceMap[y] = [];
            for (let x = 0; x < this.colsNum; x++) {
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.node.addChild(pieceNode);
                pieceNode.width = this.gridWidth;
                pieceNode.height = this.gridWidth;
                pieceNode.x = x * this.gridWidth + pieceNode.width / 2;
                pieceNode.y = y * this.gridWidth + pieceNode.height / 2;
                this.pieceMap[y][x] = pieceNode.getComponent(Piece);
            }
        }
    }

    init(tetrisScene: TetrisScene) {
        this.tetrisScene = tetrisScene;
    }

    reset() {
        this.arena = this.createMatrix(this.colsNum, this.rowsNum);
        this.playerReset();
        this.clear();
        this.draw();
        this.isStart = true;
    }

    stop() {
        this.isStart = false;
    }

    private clear() {
        for (let y = 0; y < this.rowsNum; y++) {
            for (let x = 0; x < this.colsNum; x++) {
                this.pieceMap[y][x].hide();
            }
        }
    }

    private createMatrix(w: number, h: number) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    private drawMatrix(matrix: number[][], offset: cc.Vec2) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.pieceMap[y + offset.y][x + offset.x].show();
                }
            });
        });
    }

    private draw() {
        this.clear();
        this.drawMatrix(this.arena, cc.v2(0, 0));
        this.drawMatrix(this.player.matrix, this.player.pos);
    }

    playerReset() {
        this.player.matrix = this.createBlock(this.nextBlock);
        this.player.pos.y = this.rowsNum - this.player.matrix.length;
        this.player.pos.x = (this.arena[0].length / 2 | 0) -
        (this.player.matrix[0].length / 2 | 0);
        if (this.collide()) {
            // this.arena.forEach(row => row.fill(0));
            this.tetrisScene.stopGame(this.player.score);
            // this.player.score = 0;
        }
        if(Math.random()<0.01) {
            this.nextBlock = "囧";
        }else{
            const blocks = 'TJLOSZIX';
            this.nextBlock = blocks[blocks.length * Math.random() | 0];
        }
        this.tetrisScene.updateHint(this.nextBlock);
    }

    playerDrop() {
        this.player.pos.y--;
        if (this.collide()) {
            this.player.pos.y++;
            this.merge();
            this.playerReset();
            this.arenaSweep();
            this.tetrisScene.updateScore(this.player.score);
        }
        this.draw();
    }

    playerMove(offset: number) {
        this.player.pos.x += offset;
        if (this.collide()) {
            this.player.pos.x -= offset;
        }
        this.draw();
    }

    playerRotate(dir: number) {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        while (this.collide()) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix.length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
        this.draw();
    }

    arenaSweep() {
        let rowCount = 1;
        outer: for (let y = 0; y < this.arena[0].length - 1; y++) {
            for (let x = 0; x < this.arena.length; x++) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.arena.splice(y, 1)[0].fill(0);
            this.arena.push(row);
            y++;

            this.player.score += rowCount * 10;
            rowCount *= 2;
        }
    }

    collide(): boolean {
        const m = this.player.matrix;
        const o = this.player.pos;
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x] !== 0 &&
                    (this.arena[y + o.y] &&
                        this.arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    merge() {
        this.player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.arena[y + this.player.pos.y][x + this.player.pos.x] = value;
                }
            });
        });
    }

    rotate(matrix: number[][], dir: number) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                        matrix[y][x],
                        matrix[x][y],
                    ];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    private createBlock(type: string): number[][] {
        if (type === 'I') {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];
        } else if (type === 'L') {
            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];
        } else if (type === 'J') {
            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];
        } else if (type === 'O') {
            return [
                [4, 4],
                [4, 4],
            ];
        } else if (type === 'Z') {
            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];
        } else if (type === 'S') {
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        } else if (type === 'T') {
            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];
        } else if( type === 'X') {
            return [
                [1,0,1],
                [0,1,0],
                [1,0,1],
            ]
        } else if (type === '囧') {
            return [
                [1,1,1,1,1,1,1],
                [1,0,1,0,1,0,1],
                [1,1,0,0,0,1,1],
                [1,0,0,0,0,0,1],
                [1,0,1,1,1,0,1],
                [1,0,1,0,1,0,1],
                [1,1,1,1,1,1,1],
            ].reverse();
        }
    }

    update(dt: number) {
        if (this.isStart) {
            this.pastTime += dt;
            if (this.pastTime >= this.frameTime) {
                this.playerDrop();
                this.pastTime = 0;
            }
        }
    }

}