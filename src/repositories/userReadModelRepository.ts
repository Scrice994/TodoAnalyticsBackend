import { UserReadModelEntity } from "src/entities/mongo/userReadModelSchema";
import { IDataStorage } from "../dataStorage/IDataStorage";
import { IRepository } from "./IRepository";
import { IEntity } from "src/entities/IEntity";

export class UserReadModelRepository implements IRepository<UserReadModelEntity>{
    constructor(private _dataStorage: IDataStorage<UserReadModelEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<UserReadModelEntity> {
        const result = await this._dataStorage.findOneByKey(obj)
        return result
    }

    async insertOne(newEntity: Omit<UserReadModelEntity, "id">): Promise<UserReadModelEntity> {
        const result = await this._dataStorage.create(newEntity)
        return result
    }

    updateOne(filter: IEntity, updateUnit: Partial<UserReadModelEntity>): Promise<UserReadModelEntity> {
        const result = this._dataStorage.update(filter, updateUnit)
        return result
    }
}