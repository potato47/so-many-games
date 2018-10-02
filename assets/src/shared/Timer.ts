const {ccclass,property} = cc._decorator;

@ccclass
export class Timer extends cc.Component {

    @property(cc.Label)
    private timerLabel: cc.Label = null;
    
    public time:number = null;

    public run() {
        this.time = 0;
        this.schedule(this.tick,0.1);
    }

    private tick() {
        this.time += 0.1;
        this.timerLabel.string = this.time.toFixed(1) + " s";
    }

    public stop() {
        this.unschedule(this.tick);
    }

    public reset() {
        this.time = 0;
        this.timerLabel.string = "0.0 s";
    }
}