const {ccclass, property} = cc._decorator;

@ccclass
export class Streak extends cc.Component {

    start() {
        this.node.parent.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>{
            this.node.position = this.node.parent.convertToNodeSpaceAR(event.getStartLocation());
            let moveAction = cc.moveTo(0.3,this.node.parent.convertToNodeSpaceAR(event.getLocation()));
            this.node.runAction(moveAction);
        },this);
    }
}
