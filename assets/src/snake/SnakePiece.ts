import { PIECE_TYPE, DIRECTION } from "./SnakeConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private picFood: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picSnakeHeadRight: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picSnakeBodyH: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picSnakeJointRight: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picSnakeTailUp: cc.SpriteFrame = null;

    public x = 0;
    public y = 0;
    
    private _type: PIECE_TYPE;
    get type() {
        return this._type;
    }
    set type(value: PIECE_TYPE) {
        this._type = value;
        this.render();
    }

    private _inDir: DIRECTION = DIRECTION.RIGHT;
    get inDir() {
        return this._inDir;
    }
    set inDir(value: DIRECTION) {
        this._inDir = value;
        this.render();
    }

    private _outDir: DIRECTION = DIRECTION.RIGHT;
    get outDir() {
        return this._outDir;
    }
    set outDir(value: DIRECTION) {
        this._outDir = value;
        this.render();
    }

    public init(type: PIECE_TYPE, outDir = DIRECTION.RIGHT, inDir = DIRECTION.RIGHT) {
        this._type = type;
        this._inDir = inDir;
        this._outDir = outDir;
        this.render();
    }

    private render() {
        switch(this.type) {
            case PIECE_TYPE.BLANK:
                this.sprite.spriteFrame = null;
                this.rotateOther();
                break;
            case PIECE_TYPE.FOOD:
                this.sprite.spriteFrame = this.picFood;
                this.rotateOther();
                break;
            case PIECE_TYPE.SNAKE_HEAD:
                this.sprite.spriteFrame = this.picSnakeHeadRight;
                this.rotateHeadByDir(this.outDir);
                break;
            case PIECE_TYPE.SNAKE_BODY:
                if (this.inDir === this.outDir) {
                    this.sprite.spriteFrame = this.picSnakeBodyH;
                    this.rotateBodyByDir(this.outDir);
                } else {
                    this.sprite.spriteFrame = this.picSnakeJointRight;
                    this.rotateJointByDir(this.inDir, this.outDir);
                }
                break;
            case PIECE_TYPE.SNAKE_TAIL:
                this.sprite.spriteFrame = this.picSnakeTailUp;
                this.rotateTailByDir(this.outDir);
                break;
            default:
                cc.error("wrong piece type!");
        }
    }

    private rotateHeadByDir(dir: DIRECTION){
        switch(dir) {
            case DIRECTION.RIGHT:
                this.node.rotation = 0;
                break;
            case DIRECTION.DOWN:
                this.node.rotation = 90;
                break;
            case DIRECTION.LEFT:
                this.node.rotation = 180;
                break;
            case DIRECTION.UP:
                this.node.rotation = 270;
                break;
        }
    }

    private rotateBodyByDir(dir: DIRECTION) {
        switch(dir) {
            case DIRECTION.RIGHT:
                this.node.rotation = 0;
                break;
            case DIRECTION.LEFT:
                this.node.rotation = 180;
                break;
            case DIRECTION.DOWN:
                this.node.rotation = 90;
            case DIRECTION.UP:
                this.node.rotation = 270;
                break;
        }
    }

    private rotateJointByDir(inDir: DIRECTION, outDir: DIRECTION) {
        if(inDir === DIRECTION.UP && outDir === DIRECTION.RIGHT || inDir === DIRECTION.LEFT && outDir === DIRECTION.DOWN) {
            this.node.rotation = 0;
        } else if(inDir === DIRECTION.RIGHT && outDir === DIRECTION.DOWN || inDir === DIRECTION.UP && outDir === DIRECTION.LEFT) {
            this.node.rotation = 90;
        } else if(inDir === DIRECTION.RIGHT && outDir === DIRECTION.UP || inDir === DIRECTION.DOWN && outDir === DIRECTION.LEFT) {
            this.node.rotation = 180;
        } else if(inDir === DIRECTION.DOWN && outDir === DIRECTION.RIGHT || inDir === DIRECTION.LEFT && outDir === DIRECTION.UP) {
            this.node.rotation = 270;
        }
    }

    private rotateTailByDir(dir: DIRECTION) {
        switch(dir) {
            case DIRECTION.UP:
                this.node.rotation = 0;
                break;
            case DIRECTION.RIGHT:
                this.node.rotation = 90;
                break;
            case DIRECTION.DOWN:
                this.node.rotation = 180;
                break;
            case DIRECTION.LEFT:
                this.node.rotation = 270;
                break;
        }
    }

    private rotateOther() {
        this.node.rotation = 0;
    }
}