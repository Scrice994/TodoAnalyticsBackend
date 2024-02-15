import { IEntity } from "./IEntity";

export interface UserEntity extends IEntity{
    username: string
    password: string
    salt: string
    userRole: string
    tenantId?: string
}