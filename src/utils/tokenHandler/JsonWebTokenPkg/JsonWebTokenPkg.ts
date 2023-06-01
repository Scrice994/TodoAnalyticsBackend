import { JwtPayload, sign, verify } from "jsonwebtoken";
import { IJsonWebTokenPkg } from "./IJsonWebTokenPkg";

export class JsonWebTokenPkg implements IJsonWebTokenPkg{

    singToken(payload: JwtPayload, secret: string, expiresIn: string): string {
        const signedToken = sign(payload, secret, { expiresIn: expiresIn, algorithm: 'HS512' })
        return signedToken
    }

    verifyToken(token: string, secret: string): JwtPayload | string {
        const result = verify(token, secret, {algorithms: ['HS512']})
        return result
    }
    
}