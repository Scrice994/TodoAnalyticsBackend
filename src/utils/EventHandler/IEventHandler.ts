import { GroupReadModelEntity } from "../../entities/GroupReadModelEntity"
import { UserReadModelEntity } from "../../entities/UserReadModelEntity"

export interface EventHandlerResponse{
    user: UserReadModelEntity | null,
    group: GroupReadModelEntity | null
}


export interface IEventHanlder{
    newTodoHandler(userId: string, tenantId: string): Promise<EventHandlerResponse>
    updateTodoHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
    deleteTodoHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
    deleteAllTodosHandler(userId: string, tenantId: string, data: any): Promise<EventHandlerResponse>
}