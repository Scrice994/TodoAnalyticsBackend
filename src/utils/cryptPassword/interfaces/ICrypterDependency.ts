
export interface ICrypterDependency{
    hashPassword(password: string,  salt: string): string
    generateSalt(bytes: number): string
}