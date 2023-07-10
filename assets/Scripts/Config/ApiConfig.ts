import { UrlConfig } from "./UrlConfig";
export enum ApiType {
    login = "Account/Login",
    GetArticles = "Article/GetArticles"
}
export class ApiConfig {
    public static base = "api";
    public static GetApi(api: ApiType): URL {
        return new URL(`${UrlConfig.testUrl}/${this.base}/${api}`);
    }
}
