export default interface IModule {
    name: string;//模块名
    priority: number;//优先级
    Init(): void;//初始化
    OnModuleUpdate(dt: number): void;//模块更新
}

