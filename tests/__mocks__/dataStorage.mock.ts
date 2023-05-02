import { IDataStorage } from "../../src/dataStorage/IDataStorage";
import { IEntity } from "../../src/entities/IEntity";

export class MongoDataStorageMock<T extends IEntity> implements IDataStorage<T>{

    find = jest.fn()

    findOneByKey = jest.fn()

    create = jest.fn()

    update = jest.fn()
}