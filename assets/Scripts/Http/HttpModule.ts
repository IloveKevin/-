export interface HttpOption {
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
}
export default class HttpModule {
    public static SendRequest(mothod: 'Get' | 'Post' | 'Put' | 'Delete', url: URL, option: HttpOption, data?: string | number | object): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        xhr.timeout = option.timeOut;
        xhr.upload.addEventListener("progress", option.Progress);
        xhr.addEventListener("error", option.Error);
        xhr.addEventListener("abort", option.Abort);
        xhr.addEventListener("load", option.Succeed);
        xhr.addEventListener("loadend", option.Loadend);
        xhr.addEventListener("loadstart", option.Loadstart);
        xhr.addEventListener("progress", option.Progress);
        xhr.addEventListener("timeout", option.Timeout);
        xhr.open(mothod, mothod == "Get" && data != null ? new URL(url.href + "?" + this.GetData(data)) : url, true);
        option.header.forEach((value, key) => {
            xhr.setRequestHeader(key, value);
        });
        xhr.send(mothod == "Get" ? null : option.header.get("Content-Type") == "application/json" ? JSON.stringify(data) : data as FormData);
        return xhr;
    }

    private static GetData(data: string | number | object): string {
        let _data: string = "";
        if (typeof data == 'object') {
            let j = 1;
            for (var i in data) {
                if (typeof data[i] == 'boolean' || typeof data[i] == 'number' || typeof data[i] == 'string' || typeof data[i] == 'object') {
                    j++ == 1 ? _data += i + "=" + data[i] : _data += "&" + i + "=" + data[i];
                }
            }
        }
        else _data = data.toString();
        return _data;
    }
}

