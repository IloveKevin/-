import { ApiConfig, ApiType } from "../Config/ApiConfig";
import HttpModule, { HttpOption } from "./HttpModule";

export class MyHttpOition implements HttpOption {
    header: Map<string, string | (() => string)> = new Map<string, string | (() => string)>();
    timeOut: number = 0;
    eventListener: Map<'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', (data: ProgressEvent<XMLHttpRequestEventTarget>) => void> = new Map<'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', (data: ProgressEvent<XMLHttpRequestEventTarget>) => void>();
}

export interface RequestSender {
    SendRequest<T extends (...args: K) => HttpRequest, K extends any[]>(fun: T, ...args: K): HttpRequest
    AddRequest(request: HttpRequest): void
    RemoveRequest(request: HttpRequest): void
}

export class HttpRequest {
    constructor(mothod: 'Get' | 'Post' | 'Put' | 'Delete', url: URL, sender: RequestSender, data?: string | number | object) {
        this.mothod = mothod;
        this.url = url;
        this.sender = sender;
        if (typeof data == 'object') {
            HttpRequest.globalData.forEach((value, key) => {
                data[key] = value;
            });
        }
        this.data = data;
    }
    private xhr: XMLHttpRequest = new XMLHttpRequest();
    private readonly sender: RequestSender;
    private readonly url: URL;
    private readonly mothod: 'Get' | 'Post' | 'Put' | 'Delete';
    private readonly data: string | number | object;
    private static globalData: Map<string, string | number> = new Map<string, string | number>();
    private static globalOption: HttpOption = new MyHttpOition();
    private option: HttpOption = new MyHttpOition();
    public static SetGlobalData(key: string, value: string | number): typeof HttpRequest {
        this.globalData.set(key, value);
        return HttpRequest;
    }
    public AddEventListener(type: 'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', callback: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void): HttpRequest {
        this.option.eventListener.set(type, callback);
        return this;
    }
    public SetHeader(key: string, value: string): HttpRequest {
        this.option.header.set(key, value);
        return this;
    }
    public SetTimeOut(timeOut: number): HttpRequest {
        this.option.timeOut = timeOut;
        return this;
    }
    public static AddGlobalEventListener(type: 'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', callback: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void): typeof HttpRequest {
        this.globalOption.eventListener.set(type, callback);
        return HttpRequest;
    }
    public static SetGlobalHeader(key: string, value: string): typeof HttpRequest {
        this.globalOption.header.set(key, value);
        return HttpRequest;
    }
    public static SetGlobalTimeOut(timeOut: number): typeof HttpRequest {
        this.globalOption.timeOut = timeOut;
        return HttpRequest;
    }
    public Abort(): HttpRequest {
        this.xhr.abort();
        return this;
    }
    public Send(): HttpRequest {
        let option = new MyHttpOition();
        HttpRequest.globalOption.eventListener.forEach((value, key) => {
            option.eventListener.set(key, value);
        });
        HttpRequest.globalOption.header.forEach((value, key) => {
            option.header.set(key, value);
        });
        this.option.eventListener.forEach((value, key) => {
            option.eventListener.set(key, value);
        });
        this.option.header.forEach((value, key) => {
            if (value == null || value == undefined || value == "") option.header.delete(key);
            else option.header.set(key, value);
        });
        this.option.timeOut = this.option.timeOut ? this.option.timeOut : HttpRequest.globalOption.timeOut;
        this.xhr = HttpModule.SendRequest(this.mothod, this.url, option, this.data);
        return this;
    }
}

export default class MyHttp {
    public static Login(sender: RequestSender, account: string, password: string, callback?: (option: MyHttpOition) => MyHttpOition): HttpRequest {
        return new HttpRequest("Post", new URL(ApiConfig.GetApi(ApiType.login)), sender, { account: account, password: password })
    }
}
