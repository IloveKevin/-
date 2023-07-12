import ModuleManager from "../Module/ModuleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ModuleDriver extends cc.Component {
    update(dt) {
        ModuleManager.GetInstance().update(dt);
    }
}
