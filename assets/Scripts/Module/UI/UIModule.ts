import IModule from "../IModule";

export default class UIModule implements IModule {
    name: string = "UIModule";
    priority: number = 0;
    Init(): void {
        throw new Error("Method not implemented.");
    }
    OnModuleUpdate(dt: number): void {
        throw new Error("Method not implemented.");
    }
}
