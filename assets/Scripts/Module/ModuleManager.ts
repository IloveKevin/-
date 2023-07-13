import SingletonBase from "../Base/SingletonBase";
import IModule from "./IModule";

export default class ModuleManager extends SingletonBase {
    private isInitialize: boolean = false;//是否初始化
    private driver: cc.Node = null;//驱动
    //模块字典
    private moduleList: Array<IModule>;
    public Init(): void {
        if (this.isInitialize) {
            cc.error("模块管理器已初始化");
            return;
        }
        this.moduleList = new Array<IModule>();
        this.isInitialize = true;
        this.driver = new cc.Node("ModuleManager");
        this.driver.parent = cc.director.getScene();
        cc.game.addPersistRootNode(this.driver);
    }
    //添加模块
    public AddModule(module: IModule): void {
        if (this.HasModule(module.name)) {
            cc.error("模块已存在", module.name);
            return;
        }
        for (let i = 0; i < this.moduleList.length; i++) {
            if (module.priority >= this.moduleList[i].priority) {
                this.moduleList.splice(i, 0, module);
                return;
            }
        }
    }
    //获取模块
    public GetModule(name: string): IModule {
        for (let i = 0; i < this.moduleList.length; i++) {
            if (name == this.moduleList[i].name) {
                return this.moduleList[i];
            }
        }
    }
    //移除模块
    public RemoveModule(name: string): void {
        for (let i = 0; i < this.moduleList.length; i++) {
            if (name == this.moduleList[i].name) {
                this.moduleList.splice(i, 1);
                return;
            }
        }
    }
    //是否存在模块
    public HasModule(name: string): boolean {
        this.moduleList.forEach((value: IModule, index: number) => {
            if (value.name == name) {
                return true;
            }
        });
        return false;
    }
    //清空模块
    public Clear(): void {
        this.moduleList = new Array<IModule>();
    }
    //模块更新
    public update(dt: number): void {
        //模块排序-优先级从大到小
        this.moduleList.sort((a: IModule, b: IModule) => {
            return b.priority - a.priority;
        });
        this.moduleList.forEach((value: IModule, index: number) => {
            value.OnModuleUpdate(dt);
        });
    }
}
