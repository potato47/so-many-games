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

    public enterLink() {
        this.loadSceneWithProgress("link");
    }

    public enterSnake() {
        this.loadSceneWithProgress("snake");
    }

    public enterBrick() {
        this.loadSceneWithProgress("brick");
    }

    public enterPinball() {
        this.loadSceneWithProgress("pinball");
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

    public setResolutionPolicy() {
        let f = function () {
            if (cc.sys.isMobile) {
                cc.log('手机场景适配');
                cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
                cc.Canvas.instance['alignWithScreen']();
            } else {
                cc.log('电脑场景适配');
                cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
                cc.Canvas.instance['alignWithScreen']();
            }
        }
        f();
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, f);
    }
}

export const G = GlobalInstance.Instance;
