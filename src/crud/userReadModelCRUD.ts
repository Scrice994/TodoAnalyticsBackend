import { IEntity } from "src/entities/Entities";
import { UserReadModelEntity } from "../entities/Entities";
import { IRepository } from "../repositories/IRepository";
import { ICRUD } from "./ICRUD";
import createHttpError from "http-errors";

export class UserReadModelCRUD implements ICRUD<UserReadModelEntity>{
    constructor(private _repository: IRepository<UserReadModelEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<UserReadModelEntity> {
        if(!obj){
            throw createHttpError(400, 'Missing @filter parameter');
        }
        const result = await this._repository.getOneByKey(obj);
        return result;
    }

    async create(newElement: Omit<UserReadModelEntity, "id">): Promise<UserReadModelEntity> {
        if(!newElement.userId){
            return createHttpError(404, 'Missing @parameter userId')
        }
            
        const result = await this._repository.insertOne(newElement);
        return result;
    }

    async update(elementToUpdate: Required<IEntity> & Partial<UserReadModelEntity>): Promise<UserReadModelEntity> {
        if(!elementToUpdate.id){
            return createHttpError(404, 'Missing @parameter id');
        }

        const result = await this._repository.updateOne(elementToUpdate);
        return result;
    }
}