import { GroupReadModelEntity } from "../entities/GroupReadModelEntity";
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

    async update(elementToUpdate: GroupReadModelEntity, event: any): Promise<GroupReadModelEntity> {
        const { tenantId, todos, completedTodos, id } = elementToUpdate

        if(event.type === 'newTodo'){
            const result = await this._repository.updateOne({ tenantId }, { todos: todos! + 1 });
            return result;
        }

        if(event.type === 'updateTodo'){
            if(event.data.completed === true){
                const result = await this._repository.updateOne({ tenantId }, { completedTodos: completedTodos! + 1 });
                return result;
            } else {
                const result = await this._repository.updateOne({ tenantId }, { completedTodos: completedTodos! - 1 })
                return result;
            }
        }

        if(event.type === 'deleteTodo'){
            if(event.data.completed === true){
                const result = await this._repository.updateOne({ tenantId }, { todos: todos! - 1, completedTodos: completedTodos! - 1 })
                return result;
            } else {
                const result = await this._repository.updateOne({ tenantId }, { todos: todos! - 1 })
                return result;
            }
        }

        if(event.type === 'deleteAllTodos'){
            const deletedTodos: any[] = event.data.deletedTodos
            const deletedCompletedTodos: any[] = deletedTodos.filter((todo: any) => todo.completed === true)
            const result = await this._repository.updateOne({ tenantId }, { todos: todos! - deletedTodos.length, completedTodos: completedTodos! - deletedCompletedTodos.length })
            return result;
        }

        return createHttpError(404, 'Invalid @event recived');
    }
}