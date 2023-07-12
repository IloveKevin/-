export default class QuickEventSystem {
    public eventList: Array<Function>;//事件列表
    constructor() {
        this.eventList = new Array<Function>();
    }
    //添加事件
    public AddEvent(func: Function): void {
        this.eventList.push(func);
    }
    //移除事件
    public RemoveEvent(func: Function): void {
        let index = this.eventList.indexOf(func);
        if (index != -1) {
            this.eventList.splice(index, 1);
        }
    }
    //移除所有事件
    public RemoveAllEvent(): void {
        this.eventList = new Array<Function>();
    }
    //触发事件
    public EmitEvent(args: any): void {
        for (let i = 0; i < this.eventList.length; i++) {
            this.eventList[i](args);
        }
    }
}
