import { IEntity } from "src/entities/Entities";
import { GroupReadModelEntity } from "../entities/Entities";
import { IRepository } from "../repositories/IRepository";
import { ICRUD } from "./ICRUD";
import createHttpError from "http-errors";

export class GroupReadModelCRUD implements ICRUD<GroupReadModelEntity>{
    constructor(private _repository: IRepository<GroupReadModelEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<GroupReadModelEntity> {
        if(!obj){
            throw createHttpError(400, 'Missing @filter parameter');
        }
        const result = await this._repository.getOneByKey(obj);
        return result;
    }

    async create(newElement: Omit<GroupReadModelEntity, "id">): Promise<GroupReadModelEntity> {
        if(!newElement.tenantId){
            return createHttpError(404, 'Missing @parameter tenantId')
        }
            
        const result = await this._repository.insertOne(newElement);
        return result;
    }

    async update(elementToUpdate: Required<IEntity> & Partial<GroupReadModelEntity>): Promise<GroupReadModelEntity> {
        if(!elementToUpdate.id){
            return createHttpError(404, 'Missing @parameter id');
        }

        const result = await this._repository.updateOne(elementToUpdate);
        return result;
    }
}