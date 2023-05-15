import { IEntity } from "./IEntity";

export interface IGroupReadModelEntity{
    tenantId: string
}

export interface GroupReadModelEntity extends IEntity, IGroupReadModelEntity{
    todos?: number,
    completedTodos?: number
}



