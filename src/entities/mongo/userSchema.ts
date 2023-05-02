import { Schema, model, InferSchemaType } from "mongoose";
import * as uuid from 'uuid'

const userSchema = new Schema({
    id: { type: String, default: uuid.v4 },
    userId: { type: String, required: true },
    todos: { type: Number, default: 0 },
    completedTodos: { type: Number, default: 0}
})

type User = InferSchemaType<typeof userSchema>

export const User = model<User>('User', userSchema)