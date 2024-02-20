import { GroupReadModelEntity } from "../entities/Entities";
import { IDataStorage } from "../dataStorage/IDataStorage";
import { IEntity } from "../entities/Entities";
import { IRepository } from "./IRepository";

export class GroupReadModelRepository implements IRepository<GroupReadModelEntity>{
    constructor(private _dataStorage: IDataStorage<GroupReadModelEntity>){}

    async getOneByKey(obj: { [key: string]: unknown; }): Promise<GroupReadModelEntity> {
        const result = await this._dataStorage.findOneByKey(obj);
        return result
    }

    async insertOne(newEntity: Omit<GroupReadModelEntity, "id">): Promise<GroupReadModelEntity> {
        const result = await this._dataStorage.create(newEntity);
        return result
    }

    async updateOne(obj: Required<IEntity> & Partial<GroupReadModelEntity>): Promise<GroupReadModelEntity> {
        const result = this._dataStorage.update(obj);
        return result
    }

    getAll(obj: { [key: string]: unknown; }): Promise<{ id: string; tenantId: string; todos?: number | undefined; completedTodos?: number | undefined; }[]> {
        throw new Error("Method not implemented.");
    }
}