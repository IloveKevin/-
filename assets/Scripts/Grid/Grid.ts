import { AnimalRemoveAction, AnimalShakAction, MoveAction, WaitAction, showVisualAction } from "../Action/Action";
import ActionChain from "../Action/ActionChain";
import ActionModel from "../Action/ActionModel";
import Animal, { AnimalType } from "../Animal/Animal";
import { AnimalVFXType } from "../Animal/AnimalVFX";
import EventSystem, { EventType } from "../Event/EventSystem";
import MyHttp, { MyHttpOition } from "../Http/MyHttp";
import SingletonManager from "../Manager/SingletonManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid extends cc.Component {
    @property({ type: cc.Integer, displayName: "行个数" })
    public row: number = 9;//行个数
    @property({ type: cc.Integer, displayName: "列个数" })
    public col: number = 9;//列个数
    @property({ type: cc.Node, displayName: "动物父节点" })
    public animalParent: cc.Node = null;//动物父节点
    @property({ type: cc.Node, displayName: "特效父节点" })
    public vfxParent: cc.Node = null;//特效父节点
    public canClick: boolean = null;//是否可以点击
    public chooseAnimal: Animal = null;//选择的动物
    public _grid: Animal[][] = null;//动物数组
    private eventSystem: EventSystem = null;//事件系统
    public size: number = 70;
    public similarAnimalType: AnimalType = null;//相同动物类型
    public actionChain: ActionChain = null;//动作链
    private a: XMLHttpRequest = null;
    protected onLoad(): void {
        SingletonManager.Instance.AddSingleton(this);
    }

    protected start(): void {
        this.eventSystem = SingletonManager.Instance.GetSingleton(EventSystem);
        this.eventSystem.AddEvent(EventType.ClickAnimal, this.OnClickAnimal.bind(this));
        this.Init();
    }

    logTest(): void {
        for (let i = this.row - 1; i >= 0; i--) {
            let str = "";
            for (let j = 0; j < this.col; j++) {
                str += AnimalType[this._grid[i][j]?.animalType] + " ";
            }
            cc.log(str);
        }
        cc.log("---------------------------");
    }

    private OnClickAnimal(animal: Animal): void {
        if (this.chooseAnimal == null) {
            this.chooseAnimal = animal;
            return;
        }
        if (this.chooseAnimal == animal) {
            this.chooseAnimal = null;
            return;
        }
        //如果不相邻
        if (Math.abs(this.chooseAnimal.row - animal.row) + Math.abs(this.chooseAnimal.col - animal.col) != 1) {
            this.chooseAnimal.animalVisual.CancelClick();
            this.chooseAnimal = animal;
            return;
        }
        this.canClick = false;
        let callback = () => {
            this.canClick = true;
            cc.log("动作链执行完成");
        }
        this.actionChain = new ActionChain(callback.bind(this));
        //交换位置
        this.ExchangeAnimal(this.chooseAnimal, animal);
        let model = new ActionModel();
        model.AddAction(new MoveAction(this.chooseAnimal, this.GetPos(this.chooseAnimal.row, this.chooseAnimal.col)));
        model.AddAction(new MoveAction(animal, this.GetPos(animal.row, animal.col)));
        model.AddAction(new WaitAction(0.3));
        this.actionChain.AddModel(model);
        //判断是否消除
        let animalList: Animal[] = [];
        animalList.push(this.chooseAnimal);
        animalList.push(animal);
        let ramoveAnimals = this.AnliamlsDetect(animalList);
        if (this.chooseAnimal.animalVFX == AnimalVFXType.Similar && animal.animalVFX == AnimalVFXType.Similar) {
            ramoveAnimals = [];
            for (let i = 0; i < this.row; i++) {
                for (let j = 0; j < this.col; j++) {
                    this._grid[i][j].animalVFX = AnimalVFXType.Similar;
                    ramoveAnimals.push(this._grid[i][j]);
                }
            }
        }
        else if (this.chooseAnimal.animalVFX == AnimalVFXType.Similar || animal.animalVFX == AnimalVFXType.Similar) {
            let tempAnimal = this.chooseAnimal.animalVFX == AnimalVFXType.Similar ? this.chooseAnimal : animal;
            ramoveAnimals.push(tempAnimal);
            this.similarAnimalType = this.chooseAnimal == tempAnimal ? animal.animalType : this.chooseAnimal.animalType;
        }
        // 消除动物
        if (ramoveAnimals.length <= 0) {
            let model = new ActionModel();
            this.ExchangeAnimal(this.chooseAnimal, animal);
            model.AddAction(new MoveAction(this.chooseAnimal, this.GetPos(this.chooseAnimal.row, this.chooseAnimal.col)));
            model.AddAction(new MoveAction(animal, this.GetPos(animal.row, animal.col)));
            this.actionChain.AddModel(model);
            this.actionChain.Run();
            this.CancelClick(this.chooseAnimal, animal);
            this.chooseAnimal = null;
            return;
        }
        while (ramoveAnimals.length > 0) {
            animalList = [];
            let removeModel = new ActionModel();
            let gridDownModel = new ActionModel();
            animalList = animalList.concat(this.RemoveAnimal(ramoveAnimals, removeModel));
            this._grid.forEach((row) => {
                row.forEach((animal) => { if (animal) animal.isRemove = false; })
            });
            removeModel.AddAction(new WaitAction(0.3));
            animalList = animalList.concat(this.GridDown(gridDownModel));
            ramoveAnimals = this.AnliamlsDetect(animalList);
            this.actionChain.AddModel(removeModel);
            this.actionChain.AddModel(gridDownModel);
        }
        this.actionChain.Run();
        this.CancelClick(this.chooseAnimal, animal);
        this.chooseAnimal = null;
        return;
    }

    private CancelClick(...animal: Animal[]): void {
        animal.forEach((animal) => {
            animal.animalVisual.CancelClick();
        })
    }

    //消除动物
    private RemoveAnimal(animals: Animal[], model: ActionModel): Animal[] {
        cc.log("消除动物");
        let animalList: Animal[] = [];
        animals.sort((a, b) => { return a.animalVFX - b.animalVFX });
        animals.forEach((animal) => {
            if (!animal.isRemove) {
                if (animal.nextVFX != AnimalVFXType.None && animal.animalVFX == AnimalVFXType.None) {
                    animal.isRemove = true;
                    animalList.push(animal);
                    animal.animalVFX = animal.nextVFX;
                    animal.nextVFX = AnimalVFXType.None;
                    if (animal.animalVFX == AnimalVFXType.Similar) animal.animalType = AnimalType.Brid;
                    model.AddAction(new showVisualAction(animal, this.GetPos(animal.row, animal.col)));
                    return;
                }
                animal.Remove(model, animal.animalVFX == AnimalVFXType.Similar ? new AnimalShakAction(animal) : new AnimalRemoveAction(animal));
            }
        });
        return animalList;
    }

    //交换位置
    private ExchangeAnimal(animal1: Animal, animal2: Animal): void {
        let tempRow = animal1.row;
        let tempCol = animal1.col;
        animal1.row = animal2.row;
        animal1.col = animal2.col;
        animal2.row = tempRow;
        animal2.col = tempCol;
        this._grid[animal1.row][animal1.col] = animal1;
        this._grid[animal2.row][animal2.col] = animal2;
    }

    //去除重复
    public Deduplication(animalList: Animal[]): void {
        for (let i = 0; i < animalList.length; i++) {
            for (let j = i + 1; j < animalList.length; j++) {
                if (animalList[i] == animalList[j]) {
                    animalList.splice(j, 1);
                    j--;
                }
            }
        }
    }

    private GridDown(model: ActionModel): Animal[] {
        cc.log("掉落");
        let animalList: Animal[] = [];
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row;) {
                let animal = this._grid[j][i];
                if (animal != null && j - 1 >= 0 && this._grid[j - 1][i] == null) {
                    animalList.push(animal);
                    animal.row = j - 1;
                    this._grid[j - 1][i] = animal;
                    this._grid[j][i] = null;
                    j--;
                    model.AddAction(new MoveAction(animal, this.GetPos(j, i)));
                    continue;
                }
                j++;
            }
        }
        for (let i = 0; i < this.col; i++) {
            for (let j = 0, y = 0; j < this.row; j++) {
                if (this._grid[j][i] == null) {
                    let animal = this.AddAnimal(j, i, Animal.GetRandomAnimalType(), true, this.GetPos(y++ + this.row, i));
                    animalList.push(animal);
                    model.AddAction(new MoveAction(animal, this.GetPos(j, i)));
                }
            }
        }
        this.Deduplication(animalList);
        return animalList;
    }


    private Init() {
        this.canClick = true;
        this._grid = [];
        for (let i = 0; i < this.row; i++) this._grid[i] = [];
        for (let i = 0; i < this.col; i++) {
            for (let j = 0; j < this.row; j++) {
                this.AddAnimal(j, i, Animal.GetRandomAnimalType(), false, this.GetPos(j, i));
            }
        }
    }

    //添加一个动物
    private AddAnimal(row: number, col: number, type: AnimalType, repeat: boolean = false, pos: cc.Vec2 = null): Animal {
        cc.log("AddAnimal: row = " + row + ", col = " + col, ", type = " + AnimalType[type], ", repeat = " + repeat);
        let newAanimal = new Animal();
        newAanimal.row = row;
        newAanimal.col = col;
        newAanimal.animalType = type;
        newAanimal.animalVFX = AnimalVFXType.None;
        this._grid[row][col] = newAanimal;
        if (!repeat) {
            while (this.AnimalDetect(newAanimal).length >= 3) {
                newAanimal.animalType = Animal.GetRandomAnimalType();
            }
        }
        if (pos) newAanimal.showVisual(pos);
        return newAanimal;
    }

    //检测一个动物组
    public AnliamlsDetect(animals: Animal[]): Animal[] {
        cc.log("检测动物组");
        let eliminateAnimals: Animal[] = [];
        animals.forEach((animal) => {
            let _eliminateAnimals = this.AnimalDetect(animal);
            if (_eliminateAnimals.length >= 3) {
                eliminateAnimals = eliminateAnimals.concat(_eliminateAnimals);
            }
        });
        this.Deduplication(eliminateAnimals);
        return eliminateAnimals;
    }

    //检测该动物是否相连的相同动物的个数
    private AnimalDetect(animal: Animal): Animal[] {
        cc.log("检测动物");
        let eliminateAnimals: Animal[] = [];
        let rowEliminateAnimals: Animal[] = [];
        let colEliminateAnimals: Animal[] = [];
        let bigNextvfx = animal.nextVFX;
        let rowCount: number = 1;
        let colCount: number = 1;
        let left = animal.col - 1;
        let right = animal.col + 1;
        while (left >= 0 && this._grid[animal.row][left]?.animalType == animal.animalType) {
            bigNextvfx = this._grid[animal.row][left].nextVFX > bigNextvfx ? this._grid[animal.row][left].nextVFX : bigNextvfx;
            rowCount++;
            rowEliminateAnimals.push(this._grid[animal.row][left]);
            left--;
        }
        while (right < this.col && this._grid[animal.row][right]?.animalType == animal.animalType) {
            bigNextvfx = this._grid[animal.row][right].nextVFX > bigNextvfx ? this._grid[animal.row][right].nextVFX : bigNextvfx;
            rowCount++;
            rowEliminateAnimals.push(this._grid[animal.row][right]);
            right++;
        }
        let top = animal.row + 1;
        let bottom = animal.row - 1;
        while (top < this.row && this._grid[top][animal.col]?.animalType == animal.animalType) {
            bigNextvfx = this._grid[top][animal.col].nextVFX > bigNextvfx ? this._grid[top][animal.col].nextVFX : bigNextvfx;
            colCount++;
            colEliminateAnimals.push(this._grid[top][animal.col]);
            top++;
        }
        while (bottom >= 0 && this._grid[bottom][animal.col]?.animalType == animal.animalType) {
            bigNextvfx = this._grid[bottom][animal.col].nextVFX > bigNextvfx ? this._grid[bottom][animal.col].nextVFX : bigNextvfx;
            colCount++;
            colEliminateAnimals.push(this._grid[bottom][animal.col]);
            bottom--;
        }
        if (rowCount >= 3) eliminateAnimals = eliminateAnimals.concat(rowEliminateAnimals);
        if (colCount >= 3) eliminateAnimals = eliminateAnimals.concat(colEliminateAnimals);
        let nextVFX = AnimalVFXType.None;
        if (rowCount >= 5 || colCount >= 5) nextVFX = AnimalVFXType.Similar;
        else if (rowCount >= 3 && colCount >= 3) nextVFX = AnimalVFXType.Warp;
        else if (rowCount >= 4) nextVFX = AnimalVFXType.Line;
        else if (colCount >= 4) nextVFX = AnimalVFXType.Column;
        if (nextVFX > bigNextvfx) {
            eliminateAnimals.forEach((animal) => {
                animal.nextVFX = AnimalVFXType.None;
            });
            animal.nextVFX = nextVFX;
        }
        eliminateAnimals.push(animal);
        return eliminateAnimals;
    }

    public GetPos(row: number, col: number): cc.Vec2 {
        let pos = cc.v2((col - Math.floor(this.col / 2)) * this.size, (row - Math.floor(this.row / 2)) * this.size);
        return pos;
    }
}

export class AddAnimalEventData {
    public row: number = null;
    public animalNode: cc.Node = null;
    public constructor(row: number, animalNode: cc.Node) {
        this.row = row;
        this.animalNode = animalNode;
    }
}