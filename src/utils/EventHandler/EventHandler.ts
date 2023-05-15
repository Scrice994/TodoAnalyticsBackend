import { ICRUD } from "../../crud/ICRUD";
import { GroupReadModelEntity } from "../../entities/GroupReadModelEntity";
import { UserReadModelEntity } from "../../entities/UserReadModelEntity";
import { EventHandlerResponse, IEventHanlder } from "./IEventHandler";

export class EventHandler implements IEventHanlder{
    constructor(
        private _USER_CRUD: ICRUD<UserReadModelEntity>,
        private _GROUP_CRUD: ICRUD<GroupReadModelEntity>,
        private user: UserReadModelEntity | null,
        private group: GroupReadModelEntity | null
    ){}
    
    newTodoHandler = async (userId: string, tenantId: string): Promise<EventHandlerResponse> => {

        let updatedUser: UserReadModelEntity | null = null;
        let updatedGroup: GroupReadModelEntity | null = null;
     
        if(userId){
            const updateUserReadModelEntity = await this._USER_CRUD.update({ userId }, { todos: this.user!.todos! + 1 })
            if('response' in updateUserReadModelEntity.data){
                updatedUser = updateUserReadModelEntity.data.response
            }
        }
    
        if(tenantId){
            const updateGroupReadModelEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! + 1 })
            if('response' in updateGroupReadModelEntity.data){
                updatedGroup = updateGroupReadModelEntity.data.response
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    updateTodoHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
    
        let updatedUser: UserReadModelEntity | null = null;
        let updatedGroup: GroupReadModelEntity | null = null;
    
        if(data.completed === true){
            if(userId){
                const updateUserReadModelEntity = await this._USER_CRUD.update({ userId }, { completedTodos: this.user!.completedTodos! + 1 })
                if('response' in updateUserReadModelEntity.data){
                    updatedUser = updateUserReadModelEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupReadModelEntity = await this._GROUP_CRUD.update({ tenantId }, { completedTodos: this.group!.completedTodos! + 1 })
                if('response' in updateGroupReadModelEntity.data){
                    updatedGroup = updateGroupReadModelEntity.data.response
                }
            }
        }
    
        if(data.completed === false){
            if(userId){
                const updateUserReadModelEntity = await this._USER_CRUD.update({ userId }, { completedTodos: this.user!.completedTodos! - 1 })
                if('response' in updateUserReadModelEntity.data){
                    updatedUser = updateUserReadModelEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupReadModelEntity = await this._GROUP_CRUD.update({ tenantId }, { completedTodos: this.group!.completedTodos! - 1 })
                if('response' in updateGroupReadModelEntity.data){
                    updatedGroup = updateGroupReadModelEntity.data.response
                }
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    deleteTodoHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
        let updatedUser: UserReadModelEntity | null = null;
        let updatedGroup: GroupReadModelEntity | null = null;
    
        if(data.completed === false){
            if(userId){
                const updateUserReadModelEntity = await this._USER_CRUD.update({ userId }, { todos: this.user!.todos! - 1 })
                if('response' in updateUserReadModelEntity.data){
                    updatedUser = updateUserReadModelEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupReadModelEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! - 1 })
                if('response' in updateGroupReadModelEntity.data){
                    updatedGroup = updateGroupReadModelEntity.data.response
                }
            }
    
        } else {
            
            if(userId){
                const updateUserReadModelEntity = await this._USER_CRUD.update(
                    { userId }, { todos: this.user!.todos! - 1, completedTodos: this.user!.completedTodos! - 1 }
                )
                if('response' in updateUserReadModelEntity.data){
                    updatedUser = updateUserReadModelEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupReadModelEntity = await this._GROUP_CRUD.update(
                    { tenantId }, { todos: this.group!.todos! - 1, completedTodos: this.group!.completedTodos! - 1  }
                )
                if('response' in updateGroupReadModelEntity.data){
                    updatedGroup = updateGroupReadModelEntity.data.response
                }
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    deleteAllTodosHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
        let updatedUser: UserReadModelEntity | null = null;
        let updatedGroup: GroupReadModelEntity | null = null;
    
        if(userId){
            const updateUserReadModelEntity = await this._USER_CRUD.update({ userId }, { todos: 0, completedTodos: 0 })
    
            if('response' in updateUserReadModelEntity.data){
                updatedUser = updateUserReadModelEntity.data.response
            }
        }
        
        if(tenantId){
            const deletedTodos = await data.deletedTodos
            const deletedCompletedTodos = await deletedTodos.filter((todo: any) => todo.completed === true)
    
            const updateGroupReadModelEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! - deletedTodos.length , completedTodos: this.group!.completedTodos! - deletedCompletedTodos.length })
    
            if('response' in updateGroupReadModelEntity.data){
                updatedGroup = updateGroupReadModelEntity.data.response
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }

}