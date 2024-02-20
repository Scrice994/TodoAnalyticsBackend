import { UserReadModelEntity } from "../entities/Entities";
import { IDataStorage } from "../dataStorage/IDataStorage";
import { IRepository } from "./IRepository";
import { IEntity } from "src/entities/Entities";

export class UserReadModelRepository implements IRepository<UserReadModelEntity>{
    constructor(private _dataStorage: IDataStorage<UserReadModelEntity>){}
    async getAll(obj: { [key: string]: unknown; }): Promise<UserReadModelEntity[]> {
        const result = await this._dataStorage.find(obj);
        return result;
    }

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<UserReadModelEntity> {
        const result = await this._dataStorage.findOneByKey(obj);
        return result;
    }

    async insertOne(newEntity: Omit<UserReadModelEntity, "id">): Promise<UserReadModelEntity> {
        const result = await this._dataStorage.create(newEntity);
        return result;
    }

    async updateOne(obj: Required<IEntity> & Partial<UserReadModelEntity>): Promise<UserReadModelEntity> {
        const result = this._dataStorage.update(obj);
        return result;
    }
}