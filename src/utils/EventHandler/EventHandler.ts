import { ICRUD } from "../../crud/ICRUD";
import { GroupEntity } from "../../entities/GroupEntity";
import { UserEntity } from "../../entities/UserEntity";
import { EventHandlerResponse, IEventHanlder } from "./IEventHandler";

export class EventHandler implements IEventHanlder{
    constructor(
        private _USER_CRUD: ICRUD<UserEntity>,
        private _GROUP_CRUD: ICRUD<GroupEntity>,
        private user: UserEntity | null,
        private group: GroupEntity | null
    ){}
    
    newTodoHandler = async (userId: string, tenantId: string): Promise<EventHandlerResponse> => {

        let updatedUser: UserEntity | null = null;
        let updatedGroup: GroupEntity | null = null;
     
        if(userId){
            const updateUserEntity = await this._USER_CRUD.update({ userId }, { todos: this.user!.todos! + 1 })
            if('response' in updateUserEntity.data){
                updatedUser = updateUserEntity.data.response
            }
        }
    
        if(tenantId){
            const updateGroupEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! + 1 })
            if('response' in updateGroupEntity.data){
                updatedGroup = updateGroupEntity.data.response
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    updateTodoHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
    
        let updatedUser: UserEntity | null = null;
        let updatedGroup: GroupEntity | null = null;
    
        if(data.completed === true){
            if(userId){
                const updateUserEntity = await this._USER_CRUD.update({ userId }, { completedTodos: this.user!.completedTodos! + 1 })
                if('response' in updateUserEntity.data){
                    updatedUser = updateUserEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupEntity = await this._GROUP_CRUD.update({ tenantId }, { completedTodos: this.group!.completedTodos! + 1 })
                if('response' in updateGroupEntity.data){
                    updatedGroup = updateGroupEntity.data.response
                }
            }
        }
    
        if(data.completed === false){
            if(userId){
                const updateUserEntity = await this._USER_CRUD.update({ userId }, { completedTodos: this.user!.completedTodos! - 1 })
                if('response' in updateUserEntity.data){
                    updatedUser = updateUserEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupEntity = await this._GROUP_CRUD.update({ tenantId }, { completedTodos: this.group!.completedTodos! - 1 })
                if('response' in updateGroupEntity.data){
                    updatedGroup = updateGroupEntity.data.response
                }
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    deleteTodoHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
        let updatedUser: UserEntity | null = null;
        let updatedGroup: GroupEntity | null = null;
    
        if(data.completed === false){
            if(userId){
                const updateUserEntity = await this._USER_CRUD.update({ userId }, { todos: this.user!.todos! - 1 })
                if('response' in updateUserEntity.data){
                    updatedUser = updateUserEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! - 1 })
                if('response' in updateGroupEntity.data){
                    updatedGroup = updateGroupEntity.data.response
                }
            }
    
        } else {
            
            if(userId){
                const updateUserEntity = await this._USER_CRUD.update(
                    { userId }, { todos: this.user!.todos! - 1, completedTodos: this.user!.completedTodos! - 1 }
                )
                if('response' in updateUserEntity.data){
                    updatedUser = updateUserEntity.data.response
                }
            }
    
            if(tenantId){
                const updateGroupEntity = await this._GROUP_CRUD.update(
                    { tenantId }, { todos: this.group!.todos! - 1, completedTodos: this.group!.completedTodos! - 1  }
                )
                if('response' in updateGroupEntity.data){
                    updatedGroup = updateGroupEntity.data.response
                }
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }
    
    deleteAllTodosHandler = async (userId: string, tenantId: string, data: any): Promise<EventHandlerResponse> => {
        let updatedUser: UserEntity | null = null;
        let updatedGroup: GroupEntity | null = null;
    
        if(userId){
            const updateUserEntity = await this._USER_CRUD.update({ userId }, { todos: 0, completedTodos: 0 })
    
            if('response' in updateUserEntity.data){
                updatedUser = updateUserEntity.data.response
            }
        }
        
        if(tenantId){
            const deletedTodos = await data.deletedTodos
            const deletedCompletedTodos = await deletedTodos.filter((todo: any) => todo.completed === true)
    
            const updateGroupEntity = await this._GROUP_CRUD.update({ tenantId }, { todos: this.group!.todos! - deletedTodos.length , completedTodos: this.group!.completedTodos! - deletedCompletedTodos.length })
    
            if('response' in updateGroupEntity.data){
                updatedGroup = updateGroupEntity.data.response
            }
        }
    
        return {
            user: updatedUser,
            group: updatedGroup
        }
    }

}