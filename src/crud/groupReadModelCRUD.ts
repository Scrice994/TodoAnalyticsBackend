import { GroupReadModelEntity, IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD, ICRUDResponse } from "./ICRUD";

export class GroupReadModelCRUD implements ICRUD<GroupReadModelEntity>{
    constructor(private _repository: IRepository<GroupReadModelEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            const result = await this._repository.getOneByKey(obj)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async create(newElement: Omit<GroupReadModelEntity, "id">): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            const result = await this._repository.insertOne(newElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async update(filter: IGroupReadModelEntity, updateElement: Partial<GroupReadModelEntity>): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            const result = await this._repository.updateOne(filter, updateElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    private successfullResponse(result: any){
        return {
            statusCode: 200,
            data: {
                response: result
            }
        }
    }
 
    private errorResponse(error: any){
         if (error instanceof Error){
            return {
                statusCode: 500,
                data: {
                    message: error.message,
                },
            };
        } else {
            return {
                statusCode: 500,
                data: {
                    message: `An unknown error occured: ${error}`
                }
            }    
        }
    }

}