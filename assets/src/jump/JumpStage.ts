import { Block } from "./JumpBlock";
import { Player } from "./JumpPlayer";
import { JumpScene } from "./JumpScene";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
// @executeInEditMode
export class Stage extends cc.Component {

    @property(Player)
    private player: Player = null;
    @property(cc.Node)
    private groundLayer: cc.Node = null;
    @property(cc.Integer)
    private gridNum: number = 20;
    @property(cc.Graphics)
    private g: cc.Graphics = null;
    @property(cc.Integer)
    private minBlockSpace: number = 1;//两个block最小间距
    @property(cc.Integer)
    private maxBlockSpace: number = 10;
    @property(cc.Integer)
    private minBlockLength: number = 1;
    @property(cc.Integer)
    private maxBlockLength: number = 7;
    @property(cc.Float)
    private cameraMoveDuration: number = 1;
    @property(cc.Node)
    private endScene: cc.Node = null;

    private jumpScene: JumpScene = null;
    private gridWidth: number = 32;
    private groundOrigin: cc.Vec2 = cc.v2();
    private offset: number = 0;
    private currBlock: Block = null;// 同一屏只出现两个block，玩家站的是这个
    private nextBlock: Block = null;

    private playerIndex: number = null;
    private animState: cc.AnimationState = null;
    private isMovingStage: boolean = false;

    onLoad() {
        this.gridWidth = Math.floor(this.groundLayer.width / this.gridNum);
        this.groundOrigin = this.groundLayer.position;
    }

    public init(jumpScene: JumpScene) {
        this.jumpScene = jumpScene;
    }

    public showStartStory(cb, cbTarget) {
        this.g.clear();
        this.drawBlock(new Block(0, 5));
        this.drawBlock(new Block(9, 5));
        let anim = this.getComponent(cc.Animation);
        anim.once("finished", () => {
            cb();
        }, cbTarget);
        this.animState = anim.play("start");
    }

    public startGame() {
        this.reset();
    }

    public endGame(cb, cbTarget) {
        this.g.clear();
        this.scheduleOnce(() => {
            this.endScene.active = true;
        }, 5);
        this.scheduleOnce(() => {
            this.player.node.getChildByName("name").getComponent(cc.Label).string = "";
        }, 10);
        this.scheduleOnce(() => {
            this.player.node.children.forEach((child) => {
                child.color = cc.hexToColor("#58D639");
                let streak = this.player.getComponent(cc.MotionStreak);
                streak.color = cc.hexToColor("#58D639");
            });
        }, 15);
        this.scheduleOnce(() => {
            this.player.readyJump();
        }, 20);
        this.scheduleOnce(() => {
            let far = cc.v2(this.player.node.x - 1000, this.player.node.y);
            this.player.jumpTo(far, cb, cbTarget);
        }, 25);

    }

    public reset() {
        this.groundLayer.position = this.groundOrigin;
        this.g.clear();
        this.currBlock = new Block(0, 5);
        this.nextBlock = new Block(9, 5);
        this.drawBlock(this.currBlock);
        this.drawBlock(this.nextBlock);
        let center = this.currBlock.head + Math.floor(this.currBlock.length / 2);
        this.playerIndex = center;
        this.player.node.position = cc.v2(center * this.gridWidth + this.gridWidth / 2, 0);
        this.isMovingStage = false;
    }

    private drawBlock(block: Block) {
        this.g.rect(block.head * this.gridWidth, - this.gridWidth, this.gridWidth * block.length,this.gridWidth);
        this.g.fill();
    }

    public addNewBlock() {
        let cb = () => {
            this.currBlock = this.nextBlock;
            let space = Math.floor(this.minBlockSpace + Math.random() * (this.maxBlockSpace - this.minBlockSpace));
            let head = this.currBlock.head + this.currBlock.length + space;
            let length = Math.floor(this.minBlockLength + Math.random() * (this.maxBlockLength - this.minBlockLength));
            this.nextBlock = new Block(head, length);
            this.drawBlock(this.nextBlock);
        }
        this.moveStage(cb, this);
    }

    private moveStage(cb: Function, target: any) {
        this.isMovingStage = true;
        let moveLength = (this.nextBlock.head - this.currBlock.head) * this.gridWidth;
        let moveAction = cc.moveBy(this.cameraMoveDuration, -moveLength, 0);
        let action = cc.sequence(moveAction, cc.callFunc(() => {
            this.isMovingStage = false;
            cb();
        }, target));
        this.groundLayer.runAction(action);
    }

    private canReadyJump() {
        return !this.isMovingStage && this.player.speed === 0;
    }

    public playerReadyJump() {
        if (this.canReadyJump()) {
            this.player.readyJump();
        }
    }

    public ignoreStory() {
        this.animState.speed = 4;
    }

    public playerDie(cb, cbTarget) {
        let action = cc.sequence(cc.moveBy(1, 0, -1000), cc.callFunc(cb, cbTarget));
        this.player.node.runAction(action);
    }

    public playerJump(cb, target) {
        if (!this.player.isReadyJump) {
            return;
        }
        let jumpGrids = Math.round(this.player.jumpDistance / this.gridWidth);
        let targetGrid = this.playerIndex + jumpGrids;
        let targetPos = cc.v2(this.gridWidth * targetGrid + this.gridWidth / 2, 0);
        this.player.jumpTo(targetPos, () => {
            this.playerIndex = targetGrid;
            if (targetGrid <= this.currBlock.tail) {
                cb(this.playerIndex, false);
            } else if (targetGrid >= this.nextBlock.head && targetGrid <= this.nextBlock.tail) {
                cb(this.playerIndex, true);
            } else {
                cb(-1, false);
            }
        }, this);
    }

}
