import { IDataStorage } from "../dataStorage/IDataStorage";
import { GroupReadModelEntity, IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IRepository } from "./IRepository";

export class GroupRepository implements IRepository<GroupReadModelEntity>{
    constructor(private _dataStorage: IDataStorage<GroupReadModelEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<GroupReadModelEntity> {
        const result = await this._dataStorage.findOneByKey(obj)

        return result
    }

    async insertOne(newEntity: Omit<GroupReadModelEntity, "id">): Promise<GroupReadModelEntity> {
        const result = await this._dataStorage.create(newEntity)

        return result
    }

    updateOne(filter: IGroupReadModelEntity, updateUnit: Partial<GroupReadModelEntity>): Promise<GroupReadModelEntity> {
        const result = this._dataStorage.update(filter, updateUnit)

        return result
    }

}