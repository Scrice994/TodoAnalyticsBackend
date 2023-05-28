import { GroupReadModelEntity, IGroupReadModelEntity } from "../entities/GroupReadModelEntity";
import { IRepository } from "../repositories/IRepository";
import { ICRUD, ICRUDResponse } from "./ICRUD";

export class GroupReadModelCRUD implements ICRUD<GroupReadModelEntity>{
    constructor(private _repository: IRepository<GroupReadModelEntity>){}

    async readOne(obj: { [key: string]: unknown; }): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            if(!obj){
                return this.customErrorResponse(400, 'Missing @filter parameter')
            }
            const result = await this._repository.getOneByKey(obj)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async create(newElement: Omit<GroupReadModelEntity, "id">): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            if(!newElement.tenantId){
                return this.customErrorResponse(404, 'Missing @parameter tenantId')
            }
            
            const result = await this._repository.insertOne(newElement)
            return this.successfullResponse(result)
        } catch (error) {
            return this.errorResponse(error)
        }
    }
    async update(elementToUpdate: GroupReadModelEntity, event: any): Promise<ICRUDResponse<GroupReadModelEntity>> {
        try {
            const { tenantId, todos, completedTodos, id } = elementToUpdate

            if(event.type === 'newTodo'){
                const result = await this._repository.updateOne({ tenantId }, { todos: todos! + 1 })
                return this.successfullResponse(result)
            }

            if(event.type === 'updateTodo'){
                if(event.data.completed === true){
                    const result = await this._repository.updateOne({ tenantId }, { completedTodos: completedTodos! + 1 })
                    return this.successfullResponse(result)
                } else {
                    const result = await this._repository.updateOne({ tenantId }, { completedTodos: completedTodos! - 1 })
                    return this.successfullResponse(result)
                }
            }

            if(event.type === 'deleteTodo'){
                if(event.data.completed === true){
                    const result = await this._repository.updateOne({ tenantId }, { todos: todos! - 1, completedTodos: completedTodos! - 1 })
                    return this.successfullResponse(result)
                } else {
                    const result = await this._repository.updateOne({ tenantId }, { todos: todos! - 1 })
                    return this.successfullResponse(result)
                }
            }

            if(event.type === 'deleteAllTodos'){
                const deletedTodos: any[] = event.data.deletedTodos
                const deletedCompletedTodos: any[] = deletedTodos.filter((todo: any) => todo.completed === true)
                const result = await this._repository.updateOne({ tenantId }, { todos: todos! - deletedTodos.length, completedTodos: completedTodos! - deletedCompletedTodos.length })
                return this.successfullResponse(result)
            }

            return this.customErrorResponse(404, 'Invalid @event recived')
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