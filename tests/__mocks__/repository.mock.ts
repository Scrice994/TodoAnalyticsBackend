import { IEntity } from "../../src/entities/Entities";
import { IRepository } from "../../src/repositories/IRepository";

export class RepositoryMock<T extends IEntity> implements IRepository<T>{

    getAll = jest.fn()
    
    getOneByKey = jest.fn()
    
    insertOne = jest.fn()
    
    updateOne = jest.fn()
    
}