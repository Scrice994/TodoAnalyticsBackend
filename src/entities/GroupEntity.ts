import { IEntity } from "./IEntity";

export interface IGroupEntity{
    tenantId: string
}

export interface GroupEntity extends IEntity, IGroupEntity{
    todos?: number,
    completedTodos?: number
}



