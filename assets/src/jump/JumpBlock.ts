export class Block{

    public head: number;
    public length: number;
    public get tail() {
        return this.head+this.length-1;
    }

    public constructor(head:number,length:number) {
        this.head = head;
        this.length = length;
    }
}
