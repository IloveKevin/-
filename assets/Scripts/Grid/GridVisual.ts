import Util from "../Util/Util";
import Grid, { AddAnimalEventData } from "./Grid";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GridVisual extends cc.Component {
    @property({ type: Grid, displayName: "逻辑格子" })
    public grid: Grid = null;
    private _gridNode: cc.Node[][] = null;
    // protected onLoad(): void {
    //     this.grid.addAnimalEvent.AddEvent(this.AddAnimalEvent.bind(this));
    //     this.Init();
    // }

    private Init(): void {
        this._gridNode = [];
        for (let i = 0; i < this.grid.row; i++) {
            this._gridNode[i] = [];
        }
    }

    private AddAnimalEvent(args: AddAnimalEventData): void {
        let node = args.animalNode;
        node.parent = this.node;
        this.SetPositionByRow(args.row, node);
    }

    private SetPositionByRow(row: number, node: cc.Node): void {
        let length = this._gridNode[row].length;
        let x = row * node.width;
        let y = length * node.height;
        node.setPosition(x, y);
        cc.log("GetPositionByRow: x = " + x + ", y = " + y);
        this._gridNode[row].push(node);
    }
}
