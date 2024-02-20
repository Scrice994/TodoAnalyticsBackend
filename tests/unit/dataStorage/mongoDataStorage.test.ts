import { MongoDataStorage } from "../../../src/dataStorage/MongoDataStorage";
import { GroupReadModelEntity } from "../../../src/entities/mongo/groupReadModelSchema";
import { UserReadModelEntity } from "../../../src/entities/mongo/userReadModelSchema";
import { GroupReadModel } from "../../../src/entities/mongo/groupReadModelSchema";
import { UserReadModel } from "../../../src/entities/mongo/userReadModelSchema";
import { connectFakeDB, dropFakeCollections, dropFakeDB } from "./mongoDataStorageSetup";


describe("mongoDataStorage", () => {

    beforeAll( async () => {
        connectFakeDB();
    })
    afterAll(async () => {
        dropFakeDB();
    })
    beforeEach(async () => {
        dropFakeCollections();
    })

    const GROUP_STORAGE = new MongoDataStorage<GroupReadModelEntity>(GroupReadModel);
    const USER_STORAGE = new MongoDataStorage<UserReadModelEntity>(UserReadModel);
    const userData = {
        username: 'testUsername',
        tenantId: 'testTenantId',
        userId: 'testUserId'
    }

    describe("find()", () => {
        it("should return an array of group entities",async () => {
            const createEntity = await GROUP_STORAGE.create({ tenantId: 'testTenantId' });

            const findEntities = await GROUP_STORAGE.find({ tenantId: createEntity.tenantId });

            expect(findEntities).toEqual([createEntity]);
        });

        it("should return an array of user entities",async () => {
            const createEntity = await USER_STORAGE.create(userData);

            const findEntities = await USER_STORAGE.find({ tenantId: createEntity.tenantId });

            expect(findEntities).toEqual([createEntity]);
        });
    });
    
    describe("create()", () => {

        it("should save a new group entity in the db", async () => {
            const result = await GROUP_STORAGE.create({ tenantId: 'testTenantId' })

            expect(result).toEqual({
                tenantId: 'testTenantId',
                todos: 0,
                completedTodos: 0,
                id: result.id
            })
        })

        it("should save a new user entity in the db", async () => {
            const result = await USER_STORAGE.create(userData)

            expect(result).toEqual({ ...userData, id: result.id, todos: 0, completedTodos: 0 });
        })
    })

    describe("findOneByKey()", () => {

        it("should return a saved group entity in the db", async () => {
            const createGroupReadModel = await GROUP_STORAGE.create({
                tenantId: 'testId',
                todos: 0,
                completedTodos: 0,  
            })

            const result = await GROUP_STORAGE.findOneByKey({ tenantId: createGroupReadModel.tenantId })

            expect(result).toEqual(createGroupReadModel)
        })

        it("should return null when it don't find anything that match the filter", async () => {
            const result = await GROUP_STORAGE.findOneByKey({ tenantId: 'testTenantId' })

            expect(result).toBe(null)
        })

        it("should return a saved user in the db", async () => {
            const user = await USER_STORAGE.create(userData)

            const findUser = await USER_STORAGE.findOneByKey({ id: user.id })

            expect(findUser).toEqual(user)
        })
    })

    describe("update()", () => {

        it("should do the update of an existing group entity in the db", async () => {
            const createEntity = await GROUP_STORAGE.create({ tenantId: 'testTenantId' })

            const updateEntity = await GROUP_STORAGE.update({ tenantId: createEntity.tenantId! }, { todos: createEntity.todos! + 1 })

            expect(updateEntity).toEqual({ ...createEntity, todos: 1 })
        })

        it("should return the updated user from the db", async () => {
            const createEntity = await USER_STORAGE.create(userData);

            const updateEntity = await USER_STORAGE.update({ id: createEntity.id! }, { todos: createEntity.todos! + 1 })

            expect(updateEntity).toEqual({ ...createEntity, todos: 1 })
        });
    })
})