import { MongoDataStorage } from "../../../src/dataStorage/MongoDataStorage"
import { UserEntity } from "../../../src/entities/UserEntity"
import { User } from "../../../src/entities/mongo/userSchema"
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

    const USER_DATA_STORAGE = new MongoDataStorage<UserEntity>(User)
    
    describe("create()", () => {
        it("should save a new entity in the db", async () => {

            const result = await USER_DATA_STORAGE.create({ userId: 'testId' })

            expect(result).toEqual({
                userId: 'testId',
                todos: 0,
                completedTodos: 0,
                id: result.id
            })
        })
    })

    describe("findOneByKey()", () => {
        it("Should return a saved entity in the db", async () => {
            const createUserReadModel = await USER_DATA_STORAGE.create({
                userId: 'testId',
                todos: 0,
                completedTodos: 0,
            })

            const result = await USER_DATA_STORAGE.findOneByKey({ userId: createUserReadModel.userId })

            expect(result).toEqual(createUserReadModel)
        })
    })

    describe("update()", () => {
        it("should do the update of an existing entity in the db", async () => {
            const createEntity = await USER_DATA_STORAGE.create({ userId: 'testUserId' })

            const updateEntity = await USER_DATA_STORAGE.update({ userId: createEntity.userId! }, { todos: createEntity.todos! + 1 })

            console.log(updateEntity)

            expect(updateEntity).toEqual({ ...createEntity, todos: 1 })
        })
    })
})