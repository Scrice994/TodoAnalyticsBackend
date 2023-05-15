import { IDataStorage } from "../dataStorage/IDataStorage";
import { IUserReadModelEntity, UserReadModelEntity } from "../entities/UserReadModelEntity";
import { IRepository } from "./IRepository";

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

    async updateOne(filter: IUserReadModelEntity, updateUnit: Partial<UserReadModelEntity>): Promise<UserReadModelEntity> {
        const result = await this._dataStorage.update(filter, updateUnit)

        return result
    }

}