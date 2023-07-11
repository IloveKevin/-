export interface HttpOption {
    header: Map<string, string | (() => string)>;
    timeOut: number;
    eventListener: Map<'error' | 'abort' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', (data: ProgressEvent<XMLHttpRequestEventTarget>) => void>;
}
export default class HttpModule {
    public static SendRequest(mothod: 'Get' | 'Post' | 'Put' | 'Delete', url: URL, option: HttpOption, data?: string | number | object): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        xhr.timeout = option.timeOut;
        option.eventListener.forEach((value, key) => {
            if (key == "progress") xhr.upload.addEventListener(key, value);
            xhr.addEventListener(key, value);
        });
        xhr.open(mothod, mothod == "Get" && data != null ? new URL(url.href + "?" + this.GetData(data)) : url, true);
        option.header.forEach((value, key) => {
            if (typeof value == 'function') value = value();
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

