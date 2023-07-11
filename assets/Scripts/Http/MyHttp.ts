import { ApiConfig, ApiType } from "../Config/ApiConfig";
import HttpModule, { HttpOption } from "./HttpModule";

export class MyHttpOition implements HttpOption {
    header: Map<string, string> = new Map<string, string>();
    timeOut: number = 0;
    eventListener: Map<'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', (data: ProgressEvent<XMLHttpRequestEventTarget>) => void> = new Map<'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', (data: ProgressEvent<XMLHttpRequestEventTarget>) => void>();
}

export class HttpRequest {
    constructor(mothod: 'Get' | 'Post' | 'Put' | 'Delete', url: URL, data?: string | number | object) {
        this.mothod = mothod;
        this.url = url;
        this.data = data;
    }
    private xhr: XMLHttpRequest = new XMLHttpRequest();
    private readonly url: URL;
    private readonly mothod: 'Get' | 'Post' | 'Put' | 'Delete';
    private readonly data: string | number | object;
    private static globalOption: HttpOption = new MyHttpOition();
    private option: HttpOption = new MyHttpOition();
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
    public static Login(account: string, password: string, callback?: (option: MyHttpOition) => MyHttpOition): HttpRequest {
        return new HttpRequest("Post", new URL(ApiConfig.GetApi(ApiType.login)), { account: account, password: password })
    }
}
