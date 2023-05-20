import { JwtPayload } from "jsonwebtoken";
import { PayloadEntity } from "./PayloadEntity";

export interface IJWTPkg{
    singToken(payload: PayloadEntity, secret: string, expiresIn: string): string;
    verifyToken(token: string, secret: string): JwtPayload | string;
}