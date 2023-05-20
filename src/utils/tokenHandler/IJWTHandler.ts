import { IJWTEntity } from "./IJWTEntity";
import { ITokenPayloadEntity } from "./ITokenPayloadEntity";
import { UserEntity } from "../../entities/UserEntity";
import { JwtPayload } from "jsonwebtoken";

export interface IJWTHandler{
    issueJWT(user: UserEntity, secret: string): IJWTEntity;
    checkJWT(token: string, secret: string): string | JwtPayload;
}