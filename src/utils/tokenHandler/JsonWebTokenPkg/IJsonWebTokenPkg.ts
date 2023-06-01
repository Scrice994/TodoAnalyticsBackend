import { IPayload } from "../interfaces/IPayload";

export interface IJsonWebTokenPkg{
    singToken(payload: IPayload, secret: string, expiresIn: string): string;
    verifyToken(token: string, secret: string);
}