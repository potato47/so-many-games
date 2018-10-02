import { G } from "../G";
import { GameRoot } from "../shared/GameRoot";

const {ccclass, property} = cc._decorator;

@ccclass
export class LoadingScene extends cc.Component {
    
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Node)
    private gameRoot:cc.Node = null;

    onLoad() {
        G.setResolutionPolicy();
        cc.game.addPersistRootNode(this.gameRoot);
        this.initGlobal();
    }

    initGlobal() {
        G.gameRoot = this.gameRoot.getComponent(GameRoot);
    }

    protected start() {
        // cc.director.setDisplayStats(false);
        let tip = "始终相信美好的事情不会发生"
        let i = 0;
        this.tipLabel.string = '';
        this.schedule(()=>{
            i++;
            if(i === tip.length+1) {
                this.onLoadSuccess();
            }else{
                this.tipLabel.string = tip.substring(0,i);
            }
        },0.3,tip.length+1,0.3);
    }

    private onLoadSuccess() {
        G.enterHall();
    }
}
