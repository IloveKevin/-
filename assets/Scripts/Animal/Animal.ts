import { AnimalRemoveAction, AnimalShakAction, RemoveAction } from "../Action/Action";
import ActionModel from "../Action/ActionModel";
import Grid from "../Grid/Grid";
import SingletonManager from "../Manager/SingletonManager";
import NodePool, { NodePoolType } from "../NodePool/NodePool";
import Util from "../Util/Util";
import VFXFactory, { AnimalVFXType } from "./AnimalVFX";
import AnimalVisual from "./AnimalVisual";
//动物类型
export enum AnimalType {
    Bear,//熊
    Brid,//鸟
    Cat,//猫头鹰
    Chicken,//鸡
    Fox,//狐狸
    Frog,//青蛙
    Horse,//河马
}
export default class Animal {
    public row: number = null;//逻辑行
    public col: number = null;//逻辑列
    public animalType: AnimalType = null;//动物类型
    public animalVFX: AnimalVFXType = AnimalVFXType.None;//动物特殊效果
    public nextVFX: AnimalVFXType = AnimalVFXType.None;//下一个特效
    public isClick: boolean = false;//是否点击
    public isRemove: boolean = false;//是否移除
    public animalVisual: AnimalVisual = null;//动物视觉
    private noodPool: NodePool = null;
    public grid: Grid = null;

    public constructor() {
        this.noodPool = SingletonManager.Instance.GetSingleton(NodePool);
        this.grid = SingletonManager.Instance.GetSingleton(Grid);
    }

    public showVisual(pos: cc.Vec2): void {
        if (this.animalVisual !== null) this.noodPool.PutNode(this.animalVisual.nodePoolType, this.animalVisual.node);
        let node: cc.Node = this.noodPool.GetNode(NodePoolType[AnimalType[this.animalType]]);
        node.parent = this.grid.animalParent;
        node.setPosition(pos);
        this.animalVisual = node.getComponent(AnimalVisual);
        this.animalVisual.Init(this);
    }

    public Remove(model: ActionModel, action: RemoveAction): void {
        model.AddAction(action);
        this.grid._grid[this.row][this.col] = null;
        VFXFactory.GetVFX(this.animalVFX).TriggerVFX(this, model);
    }

    public static GetRandomAnimalType(): AnimalType {
        let type: AnimalType = AnimalType.Brid;
        while (type == AnimalType.Brid)
            type = Util.GetIntRandom(0, Object.keys(AnimalType).length / 2 - 1);
        return type;
    }

    public Destory(): void {
        let effect = this.noodPool.GetNode(NodePoolType.DestroyLight);
        effect.parent = this.grid.vfxParent;
        effect.setPosition(this.animalVisual.node.position);
        this.noodPool.PutNode(NodePoolType[AnimalType[this.animalType]], this.animalVisual.node);
    }
}
