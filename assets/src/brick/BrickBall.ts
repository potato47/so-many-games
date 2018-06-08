import { BrickScene } from "./BrickScene";

const {ccclass, property} = cc._decorator;

@ccclass
export class BrickBall extends cc.Component {

    private brickScene: BrickScene = null;

    init(brickScene:BrickScene) {
        this.brickScene = brickScene;
        this.node.position = cc.v2(360,270);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(800,800);//初始化速度
    }

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.brickScene.onBallContactBrick(self.node, other.node);
                break;
            case 2://球碰到地面
                this.brickScene.onBallContactGround(self.node, other.node);
                break;
            case 3://球碰到托盘
                this.brickScene.onBallContactPaddle(self.node, other.node);
                break;
            case 4://球碰到墙
                this.brickScene.onBallContactWall(self.node, other.node);
                break;
        }
    }
}