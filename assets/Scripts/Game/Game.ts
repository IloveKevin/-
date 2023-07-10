import EventSystem from "../Event/EventSystem";
import SingletonManager from "../Manager/SingletonManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    protected onLoad(): void {
        this.SinletonInit();
    }

    private SinletonInit(): void {
        SingletonManager.Instance.AddSingleton(this);
        SingletonManager.Instance.AddNewSingleton(EventSystem);
    }
}
