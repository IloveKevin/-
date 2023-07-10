import Animal, { AnimalType } from "../Animal/Animal";

export default interface Action {
    Run(callback?: () => void): void;
}

export class RemoveAction implements Action {
    public Run(callback?: () => void): void { }
}

export class showVisualAction implements Action {
    constructor(target: Animal, pos: cc.Vec2) {
        this.target = target;
        this.position = pos;
    }
    private position: cc.Vec2 = null;//目标位置
    private target: Animal = null;//目标节点
    public Run(callback?: () => void): void {
        cc.log("显示动物开始执行", AnimalType[this.target.animalType]);
        this.target.showVisual(this.position);
        if (callback != null)
            callback();
    }
}

export class MoveAction implements Action {
    constructor(animal: Animal, position: cc.Vec2) {
        this.animal = animal;
        this.position = cc.v3(position.x, position.y, 0);
    }
    private animal: Animal = null;//目标动物
    private position: cc.Vec3 = null;//目标位置
    private speed: number = 1000;//移动速度
    public Run(callback?: () => void): void {
        cc.log("移动动作开始执行", AnimalType[this.animal.animalType], this.position.x, this.position.y);
        let ndoe = this.animal.animalVisual.node;
        cc.tween(ndoe)
            .to(ndoe.position.sub(this.position).mag() / this.speed, { position: this.position })
            .call(callback)
            .start();
    }
}

export class WaitAction implements Action {
    constructor(time: number) {
        this.time = time * 1000;
    }
    private time: number = 0;//等待时间
    public Run(callback?: () => void): void {
        cc.log("等待动作开始执行", this.time);
        setTimeout(() => {
            if (callback != null)
                callback();
        }, this.time);
    }
}

export class AnimalRemoveAction extends RemoveAction {
    constructor(target: Animal) {
        super();
        this.target = target;
    }
    private target: Animal = null;//目标动物
    public Run(callback?: () => void): void {
        this.target.Destory();
        if (callback != null)
            callback();
    }
}

export class AnimalShakAction extends RemoveAction {
    constructor(target: Animal) {
        super();
        this.target = target;
    }
    private target: Animal = null;//目标动物
    public Run(callback?: () => void): void {
        let node = this.target.animalVisual.node;
        cc.tween(node)
            .repeat(3, cc.tween(node).to(0.1, { angle: 10 }).to(0.1, { angle: -10 }))
            .call(() => {
                this.target.Destory();
                if (callback != null)
                    callback();
            })
            .start();
    }
}
