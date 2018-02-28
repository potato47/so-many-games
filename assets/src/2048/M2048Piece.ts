const {ccclass,property} = cc._decorator;

@ccclass
export class M2048Piece extends cc.Component{

    @property(cc.Label)
    private nLabel:cc.Label = null;

    public x:number;
    public y:number;
    private _n: number = 0;
    public get n() {
        return this._n;
    }
    public set n(value:number) {
        this._n = value;
        this.nLabel.string = (value===0?"":value) + "";
        this.nLabel.node.color = this.getHcolor(Math.random(),1);
    }

    public init(x:number, y:number, n:number){
        this.x = x;
        this.y = y;
        this.n = n;
    }

    public randomNumber() {
        this.n = Math.random() < 0.9 ? 2 : 4;
    }

    private getHcolor(top: number, height: number) {
        let oneHeight = height / 6;
        let d = 0, rgbStr;
        let r = 0, g = 0, b = 0;
        if (top < oneHeight * 1) {
            d = (top / oneHeight) * 255;
            r = 255;
            g = 0;
            b = Math.round(d);
        } else if (top >= oneHeight && top < 2 * oneHeight) {
            d = 255 - ((top - oneHeight) / oneHeight) * 255;
            r = Math.round(d);
            g = 0;
            b = 255;
        } else if (top >= 2 * oneHeight && top < 3 * oneHeight) {
            d = ((top - 2 * oneHeight) / oneHeight) * 255;
            r = 0;
            g = Math.round(d);
            b = 255;
        } else if (top >= 3 * oneHeight && top < 4 * oneHeight) {
            d = 255 - ((top - 3 * oneHeight) / oneHeight) * 255;
            r = 0;
            g = 255;
            b = Math.round(d);
        } else if (top >= 4 * oneHeight && top < oneHeight * 5) {
            d = ((top - oneHeight * 4) / oneHeight) * 255;
            r = Math.round(d);
            g = 255;
            b = 0;
        } else {
            d = 255 - ((top - oneHeight * 5) / oneHeight) * 255;
            r = 255;
            g = Math.round(d);
            b = 0;
        }
        return cc.color(r, g, b);
    }
}