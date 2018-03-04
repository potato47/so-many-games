const {ccclass, property} = cc._decorator;

@ccclass
export class Player extends cc.Component {

    
    @property(cc.Integer)
    public power: number = 0;
    @property(cc.Float)
    public initSpeed: number = 0;

    public jumpDistance: number = 0;

    public speed: number = 0;

    public isReadyJump: boolean = false;

    public direction: number = 1;

    public readyJump() {
        this.node.runAction(cc.scaleTo(2,1,0.5));
        this.speed = this.initSpeed;
        this.isReadyJump = true;
    }

    public jumpTo(targetPos:cc.Vec2,cb:Function,cbTarget?:any) {
        this.node.stopAllActions();
        // let targetPos = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.isReadyJump = false;
        let resetAction = cc.scaleTo(1,1,1);
        let jumpAction = cc.jumpTo(0.5,targetPos,200,1);
        // let rotateAction = cc.rotateBy(0.5,this.direction*360);
        let finished = cc.callFunc(()=>{
            this.speed = 0;
            this.jumpDistance = 0;
            cb();
        },cbTarget);
        this.node.runAction(resetAction);
        this.node.runAction(cc.sequence(jumpAction,finished))
    }

    public update(dt) {
        if(this.isReadyJump) {
            this.speed += dt * this.power;
            this.jumpDistance += this.speed * dt;
        }
    }

}
