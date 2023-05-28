import { IEntity } from "../entities/IEntity";
import { UserEntity } from "../entities/UserEntity";
import { IRepository } from "../repositories/IRepository";
import { ValidCredentials } from "../utils/ValidCredentials/ValidCredentials";
import { CryptoPasswordHandler } from "../utils/cryptPassword/CryptoPasswordHandler";
import { PasswordHandler } from "../utils/cryptPassword/PasswordHandler";
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

    async create(newElement: Omit<UserEntity, "id" | "salt">): Promise<ICRUDResponse<UserEntity>> {
        try {
            if(!newElement.username){
                return this.customErrorResponse(404, 'Missing @parameter username')
            }
            if(!newElement.password){
                return this.customErrorResponse(404, 'Missing @parameter password')
            }
        
            const credentials = new ValidCredentials(newElement.username, newElement.password)
        
            const validUsername = credentials.usernameCheck()
            const validPassword = credentials.passwordCheck()
        
            if(!validUsername){
                return this.customErrorResponse(404, 'Invalid @parameter username')
            }
            if(!validPassword){
                return this.customErrorResponse(404, 'Invalid @parameter password')
            }

            const cryptoObj = new PasswordHandler(new CryptoPasswordHandler()).cryptPassword(newElement.password)

            const result = await this._repository.insertOne({
                ...newElement, 
                password: cryptoObj.hashPassword, 
                salt: cryptoObj.salt
            })
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }

    }

    async update(filter: IEntity , updateElement: Partial<UserEntity>): Promise<ICRUDResponse<UserEntity>> {
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

    private customErrorResponse(statusCode: number, customErrorMessage: string){
        return {
            statusCode: statusCode,
            data: {
                message: customErrorMessage,
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