import { IValidCredentials } from "./IValidCredentials"

export class ValidCredentials implements IValidCredentials {

    constructor(private username: string, private password: string){}

    usernameCheck(): boolean {
        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/

        const validUsername = this.username.match(usernameRegex)

        if(validUsername){
            return true
        } else {
            return false
        }
    }

    passwordCheck(): boolean {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/

        const validPassword = passwordRegex.test(this.password)

        if(validPassword){
            return true
        } else {
            return false
        }
    }
}