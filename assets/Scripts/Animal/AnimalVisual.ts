import EventSystem, { EventType } from "../Event/EventSystem";
import Grid from "../Grid/Grid";
import SingletonManager from "../Manager/SingletonManager";
import { NodePoolType } from "../NodePool/NodePool";
import Animal, { AnimalType } from "./Animal";
import { AnimalVFXType } from "./AnimalVFX";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AnimalVisual extends cc.Component {
    @property({ type: cc.SpriteFrame, displayName: "动物默认图片" })
    public defaultSprite: cc.SpriteFrame = null;//动物默认图片
    @property({ type: cc.Node, displayName: "选中节点" })
    public clickNode: cc.Node = null;//选中节点
    public animal: Animal = null;//动物数据
    private animation: cc.Animation = null;//视觉动画
    private eventSystem: EventSystem = null;//事件系统
    private grid: Grid = null;//格子
    public nodePoolType: NodePoolType = null;//节点池类型
    protected onLoad(): void {
        this.animation = this.getComponent(cc.Animation);
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnClick, this);
    }

    protected start(): void {
        this.eventSystem = SingletonManager.Instance.GetSingleton(EventSystem);
        this.grid = SingletonManager.Instance.GetSingleton(Grid);
    }

    //初始化
    public Init(animal: Animal): void {
        this.node.angle = 0;
        this.StopAnimation();
        this.animal = animal;
        this.nodePoolType = NodePoolType[AnimalType[this.animal.animalType]];
        if (animal.animalVFX != AnimalVFXType.None) this.PlayAnimation(AnimalType[this.animal.animalType] + "_" + AnimalVFXType[animal.animalVFX]);
    }

    //点击事件
    public OnClick(e: cc.Event.EventTouch): void {
        if (!this.grid.canClick) return;
        cc.log("点击动物", AnimalType[this.animal.animalType], AnimalVFXType[this.animal.animalVFX]);
        this.animal.isClick = !this.animal.isClick;
        this.clickNode.active = this.animal.isClick;
        if (this.animal.animalVFX == AnimalVFXType.None || this.animal.animalVFX == AnimalVFXType.Similar) {
            if (this.animal.isClick) this.PlayAnimation(AnimalType[this.animal.animalType] + "_Click");
            else this.StopAnimation();
        }
        //触发点击事件
        this.eventSystem.EmitEvent(EventType.ClickAnimal, this.animal);
    }

    //播放动画
    private PlayAnimation(anim?: string): void {
        if (this.animation == null) { cc.error("动物视觉动画为空"); return; }
        cc.log("播放动画", anim);
        if (anim == null) {
            this.animation.play();
            return;
        }
        this.animation.play(anim);
    }

    public CancelClick(): void {
        this.animal.isClick = false;
        this.clickNode.active = this.animal.isClick;
        if (!this.animal.isClick && (this.animal.animalVFX == AnimalVFXType.None || this.animal.animalVFX == AnimalVFXType.Similar)) this.StopAnimation();
    }

    //停止动画
    private StopAnimation(): void {
        if (this.animation == null) { cc.error("动物视觉动画为空"); return; }
        this.animation.stop();
        this.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;
    }
}
