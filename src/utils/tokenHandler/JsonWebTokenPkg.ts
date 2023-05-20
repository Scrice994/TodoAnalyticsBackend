import { sign, verify, JwtPayload } from "jsonwebtoken";
import { IJWTPkg } from "./IJWTPkg";
import { PayloadEntity } from "./PayloadEntity";


export class JsonWebTokenPkg implements IJWTPkg{

    singToken(payload: PayloadEntity, secret: string, expiresIn: string): string {
        const signedToken = sign(payload, secret, { expiresIn: expiresIn, algorithm: 'HS512' })
        return signedToken
    }

    verifyToken(token: string, secret: string): JwtPayload | string {
        const result = verify(token, secret, {algorithms: ['HS512']})
        return result
    }
    
}