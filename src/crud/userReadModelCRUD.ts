import { IUserReadModelEntity, UserReadModelEntity } from "../entities/UserReadModelEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD, ICRUDResponse } from "./ICRUD";

export class UserReadModelCRUD implements ICRUD<UserReadModelEntity>{
    constructor(private _repository: IRepository<UserReadModelEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<ICRUDResponse<UserReadModelEntity>> {
        try {
            const result = await this._repository.getOneByKey(obj)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async create(newElement: Omit<UserReadModelEntity, "id">): Promise<ICRUDResponse<UserReadModelEntity>> {
        try {
            const result = await this._repository.insertOne(newElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async update(filter: IUserReadModelEntity, updateElement: Partial<UserReadModelEntity>): Promise<ICRUDResponse<UserReadModelEntity>> {
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