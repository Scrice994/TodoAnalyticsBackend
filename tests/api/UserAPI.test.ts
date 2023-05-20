import axios from 'axios'
import { clearDatabase, databaseConnection, closeDatabaseConnection } from './utils/mongooseTestUtils'

describe('UserAPI', () => {
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

    it.only("should return new created user", async () => {
        const result = await axios.post(REGISTER_URL, {
            username: 'testUsername',
            password: 'testPassword1',
            confirmPassword: 'testPassword1',
            groupName: 'testGroupName'
        })

        console.log(result.data)
        
        expect(result.status).toBe(200)
        expect(result.data).toEqual({user: result.data.user, token: result.data.token, expireIn: result.data.expireIn })
    })

    it("Should return 400 statusCode and errorMessage if groupName already exist", async () => {
        await axios.post(REGISTER_URL, {username: 'fakeUser', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
        const secondUser = await axios.post(REGISTER_URL, {username: 'fakeUser2', password: 'testPassword1', confirmPassword: 'testPassword1', groupName: 'Akatsuki'})
            .catch(err => {
                console.log(err.response)
                expect(err.response.status).toBe(400)
                expect(err.response.data).toEqual({ message: "This group name already exist" })
            })
    })
})