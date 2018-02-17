import { GameRoot } from "./shared/GameRoot";

class GlobalInstance {
    
    public static readonly Instance:GlobalInstance = new GlobalInstance();
    public gameRoot:GameRoot = null;

    private constructor(){}

    public enterHall() {
        cc.director.loadScene("hall");
    }

    public returnHall() {
        cc.director.loadScene("hall");
    }

    public enterGobang() {
        cc.director.loadScene("gobang");
    }
}

export const G = GlobalInstance.Instance;
