import { Piece } from "./TetrisPiece";

const { ccclass, property } = cc._decorator;

@ccclass
export class Board extends cc.Component {

    @property(cc.Integer)
    private colsNum: number = 0;
    @property(cc.Float)
    private updateInterval: number = 0.5;
    @property(cc.Prefab)
    private piecePrefab: cc.Prefab = null;

    private rowsNum: number = 0;
    private gridWidth: number = 0;
    private pieceMap: Piece[][];

    onLoad() {
        this.gridWidth = this.node.width / this.colsNum;
        this.rowsNum = this.node.height / this.gridWidth | 0;
        this.pieceMap = [];
        for (let x = 0; x < this.colsNum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.rowsNum; y++) {
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.node.addChild(pieceNode);
                pieceNode.width = this.gridWidth;
                pieceNode.height = this.gridWidth;
                pieceNode.x = x * this.gridWidth + pieceNode.width / 2;
                pieceNode.y = y * this.gridWidth + pieceNode.height / 2;
            }
        }
    }

    start() {

        this.schedule(this.customUpdate, this.updateInterval);
    }

    private reset() {
        for (let x = 0; x < this.colsNum; x++) {
            for (let y = 0; y < this.rowsNum; y++) {
                this.pieceMap[x][y].hide();
            }
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
        }
    }

    private drawMatrix(matrix: number[][], offset: cc.Vec2) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.pieceMap[x + offset.x][y + offset.y].show();
                }
            });
        });
    }

    customUpdate() {

    }

}