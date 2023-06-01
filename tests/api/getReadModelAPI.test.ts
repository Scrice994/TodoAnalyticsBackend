import axios from 'axios'
import { clearDatabase, databaseConnection, closeDatabaseConnection } from './utils/mongooseTestUtils'

describe('getReadModelAPI', () => {
    beforeAll( async () => {
        await databaseConnection()
    })

    beforeEach( async () => {
        await clearDatabase()
    })

    afterAll( async () => {
        await closeDatabaseConnection()
    })

    const REGISTER_URL = 'http://localhost:5005/user/signup'
    const GETMODEL_URL = 'http://localhost:5005/getModel'
    const eventListenerUrl = 'http://localhost:5005/eventListener'

    it("should return read Model from the db", async () => {
        const user = await axios.post(REGISTER_URL, {
            username: 'testUsername',
            password: 'testPassword1',
            confirmPassword: 'testPassword1',
            groupName: 'testGroupName'
        })

        await axios.post(eventListenerUrl, { 
            type: 'newTodo',
            data: {
                text: 'testText',
                completed: false,
                tenantId: 'testGroupName',
                id: 'testId'
            }
        })

        const result = await axios.get(GETMODEL_URL, { headers: { 'Authorization': user.data.token } }).catch( err => console.log(err))

        expect(result?.status).toBe(200)
        expect(result?.data).toEqual({ response: { ...result?.data.response, todos: 1 } })
    })

    it("should return statusCode 401 and errorMessage if try to make call without a token", async () => {
        const result = await axios.get(GETMODEL_URL).catch( err => {

            expect(err.response.status).toBe(401)
            expect(err.response.data).toEqual({ message: 'You are not Authorized to this route' })
        })

        expect(result?.status).toBe(undefined)
    })

    it("should return statusCode 401 and errorMessage if token regex is not valid", async () => {
        const result = await axios.get(GETMODEL_URL, { headers: { 'Authorization': 'Bearer fakeToken'}}).catch( err => {

            expect(err.response.status).toBe(401)
            expect(err.response.data).toEqual({ message: 'You are not Authorized to this route' })
        })

        expect(result?.status).toBe(undefined)
    })

    it("should return statusCode 401 and errorMessage if token is invalid", async () => {
        const result = await axios.get(GETMODEL_URL, { headers: { 'Authorization': 'Bearer fakeToken.fakeToken.fakeToken'}}).catch( err => {

            expect(err.response.status).toBe(401)
            expect(err.response.data).toEqual({ message: 'invalid Token' })
        })

        expect(result?.status).toBe(undefined)
    })
})