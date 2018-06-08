import { BrickBall } from "./BrickBall";

const { ccclass, property } = cc._decorator;

@ccclass
export class BrickScene extends cc.Component {

    @property(BrickBall)
    private ball: BrickBall = null;

    private physicsManager: cc.PhysicsManager = null;

    onLoad() {
        this.physicsManager = cc.director.getPhysicsManager();
        this.startGame();

    },

    //this.physicsManager.debugDrawFlags =0;
    // cc.PhysicsManager.DrawBits.e_aabbBit |
    // cc.PhysicsManager.DrawBits.e_pairBit |
    // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    // cc.PhysicsManager.DrawBits.e_jointBit |
    // cc.PhysicsManager.DrawBits.e_shapeBit
    // ; 

    init() {
        this.physicsManager.enabled = true;
        this.ball.init(this);
        // this.paddle.init();
        // this.brickLayout.init(this.gameModel.bricksNumber);
        // this.overPanel.init(this);

    }

    startGame() {
        this.init();
    }

    pauseGame() {
        this.physicsManager.enabled = false;
    }

    resumeGame() {
        this.physicsManager.enabled = true;
    }

    stopGame() {
        this.physicsManager.enabled = false;
        // this.overPanel.show(this.gameModel.score, this.gameModel.bricksNumber === 0);
    }

    onBallContactBrick(ballNode, brickNode) {
        brickNode.parent = null;
        // this.gameModel.addScore(1);
        // this.gameModel.minusBrick(1);
        // this.gameView.updateScore(this.gameModel.score);
        // if (this.gameModel.bricksNumber <= 0) {
        //     this.stopGame();
        // }
    }

    onBallContactGround(ballNode: cc.Node, groundNode: cc.Node) {
        this.stopGame();
    }

    onBallContactPaddle(ballNode: cc.Node, paddleNode: cc.Node) {

    }

    onBallContactWall(ballNode: cc.Node, brickNode: cc.Node) {

    }

    onDestroy() {
        this.physicsManager.enabled = false;
    }


}
