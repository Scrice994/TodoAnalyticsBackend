import { GroupReadModelEntity } from "../entities/mongo/groupReadModelSchema";
import { IEntity } from "../entities/IEntity";


export interface ICRUD<T extends IEntity>{
    //read(obj: { [key: string]: unknown }): Promise<ICRUDResponse<T[]>>;
    readOne(obj: { [key: string]: unknown }): Promise<T>
    create(newElement: Omit<T, 'id'>): Promise<T>;
    update(elementToUpdate: GroupReadModelEntity | IEntity, event: any): Promise<T>;
    // delete(id: DataStorageId): Promise<ICRUDResponse<T>>;
    // deleteAll(obj: {[key: string]: unknown}): Promise<ICRUDResponse<number>>
}
