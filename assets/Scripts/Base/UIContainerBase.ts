import MyHttp, { HttpRequest, RequestSender } from "../Http/MyHttp";
import IModule from "../Module/IModule";

export default class UIContainerBase implements IModule, RequestSender {
    priority: number;
    public name: string;
    private requestList: HttpRequest[];
    private parent: UIContainerBase;
    private children: UIContainerBase[];
    public Init(): void {
        this.requestList = [];
        this.parent = null;
        this.children = [];
    }
    public OnModuleUpdate(dt: number): void {
        this.children.forEach((value) => {
            value.OnModuleUpdate(dt);
        });
    }
    public Dispose(): void {
        this.requestList.forEach((value) => {
            value.Abort();
        });
        this.requestList = [];
        this.children.forEach((value) => {
            value.Dispose();
        });
        this.children = [];
        this.SetParent(null);
    }
    public AddChild(child: UIContainerBase): void {
        child.SetParent(this);
        this.children.push(child);
    }
    private RemoveChild(child: UIContainerBase): void {
        child.parent = null;
        this.children.splice(this.children.indexOf(child), 1);
    }
    public GetChildByName(name: string): UIContainerBase {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].name == name) return this.children[i];
        }
        return null;
    }
    public GetParent(): UIContainerBase {
        return this.parent;
    }
    public GetChildren(): UIContainerBase[] {
        return this.children;
    }
    public GetChildrenCount(): number {
        return this.children.length;
    }
    public SetParent(parent: UIContainerBase): void {
        if (this.parent != null) this.parent.RemoveChild(this);
        this.parent = parent;
    }
    public AddRequest(request: HttpRequest): void {
        this.requestList.push(request);
    }
    public RemoveRequest(request: HttpRequest): void {
        this.requestList.splice(this.requestList.indexOf(request), 1);
    }
    public SendRequest<T extends (...args: K) => HttpRequest, K extends any[]>(fun: T, ...args: K): HttpRequest {
        let request = fun(...args);
        this.requestList.push(request);
        return request;
    }
}
