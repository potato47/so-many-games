import { GameRoot } from "./shared/GameRoot";

class GlobalInstance {

    public static readonly Instance: GlobalInstance = new GlobalInstance();
    public gameRoot: GameRoot = null;

    private constructor() {
    }

    public enterHall() {
        cc.director.loadScene("hall");
    }

    public returnHall() {
        cc.director.loadScene("hall");
    }

    public enterGobang() {
        this.loadSceneWithProgress("gobang");
    }

    public enterReversi() {
        this.loadSceneWithProgress("reversi");
    }

    public enter2048() {
        this.loadSceneWithProgress("2048");
    }

    public enterJump() {
        this.loadSceneWithProgress("jump");
    }

    public enterPuzzle() {
        this.loadSceneWithProgress("puzzle");
    }

    public enterGet47() {
        this.loadSceneWithProgress("get47");
    }

    public enterTetris() {
        this.loadSceneWithProgress("tetris");
    }

    public enterMine() {
        this.loadSceneWithProgress("mine");
    }

    private setLoadingDisplay() {
        if (cc.sys.isNative) {
            return;
        }
        // Loading splash scene
        let splash = document.getElementById('splash');
        let progressBar = splash.querySelector('.progress-bar span');
        (cc.loader as any).onProgress = function (completedCount, totalCount, item) {
            let percent = 100 * completedCount / totalCount;
            if (progressBar) {
                (progressBar as any).style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        (progressBar as any).style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    private loadSceneWithProgress(scene: string, cb?: Function) {
        this.setLoadingDisplay();
        cc.director.preloadScene(scene, () => {
            setTimeout(() => {
                cc.director.loadScene(scene, cb);
            }, 1000);
        });
    }
}

export const G = GlobalInstance.Instance;
