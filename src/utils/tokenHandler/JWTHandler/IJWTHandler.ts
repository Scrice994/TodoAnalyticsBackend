import { IToken } from "../interfaces/IToken";
import { IPayload } from "../interfaces/IPayload";
import { UserEntity } from "../../../entities/UserEntity";

export interface IJWTHandler{
    issueJWT(user: UserEntity, secret: string): IToken;
    checkJWT(token: string, secret: string): IPayload;
}