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

    it("should return new created user", async () => {
        const result = await axios.post('http://localhost:5005/user/signup', {
            username: 'testUsername',
            password: 'testPassword1',
            confirmPassword: 'testPassword1',
            groupName: 'testGroupName'
        })

        expect(result.data).toEqual({
            username: 'testUsername',
            password: 'testPassword1',
            confirmPassword: 'testPassword1',
            id: result.data.id,
            tenantId: result.data.tenantId
        })
    })
})