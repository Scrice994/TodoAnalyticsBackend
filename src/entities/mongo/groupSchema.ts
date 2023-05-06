import { Schema, model, InferSchemaType } from "mongoose";
import * as uuid from 'uuid'

const groupSchema = new Schema({
    id: { type: String, default: uuid.v4 },
    tenantId: { type: String, required: true },
    todos: { type: Number, default: 0 },
    completedTodos: { type: Number, default: 0}
})

type Group = InferSchemaType<typeof groupSchema>

export const Group = model<Group>('Group', groupSchema)