const { ccclass, property } = cc._decorator;

@ccclass
export class M2048Piece extends cc.Component {

    @property(cc.Label)
    public nLabel: cc.Label = null;

    public x: number;
    public y: number;
    private _n: number = 0;
    public get n() {
        return this._n;
    }
    public set n(value: number) {
        this._n = value;
        let color: cc.Color;
        let str: string;
        switch (value) {
            case 0:
                str = "";
                color = cc.Color.BLACK;
                break;
            case 2:
                str = "幼儿园";
                color = cc.hexToColor("#784212");
                break;
            case 4:
                str = "小学生";
                color = cc.hexToColor("#784212");
                break;
            case 8:
                str = "初中生";
                color = cc.hexToColor("#7E5109");
                break;
            case 16:
                str = "高中生";
                color = cc.hexToColor("#7D6608");
                break;
            case 32:
                str = "大学生";
                color = cc.hexToColor("#186A3B");
                break;
            case 64:
                str = "研究生";
                color = cc.hexToColor("#145A32");
                break;
            case 128:
                str = "硕士生";
                color = cc.hexToColor("#0B5345");
                break;
            case 256:
                str = "博士生";
                color = cc.hexToColor("#0E6251");
                break;
            case 512:
                str = "实习生";
                color = cc.hexToColor("#1B4F72");
                break;
            case 1024:
                str = "码农";
                color = cc.hexToColor("#154360");
                break;
            case 2048:
                str = "码神";
                color = cc.hexToColor("#4A235A");
                break;
            case 4096:
                str = "女装大佬";
                color = cc.hexToColor("#512E5F");
                break;
            case 8192:
                str = "众生平等";
                color = cc.hexToColor("#78281F");
                break;
            default:
                str = "开挂吧你";
                color = cc.hexToColor("#641E16");
                break;
        }
        this.nLabel.string = str;
        this.nLabel.node.color = color;
        // this.nLabel.node.color = this.getHcolor(Math.random(),1);
    }

    public init(x: number, y: number, n: number) {
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