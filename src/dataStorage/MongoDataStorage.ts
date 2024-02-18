import { IGroupReadModelEntity } from "../entities/IEntity";
import { IEntity } from "../entities/IEntity";
import { IDataStorage } from "./IDataStorage";
import mongoose from "mongoose";

export class MongoDataStorage<T extends IEntity> implements IDataStorage<T>{
    constructor(private _model: mongoose.Model<any>){}

    async find(obj: { [key: string]: unknown; }): Promise<T[]> {
        const findElements = await this._model.find(obj);
        return findElements.map(element => {
            const { __v, _id, ...result } = element.toObject();
            return result
        });
    }

    async findOneByKey(obj: { [key: string]: unknown; }): Promise<T> {
        const findElement = await this._model.findOne(obj);

        if(findElement === null){
            return findElement
        }

        const { __v, _id, ...result } = findElement.toObject();

        return result
    }

    async create(entity: Omit<T, "id">): Promise<T> {
        const createNewEntity = await this._model.create(entity);

        const { __v, _id, ...result} = createNewEntity.toObject();

        return result
    }
    
    async update(filter: IGroupReadModelEntity | IEntity, toUpdate: Partial<T>): Promise<T> {
      
        const updateEntity = await this._model.findOneAndUpdate(filter, toUpdate, { new: true })

        const { __v, _id, ...result } = updateEntity.toObject()

        return result
    }
}