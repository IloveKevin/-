const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayOnceEffect extends cc.Component {
    onLoad() {
        this.node.getComponent(cc.Animation).on('finished', this.onFinished, this);
    }
    onFinished() {
        this.node.destroy();
    }
}
