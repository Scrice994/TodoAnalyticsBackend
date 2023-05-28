import { IDataStorage } from "../dataStorage/IDataStorage";
import { IEntity } from "../entities/IEntity";
import { UserEntity } from "../entities/UserEntity";
import { IRepository } from "./IRepository";

export class UserRepository implements IRepository<UserEntity>{
    constructor(private _dataStorage: IDataStorage<UserEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<UserEntity> {
        const result = await this._dataStorage.findOneByKey(obj)
        return result
    }

    async insertOne(newEntity: Omit<UserEntity, "id">): Promise<UserEntity> {
        const result = await this._dataStorage.create(newEntity)
        return result
    }

    async updateOne(filter: IEntity, updateUnit: Partial<UserEntity>): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }

}