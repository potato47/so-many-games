const { ccclass, property } = cc._decorator;

@ccclass
export class Progress extends cc.Component {

    @property(cc.ProgressBar)
    private progressBar: cc.ProgressBar = null;
    @property(cc.Node)
    private anchor: cc.Node = null;
    @property(cc.Node)
    private target: cc.Node = null;

    private length: number = 100;

    public init(length: number) {
        this.length = length;
        this.anchor.x = 0;
    }

    public show() {
        this.node.active = true;
    }

    public hide() {
        this.node.active = false;
    }

    public updateProgress(progress: number):boolean {
        this.progressBar.progress = progress / this.length;
        if(this.progressBar.progress >= 0.95){
            this.anchor.x = this.node.width;
            return true;            
        }else{
            this.anchor.x = this.node.getChildByName("bar").width;
            return false;
        }
    }
}
