import { IEntity } from "src/entities/IEntity";
import { UserReadModelEntity } from "../entities/mongo/userReadModelSchema";
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
        const { id, ...elementsToUpdate } = elementToUpdate;

        const result = await this._repository.updateOne({ id }, elementsToUpdate);
        return result;
    }
}