import { IDataStorage } from "../dataStorage/IDataStorage";
import { GroupEntity, IGroupEntity } from "../entities/GroupEntity";
import { IRepository } from "./IRepository";

export class GroupRepository implements IRepository<GroupEntity>{
    constructor(private _dataStorage: IDataStorage<GroupEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<GroupEntity> {
        const result = await this._dataStorage.findOneByKey(obj)

        return result
    }

    async insertOne(newEntity: Omit<GroupEntity, "id">): Promise<GroupEntity> {
        const result = await this._dataStorage.create(newEntity)

        return result
    }

    updateOne(filter: IGroupEntity, updateUnit: Partial<GroupEntity>): Promise<GroupEntity> {
        const result = this._dataStorage.update(filter, updateUnit)

        return result
    }

}