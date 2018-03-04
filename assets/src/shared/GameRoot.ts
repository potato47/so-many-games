const {ccclass,property} = cc._decorator;

@ccclass
export class GameRoot extends cc.Component {

    @property(cc.Node)
    private maskPanel:cc.Node = null;
    @property(cc.Label)
    private messageLabel: cc.Label = null;
    @property(cc.Node)
    private messageBtn1: cc.Node = null;
    @property(cc.Node)
    private messageBtn2: cc.Node = null;
    @property(cc.Node)
    private tipPanel:cc.Node = null;
    @property(cc.Label)
    private tipLabel:cc.Label = null;

    public showMaskMessage(message:string,btn1?:{label:string,cb?:Function,target?:any},btn2?:{label:string,cb?:Function,target?:any}) {
        this.messageLabel.string = message;
        if(!this.maskPanel.active){
            this.maskPanel.active = true;
        }
        if(btn1) {
            this.messageBtn1.active = true;
            this.messageBtn1.getComponent(cc.Label).string = btn1.label;
            this.messageBtn1.once(cc.Node.EventType.TOUCH_END,()=>{
                this.hideMaskMessage();
                if(btn1.cb) {
                    btn1.cb();
                }
            },btn1.target);
        }else{
            this.messageBtn1.active = false;
        }
        if(btn2) {
            this.messageBtn2.active = true;
            this.messageBtn2.getComponent(cc.Label).string = btn2.label;
            this.messageBtn2.once(cc.Node.EventType.TOUCH_END,()=>{
                this.hideMaskMessage();
                if(btn2.cb){
                    btn2.cb();
                }
            },btn2.target);
        }else{
            this.messageBtn2.active = false;
        }
    }

    public hideMaskMessage() {
        this.maskPanel.active = false;
    }

    public showTip(tip:string) {
        this.tipLabel.string = tip;
        this.tipPanel.getComponent(cc.Animation).play();
    }
    
}