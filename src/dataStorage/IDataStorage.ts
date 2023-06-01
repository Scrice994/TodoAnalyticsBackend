import { IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IEntity } from "../entities/IEntity";

export type DataStorageId = string;

export interface IDataStorage<T extends IEntity> {
    //find(obj: {[key: string]: unknown}): Promise<T[]>;
    findOneByKey(obj: {[key: string]: unknown}): Promise<T>;
    create(entity: Omit<T, 'id'>): Promise<T>;
    update(filter: IGroupReadModelEntity | IEntity, toUpdate: Partial<T>): Promise<T>;
    // delete(id: DataStorageId): Promise<T>;
    // deleteMany(obj: {[key: string]: unknown}): Promise<number>
}