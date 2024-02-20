
export enum TodoEventTypes {
    Create = "todo_create",
    Toggle = "todo_toggle",
    Delete = "todo_delete",
    DeleteAll = "todo_deleteAll"
}

export enum UserEventTypes {
    Login = "user_login",
}

interface TodoEvent {
    userId: string,
    completed?: boolean
}

interface UserEvent {
    userId: string,
    username?: string,
    tenantId?: string,
    userRole?: string
}

export interface NewTodoEvent {
    eventType: TodoEventTypes
    event: TodoEvent 
}

export interface NewUserEvent {
    eventType: UserEventTypes
    event: UserEvent
}

