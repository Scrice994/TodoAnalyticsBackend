import { IGroupEntity } from "../entities/GroupEntity";
import { IEntity } from "../entities/IEntity";
import { IUserEntity } from "../entities/UserEntity";

export interface IRepository<T extends IEntity> {
    //getAll(obj: {[key: string]: unknown}): Promise<T[]>;
    getOneByKey(obj: {[key: string]: unknown}): Promise<T>
    insertOne(newEntity: Omit<T, 'id'>): Promise<T>;
    updateOne(filter: IUserEntity | IGroupEntity, updateUnit: Partial<T>): Promise<T>;
    // deleteOne(id: DataStorageId): Promise<T>;
    // deleteAll(obj: {[key: string]: unknown}): Promise<number>
}