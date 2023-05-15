import { Schema, model, InferSchemaType } from 'mongoose'
import * as uuid from 'uuid'

const userSchema = new Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    id: { default: uuid.v4, type: String },
    userRole: { type: String, require: true },
    tenantId: { type: String, require: false }
})

type User = InferSchemaType<typeof userSchema>;

export const User = model<User>('User', userSchema);

