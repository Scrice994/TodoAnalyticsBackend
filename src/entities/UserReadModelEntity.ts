import { IEntity } from "./IEntity";

export interface IUserReadModelEntity {
    userId: string
}

export interface UserReadModelEntity extends IEntity, IUserReadModelEntity{
    todos?: number,
    completedTodos?: number
}