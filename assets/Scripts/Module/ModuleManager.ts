import ModuleBase from "../Base/ModuleBase";
import SingletonBase from "../Base/SingletonBase";
import { ModuleType } from "../Config/EnumConfig";

export default class ModuleManager extends SingletonBase {
    private isInitialize: boolean = false;//是否初始化
    private driver: cc.Node = null;//驱动
    //模块字典
    private moduleMap: Map<ModuleType, ModuleBase> = new Map<ModuleType, ModuleBase>();
    public Init(): void {
        if (this.isInitialize) {
            cc.error("模块管理器已初始化");
            return;
        }
        this.isInitialize = true;
        this.driver = new cc.Node("ModuleManager");
        this.driver.parent = cc.director.getScene();
        cc.game.addPersistRootNode(this.driver);
    }

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
    public update(dt: number): void {
        this.moduleMap.forEach((value: ModuleBase, key: ModuleType) => {
            value.OnModuleUpdate(dt);
        });
    }
}
