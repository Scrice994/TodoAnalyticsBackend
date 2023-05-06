import { GroupEntity, IGroupEntity } from "../entities/GroupEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD, ICRUDResponse } from "./ICRUD";

export class GroupCRUD implements ICRUD<GroupEntity>{
    constructor(private _repository: IRepository<GroupEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<ICRUDResponse<GroupEntity>> {
        try {
            const result = await this._repository.getOneByKey(obj)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async create(newElement: Omit<GroupEntity, "id">): Promise<ICRUDResponse<GroupEntity>> {
        try {
            const result = await this._repository.insertOne(newElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async update(filter: IGroupEntity, updateElement: Partial<GroupEntity>): Promise<ICRUDResponse<GroupEntity>> {
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