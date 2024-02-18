import { Schema, model, InferSchemaType } from "mongoose";
import * as uuid from 'uuid'

const groupReadModelSchema = new Schema({
    id: { type: String, default: uuid.v4 },
    tenantId: { type: String, required: true },
    todos: { type: Number, required: false, default: 0 },
    completedTodos: { type: Number, required: false, default: 0}
})

export type GroupReadModelEntity = InferSchemaType<typeof groupReadModelSchema>

export const GroupReadModel = model<GroupReadModelEntity>('GroupRead', groupReadModelSchema)