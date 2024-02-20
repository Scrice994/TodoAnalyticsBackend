
export type DataStorageId = string;

export interface IEntity {
    id: DataStorageId
}

export interface GroupReadModelEntity extends IEntity {
    tenantId: string
    todos?: number
    completedTodos?: number
}

export interface UserReadModelEntity extends IEntity {
    userId: string
    username?: string
    todos?: number
    completedTodos?: number
    tenantId?: string
}