import IAction from "./Action";
import ActionChain from "./ActionChain";

export default class ActionModel {
    private actions: IAction[] = [];//动作模型持有的动作组
    public chain: ActionChain = null;//动作模型所属的动作链
    private finishCount: number = 0;//已完成的动作数量
    public nextModel: ActionModel = null;//下一个动作模型
    public AddAction(action: IAction): void {
        this.actions.push(action);
    }
    public ActionFinish(): void {
        this.finishCount++;
        if (this.finishCount == this.actions.length) {//如果已完成的动作数量等于动作组的长度，则运行下一个动作模型
            if (this.nextModel != null)
                this.nextModel.Run();
            else this.chain.finshCallback();
        }
    }
    public Run(): void {
        this.actions.forEach((action) => {
            action.Run(this.ActionFinish.bind(this));
        });
    }
}
