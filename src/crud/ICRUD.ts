import { GroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IEntity } from "../entities/IEntity";

interface ICRUDBaseResponse {
    statusCode: number;
    data: {[key:string]: unknown}
}

export interface ICrudErrorResponse extends ICRUDBaseResponse {
    data: {
        message: string
    }
}

export interface ICRUDSuccessResponse<T> extends ICRUDBaseResponse {
    data: {
        response: T
    }
}

export type ICRUDResponse<T> = ICRUDSuccessResponse<T> | ICrudErrorResponse;

export interface ICRUD<T extends IEntity>{
    //read(obj: { [key: string]: unknown }): Promise<ICRUDResponse<T[]>>;
    readOne(obj: { [key: string]: unknown }): Promise<ICRUDResponse<T>>
    create(newElement: Omit<T, 'id'>): Promise<ICRUDResponse<T>>;
    update(elementToUpdate: GroupReadModelEntity | IEntity, event: any): Promise<ICRUDResponse<T>>;
    // delete(id: DataStorageId): Promise<ICRUDResponse<T>>;
    // deleteAll(obj: {[key: string]: unknown}): Promise<ICRUDResponse<number>>
}
