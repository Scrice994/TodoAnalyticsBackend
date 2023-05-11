import { GroupEntity } from "../../entities/GroupEntity"
import { UserEntity } from "../../entities/UserEntity"

export interface EventHandlerResponse{
    user: UserEntity | null,
    group: GroupEntity | null
}


export interface IEventHanlder{
    newTodoHandler(userId: string, tenantId: string): Promise<EventHandlerResponse>
    updateTodoHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
    deleteTodoHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
    deleteAllTodosHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
}