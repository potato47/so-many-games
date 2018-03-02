const { ccclass, property } = cc._decorator;

@ccclass
export class Streak extends cc.Component {

    @property(cc.Graphics)
    private g: cc.Graphics = null;

    start() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this);
        this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: cc.Event.EventTouch){
        let localPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.g.circle(localPos.x,localPos.y,5);
        this.g.fill();
        this.g.moveTo(localPos.x,localPos.y);
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        let localPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.g.lineTo(localPos.x,localPos.y);
        this.g.stroke();
        this.g.moveTo(localPos.x,localPos.y);
    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        // this.node.position = this.node.parent.convertToNodeSpaceAR(event.getStartLocation());
        // let moveAction = cc.moveTo(0.3, this.node.parent.convertToNodeSpaceAR(event.getLocation()));
        // this.node.runAction(moveAction);
        let localPos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.g.circle(localPos.x,localPos.y,5);
        this.g.fill();
        this.g.clear();
    }
}
