import { IGroupEntity } from "../entities/GroupEntity";
import { IEntity } from "../entities/IEntity";
import { IUserEntity } from "../entities/UserEntity";
import { IDataStorage } from "./IDataStorage";
import mongoose from "mongoose";

export class MongoDataStorage<T extends IEntity> implements IDataStorage<T>{
    constructor(private _model: mongoose.Model<any>){}

    async findOneByKey(obj: { [key: string]: unknown; }): Promise<T> {
        const findElement = await this._model.findOne(obj);

        const { __v, _id, ...result } = findElement.toObject();

        return result
    }

    async create(entity: Omit<T, "id">): Promise<T> {
        const createNewEntity = await this._model.create(entity);

        const { __v, _id, ...result} = createNewEntity.toObject();

        return result
    }
    
    async update(filter: IUserEntity | IGroupEntity, toUpdate: Partial<T>): Promise<T> {
      
        const updateEntity = await this._model.findOneAndUpdate(filter, toUpdate, { new: true })

        const { __v, _id, ...result } = updateEntity.toObject()

        return result
    }
}