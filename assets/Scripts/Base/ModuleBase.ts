export default interface ModuleBase {
    Init(): void;//初始化
    OnModuleUpdate(dt: number): void;//模块更新
}

