import crypto from 'crypto'
import { ICrypterDependency } from "./interfaces/ICrypterDependency";

export class CryptoPasswordHandler implements ICrypterDependency{
    hashPassword(password: string,  salt: string): string {
        const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return hashPassword
    }

    generateSalt(bytes: number){
        const salt = crypto.randomBytes(bytes).toString('hex');
        return salt
    }
}