import { ICrypterDependency } from "./interfaces/ICrypterDependency";
import { IPasswordHandler } from "./interfaces/IPasswordHandler";
import { IHashPassword } from "./interfaces/IHashPassword";

export class PasswordHandler implements IPasswordHandler{

    constructor(private crypterDependency: ICrypterDependency){}

    cryptPassword(password: string): IHashPassword {
        const salt = this.crypterDependency.generateSalt(32);

        const cryptedPassword = this.crypterDependency.hashPassword(password, salt);
        
        return {
            salt: salt,
            hashPassword: cryptedPassword
        };
    }
    
    checkPassword(UIpassword: string, DBpassword: string, salt: string): boolean {
        const result = this.crypterDependency.hashPassword(UIpassword, salt);
        
        return result === DBpassword;
    }
}