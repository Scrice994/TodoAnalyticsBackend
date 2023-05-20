import { IHashPassword } from "./IHashPassword"

export interface IPasswordHandler{
    cryptPassword(password: string): IHashPassword 
    checkPassword(UIpassword: string, DBpassword: string, salt: string): boolean
}