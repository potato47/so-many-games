import { PIECE_STATE } from "./LinkConstants";

const { ccclass, property } = cc._decorator;

@ccclass
export class Piece extends cc.Component {

    @property(cc.Sprite)
    private sprite: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    private herosAtlas: cc.SpriteAtlas = null;

    public x: number = 0;
    public y: number = 0;
    public type: number = 0;
    public state: PIECE_STATE = PIECE_STATE.IDLE;

    public init(x: number, y: number, type: number, state = PIECE_STATE.IDLE) {
        this.x = x;
        this.y = y;
        this.setType(type);
        this.setState(state);
    }
    
    public setType(type: number) {
        this.type = type;
        if(type === 0) {
            this.sprite.spriteFrame = null;
        } else {
            this.sprite.spriteFrame = this.herosAtlas.getSpriteFrame("hero_" + type);
        }
    }

    public setState(state: PIECE_STATE) {
        if(state === this.state) {
            return;
        }
        this.state = state;
        if (state === PIECE_STATE.IDLE) {
            this.node.color = cc.Color.WHITE;
        } else if(state === PIECE_STATE.PRESS) {
            this.node.color = cc.Color.GRAY;
        }
    }

}