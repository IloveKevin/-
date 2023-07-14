import UIContainerBase from "./Base/UIContainerBase";
import ModuleManager from "./Module/ModuleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MyGame extends cc.Component {
    //游戏入口
    protected start(): void {
        //初始化模块管理器
        ModuleManager.GetInstance().Init();
        //添加UI容器模块
        ModuleManager.GetInstance().AddModule(new UIContainerBase().Init());
    }
}
