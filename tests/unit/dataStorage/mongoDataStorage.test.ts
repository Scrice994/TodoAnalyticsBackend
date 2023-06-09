import { MongoDataStorage } from "../../../src/dataStorage/MongoDataStorage"
import { GroupReadModelEntity } from "../../../src/entities/GroupReadModelEntity"
import { UserReadModelEntity } from "../../../src/entities/UserReadModelEntity"
import { GroupReadModel } from "../../../src/entities/mongo/groupReadModelSchema"
import { UserReadModel } from "../../../src/entities/mongo/userReadModelSchema"
import { connectFakeDB, dropFakeCollections, dropFakeDB } from "./mongoDataStorageSetup"


describe("mongoDataStorage", () => {

    beforeAll( async () => {
        connectFakeDB()
    })
    afterAll(async () => {
        dropFakeDB()
    })
    beforeEach(async () => {
        dropFakeCollections()
    })

    const USER_DATA_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel)
    const GROUP_DATA_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel)
    
    describe("create()", () => {
        it("should save a new user entity in the db", async () => {

            const result = await USER_DATA_STORAGE.create({ userId: 'testId' })

            expect(result).toEqual({
                userId: 'testId',
                todos: 0,
                completedTodos: 0,
                id: result.id
            })
        })

        it("should save a new group entity in the db", async () => {
            const result = await GROUP_DATA_STORAGE.create({ tenantId: 'testTenantId' })

            expect(result).toEqual({
                tenantId: 'testTenantId',
                todos: 0,
                completedTodos: 0,
                id: result.id
            })
        })
    })

    describe("findOneByKey()", () => {
        it("Should return a saved user entity in the db", async () => {
            const createUserReadModel = await USER_DATA_STORAGE.create({
                userId: 'testId',
                todos: 0,
                completedTodos: 0,
            })

            const result = await USER_DATA_STORAGE.findOneByKey({ userId: createUserReadModel.userId })

            expect(result).toEqual(createUserReadModel)
        })

        it("should return a saved group entity in the db", async () => {
            const createGroupReadModel = await GROUP_DATA_STORAGE.create({
                tenantId: 'testId',
                todos: 0,
                completedTodos: 0,  
            })

            const result = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: createGroupReadModel.tenantId })

            expect(result).toEqual(createGroupReadModel)
        })

        it("should return null when it don't find anything that match the filter", async () => {
            const result = await GROUP_DATA_STORAGE.findOneByKey({ tenantId: 'testTenantId' })

            expect(result).toBe(null)
        })
    })

    describe("update()", () => {
        it("should do the update of an existing user entity in the db", async () => {
            const createEntity = await USER_DATA_STORAGE.create({ userId: 'testUserId' })

            const updateEntity = await USER_DATA_STORAGE.update({ userId: createEntity.userId! }, { todos: createEntity.todos! + 1 })

            console.log(updateEntity)

            expect(updateEntity).toEqual({ ...createEntity, todos: 1 })
        })

        it("should do the update of an existing group entity in the db", async () => {
            const createEntity = await GROUP_DATA_STORAGE.create({ tenantId: 'testTenantId' })

            const updateEntity = await GROUP_DATA_STORAGE.update({ tenantId: createEntity.tenantId! }, { todos: createEntity.todos! + 1 })

            console.log(updateEntity)

            expect(updateEntity).toEqual({ ...createEntity, todos: 1 })
        })
    })
})