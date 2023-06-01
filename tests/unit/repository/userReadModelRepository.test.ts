import { UserReadModelRepository } from "../../../src/repositories/userReadModelRepository"
import { MongoDataStorageMock } from "../../__mocks__/dataStorage.mock"

describe("userRepository", () => {

    const DATA_STORAGE = new MongoDataStorageMock()
    const REPOSITORY = new UserReadModelRepository(DATA_STORAGE)

    describe("insertOne()", () => {
        it("should call create() from the dataStorage and return it's value", async () => {
            DATA_STORAGE.create.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }))

            const result = await REPOSITORY.insertOne({
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })

            expect(result).toEqual({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })
        })
    })

    describe("getOneByKey()", () => {
        it("should call findOneByKey() from the DataStorage and return it's value", async () => {
            DATA_STORAGE.findOneByKey.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }))
    
            const result = await REPOSITORY.getOneByKey({ userId: 'testUserId' })

            expect(result).toEqual({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })
        })
    })

    describe("updateOne()", () => {
        it("should call update() from the data storage and return it's value", async () => {
            DATA_STORAGE.update.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }))

            const result = await REPOSITORY.updateOne({ userId: 'testUserId' }, { todos: 2 })

            expect(result).toEqual({
                id: 'testId',
                userId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })
        })
    })
})