const {ccclass, property} = cc._decorator;

@ccclass
export class BrickPaddle extends cc.Component {
    
    onLoad() {
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            //将世界坐标转化为本地坐标
            let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());
            this.node.x = touchPoint.x;
        });
    }

    init(){
        this.node.x = 360;
    }
}