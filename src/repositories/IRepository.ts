import { IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IEntity } from "../entities/IEntity";
import { IUserReadModelEntity } from "../entities/UserReadModelEntity";

export interface IRepository<T extends IEntity> {
    //getAll(obj: {[key: string]: unknown}): Promise<T[]>;
    getOneByKey(obj: {[key: string]: unknown}): Promise<T>
    insertOne(newEntity: Omit<T, 'id'>): Promise<T>;
    updateOne(filter: IUserReadModelEntity | IGroupReadModelEntity, updateUnit: Partial<T>): Promise<T>;
    // deleteOne(id: DataStorageId): Promise<T>;
    // deleteAll(obj: {[key: string]: unknown}): Promise<number>
}