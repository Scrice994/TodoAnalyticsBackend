import { IEntity } from "./IEntity";

export interface IUserEntity {
    userId: string
}

export interface UserEntity extends IEntity, IUserEntity{
    todos?: number,
    completedTodos?: number
}