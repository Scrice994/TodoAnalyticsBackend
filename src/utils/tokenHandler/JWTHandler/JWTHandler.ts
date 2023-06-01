import { IJWTHandler } from "./IJWTHandler";
import { IJsonWebTokenPkg } from "../JsonWebTokenPkg/IJsonWebTokenPkg";
import { IPayload } from "../interfaces/IPayload";
import { UserEntity } from "../../../entities/UserEntity";
import { IToken } from "../interfaces/IToken";

export class JWTHandler implements IJWTHandler{
    constructor(private jwtPkg: IJsonWebTokenPkg){}

    issueJWT(user: UserEntity, secret: string): IToken {

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

    checkJWT(token: string, secret: string): IPayload {
        const result = this.jwtPkg.verifyToken(token, secret)
        return result
    }

    private callSignedToken(payload: IPayload, secret: string, expiresIn: string): string {
        const token = this.jwtPkg.singToken(payload, secret, expiresIn)
        return token
    }
}