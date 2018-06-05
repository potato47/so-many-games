import { DIRECTION, PIECE_TYPE } from './SnakeConstants';
import { Piece } from './SnakePiece';
import { SnakeScene } from './SnakeScene';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Board extends cc.Component {
    @property(cc.Float) private frameTime = 0.5;
    @property(cc.Float) private levelRatio = 0.05;
    @property(cc.Prefab) private piecePrefab: cc.Prefab = null;
    @property(cc.Node) private layout: cc.Node = null;

    public isStart = false;
    private pastTime = 0;
    private rowsNum: number = 16;
    private colsNum: number = 16;
    private gridWidth: number = 0;
    private pieceMap: Piece[][];
    private snake: Piece[];
    private moveDir = DIRECTION.RIGHT;
    public level = 0;

    private snakeScene: SnakeScene = null;

    onLoad() {
        this.gridWidth = this.layout.width / this.colsNum;
        this.pieceMap = [];
        for (let x = 0; x < this.colsNum; x++) {
            this.pieceMap[x] = [];
            for (let y = 0; y < this.rowsNum; y++) {
                let pieceNode = cc.instantiate(this.piecePrefab);
                this.layout.addChild(pieceNode);
                pieceNode.width = this.gridWidth;
                pieceNode.height = this.gridWidth;
                pieceNode.x = x * this.gridWidth + pieceNode.width / 2;
                pieceNode.y = y * this.gridWidth + pieceNode.height / 2;
                this.pieceMap[x][y] = pieceNode.getComponent(Piece);
                this.pieceMap[x][y].x = x;
                this.pieceMap[x][y].y = y;
            }
        }

    }

    updateTick() {
        this.unschedule(this.tickHandler);
        let time = this.frameTime - (this.levelRatio * this.level);
        if (time < 0.1) {
            time = 0.1;
        }
        this.schedule(this.tickHandler, time);
    }

    tickHandler() {
        if (this.isStart) {
            this.moveSnake();
        }
    }

    init(snakeScene: SnakeScene) {
        this.snakeScene = snakeScene;
    }

    startGame() {
        this.reset();
        for (let i = 0; i < 10; i++) {
            this.addFood();
        }
        this.isStart = true;
        this.updateTick();
    }

    reset() {
        this.clear();
        this.snake = [];
        this.pieceMap[9][9].init(PIECE_TYPE.SNAKE_HEAD, DIRECTION.RIGHT, DIRECTION.RIGHT);
        this.pieceMap[8][9].init(PIECE_TYPE.SNAKE_BODY, DIRECTION.RIGHT, DIRECTION.RIGHT);
        this.pieceMap[7][9].init(PIECE_TYPE.SNAKE_BODY, DIRECTION.RIGHT, DIRECTION.UP);
        this.pieceMap[7][8].init(PIECE_TYPE.SNAKE_TAIL, DIRECTION.UP, DIRECTION.UP);
        this.snake.push(this.pieceMap[9][9]);
        this.snake.push(this.pieceMap[8][9]);
        this.snake.push(this.pieceMap[7][9]);
        this.snake.push(this.pieceMap[7][8]);
        this.moveDir = DIRECTION.RIGHT;
        this.level = 0;
    }

    addFood() {
        let blankList: Piece[] = [];
        for (let x = 0; x < this.colsNum; x++) {
            for (let y = 0; y < this.rowsNum; y++) {
                if (this.pieceMap[x][y].type === PIECE_TYPE.BLANK) {
                    blankList.push(this.pieceMap[x][y]);
                }
            }
        }
        let randomPiece = blankList[(Math.random() * blankList.length) | 0];
        randomPiece.type = PIECE_TYPE.FOOD;
    }

    clear() {
        for (let x = 0; x < this.colsNum; x++) {
            for (let y = 0; y < this.rowsNum; y++) {
                this.pieceMap[x][y].type = PIECE_TYPE.BLANK;
            }
        }
    }

    updateLevel(level: number) {
        if (level !== this.level) {
            this.level = level;
            this.updateTick();
        }
    }

    turnSnake(dir: DIRECTION) {
        if (this.snake[0].outDir !== -dir) {
            this.moveDir = dir;
        }
    }

    moveSnake() {
        let head = this.snake[0];
        head.inDir = this.snake[1].outDir;
        head.outDir = this.moveDir;
        let nextPiece: Piece;
        switch (head.outDir) {
            case DIRECTION.UP:
                if (head.y === this.rowsNum - 1) {
                    nextPiece = this.pieceMap[head.x][0];
                } else {
                    nextPiece = this.pieceMap[head.x][head.y + 1];
                }
                break;
            case DIRECTION.RIGHT:
                if (head.x === this.colsNum - 1) {
                    nextPiece = this.pieceMap[0][head.y];
                } else {
                    nextPiece = this.pieceMap[head.x + 1][head.y];
                }
                break;
            case DIRECTION.DOWN:
                if (head.y === 0) {
                    nextPiece = this.pieceMap[head.x][this.rowsNum - 1];
                } else {
                    nextPiece = this.pieceMap[head.x][head.y - 1];
                }
                break;
            case DIRECTION.LEFT:
                if (head.x === 0) {
                    nextPiece = this.pieceMap[this.colsNum - 1][head.y];
                } else {
                    nextPiece = this.pieceMap[head.x - 1][head.y];
                }
                break;
        }
        this.moveSnakeToPiece(nextPiece);
    }

    moveSnakeToPiece(nextPiece: Piece) {
        let head = this.snake[0];
        switch (nextPiece.type) {
            case PIECE_TYPE.SNAKE_BODY:
            case PIECE_TYPE.SNAKE_TAIL:
                this.isStart = false;
                this.snakeScene.overGame();
                break;
            case PIECE_TYPE.FOOD:
                nextPiece.init(PIECE_TYPE.SNAKE_HEAD, head.outDir, head.inDir);
                head.init(PIECE_TYPE.SNAKE_BODY, head.outDir, head.inDir);
                this.snake.unshift(nextPiece);
                this.snakeScene.onEatFood();
                break;
            case PIECE_TYPE.BLANK:
                let newSnake = [];
                this.snake.forEach((piece, index) => {
                    switch (piece.type) {
                        case PIECE_TYPE.SNAKE_HEAD:
                            nextPiece.init(PIECE_TYPE.SNAKE_HEAD, piece.outDir, piece.inDir);
                            break;
                        case PIECE_TYPE.SNAKE_BODY:
                            nextPiece.init(PIECE_TYPE.SNAKE_BODY, nextPiece.outDir, piece.outDir);
                            break;
                        case PIECE_TYPE.SNAKE_TAIL:
                            nextPiece.init(PIECE_TYPE.SNAKE_TAIL, nextPiece.outDir, piece.outDir);
                            piece.type = PIECE_TYPE.BLANK;
                            break;
                    }
                    newSnake.push(nextPiece);
                    nextPiece = piece;
                });
                // for (let piece of this.snake) {

                // }
                this.snake = newSnake;
        }
    }

    // update(dt: number) {
    //     if (this.isStart) {
    //         this.pastTime += dt;
    //         if (this.pastTime >= this.frameTime * (this.levelRatio**this.level)) {
    //             this.moveSnake();
    //             this.pastTime = 0;
    //         }
    //     }
    // }
}
