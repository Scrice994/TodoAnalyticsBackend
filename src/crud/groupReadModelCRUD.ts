import { IEntity } from "src/entities/IEntity";
import { GroupReadModelEntity } from "../entities/mongo/groupReadModelSchema";
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
        const { id, ...elementsToUpdate } = elementToUpdate

        const result = await this._repository.updateOne({ id }, elementsToUpdate);
        return result;
    }
}