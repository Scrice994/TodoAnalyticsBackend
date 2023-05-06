import { GroupRepository } from "../../../src/repositories/groupRepository"
import { MongoDataStorageMock } from "../../__mocks__/dataStorage.mock"

describe("groupRepository", () => {

    const DATA_STORAGE = new MongoDataStorageMock()
    const REPOSITORY = new GroupRepository(DATA_STORAGE)

    describe("getOneByKey()", () => {
        it("should call findOneByKey() from the dataStorage and return it's value", async () => {
            DATA_STORAGE.findOneByKey.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1
            }))

            const result = await REPOSITORY.getOneByKey({ tenantId: 'testTenantId' })

            expect(result).toEqual({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1
            })
        })
    })

    describe("insertOne()", () => {
        it("should call create() from the dataStorage and return it's value", async () => {
            DATA_STORAGE.create.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testUserId',
                todos: 2,
                completedTodos: 1
            }))

            const result = await REPOSITORY.insertOne({
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1
            })

            expect(result).toEqual({
                id: 'testId',
                tenantId: 'testUserId',
                todos: 2,
                completedTodos: 1
            })
        })
    })
    
    describe("updateOne()", () => {
        it("should call update from the dataStorage and return it's value", async () => {
            DATA_STORAGE.update.mockImplementationOnce(() => Promise.resolve({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1
            }))

            const result = await REPOSITORY.updateOne({ tenantId: 'testTenantId' }, { todos: 2 })

            expect(result).toEqual({
                id: 'testId',
                tenantId: 'testTenantId',
                todos: 2,
                completedTodos: 1
            })
        })
    })
})