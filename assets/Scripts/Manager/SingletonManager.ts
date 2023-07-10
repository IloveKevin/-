const { ccclass, property } = cc._decorator;

@ccclass
export default class SingletonManager {
    private static _instance: SingletonManager = null;
    public static get Instance(): SingletonManager {
        if (this._instance == null) this._instance = new SingletonManager();
        return this._instance;
    }
    private _singletonMap: Map<string, any> = new Map<string, any>();
    public AddNewSingleton<T>(type: { new(): T }): void {
        this.AddSingleton(new type());
    }
    public AddSingleton<T>(singleton: T): void {
        this._singletonMap.set(singleton.constructor.name, singleton);
    }
    public GetSingleton<T extends object>(type: { new(): T }): T {
        return this._singletonMap.get(type.name);
    }
}
