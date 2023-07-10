import SingletonManager from "../Manager/SingletonManager";
import Util from "../Util/Util";

const { ccclass, property } = cc._decorator;
export enum NodePoolType {
    Bear,//熊
    Brid,//鸟
    Cat,//猫头鹰
    Chicken,//鸡
    Fox,//狐狸
    Frog,//青蛙
    Horse,//河马
    DestroyLight,//消除光效
    BombWhite,//白色光线
}
@ccclass
export default class NodePool extends cc.Component {
    @property({ type: [cc.Prefab], displayName: "预制体" })
    private prefabList: cc.Prefab[] = [];
    @property({ type: cc.Integer, displayName: "预制体初始创建数量" })
    private count: number = 5;
    private poolMap: Map<NodePoolType, cc.NodePool>;
    protected onLoad(): void {
        SingletonManager.Instance.AddSingleton(this);
        this.Init();
    }
    public Init(): void {
        this.poolMap = new Map<NodePoolType, cc.NodePool>();
        for (var poolType in NodePoolType) {
            let index = Number(poolType);
            if (!isNaN(index)) {
                let pool: cc.NodePool = null;
                this.prefabList.forEach((prefab) => {
                    cc.log("prefabName", prefab.name, "nodePoolName", NodePoolType[index]);
                    if (prefab.name == NodePoolType[index]) {
                        pool = new cc.NodePool();
                        for (let i = 0; i < this.count; i++) {
                            let node = cc.instantiate(prefab);
                            pool.put(node);
                        }
                    }
                });
                if (!pool) {
                    cc.error("NodePool: " + NodePoolType[index] + " 预制体不存在!");
                    continue;
                }
                this.poolMap.set(index, pool);
            }
        }
    }
    public GetNode(poolType: NodePoolType): cc.Node {
        cc.log("GetNode: " + NodePoolType[poolType]);
        let pool = this.poolMap.get(poolType);
        if (pool.size() > 0) {
            return pool.get();
        }
        else {
            let prefab: cc.Prefab = null;
            this.prefabList.forEach((prefabItem) => {
                if (prefabItem.name == NodePoolType[poolType]) {
                    prefab = prefabItem;
                }
            });
            if (!prefab) {
                cc.error("NodePool: " + NodePoolType[poolType] + " 预制体不存在!");
                return null;
            }
            return cc.instantiate(prefab);
        }
    }
    public PutNode(poolType: NodePoolType, node: cc.Node): void {
        let pool = this.poolMap.get(poolType);
        if (pool) {
            pool.put(node);
        }
    }
}