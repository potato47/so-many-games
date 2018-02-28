import { GameRoot } from "./shared/GameRoot";

class GlobalInstance {
    
    public static readonly Instance:GlobalInstance = new GlobalInstance();
    public gameRoot:GameRoot = null;

    private constructor(){}

    public enterHall() {
        cc.director.loadScene("hall");
    }

    public returnHall() {
        this.gameRoot.showMaskMessage("命里有时终须有\n命里无时莫强求");
        cc.director.loadScene("hall",()=>{
            this.gameRoot.hideMaskMessage();
        });
    }

    public enterGobang() {
        this.gameRoot.showMaskMessage("命里有时终须有\n命里无时莫强求");
        cc.director.loadScene("gobang",()=>{
            this.gameRoot.hideMaskMessage();
        });
    }
    
    public enterReversi() {
        this.gameRoot.showMaskMessage("命里有时终须有\n命里无时莫强求");
        cc.director.loadScene("reversi",()=>{
            this.gameRoot.hideMaskMessage();
        });
    }

    public enter2048() {
        this.gameRoot.showMaskMessage("命里有时终须有\n命里无时莫强求");
        cc.director.loadScene("2048",()=>{
            this.gameRoot.hideMaskMessage();
        });
    }
}

export const G = GlobalInstance.Instance;
