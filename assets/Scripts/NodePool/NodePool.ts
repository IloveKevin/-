import SingletonBase from "../Base/SingletonBase";
import { NodePoolType } from "../Config/EnumConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NodePool extends SingletonBase {
    @property({ type: [cc.Prefab], displayName: "预制体" })
    private prefabList: cc.Prefab[] = [];
    @property({ type: cc.Integer, displayName: "预制体初始创建数量" })
    private count: number = 5;
    private poolMap: Map<NodePoolType, cc.NodePool>;
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
