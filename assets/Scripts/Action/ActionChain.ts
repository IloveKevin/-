import ActionModel from "./ActionModel";
export default class ActionChain {
    constructor(finshCallback?: () => void) {
        this.finshCallback = finshCallback;
    }
    private firstModel: ActionModel = null;//第一个动作模型
    private lastModel: ActionModel = null;//最后一个动作模型
    public finshCallback: () => void = null;//动作链完成时的回调
    public AddModel(model: ActionModel): void {//添加动作模型
        model.chain = this;//设置动作模型所属的动作链
        if (this.firstModel == null) {//如果第一个动作模型为null,则设置为第一个动作模型
            this.firstModel = model;
            this.lastModel = model;
            return;
        }
        this.lastModel.nextModel = model;//设置最后一个动作模型的下一个动作模型
        this.lastModel = model;//设置最后一个动作模型
    }
    public Run(): void {
        cc.log("动作链开始执行");
        this.firstModel.Run();//运行第一个动作模型
    }
}
