import { Schema, model, InferSchemaType } from "mongoose";
import * as uuid from 'uuid'

const userReadModelSchema = new Schema({
    id: { type: String, default: uuid.v4 },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    todos: { type: Number, required: false, default: 0 },
    completedTodos: { type: Number, required: false, default: 0 },
    tenantId: { type: String }
})

export type UserReadModelEntity = InferSchemaType<typeof userReadModelSchema>

export const UserReadModel = model<UserReadModelEntity>('UserRead', userReadModelSchema)