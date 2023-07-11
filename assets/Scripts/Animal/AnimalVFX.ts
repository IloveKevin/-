import { AnimalShakAction, AnimalRemoveAction } from "../Action/Action";
import ActionModel from "../Action/ActionModel";
import { AnimalVFXType } from "../Config/EnumConfig";
import Grid from "../Grid/Grid";
import SingletonManager from "../Manager/SingletonManager";
import Animal from "./Animal";

export interface AnimalVFX {
    //触发特效
    TriggerVFX(animal: Animal, model: ActionModel): void;
}

export default class VFXFactory {
    public static GetVFX(type: AnimalVFXType): AnimalVFX {
        switch (type) {
            case AnimalVFXType.None: return new NoneVFX();
            case AnimalVFXType.Similar: return new SimilarVFX();
            case AnimalVFXType.Warp: return new WarpVFX();
            case AnimalVFXType.Column: return new ColumnVFX();
            case AnimalVFXType.Line: return new LineVFX();
        }
    }
}

export class NoneVFX implements AnimalVFX {
    TriggerVFX(animal: Animal): void {
        animal.isRemove = true;
    }
}

export class SimilarVFX implements AnimalVFX {
    TriggerVFX(animal: Animal, model: ActionModel): void {
        animal.isRemove = true;
        let grid = SingletonManager.Instance.GetSingleton(Grid);
        let type = grid.similarAnimalType == null ? Animal.GetRandomAnimalType() : grid.similarAnimalType;
        for (let i = 0; i < grid.row; i++) {
            for (let j = 0; j < grid.col; j++) {
                if (grid._grid[i][j]?.animalType == type) {
                    if (!grid._grid[i][j].isRemove) {
                        grid._grid[i][j].Remove(model, new AnimalShakAction(grid._grid[i][j]));
                    }
                }
            }
        }
        grid.similarAnimalType = null;
    }
}

export class WarpVFX implements AnimalVFX {
    TriggerVFX(animal: Animal, model: ActionModel): void {
        animal.isRemove = true;
        let grid = SingletonManager.Instance.GetSingleton(Grid);
        let lengh = 2;
        for (let i = lengh; i >= - lengh; i--) {
            for (let j = - Math.abs(Math.abs(i) - lengh); j <= Math.abs(Math.abs(i) - lengh); j++) {
                let row = animal.row + i;
                let col = animal.col + j;
                if (col < 0 || col >= grid.col || row < 0 || row >= grid.row) continue;
                let newAniaml = grid._grid[row][col];
                if (newAniaml !== null && newAniaml !== undefined) {
                    if (!newAniaml.isRemove) newAniaml.Remove(model, newAniaml.animalVFX == AnimalVFXType.Similar ? new AnimalShakAction(newAniaml) : new AnimalRemoveAction(newAniaml));
                }
            }
        }
    }
}

export class ColumnVFX implements AnimalVFX {
    TriggerVFX(animal: Animal, model: ActionModel): void {
        animal.isRemove = true;
        let grid = SingletonManager.Instance.GetSingleton(Grid);
        for (let i = 0; i < grid.row; i++) {
            if (grid._grid[i][animal.col] !== null && grid._grid[i][animal.col] !== undefined) {
                if (!grid._grid[i][animal.col].isRemove) grid._grid[i][animal.col].Remove(model, grid._grid[i][animal.col].animalVFX == AnimalVFXType.Similar ? new AnimalShakAction(grid._grid[i][animal.col]) : new AnimalRemoveAction(grid._grid[i][animal.col]));
            }
        }
    }
}

export class LineVFX implements AnimalVFX {
    TriggerVFX(animal: Animal, model: ActionModel): void {
        animal.isRemove = true;
        let grid = SingletonManager.Instance.GetSingleton(Grid);
        for (let i = 0; i < grid.col; i++) {
            if (grid._grid[animal.row][i] !== null && grid._grid[animal.row][i] !== undefined) {
                if (!grid._grid[animal.row][i].isRemove) grid._grid[animal.row][i].Remove(model, grid._grid[animal.row][i].animalVFX == AnimalVFXType.Similar ? new AnimalShakAction(grid._grid[animal.row][i]) : new AnimalRemoveAction(grid._grid[animal.row][i]));
            }
        }
    }
}
