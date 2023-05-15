import { UserRepository } from "../../../src/repositories/userRepository"
import { MongoDataStorageMock } from "../../__mocks__/dataStorage.mock"

describe('userRepository', () => {

    const DATA_STORAGE = new MongoDataStorageMock()
    const REPOSITORY = new UserRepository(DATA_STORAGE)
    const userData = {
        username: 'testUsername',
        password: 'testPassword1',
        salt: 'testSalt',
        userRole: 'Admin',
        tenantId: 'testTenantId',
        id: 'testId'
    }

    describe("insertOne()", () => {
        it("should call create() from the dataStorage and return it's value", async () => {
            DATA_STORAGE.create.mockImplementationOnce(() => Promise.resolve(userData))

            const { id, ...userDataParam } = userData
            const result = await REPOSITORY.insertOne(userDataParam)

            expect(result).toEqual(userData)
        })
    })

    describe("getOneByKey()", () => {
        it("should call findOneByKey() from the dataStorage and return it's value", async () => {
            DATA_STORAGE.findOneByKey.mockImplementationOnce(() => Promise.resolve(userData))
            const result = await REPOSITORY.getOneByKey({ id: userData.id })

            expect(result).toEqual(userData)
        })
    })
})