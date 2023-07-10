import { ApiConfig, ApiType } from "../Config/ApiConfig";
import HttpModule, { HttpOption } from "./HttpModule";

export class MyHttpOition implements HttpOption {
    header: Map<string, string>;
    timeOut: number;
    isTimeOut: boolean;
    isError: boolean;
    Success: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Error: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Abort: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Succeed: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Loadend: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Loadstart: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Progress: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    Timeout: (data: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    constructor() {
        this.header = new Map<string, string>();
        this.timeOut = 5000;
        this.isTimeOut = false;
        this.isError = false;
        this.header.set("Content-Type", "application/json");
        this.Error = (data: ProgressEvent<XMLHttpRequestEventTarget>) => {
            this.isError = true;
            console.log("Error");
        }
        this.Timeout = (data: ProgressEvent<XMLHttpRequestEventTarget>) => {
            this.isTimeOut = true;
            console.log("Timeout");
        }
    }
}

export default class MyHttp {
    private static httpMap: Map<number, XMLHttpRequest> = new Map<number, XMLHttpRequest>();
    private static httpIndex: number = 0;
    private static GetOption(callback: (option: MyHttpOition) => MyHttpOition): MyHttpOition {
        let option = callback ? callback(new MyHttpOition()) : new MyHttpOition();
        return option;
    }

    private static SendRequest(mothod: 'Get' | 'Post' | 'Put' | 'Delete', url: URL, option: HttpOption, data?: string | number | object): number {
        this.httpMap.set(this.httpIndex, HttpModule.SendRequest(mothod, url, option, data));
        if (this.httpIndex)
            return this.httpIndex++;
    }

    public static Login(account: string, password: string, callback?: (option: MyHttpOition) => MyHttpOition): number {
        return this.SendRequest('Post', ApiConfig.GetApi(ApiType.login), this.GetOption(callback), { account: account, password: password, appid: 1, device: "string" });
    }
}
