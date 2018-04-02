import { PIECE_STATE, PIECE_TYPE, PIECE_HINT } from "./MineConstans";

const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property(cc.Sprite)
    private pieceSprite: cc.Sprite = null;
    @property(cc.SpriteFrame)
    private picPending: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picFlag: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picDeath: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen0: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen2: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen3: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen4: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen5: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen6: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen7: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private picOpen8: cc.SpriteFrame = null;

    public x: number = 0;
    public y: number = 0;
    private _state = PIECE_STATE.PENDING;

    public get state(): PIECE_STATE {
        return this._state;
    }

    public set state(value: PIECE_STATE) {
        this._state = value;
        switch (this.state) {
            case PIECE_STATE.PENDING:
                this.pieceSprite.spriteFrame = this.picPending;
                break;
            case PIECE_STATE.FLAG:
                this.pieceSprite.spriteFrame = this.picFlag;
                break;
            case PIECE_STATE.OPEN:
                this.setSpriteByType();
                break;
            default:
                cc.error("unknown state!");
                break;
        }
    }

    private setSpriteByType() {
        switch (this.type) {
            case PIECE_TYPE.OPEN0:
                this.pieceSprite.spriteFrame = this.picOpen0;
                break;
            case PIECE_TYPE.OPEN1:
                this.pieceSprite.spriteFrame = this.picOpen1;
                break;
            case PIECE_TYPE.OPEN2:
                this.pieceSprite.spriteFrame = this.picOpen2;
                break;
            case PIECE_TYPE.OPEN3:
                this.pieceSprite.spriteFrame = this.picOpen3;
                break;
            case PIECE_TYPE.OPEN4:
                this.pieceSprite.spriteFrame = this.picOpen4;
                break;
            case PIECE_TYPE.OPEN5:
                this.pieceSprite.spriteFrame = this.picOpen5;
                break;
            case PIECE_TYPE.OPEN6:
                this.pieceSprite.spriteFrame = this.picOpen6;
                break;
            case PIECE_TYPE.OPEN7:
                this.pieceSprite.spriteFrame = this.picOpen7;
                break;
            case PIECE_TYPE.OPEN8:
                this.pieceSprite.spriteFrame = this.picOpen8;
                break;
            case PIECE_TYPE.BOMB:
                this.pieceSprite.spriteFrame = this.picDeath;
        }
    }

    private _type = PIECE_TYPE.OPEN0;

    public get type() {
        return this._type;
    }
    public set type(value:PIECE_TYPE) {
        this._type = value;
        this.setSpriteByType();
    }

    init(x: number, y: number, type: PIECE_TYPE, state: PIECE_STATE) {
        this.x = x;
        this.y = y;
        this.state = state;
        this.type = type;
    }

}