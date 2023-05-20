import { IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IEntity } from "../entities/IEntity";
import { UserEntity } from "../entities/UserEntity";
import { IUserReadModelEntity } from "../entities/UserReadModelEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD, ICRUDResponse } from "./ICRUD";

export class UserCRUD implements ICRUD<UserEntity>{
    constructor(private _repository: IRepository<UserEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<ICRUDResponse<UserEntity>> {
        try {
            const result = await this._repository.getOneByKey(obj)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }

    async create(newElement: Omit<UserEntity, "id">): Promise<ICRUDResponse<UserEntity>> {
        try {
            const result = await this._repository.insertOne(newElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }

    }

    async update(filter: IEntity | IUserReadModelEntity | IGroupReadModelEntity, updateElement: Partial<UserEntity>): Promise<ICRUDResponse<UserEntity>> {
        throw new Error("Method not implemented.");
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