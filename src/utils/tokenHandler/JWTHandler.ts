import { IJWTHandler } from "./IJWTHandler";
import { IJWTPkg } from "./IJWTPkg";
import { PayloadEntity } from "./PayloadEntity";
import { UserEntity } from "../../entities/UserEntity";
import { IJWTEntity } from "./IJWTEntity";
import { ITokenPayloadEntity } from "./ITokenPayloadEntity";
import { JwtPayload } from "jsonwebtoken";

export class JWTHandler implements IJWTHandler{
    constructor(private jwtPkg: IJWTPkg){}

    issueJWT(user: UserEntity, secret: string): IJWTEntity {

        const expiresIn = '1d';
  
        const payload = {
          group: user.tenantId,
          sub: user.id,
          iat: Date.now()
        };
      
        const signedToken = this.callSignedToken(payload, secret, expiresIn)
        
        return {
          token: `Bearer ${signedToken}`,
          expires: expiresIn
        }
    }

    checkJWT(token: string, secret: string): JwtPayload | string {
        const result = this.jwtPkg.verifyToken(token, secret)
        return result
    }

    private callSignedToken(payload: PayloadEntity, secret: string, expiresIn: string): string {
        const token = this.jwtPkg.singToken(payload, secret, expiresIn)
        return token
    }
}