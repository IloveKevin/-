import ModuleBase from "../Base/ModuleBase";
import { ModuleType } from "../Config/EnumConfig";
import SingletonManager from "../Manager/SingletonManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ModuleManager extends cc.Component {
    protected onLoad(): void {
        SingletonManager.Instance.AddSingleton(this);
    }
    //模块字典
    private moduleMap: Map<ModuleType, ModuleBase> = new Map<ModuleType, ModuleBase>();
    //添加模块
    public AddModule(moduleType: ModuleType, module: ModuleBase): void {
        if (this.moduleMap.has(moduleType)) {
            cc.error("模块已存在", moduleType);
            return;
        }
        this.moduleMap.set(moduleType, module);
    }
    //获取模块
    public GetModule(moduleType: ModuleType): ModuleBase {
        if (!this.moduleMap.has(moduleType)) {
            cc.error("模块不存在", moduleType);
            return null;
        }
        return this.moduleMap.get(moduleType);
    }
    //移除模块
    public RemoveModule(moduleType: ModuleType): void {
        if (!this.moduleMap.has(moduleType)) {
            cc.error("模块不存在", moduleType);
            return;
        }
        this.moduleMap.delete(moduleType);
    }
    //清空模块
    public Clear(): void {
        this.moduleMap.clear();
    }
    //模块更新
    protected update(dt: number): void {
        this.moduleMap.forEach((value: ModuleBase, key: ModuleType) => {
            value.OnModuleUpdate(dt);
        });
    }
}
