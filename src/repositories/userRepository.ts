import { IDataStorage } from "../dataStorage/IDataStorage";
import { IUserEntity, UserEntity } from "../entities/UserEntity";
import { IRepository } from "./IRepository";

export class userRepository implements IRepository<UserEntity>{
    constructor(private _dataStorage: IDataStorage<UserEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<UserEntity> {
        const result = await this._dataStorage.findOneByKey(obj)

        return result
    }

    async insertOne(newEntity: Omit<UserEntity, "id">): Promise<UserEntity> {
        const result = await this._dataStorage.create(newEntity)

        return result
    }

    async updateOne(filter: IUserEntity, updateUnit: Partial<UserEntity>): Promise<UserEntity> {
        const result = await this._dataStorage.update(filter, updateUnit)

        return result
    }

}