const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    protected onLoad(): void {
        this.SinletonInit();
    }

    private SinletonInit(): void {
    }
}
