import { UserCRUD } from "../../../src/crud/userCRUD"
import { RepositoryMock } from "../../__mocks__/repository.mock"

describe('userCRUD', () => {
    const REPOSITORY = new RepositoryMock()
    const USER_CRUD = new UserCRUD(REPOSITORY)
    const userData = {
        username: 'testUsername',
        password: 'testPassword1',
        salt: 'testSalt',
        userRole: 'Admin',
        tenantId: 'testTenantId',
        id: 'testId'
    }

    describe('create()', () => {
        it("should call insertOne() from the repository and return obj with statusCode 200 and a response", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => Promise.resolve(userData))
            const {id, ...userDataParam } = userData
            const result = await USER_CRUD.create(userDataParam)

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: userData })
        })

        it("should return obj with statusCode 500 and a message if an error occour", async () => {
            REPOSITORY.insertOne.mockImplementationOnce(() => {throw new Error('TestError')})
            const {id, ...userDataParam } = userData
            const result = await USER_CRUD.create(userDataParam)

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })

    describe('readOne()', () => {
        it("should call getOneByKey() from the repository and return obj with statusCode 200 and a response", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => Promise.resolve(userData))
            const {id, ...userDataParam } = userData
            const result = await USER_CRUD.readOne({id})

            expect(result.statusCode).toBe(200)
            expect(result.data).toEqual({ response: userData })
        })

        it("should return obj with statusCode 500 and a message if an error occour", async () => {
            REPOSITORY.getOneByKey.mockImplementationOnce(() => {throw new Error('TestError')})
            const {id, ...userDataParam } = userData
            const result = await USER_CRUD.readOne({id})

            expect(result.statusCode).toBe(500)
            expect(result.data).toEqual({ message: 'TestError' })
        })
    })
})