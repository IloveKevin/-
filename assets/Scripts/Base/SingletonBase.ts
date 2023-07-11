export default class SingletonBase {
    private static _instance: any = null;
    public static GetInstance<T extends {}>(this: { new(): T }): T {
        if (!(<any>this)._instance) (<any>this)._instance = new this();
        return (<any>this)._instance;
    }
}
